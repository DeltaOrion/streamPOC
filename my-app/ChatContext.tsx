import { createContext, ReactNode, useContext, useState } from "react";
import type { Channel } from "stream-chat";
import { DefaultStreamChatGenerics, MessageType } from "stream-chat-expo";
import { User } from "./users/user";

export type ChatContextType = {
  channel: Channel<DefaultStreamChatGenerics> | null;
  setChannel: (channel: Channel<DefaultStreamChatGenerics> | null) => void;
  thread: MessageType<DefaultStreamChatGenerics> | null;
  setThread: (channel: MessageType<DefaultStreamChatGenerics> | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
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
  setUser: () => {},
});

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [channel, setChannel] =
    useState<Channel<DefaultStreamChatGenerics> | null>(null);
  const [thread, setThread] =
    useState<MessageType<DefaultStreamChatGenerics> | null>(null);
  const [user, setUser] = useState<User | null>(null);

  return (
    <ChatContext.Provider
      value={{
        channel: channel,
        setChannel: setChannel,
        thread: thread,
        setThread: setThread,
        user: user,
        setUser: setUser,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
