import { View, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Octicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../../context/UserContext";
import images from '../../context/imageContext';


export default function CreateGroup() {
    const API_BASE = process.env.HOST_NAME;
    const { userId, setUserId } = useContext(UserType);
    const [avatar, setAvatar] = useState("");
    const [name, setName] = useState("");
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [introduction, setIntroduction] = useState("");
    const navigation = useNavigation();
    
    const fetchUserInfo = async () => {
        try {
            const response = await fetch(
                `${API_BASE}UserInfo/${userId}`
            );

            const data = await response.json();
            console.log(data)
            //setAvatar(data.image);
            setAvatar("photo-stickers/1.png");
            setName(data.name);
            setAccount(data.email);
            setPassword(data.password);

        } catch (error) {
            console.log("error showing the accepted friends", error);
          }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    return (
        <ScrollView className="flex-1">
            <StatusBar style="dark" />
            <View style={{ paddingTop: hp(5), paddingHorizontal: wp(5) }} className="flex-1 gap-4">
                <View className="items-center">
                    <Image style={{ height: hp(20) }} resizeMode='contain' source={images[avatar]}  />
                    <TouchableOpacity>
                        <Text style={{ color: '#8177bb', fontSize: hp(2) }}>Change</Text>
                    </TouchableOpacity>
                    {/*<Text style={{ fontSize: hp(5) }} className="font-bold tracking-wider text-center text-bp-4 ">Personal Profile</Text>*/}
                </View>

                <View className="gap-4">
                    <View className="gap-4">
                        <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-hbp-1 items-center allign-l rounded-xl">
                            <View style={{ width: wp(7) }} className="flex-2 items-center">
                                <Octicons name="person" size={wp(7)} color="#8177bb" />
                            </View>
                            <TextInput
                                value={name}
                                onChangeText={(text) => setName(text)}
                                style={{ fontSize: hp(2.7) }}
                                className="flex-1 font-semibold text-bp-2"
                                placeholder='Name'
                                placeholderTextColor={'#a3a0b9'}
                            />
                            <TouchableOpacity>
                                <Text style={{ color: '#8177bb', fontSize: hp(2) }}>Change</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-hbp-1 items-center rounded-xl">
                            <View style={{ width: wp(7) }} className="flex-2 items-center">
                                <Octicons name="mail" size={wp(7)} color="#8177bb" />
                            </View>
                            <TextInput
                                value={account}
                                onChangeText={(text) => setAccount(text)}
                                style={{ fontSize: hp(2.7) }}
                                className="flex-1 font-semibold text-bp-2"
                                placeholder='Account'
                                placeholderTextColor={'#a3a0b9'}
                            />
                        </View>
                        <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-hbp-1 items-center rounded-xl">
                            <View style={{ width: wp(7) }} className="flex-2 items-center">
                                <Octicons name="lock" size={wp(7)} color="#8177bb" />
                            </View>
                            <TextInput
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                style={{ fontSize: hp(2.7) }}
                                className="flex-1 font-semibold text-bp-2"
                                placeholder='Password'
                                placeholderTextColor={'#a3a0b9'}
                            />
                            <TouchableOpacity>
                                <Text style={{ color: '#8177bb', fontSize: hp(2) }}>Change</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ height: hp(20) }} className="flex-row gap-4 px-4 bg-hbp-1 items-center rounded-xl">
                            <TextInput
                                value={introduction}
                                onChangeText={(text) => setIntroduction(text)}
                                style={{ fontSize: hp(2.7) }}
                                className="flex-1 font-semibold text-bp-2"
                                placeholder='Introduction'
                                placeholderTextColor={'#a3a0b9'}
                                multiline={true}
                            />
                            <TouchableOpacity>
                                <Text style={{ color: '#8177bb', fontSize: hp(2) }}>Change</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity style={{ height: hp(7), backgroundColor: '#8177bb', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} 
                        onPress={() => navigation.goBack()}>
                            <Text style={{ fontSize: hp(2.7), color: '#fff', fontWeight: 'bold' }}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
