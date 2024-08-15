using ChatAPI.Users;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using StreamChat.Clients;
using StreamChat.Models;
using User = ChatAPI.Models.User;

namespace ChatAPI;

[ApiController]
[Route("/user")]
public class UserController : ControllerBase
{
    private readonly IUserClient _userClient;
    private readonly IMongoCollection<User> _userCollection;
    private readonly IMongoClient _mongoClient;
    private readonly ILogger<UserController> _logger;

    public UserController(IUserClient userClient, IMongoCollection<User> userCollection, IMongoClient mongoClient,
        ILogger<UserController> logger)
    {
        _userClient = userClient;
        _userCollection = userCollection;
        _mongoClient = mongoClient;
        _logger = logger;
    }

    [HttpPost("/register")]
    public async Task<ActionResult<UserLoginResponse>> Register([FromBody] RegisterUserInput input)
    {
        //Don't do this if you like testing your code. Instead, this should all be done in
        //a layered architecture. Do NOT use the login scheme i've presented here, use an actual
        //auth provider like cognito or auth0
        var session = await _mongoClient.StartSessionAsync();
        session.StartTransaction();

        UpsertResponse? response = null;
        var id = ObjectId.GenerateNewId().ToString();
        try
        {
            var user = new User
            {
                Id = id,
                Username = input.Username,
                Password = input.Password
            };

            var userRequest = new UserRequest
            {
                Id = user.Id,
                Name = user.Username,
                Language = Language.EN,
                Role = "user"
            };

            //these can be done in parallel for efficiency
            var mongoTask = _userCollection.InsertOneAsync(user);

            //upsert user handles both creates and updates
            var streamTask = _userClient.UpsertAsync(userRequest);
            await mongoTask;
            response = await streamTask;

            return Ok(new UserLoginResponse()
            {
                AccessToken = GetToken(user),
                User = user
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred when creating a user");
            await session.AbortTransactionAsync();
            if (response is not null && response.Users.Count != 0)
            {
                await _userClient.DeleteAsync(id, markMessagesDeleted: true, hardDelete: true,
                    deleteConversations: true);
            }

            return StatusCode(500);
        }
    }

    [HttpPost]
    public async Task<ActionResult<UserLoginResponse>> Login([FromBody] UserLoginInput input)
    {
        var user = await _userCollection.Find(x => x.Username == input.Username && x.Password == input.Password)
            .FirstAsync();
        if (user is null)
        {
            return Unauthorized();
        }

        return Ok(new UserLoginResponse
        {
            AccessToken = GetToken(user),
            User = user
        });
    }

    private string GetToken(User user)
    {
        return _userClient.CreateToken(user.Id);
    }
}