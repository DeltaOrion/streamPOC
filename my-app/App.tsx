import { SafeAreaView } from "react-native";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { OverlayProvider } from "stream-chat-expo";

import { ChatProvider } from "./ChatContext";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationHandler } from "./notifications/NotificationHandler";
import { ChatApp } from "./ChatApp";

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
            <NotificationHandler />
            {/* THe overlay provider is the highest level of stream chat components and must
        be used near the root of the application (outside navigation stack). It allows users to
        interact with messages, long press views, use the full screen image viewer etc. It provides
        nice utility for interacting with streams frontend chat components. */}
            <OverlayProvider value={{ style: chatTheme }}>
              <ChatApp />
            </OverlayProvider>
          </SafeAreaView>
        </GestureHandlerRootView>
      </ChatProvider>
    </QueryClientProvider>
  );
}
