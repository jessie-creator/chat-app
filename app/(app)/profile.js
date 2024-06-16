import { View, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../../context/UserContext";
import images from '../../context/imageContext';
import { useAuth } from '../../context/authContext';


const OPTIONS = [
    require('../../assets/images/photo-stickers/1.png'),
    require('../../assets/images/photo-stickers/2.png'),
    require('../../assets/images/photo-stickers/3.png'),
    require('../../assets/images/photo-stickers/4.png'),
    require('../../assets/images/photo-stickers/5.png'),
    require('../../assets/images/photo-stickers/6.png'),
    require('../../assets/images/photo-stickers/7.png'),
    require('../../assets/images/photo-stickers/8.png'),
    require('../../assets/images/photo-stickers/9.png'),
    require('../../assets/images/photo-stickers/10.png'),
    require('../../assets/images/photo-stickers/11.png'),
    require('../../assets/images/photo-stickers/12.png')
];

export default function PersonalProfile() {
    const { userId, setUserId } = useContext(UserType);
    const [avatar, setAvatar] = useState("");
    const [name, setName] = useState("");
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [introduction, setIntroduction] = useState("");
    const navigation = useNavigation();
    const API_BASE = 'https://chatapp.ebg.tw/';
    const { user } = useAuth();
    const profileURL = user.profileURL;


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
                    <View>
                        <Image style={{ height: hp(20), width: hp(20), borderRadius: hp(10), borderWidth: 4, borderColor: '#4d4385' }} resizeMode='contain' source={OPTIONS[profileURL - 1]} />
                        <TouchableOpacity onPress={() => ChangeModalVis(true)}>
                            <View style={{ position: 'absolute', height: hp(5), width: hp(5), borderRadius: hp(2.5), bottom: 0, right: 0, borderWidth: 2, borderColor: '#8177bb' }} className="justify-center items-center bg-hbp-1">
                                <MaterialCommunityIcons name="pencil" size={hp(3.5)} style={{ color: '#8177bb' }} />
                            </View>
                        </TouchableOpacity>
                    </View>
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
