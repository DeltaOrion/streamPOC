import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Chat, OverlayProvider } from "stream-chat-expo";

import axios from "axios";
import { StreamChat } from "stream-chat";
import { ChannelListScreen } from "./ChannelListScreen";
import { ChannelScreen } from "./ChannelScreen";
import { chatApiKey } from "./chatConfig";
import { ChatProvider } from "./ChatContext";
import { LoginPage } from "./users/LoginPage";
import { ThreadScreen } from "./ThreadScreen";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RegisterPage } from "./users/RegisterPage";

const Stack = createNativeStackNavigator();
//this is a singleton so we can access it safely in multiple places
const serverClient = StreamChat.getInstance(chatApiKey);
const queryClient = new QueryClient();

export default function App() {
  const chatTheme = {
    channelPreview: {
      container: {
        backgroundColor: "transparent",
      },
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ChatProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }}>
            {/* THe overlay provider is the highest level of stream chat components and must
        be used near the root of the application (outside navigation stack). It allows users to
        interact with messages, long press views, use the full screen image viewer etc. It provides
        nice utility for interacting with streams frontend chat components. */}
            <OverlayProvider value={{ style: chatTheme }}>
              {/* The chat component is a provider for the chat client for the 
          rest of the underlying components. For simplicity i've included it in the app.tsx
          but in reality we would include this for the relevant page/screen depending on our usecase
          
          Adding offline support is trivial as well, all we have to do is also install react-native-quick-sqlite and
          stream does the rest*/}
              <Chat client={serverClient}>
                <NavigationContainer>
                  <Stack.Navigator>
                    <Stack.Screen name="Login" component={LoginPage} />
                    <Stack.Screen name="Register" component={RegisterPage} />
                    <Stack.Screen
                      name="ChannelList"
                      component={ChannelListScreen}
                    />
                    <Stack.Screen
                      name="ChannelScreen"
                      component={ChannelScreen}
                    />
                    <Stack.Screen
                      name="ThreadScreen"
                      component={ThreadScreen}
                    />
                  </Stack.Navigator>
                </NavigationContainer>
              </Chat>
            </OverlayProvider>
          </SafeAreaView>
        </GestureHandlerRootView>
      </ChatProvider>
    </QueryClientProvider>
  );
}

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
