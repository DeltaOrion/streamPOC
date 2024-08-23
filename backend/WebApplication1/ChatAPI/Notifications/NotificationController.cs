using System.Text.Json;
using Amazon.SimpleNotificationService;
using Amazon.SimpleNotificationService.Model;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using User = ChatAPI.Models.User;

namespace ChatAPI.Notifications;

[ApiController]
[Route("/notification")]
public class NotificationController : ControllerBase
{
    private readonly IAmazonSimpleNotificationService _notificationService;
    private readonly IMongoCollection<User> _userCollection;

    //it could make sense to have platform applications in the db, especially if we are also going to associate an sns topic with it
    //to broadcast to a single platform
    private readonly IDictionary<string, string> _platformApplications = new Dictionary<string, string>()
    {
        { "Android", "arn:aws:sns:ap-southeast-2:763914876745:app/GCM/Android" }
    };

    public NotificationController(IAmazonSimpleNotificationService notificationService,
        IMongoCollection<User> userCollection)
    {
        _notificationService = notificationService;
        _userCollection = userCollection;
    }

    [HttpPost("addDevice")]
    public async Task<IActionResult> SetDevice(AddDeviceInput input)
    {
        Console.WriteLine($"Set Device {JsonSerializer.Serialize(input)}");
        var userId = input.UserId;
        var provider = input.Provider;
        var deviceToken = input.DeviceToken;

        var user = await _userCollection.Find(x => x.Id == userId).FirstOrDefaultAsync();
        if (user == null)
        {
            return NotFound();
        }

        var createPlatform = await _notificationService.CreatePlatformEndpointAsync(new CreatePlatformEndpointRequest
        {
            PlatformApplicationArn = _platformApplications[provider],
            Token = deviceToken,
            CustomUserData = JsonSerializer.Serialize(new UserData() { UserId = userId })
        });

        var endpointArn = createPlatform.EndpointArn;

        // Check if the endpoint is already subscribed to the topic
        var subscriptionsResponse = await _notificationService.ListSubscriptionsByTopicAsync(
            new ListSubscriptionsByTopicRequest
            {
                TopicArn = user.Topic
            });

        //the only reason we wouldn't already be subscribed is if we got a new token. The only reasons
        //this should really happen is if the user uninstall / reinstall app, gets a new device etc. 
        var isAlreadySubscribed = subscriptionsResponse.Subscriptions
            .Any(sub => sub.Endpoint == endpointArn);

        // Subscribe if not already subscribed
        if (!isAlreadySubscribed)
        {
            //add device to own topic
            await _notificationService.SubscribeAsync(new SubscribeRequest
            {
                TopicArn = user.Topic,
                Protocol = "application", // This should match the protocol for the platform endpoint
                Endpoint = endpointArn
            });

            //add to broadcast topic
            await _notificationService.SubscribeAsync(new SubscribeRequest
            {
                TopicArn = "arn:aws:sns:ap-southeast-2:763914876745:Broadcast",
                Protocol = "application", // This should match the protocol for the platform endpoint
                Endpoint = endpointArn
            });

            //add to any other topics...
        }

        return Ok();
    }

    private class UserData
    {
        public string UserId { get; set; }
    }
}