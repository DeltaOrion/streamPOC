from stream_chat import StreamChat

# Replace these variables with your actual API key, secret, channel ID, and message
api_key = "bkcx2vtqg5dy"
api_secret = "7njtxwrdzyv3e7y23d6m447qgn8abv62yzg5py2nehnuvmsxybqkyqgm8nz9m34n"
channel_id = "66bea4300b7f3667624a8749"
message_text = "This is a message send by the API"
user_id = "66be9642956942b969df57e8"

# Initialize the StreamChat client
client = StreamChat(api_key=api_key, api_secret=api_secret)

# Get the channel
channel = client.channel("messaging", channel_id)

# Send a message to the channel
response = channel.send_message({
    "text": message_text,
}, user_id)

# Check the response
if response.get('message'):
    print("Message sent successfully!")
    print("Response:", response)
else:
    print("Failed to send message.")
    print("Response:", response)