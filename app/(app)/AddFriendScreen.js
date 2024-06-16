import { View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useContext, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Octicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios';
import { UserType } from "../../context/UserContext";
import User from '../../components/User';
import FriendRequest from '../../components/FriendRequest';


export default function AddFriend() {
    const [search, setSearch] = useState("");
    const [tab, setTab] = useState("invitations");
    const { userId, setUserId } = useContext(UserType);
    const [friendRequests, setFriendRequests] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [userFriends, setUserFriends] = useState([]);
    const API_BASE = 'https://chatapp.ebg.tw/';
    useEffect(() => {
        if (userId) {
            console.log("Fetching data with userId: ", userId);
            fetchFriendRequests();
            fetchAllUsers();
            fetchUserFriends();
        }
    }, [userId]);
    /*
    useEffect(() => {
        fetchFriendRequests();
        fetchAllUsers();
        fetchUserFriends();
    }, []);*/

    const fetchFriendRequests = async () => {
        try {
            console.log(userId)
            const response = await axios.get(`${API_BASE}friend-request/${userId}`);
            console.log(response.data)
            if (response.status === 200) {
                setFriendRequests(response.data);
            }
        } catch (err) {
            console.log("error message", err);
        }
    };
    const fetchAllUsers = async () => {
        try {
            console.log("userId = ", userId);
            const response = await axios.get(`${API_BASE}users/${userId}`);
            if (response.status === 200 && Array.isArray(response.data)) {
                setAllUsers(response.data);
            } else {
                console.error('Invalid user data received');
            }
        } catch (err) {
            console.log('Error fetching all users', err);
        }
    };

    const fetchUserFriends = async () => {
        try {
            console.log("fetchUserFriends = ", userId)
            const response = await axios.get(`${API_BASE}friends/${userId}`);
            if (response.status === 200) {
                setUserFriends(response.data);
            }
        } catch (error) {
            console.log("Error message", error);
        }
    };

    const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <ScrollView className="flex-1">
            <StatusBar style="dark" />
            <View style={{ paddingTop: hp(2), paddingHorizontal: wp(5) }} className="flex-1 gap-12">
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <TouchableOpacity onPress={() => setTab('invitations')}>
                        <Text style={{ fontSize: hp(3), color: tab === 'invitations' ? '#8177bb' : '#000' }}>Invitations</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTab('all')}>
                        <Text style={{ fontSize: hp(3), color: tab === 'all' ? '#8177bb' : '#000' }}>All Users</Text>
                    </TouchableOpacity>
                </View>

                {tab === 'invitations' && (
                    <View style={{ padding: 10 }}>
                        {friendRequests.length > 0 && <Text>Your Friend Requests!</Text>}
                        {friendRequests.map((item, index) => (
                            <FriendRequest
                                key={index}
                                item={item}
                                friendRequests={friendRequests}
                                setFriendRequests={setFriendRequests}
                            />
                        ))}
                    </View>
                )}

                {tab === 'all' && (
                    <>
                        <View className="flex-row gap-4 px-4 bg-hbp-1 items-center rounded-xl">
                            <View style={{ width: wp(7) }} className="flex-2 items-center">
                                <Octicons name="search" size={wp(7)} color="#8177bb" />
                            </View>
                            <TextInput
                                value={search}
                                onChangeText={text => setSearch(text)}
                                style={{ fontSize: hp(2.7) }}
                                className="flex-1 font-semibold text-bp-2"
                                placeholder='Search'
                                placeholderTextColor={'#a3a0b9'}
                            />
                        </View>
                        <FlatList
                            data={filteredUsers}
                            keyExtractor={item => item._id}
                            renderItem={({ item }) => (
                                <User item={item} userFriends={userFriends} />
                            )}
                        />
                    </>
                )}
            </View>
        </ScrollView>
    );
}
