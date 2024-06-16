import { StyleSheet, View, Text, ActivityIndicator, Button, ScrollView, Pressable } from 'react-native';
import React, { useEffect, useContext, useState } from 'react';
import { useAuth } from '../../context/authContext'
import { StatusBar } from 'expo-status-bar';
//import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
//import ChatList from '../../components/ChatList';
//import axios from 'axios';
//import { useSQLiteContext } from "expo-sqlite/next";
import { UserType } from "../../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
//import User from "../../components/User";
import UserChat from "../../components/UserChat";
//import {getDatabaseConnection, createTables} from "../../components/database";

export default function Home() {
  const { logout, user } = useAuth();
  const handleLogout = async () => {
    await logout();
  }
  
  const [loading, setLoading] = useState(true);
  //const { userId, setUserId } = useContext(UserType);
  const [acceptedFriends, setAcceptedFriends] = useState([]);

  const { userId } = useContext(UserType);
  const API_BASE = 'https://chatapp.ebg.tw/';

  /*
  useEffect(() => {
    const acceptedFriendsList = async () => {
      try {
        console.log("chatroom uid = ",userId)
        const response = await fetch(
          //`http://172.29.148.167:8000/accepted-friends/${userId}`
          `${API_BASE}chatrooms/${userId}`
        );
        const data = await response.json();
        console.log('Data: ',data)
        if (response.ok) {
          setAcceptedFriends(data);
        }
      } catch (error) {
        console.log("error showing the accepted friends", error);
      }
    };
    console.log('acceptFriend Len: ', acceptedFriends.length);
    acceptedFriendsList();

  }, [user]);*/
  useEffect(() => {
    const acceptedFriendsList = async () => {
      try {
        console.log("chatroom uid = ", userId);
        const response = await fetch(
          //`http://172.29.148.167:8000/accepted-friends/${userId}`
          `${API_BASE}chatrooms/${userId}`
        );
        const data = await response.json();
        console.log('Data: ', data);
        if (response.ok) {
          setAcceptedFriends(data);
        }
      } catch (error) {
        console.log("error showing the accepted friends", error);
      }
    };

    const intervalId = setInterval(() => {
      console.log('acceptFriend Len: ', acceptedFriends.length);
      acceptedFriendsList();
    }, 5000); // 每五秒刷新一次

    // 清除定时器
    return () => clearInterval(intervalId);
  }, [userId]);

  return (
    <View className="flex-1 bg-white">
      {/*<Text>Home</Text>
      <Pressable onPress={handleLogout}>
        <Text>Log Out</Text>
      </Pressable>*/}
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar style="light" />
        
        {acceptedFriends.length > 0 ? (
          <View>
            {acceptedFriends.map((item, index) => (
              <Pressable key={index} onPress={() => { }}>
                {index === acceptedFriends.length - 1 ? (
                  <UserChat item={item} noBorder={true} />
                ) : (
                  <UserChat item={item} noBorder={false} />
                )}
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.noFriendsContainer}>

            <Text style={styles.noFriendsText}>No friends yet. Please add friends.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

};

const styles = StyleSheet.create({
  noFriendsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  noFriendsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8177bb',
    textAlign: 'center',
  },
});