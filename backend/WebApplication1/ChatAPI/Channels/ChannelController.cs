using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using StreamChat.Clients;
using StreamChat.Models;

namespace ChatAPI.Channels;

[ApiController]
[Route("/channels")]
public class ChannelController : ControllerBase
{
    private readonly IChannelClient _channelClient;

    public ChannelController(IChannelClient channelClient)
    {
        _channelClient = channelClient;
    }

    //It is very much recommended that only the backend does channel creation. It is "possible" for the frontend to do it
    //but it should be sent to the backend for validation, authentication etc. 
    [HttpPost]
    public async Task<string> Create([FromBody] ChannelCreateRequest request)
    {
        var chatRequest = new ChannelGetRequest
        {
            Data = new ChannelRequest
            {
                Members = new[]
                {
                    new ChannelMember()
                    {
                        UserId = request.UserAId,
                    },
                    new ChannelMember()
                    {
                        UserId = request.UserBId
                    }
                },
                CreatedBy = new UserRequest
                {
                    Id = request.UserAId,
                },
            },
        };

        var response =
            await _channelClient.GetOrCreateAsync("messaging", ObjectId.GenerateNewId().ToString(), chatRequest);
        
        return response.Channel.Id;
    }
}