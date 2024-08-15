import { useState } from "react";
import { StreamChat } from "stream-chat";
import { chatApiKey } from "./chatConfig";
import { useChatContext } from "./ChatContext";
import { User } from "./users/user";

export type UseChatClientType = {
  isLoading: boolean;
  connectUser: (
    user: User,
    userChatToken: string
  ) => Promise<void>;
};

export type UseChatClientProps = {
  onSuccess?: () => void;
  onError?: (error: any) => void;
};

//this is a singleton so we can access it safely in multiple places
const chatClient = StreamChat.getInstance(chatApiKey);

export const useChatClient = ({ onSuccess, onError }: UseChatClientProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useChatContext();

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

  const result: UseChatClientType = {
    isLoading: isLoading,
    connectUser,
  };

  return result;
};
