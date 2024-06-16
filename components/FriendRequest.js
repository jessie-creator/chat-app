import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext, useEffect } from "react";
import { UserType } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";

const FriendRequest = ({ item, friendRequests, setFriendRequests }) => {
  //const { userId, setUserId } = useContext(UserType);
  const { userId } = useContext(UserType);
  console.log(item)
  useEffect(() => {
    if (userId) {
      console.log(`Logged in as user with ID: ${userId}`);
    }
    console.log("FriendRequest item:", item);
  }, [userId, item]);
  const navigation = useNavigation();
  const acceptRequest = async (friendRequestId) => {
    try {
      console.log(item.uid, userId)
      console.log(friendRequestId)
      const response = await fetch(
        "http://172.29.148.167:8000/friend-request/accept",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderUid: friendRequestId,
            recipientUid: userId,
          }),
        }
      );

      if (response.ok) {
        setFriendRequests(
          friendRequests.filter((request) => request.uid !== friendRequestId)
        );
        //navigation.navigate("Chats");
      }
    } catch (err) {
      console.log("error acceptin the friend request", err);
    }
  };
  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10,
      }}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25 }}
        source={{ uri: item.image }}
      />

      <Text
        style={{ fontSize: 15, fontWeight: "bold", marginLeft: 10, flex: 1 }}
      >
        {item?.name} sent you a friend request!!
      </Text>

      <Pressable
        onPress={() => acceptRequest(item.uid)}
        style={{ backgroundColor: "#0066b2", padding: 10, borderRadius: 6 }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>Accept</Text>
      </Pressable>
    </Pressable>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({});