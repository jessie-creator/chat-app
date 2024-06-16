import { StyleSheet, Text, View, TouchableOpacity, Pressable, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../context/UserContext";
import { useRouter } from 'expo-router'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const UserChat = ({ item, noBorder }) => {
  const { userId, setUserId } = useContext(UserType);
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const router = useRouter();
  const API_BASE = 'https://chatapp.ebg.tw/'
  const openChatRoom = ()=>{
    router.push({pathname: '/ChatMessageScreen', params: item._id});
}
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        //`http://172.29.148.167:8000/messages/${userId}/${item._id}`
        `${API_BASE}messages/${userId}/${item._id}`
      );
      const data = await response.json();

      if (response.ok) {
        setMessages(data);
      } else {
        console.log("error showing messags", response.status.message);
      }
    } catch (error) {
      console.log("error fetching messages", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);
  console.log(messages);

  const getLastMessage = () => {
    const userMessages = messages.filter(
      (message) => message.messageType === "text"
    );

    const n = userMessages.length;

    return userMessages[n - 1];
  };
  const lastMessage = getLastMessage();
  console.log(lastMessage);
  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("zh-TW", options);
  };
  return (
    <View>
        <TouchableOpacity onPress={() =>
        navigation.navigate("ChatMessageScreen", {
          recepientId: item._id,
        })
      }//{openChatRoom}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: wp(4),
                paddingVertical: hp(2),
                borderBottomWidth: noBorder ? 0 : 1,
                borderBottomColor: '#d1d1d1'
            }}
        >
            <Image 
                source={require('../assets/images/photo-stickers/1.png')} 
                style={{ height: hp(6), width: hp(6), borderRadius: hp(6) / 2 }} 
            />

            {/* name and last message */}
            <View style={{ flex: 1, marginLeft: wp(4) }}>
                <Text style={{ fontSize: hp(2), fontWeight: '600', color: '#2d2d2d' }}>{item?.name}</Text>
                <Text style={{ fontSize: hp(1.8), fontWeight: '400', color: '#7d7d7d' }}>{lastMessage?.message}</Text>
            </View>

            <Text style={{ fontSize: hp(1.6), fontWeight: '500', color: '#7d7d7d' }}>{lastMessage && formatTime(lastMessage?.timeStamp)}</Text>
        </TouchableOpacity>
    </View>
);
};

export default UserChat;

const styles = StyleSheet.create({});