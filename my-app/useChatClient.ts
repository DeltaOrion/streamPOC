import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
    chatApiKey,
    chatUserId,
    chatUserName,
    chatUserToken
} from "./chatConfig";

//In a real app we would store the user details in the backend and fetch it
//in some programatic way
const user = {
  id: chatUserId,
  name: chatUserName,
};

export type UseChatClientType = {
  clientIsReady: boolean;
};

//this is a singleton so we can access it safely in multiple places
//This client uses the api key that is available for the client. The
//secret should only ever be used in the backend. 
const chatClient = StreamChat.getInstance(chatApiKey);

export const useChatClient = () => {
  const [clientisReady, setClientIsReady] = useState(false);

  useEffect(() => {
    const setupClient = async () => {
      try {
        //first we would fetch the user token from the backend
        await chatClient.connectUser(user, chatUserToken);
        setClientIsReady(true);
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            `An error occurred while connecting the user: ${error.message}`
          );
        }
      }
    };

    if (!chatClient.userID) {
      setupClient();
    }
  });

  const result: UseChatClientType = {
    clientIsReady: clientisReady,
  };

  return result;
};
