namespace ChatAPI.Notifications;

public class AddDeviceInput
{
    public string UserId { get; set; }
    public string Provider { get; set; }
    public string DeviceToken { get; set; }
}