import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { Text } from "react-native";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-expo";
import { ChannelListScreen } from "./ChannelListScreen";
import { ChannelScreen } from "./ChannelScreen";
import { chatApiKey } from "./chatConfig";
import { useChatContext } from "./ChatContext";
import { ThreadScreen } from "./ThreadScreen";
import { useChatClient } from "./useChatClient";
import { LoginPage } from "./users/LoginPage";
import { RegisterPage } from "./users/RegisterPage";
import { UserListPage } from "./users/UserListPage";

const Stack = createNativeStackNavigator();
//this is a singleton so we can access it safely in multiple places
const chatClient = StreamChat.getInstance(chatApiKey);

export function ChatApp() {
  const { getUserFromLocalStorage, setUser } = useChatContext();
  const { initialiseUser } = useChatClient({});
  const [userLoading, setUserLoading] = useState(true);
  const initialRouteRef = useRef<string>("Login");

  useEffect(() => {
    const init = async () => {
      const user = await getUserFromLocalStorage();
      if (!user) {
        setUserLoading(false);
        return;
      } else {
        await setUser(user.user);
        await initialiseUser(user.user, user.accessToken);
        initialRouteRef.current = "";
        setUserLoading(false);
      }
    };

    init();
  }, []);

  if (userLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      {/* The chat component is a provider for the chat client for the 
          rest of the underlying components. For simplicity i've included it in the app.tsx
          but in reality we would include this for the relevant page/screen depending on our usecase
          
          Adding offline support is trivial as well, all we have to do is also install react-native-quick-sqlite and
          stream does the rest*/}
      <Chat client={chatClient}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={initialRouteRef.current}>
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="Register" component={RegisterPage} />
            <Stack.Screen name="UserList" component={UserListPage} />
            <Stack.Screen name="ChannelList" component={ChannelListScreen} />
            <Stack.Screen name="ChannelScreen" component={ChannelScreen} />
            <Stack.Screen name="ThreadScreen" component={ThreadScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Chat>
    </>
  );
}
