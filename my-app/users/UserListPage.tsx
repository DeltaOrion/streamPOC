import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Image, StyleSheet, Text, View } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { channelService } from "../channels/channelService";
import { useChatContext } from "../ChatContext";
import { userService } from "./userService";

export function UserListPage() {
  const { data, isLoading, error } = useQuery({
    queryFn: userService.list,
    queryKey: ["users"],
  });

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const { user } = useChatContext();
  if (!user) {
    return <Text>{":("}</Text>;
  }

  const { mutateAsync } = useMutation({
    mutationFn: channelService.create,
  });

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!data) {
    return <Text>{":("}</Text>;
  }

  return (
    <>
      {data.map((x) => {
        if (x.id === user?.id) {
          return null;
        }

        return (
          <TouchableHighlight
            key={x.id}
            onPress={async () => {
              await mutateAsync({
                userAId: user.id,
                userBId: x.id,
              });

              navigation.navigate("ChannelList");
            }}
            style={styles.itemContainer}
            underlayColor="#DDDDDD"
          >
            <View style={styles.item}>
              <Image
                source={{ uri: "https://via.placeholder.com/40" }} // Replace with actual image URI
                style={styles.profileImage}
              />
              <View style={styles.textContainer}>
                <Text style={styles.username}>{x.username}</Text>
                <Text style={styles.subText}>Tap to chat</Text>
              </View>
            </View>
          </TouchableHighlight>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    marginVertical: 5,
    borderRadius: 8,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 12,
    color: "#666",
  },
});
