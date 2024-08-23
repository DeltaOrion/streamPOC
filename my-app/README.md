# Chat POC

## Getting Started

 1. [Make a stream account and instance](https://getstream.io/blog/stream-getting-started-guide/)
 2. Get your API key (https://dashboard.getstream.io/app/{YOUR_APP}/chat/integration) and paste these into the chatConfig.ts. Do NOT paste the secret as that is only for the server
 3. Run the dotnet backend
 4. npm run android or npm run ios. Web is not supported by stream. 

## Notifications

 1. Check on your emulator / device that notifications are actually enabled, and are enabled for the apps otherwise you wont receive them. If it isn't working this is probably why. 
 2. There are a bunch of scripts in the scripts directory to help test push_notifications. 
    * The send_push_notification script relies on your admin service.json. Simply download that from the firebase console and name it admin.json. Make sure it is called admin.json so it is gitignored
    * The send_message script is a bit easier to use, just make sure the api key and secret is in the variable names. 