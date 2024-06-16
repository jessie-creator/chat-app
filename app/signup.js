import { View, Text, Image, TextInput, Pressable, Alert, TouchableOpacity, Modal } from 'react-native';
import React, { useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Octicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading'
import CostomKeyBordView from '../components/CostomKeyBordView';
import { useAuth } from '../context/authContext';
import { ModalPicker } from '../components/ModalPicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function signUp() {
  const API_BASE = 'https://chatapp.ebg.tw/';
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const usernameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const profileRef = useRef("");

  const [imagePlaceHolder, setImagePlace] = useState(require('../assets/images/photo-stickers/1.png'))

  const handleSelect = (option, index) => {
    profileRef.current = index + 1;
    setImagePlace(option);
    //console.log('Profile Index: ', profileRef.current);
  };

  // register user on db
  const registerUser = async (uid, email, name, profileURL) => {
    try {
      const response = await fetch(`${API_BASE}register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: uid,
          email: email,
          name: name,
          image: profileURL,
        }),
      });

      const data = await response.json();
      console.log('Register API response:', data);
    } catch (error) {
      console.log('Error registering user:', error);
    }
  };

  const handleRegister = async () => {
    if (!profileRef.current) {
      profileRef.current = 1;
    }

    if (!emailRef.current || !passwordRef.current || !usernameRef.current || !profileRef.current) {
      Alert.alert('Sign In', "Please fill all the fields!");
      return;
    }

    setLoading(true);

    let response = await register(emailRef.current, passwordRef.current, usernameRef.current, profileRef.current);
    registerUser(response.data.uid, response.data.email, usernameRef.current, profileRef.current);
    setLoading(false);

    console.log('got result: ', response);
    if (!response.success) {
      Alert.alert('Sign Up', response.msg);
    }
    //Login Process

  }

  const [isModalVis, setModalVis] = useState(false);
  const ChangeModalVis = (bool) => {
    setModalVis(bool)
  }

  return (
    <CostomKeyBordView>
      <View className="flex-1">
        <StatusBar style="dark" />
        <View style={{ paddingTop: hp(10), paddingHorizontal: wp(5) }} className="flex-1 gap-12">
          <View className="items-center gap-6">
            <Text style={{ fontSize: hp(5) }} className=" font-bold text-center text-bp-4 ">Sign Up</Text>
            <View>
              <Image style={{ height: hp(20), width: hp(20), borderRadius: hp(10), borderWidth: 4, borderColor: '#4d4385' }} resizeMode='contain' source={imagePlaceHolder} />
              <TouchableOpacity onPress={() => ChangeModalVis(true)}>
                <View style={{ position: 'absolute', height: hp(5), width: hp(5), borderRadius: hp(2.5), bottom: 0, right: 0, borderWidth: 2, borderColor: '#8177bb' }} className="justify-center items-center bg-hbp-1">
                  <MaterialCommunityIcons name="pencil" size={hp(3.5)} style={{ color: '#8177bb' }} />
                </View>
              </TouchableOpacity>
              <Modal
                transparent={true}
                animationType='fade'
                visible={isModalVis}
                nRequestClose={() => ChangeModalVis(false)}
              >
                <ModalPicker
                  ChangeModalVis={ChangeModalVis}
                  onSelect={handleSelect}
                />
              </Modal>
            </View>
          </View>
          <View className="gap-8">
            <View className="gap-4">
              <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-hbp-1 items-center allign-l rounded-xl" >
                <View style={{ width: wp(7) }} className="flex-2   items-center " >
                  <Feather name="user" size={wp(7)} color="#8177bb" />
                </View>
                <TextInput
                  onChangeText={value => usernameRef.current = value}
                  style={{ fontSize: hp(2.7) }}
                  className="flex-1 font-semibold text-bp-4"
                  placeholder='User Name'
                  placeholderTextColor={'#a3a0b9'}
                />
              </View>
              <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-hbp-1  items-center rounded-xl" >
                <View style={{ width: wp(7) }} className="flex-2  items-center" >
                  <Octicons name="mail" size={wp(7)} color="#8177bb" />
                </View>
                <TextInput
                  onChangeText={value => emailRef.current = value}
                  style={{ fontSize: hp(2.7) }}
                  className="flex-1 font-semibold text-bp-4"
                  placeholder='Email address'
                  placeholderTextColor={'#a3a0b9'}
                />
              </View>
              <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-hbp-1  items-center rounded-xl" >
                <View style={{ width: wp(7) }} className="flex-2  items-center" >
                  <Octicons name="lock" size={wp(7)} color="#8177bb" />
                </View>
                <TextInput
                  onChangeText={value => passwordRef.current = value}
                  style={{ fontSize: hp(2.7) }}
                  className="flex-1 font-semibold text-bp-4"
                  placeholder='Password'
                  secureTextEntry
                  placeholderTextColor={'#a3a0b9'}
                />
              </View>
              {/*
              <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-hbp-1  items-center rounded-xl" >
                <View style={{ width: wp(7) }} className="flex-2  items-center" >
                  <Feather name="image" size={wp(7)} color="#8177bb" />
                </View>
                <TextInput
                  onChangeText={value => profileRef.current = value}
                  style={{ fontSize: hp(2.7) }}
                  className="flex-1 font-semibold text-bp-4"
                  placeholder='Profile url'
                  placeholderTextColor={'#a3a0b9'}
                />
              </View>*/}
            </View>
            <View className="gap-3">
              {/* submit button */}
              <View>
                {
                  loading ? (
                    <View className="flex-row justify-center" >
                      <Loading size={hp(7)} />
                    </View>

                  ) : (
                    <TouchableOpacity style={{ backgroundColor: '#584e90', borderRadius: 10 }} underlayColor="#4d4385" onPress={handleRegister} >
                      <View style={{ height: hp(6) }} className="justify-center items-center tracking-wider">
                        <Text style={{ fontSize: hp(3) }} className="text-bp-1 font-bold " >
                          Sign Up
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )
                }
              </View>
              <View className=" flex-row justify-center">
                <Text style={{ fontSize: hp(2) }} className="font-semibold  text-hbp-3 " >Already Have an Account? </Text>
                <Pressable
                  children={({ pressed }) => (
                    <Text style={{ fontSize: hp(2), color: pressed ? '#413776' : '#584e90' }} className="font-bold" >
                      Sign In!!
                    </Text>
                  )} onPress={() => router.push('signin')} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </CostomKeyBordView>
  )
}