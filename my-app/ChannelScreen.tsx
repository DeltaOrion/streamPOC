import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text } from "react-native";
import { Channel, MessageInput, MessageList } from "stream-chat-expo";
import { useChatContext } from "./ChatContext";

export function ChannelScreen() {
  const { channel, setThread } = useChatContext();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  if (!channel) {
    return <Text>Unknown channel</Text>;
  }

  //As we can see displaying an individual channel is easy as. 

  return (
    <Channel channel={channel}>
      <MessageList
        onThreadSelect={(message) => {
          if (channel.id) {
            setThread(message);
            navigation.navigate("ThreadScreen");
          }
        }}
      />
      <MessageInput />
    </Channel>
  );
}
