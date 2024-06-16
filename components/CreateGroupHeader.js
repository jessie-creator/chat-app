import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Ionicons, MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function createGroupHeader({ router }) {
    const { top } = useSafeAreaInsets();
    return (
        <Stack.Screen
            options={{
                title: 'Create Group',
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: '#8177bb'

                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontSize: hp(3)
                },
                headerTitleAlign: 'center',
                headerLeft: () => (
                    <View style={{ paddingTop: 10 }} className="gap-8 rounded-xl">
                        <View className="flex-row   items-center justify-center">
                            <TouchableOpacity onPress={() => { router.back() }}>
                                <Ionicons size={hp(3)} name="chevron-back-outline" color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                )

            }}
        />
    )
}