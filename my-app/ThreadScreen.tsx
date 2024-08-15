import { Text } from "react-native";
import { Channel, Thread } from "stream-chat-expo";
import { useChatContext } from "./ChatContext";

export function ThreadScreen() {
  const { channel, thread } = useChatContext();
  if (!channel || !thread) {
    return <Text>Unknown Channel or thread</Text>;
  }

  return (
    <Channel channel={channel} thread={thread} threadList>
      <Thread />
    </Channel>
  );
}
