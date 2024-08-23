import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";
import { StreamChat } from "stream-chat";
import { chatApiKey } from "../chatConfig";

export function NotificationHandler() {
  useEffect(() => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      const client = StreamChat.getInstance(chatApiKey);
    });
  }, []);

  return null;
}
