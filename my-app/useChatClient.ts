import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import { useRef, useState } from "react";
import { StreamChat } from "stream-chat";
import { chatApiKey } from "./chatConfig";
import { useChatContext } from "./ChatContext";
import { User } from "./users/user";

export type UseChatClientType = {
  isLoading: boolean;
  initialiseUser: (user: User, userChatToken: string) => Promise<void>;
};

export type UseChatClientProps = {
  onSuccess?: () => void;
  onError?: (error: any) => void;
};

//this is a singleton so we can access it safely in multiple places
const chatClient = StreamChat.getInstance(chatApiKey);

export const useChatClient = ({ onSuccess, onError }: UseChatClientProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const unsubscribeTokenRefreshListenerRef = useRef<() => void>();

  const { setUser, user } = useChatContext();

  //we must request permission before we can get the push token, otherwise android wont let us have it
  //additionally in a normal app we do need to handle the case where we dont get permissions
  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    } else {
      //handle no permission case
    }
  };

  const registerPushToken = async () => {
    //get the FCM token
    unsubscribeTokenRefreshListenerRef.current?.();
    const token = await messaging().getToken();
    const pushProvider = "firebase";
    const pushProviderName = "Android";
    console.log(token);
    //tell the client about the current token. When we call client.connect, it will
    //give the token to stream.
    chatClient.setLocalDevice({
      id: token,
      push_provider: pushProvider,
      push_provider_name: pushProviderName,
    });

    await AsyncStorage.setItem("@current_push_token", token);

    const removeOldToken = async () => {
      const oldToken = await AsyncStorage.getItem("@current_push_token");
      if (oldToken !== null) {
        await chatClient.removeDevice(oldToken);
      }
    };

    //this function is quite important because there is a chance the token may change and there are many
    //reasons for this. In either case we need to handle it by telling the api that the token is invalid
    //and telling the client about the new device
    unsubscribeTokenRefreshListenerRef.current = messaging().onTokenRefresh(
      async (newToken) => {
        await Promise.all([
          removeOldToken(),
          chatClient.addDevice(
            newToken,
            pushProvider,
            user?.id,
            pushProviderName
          ), //this time we provide the user id because the client is already connected.
          AsyncStorage.setItem("@current_push_token", newToken),
        ]);
      }
    );
  };

  const connectUser = async (user: User, chatAccessToken: string) => {
    try {
      //first we would fetch the user token from the backend
      await chatClient.connectUser(
        { id: user.id, name: user.username },
        chatAccessToken
      );

      setUser(user);
      setIsLoading(true);
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError(error);
    }
  };

  const initialiseUser = async (user: User, chatAccessToken: string) => {
    await requestPermission();
    await registerPushToken();
    await connectUser(user, chatAccessToken);
  };

  const result: UseChatClientType = {
    isLoading: isLoading,
    initialiseUser: initialiseUser,
  };

  return result;
};
