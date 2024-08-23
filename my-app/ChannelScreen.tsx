import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text } from "react-native";
import {
  Channel,
  MessageInput,
  MessageList,
  useAttachmentPickerContext,
} from "stream-chat-expo";
import { useChatContext } from "./ChatContext";
import * as ImagePicker from "expo-image-picker";

export function ChannelScreen() {
  const { channel, setThread } = useChatContext();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  if (!channel) {
    return <Text>Unknown channel</Text>;
  }

  //https://github.com/GetStream/stream-chat-react-native/issues/1763
  //displaying from camera is really, hard, would have to override entire camera input button and
  //manually handle adding attachments. 

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
    </Channel>
  );
}
