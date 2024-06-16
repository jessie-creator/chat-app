import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import axios from 'axios';
import { UserType } from "../context/UserContext";
import images from './photoStickers'

const User = ({ item, userFriends }) => {
  const { userId } = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(`http://172.29.148.167:8000/friend-requests/sent/${userId}`);
      if (response.status === 200) {
        setFriendRequests(response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const sendFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      console.log(currentUserId, selectedUserId);
      const response = await axios.post("http://172.29.148.167:8000/friend-request", {
        currentUserId,
        selectedUserId
      });

      if (response.status === 200) {
        setRequestSent(true);
      }
    } catch (error) {
      console.log("error message", error);
    }
  };

  return (
    <Pressable style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
      <View>
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            resizeMode: "cover",
          }}
          source={images[item.image]}
        />
      </View>
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontWeight: "bold" }}>{item?.name}</Text>
        <Text style={{ marginTop: 4, color: "gray" }}>{item?.email}</Text>
      </View>
      {userFriends && userFriends.includes(item.uid) ? (
        <Pressable
          style={{
            backgroundColor: "#82CD47",
            padding: 10,
            width: 105,
            borderRadius: 6,
          }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>Friends</Text>
        </Pressable>
      ) : requestSent || friendRequests.some(friend => friend.uid === item.uid) ? (
        <Pressable
          style={{
            backgroundColor: "gray",
            padding: 10,
            width: 105,
            borderRadius: 6,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>Request Sent</Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => sendFriendRequest(userId, item.uid)}
          style={{
            backgroundColor: "#567189",
            padding: 10,
            borderRadius: 6,
            width: 105,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>Add Friend</Text>
        </Pressable>
      )}
    </Pressable>
  );
};

export default User;

const styles = StyleSheet.create({});
