import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Button, Text } from "react-native";
import { useChatClient } from "../useChatClient";
import { LoginForm } from "./LoginForm";
import { userService } from "./userService";

export function LoginPage() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { isLoading, connectUser } = useChatClient({
    onSuccess: () => {
      //once we finish the login we navigate away
      navigation.navigate("ChannelList");
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: userService.login,
    onSuccess: (result) => {
      //ideally we would store stuff in local storage and stuff like that.
      //however for the PoC the main point is you can grab from the backend and load it in
      connectUser(result.user, result.accessToken);
    },
  });

  return (
    <>
      <LoginForm
        handleLogin={async (form) => {
          const input = {
            username: form.username,
            password: form.password,
          };

          await mutateAsync(input);
        }}
        title={"Login"}
      />
      <Text>Dont have an account</Text>
      <Button
        title="Register"
        onPress={() => {
          navigation.navigate("Register");
        }}
      />
    </>
  );
}
