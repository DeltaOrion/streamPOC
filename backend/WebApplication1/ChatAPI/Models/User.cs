using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ChatAPI.Models;

public class User
{
    [BsonRepresentation(BsonType.ObjectId)]
    [BsonId]
    public string Id { get; set; }
    
    public string Username { get; set; }
    
    public string Password { get; set; }
    
    public string Topic { get; set; }
}