import { ParamListBase, useNavigation } from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View } from "react-native";
import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewMessengerProps,
} from "stream-chat-expo";
import { useChatContext } from "./ChatContext";

export function ChannelListScreen() {
  //This hook will be responsble for loading in the chat.
  const { setChannel, user } = useChatContext();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <ChannelList
      Preview={CustomListItem}
      filters={{
        members: {
          $in: [user?.id ?? ""],
        },
      }}
      sort={{
        last_message_at: -1,
      }}
      onSelect={(channel) => {
        setChannel(channel);
        navigation.navigate("ChannelScreen");
      }}
    />
  );
}

/*
 * In this case we are trying to override the custom channel list messenger
 * view so that whenever a channel has an unread message, its background color
 * is blue. As we can see the channel list has lots of customisability allowing
 * us to do this. We just have to override the subcomponent
 */
function CustomListItem(props: ChannelPreviewMessengerProps) {
  const { unread } = props;
  const backgroundColor = unread ? "#e6f7ff" : "#fff";

  //Note that we ALSO NEED TO OVERRIDE THE OVERLAYPROVIDER!!!!
  return (
    <View style={{ backgroundColor }}>
      <ChannelPreviewMessenger {...props} />
    </View>
  );
}
