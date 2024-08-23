import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useState } from "react";
import type { Channel } from "stream-chat";
import { DefaultStreamChatGenerics, MessageType } from "stream-chat-expo";
import { User } from "./users/user";
import { userService } from "./users/userService";
import { UserLoginResponse } from "./users/userLoginResponse";

export type ChatContextType = {
  channel: Channel<DefaultStreamChatGenerics> | null;
  setChannel: (channel: Channel<DefaultStreamChatGenerics> | null) => void;
  thread: MessageType<DefaultStreamChatGenerics> | null;
  setThread: (channel: MessageType<DefaultStreamChatGenerics> | null) => void;
  user: User | null;
  getUserFromLocalStorage: () => Promise<UserLoginResponse | null>;
  setUser: (user: User | null) => Promise<void>;
};

export type ChatProviderProps = {
  children: ReactNode;
};

/**
 * The chat context is provides information about the thread, channel and more
 * that the user has currently selected.
 */

export const ChatContext = createContext<ChatContextType>({
  channel: null,
  setChannel: () => {},
  thread: null,
  setThread: () => {},
  user: null,
  setUser: async () => {},
  getUserFromLocalStorage: async () => {
    return null;
  },
});

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [channel, setChannel] =
    useState<Channel<DefaultStreamChatGenerics> | null>(null);
  const [thread, setThread] =
    useState<MessageType<DefaultStreamChatGenerics> | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const updateUser = async (user: User | null) => {
    setUser(user);
    if (!user) {
      AsyncStorage.removeItem("@user-id");
    } else {
      await AsyncStorage.setItem("@username", user.username);
      await AsyncStorage.setItem("@password", user.password);
    }
  };

  const getUserFromLocalStorage = async () => {
    //production level security here
    const storedUserId = await AsyncStorage.getItem("@username");
    const storedUserPassword = await AsyncStorage.getItem("@password");
    if (storedUserId && storedUserPassword) {
      const user = await userService.login({
        username: storedUserId,
        password: storedUserPassword,
      });

      return user;
    }

    return null;
  };

  return (
    <ChatContext.Provider
      value={{
        channel: channel,
        setChannel: setChannel,
        thread: thread,
        setThread: setThread,
        user: user,
        getUserFromLocalStorage: getUserFromLocalStorage,
        setUser: updateUser,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
