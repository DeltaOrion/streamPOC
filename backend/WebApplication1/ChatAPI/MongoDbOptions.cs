﻿namespace ChatAPI;

public class MongoDbOptions
{
    public string ConnectionString { get; set; }
    
    public string DatabaseName { get; set; }
    
    public string UserCollectionName { get; set; }
}