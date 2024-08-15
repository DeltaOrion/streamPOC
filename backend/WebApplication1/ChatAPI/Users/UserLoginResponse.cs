using ChatAPI.Models;

namespace ChatAPI.Users;

public class UserLoginResponse
{
    public User User { get; set; }
    
    public string AccessToken { get; set; }
}