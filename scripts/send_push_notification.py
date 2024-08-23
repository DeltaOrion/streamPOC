import google.auth.transport.requests
import requests
from google.oauth2 import service_account

# Path to the Service Account JSON file
service_account_file = 'admin.json'

# Define the required scopes
scopes = ["https://www.googleapis.com/auth/firebase.messaging"]

# Authenticate and create credentials object
credentials = service_account.Credentials.from_service_account_file(
    service_account_file, scopes=scopes)

# Create a request object for the authentication
request = google.auth.transport.requests.Request()

# Refresh the credentials to obtain a valid token
credentials.refresh(request)

# The token will be used in the Authorization header
access_token = credentials.token

# The target device token
device_token = "eZtOpc_lRIWvQaYOh7GXgr:APA91bHkO6rnG9bX52J2nN27HqIfjk_fIytikdrwlPjLRSlLcnM44q2ZEjSVK7kQAdtrUXjB_xyO3AW6pym71ifd3vkmDWowBvSkbDAroTLb9D1XgUNs9Oh5wtqL69D7VFD9oHkcK8U3"

# Construct the notification payload
message = {
    "message": {
        "token": device_token,
        "notification": {
            "title": "Test Notification",
            "body": "This is a test notification sent via FCM HTTP v1 API!"
        },
        "data": {
            "id": "66be9f02e4129518d86e531f-b1b5f84c-94f0-48a1-2955-720cf0131b93"
        },
    }
}

# Set the headers including the access token
headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json; UTF-8",
}

# FCM endpoint for sending messages
url = "https://fcm.googleapis.com/v1/projects/notification-demo-f14fa/messages:send"

# Send the request
response = requests.post(url, headers=headers, json=message)

# Check the response
if response.status_code == 200:
    print("Notification sent successfully!")
    print("Response:", response.json())
else:
    print("Failed to send notification.")
    print("Status code:", response.status_code)
    print("Response:", response.json())
