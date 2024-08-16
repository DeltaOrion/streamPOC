namespace ChatAPI.Channels;

public class ChannelCreateRequest
{
    //you probably would not want this normally and instead look at the claims
    public string UserAId { get; set; }
    
    public string UserBId { get; set; }
    
}