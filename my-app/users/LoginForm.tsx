import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

type LoginFromType = {
  username: string;
  password: string;
};

type LoginFormProps = {
  handleLogin: (input: LoginFromType) => Promise<void>;
  title: string;
};

export function LoginForm({ handleLogin, title }: LoginFormProps) {
  const [values, setValues] = useState<LoginFromType>({
    username: "",
    password: "",
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={values.username}
        onChangeText={(input) => setValues({ ...values, username: input })}
        placeholder="Enter your username"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={values.password}
        onChangeText={(input) => setValues({ ...values, password: input })}
        placeholder="Enter your password"
        secureTextEntry
      />
      <Button
        title={title}
        onPress={async () => {
          await handleLogin(values);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginBottom: 10,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  error: {
    color: "red",
    marginBottom: 20,
  },
});
