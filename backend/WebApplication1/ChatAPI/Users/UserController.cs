using Amazon.SimpleNotificationService;
using Amazon.SimpleNotificationService.Model;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using StreamChat.Clients;
using StreamChat.Models;
using User = ChatAPI.Models.User;

namespace ChatAPI.Users;

/**
 * Obviously the security of this application is terrible with plain-text passwords (that are sent to the frontend lol) so dont copy that. The main take-away of this controller
 * is that the backend must be responsible for handing out the chat access tokens to the frontend. We are free to use any auth scheme we want such as amazon cognito to confirm
 * the user is authorised and then hand the token off. The frontend should never have access to the api-key secret.
 */
[ApiController]
[Route("/user")]
public class UserController : ControllerBase
{
    private readonly IUserClient _userClient;
    private readonly IMongoCollection<User> _userCollection;
    private readonly IMongoClient _mongoClient;
    private readonly ILogger<UserController> _logger;
    private readonly IAmazonSimpleNotificationService _notificationService;

    public UserController(IUserClient userClient, IMongoCollection<User> userCollection, IMongoClient mongoClient,
        ILogger<UserController> logger, IAmazonSimpleNotificationService notificationService)
    {
        _userClient = userClient;
        _userCollection = userCollection;
        _mongoClient = mongoClient;
        _logger = logger;
        _notificationService = notificationService;
    }

    [HttpGet("list")]
    public async Task<IEnumerable<User>> ListUsers()
    {
        return await _userCollection.Find(FilterDefinition<User>.Empty).ToListAsync();
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserLoginResponse>> Register([FromBody] RegisterUserInput input)
    {
        var existingUser = await _userCollection.Find(x => x.Username == input.Username).FirstOrDefaultAsync();
        if (existingUser is not null)
        {
            return StatusCode(409);
        }

        var session = await _mongoClient.StartSessionAsync();
        session.StartTransaction();

        UpsertResponse? response = null;
        var id = ObjectId.GenerateNewId().ToString();
        try
        {
            //you in reality probably want some rollback to happen if this fails
            var createTopicResponse = await _notificationService.CreateTopicAsync(new CreateTopicRequest
            {
                Name = $"user-{id}",
                Attributes = new Dictionary<string, string>()
                {
                    { "DisplayName", $"user-{input.Username}-{id}" }
                }
            });
            
            var user = new User
            {
                Id = id,
                Username = input.Username,
                Password = input.Password,
                Topic = createTopicResponse.TopicArn,
            };

            var userRequest = new UserRequest
            {
                Id = user.Id,
                Name = user.Username,
                Language = Language.EN,
                Role = "user"
            };
            //these can be done in parallel for efficiency
            var mongoTask = _userCollection.InsertOneAsync(session, user);

            //upsert user handles both creates and updates
            var streamTask = _userClient.UpsertAsync(userRequest);
            await mongoTask;
            response = await streamTask;

            await session.CommitTransactionAsync();

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

    [HttpPost("login")]
    public async Task<ActionResult<UserLoginResponse>> Login([FromBody] UserLoginInput input)
    {
        var user = await _userCollection.Find(x => x.Username == input.Username && x.Password == input.Password)
            .FirstOrDefaultAsync();
        if (user is null)
        {
            return StatusCode(401);
        }

        return Ok(new UserLoginResponse
        {
            AccessToken = GetToken(user),
            User = user
        });
    }

    private string GetToken(User user)
    {
        return _userClient.CreateToken(user.Id, DateTimeOffset.Now.AddHours(6));
    }
}