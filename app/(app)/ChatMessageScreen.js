
import {
    StyleSheet, Text, View, ScrollView,
    KeyboardAvoidingView, TextInput, Pressable, Image, FlatList, ActivityIndicator
} from "react-native";
import React, { useState, useContext, useLayoutEffect, useEffect, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../../context/UserContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

export default ChatMessagesScreen = () => {
    const [showEmojiSelector, setShowEmojiSelector] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [messages, setMessages] = useState([]);
    const [recepientData, setRecepientData] = useState();
    const navigation = useNavigation();
    const [selectedImage, setSelectedImage] = useState("");
    const route = useRoute();
    const [loading, setLoading] = useState(false);
    const { recepientId } = route.params;
    const [message, setMessage] = useState("");
    const { userId, setUserId } = useContext(UserType);

    const scrollViewRef = useRef(null);

    useEffect(() => {
        scrollToBottom()
    }, []);

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: false })
        }
    }

    const handleContentSizeChange = () => {
        scrollToBottom();
    }

    const handleEmojiPress = () => {
        setShowEmojiSelector(!showEmojiSelector);
    };

    const fetchMessages = async () => {
        try {
            // recepientId = chatRoom._id
            console.log("UserId = ", userId)
            console.log("RecepitentId = ", recepientId);
            const response = await fetch(
                //`http://172.29.148.167:8000/messages/${userId}/${recepientId}`
                //`http://172.29.148.167:8000/messages/${recepientId}`
                `http://172.29.148.167:8000/messages/${userId}/${recepientId}`
            );
            const data = await response.json();
            if (response.ok) {
                console.log("\ndata = ", data)
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
    
    useEffect(() => {
        const fetchRecepientData = async () => {
            try {
                // recepientId = chatRoom._id
                console.log("RecepitentId = ", recepientId);
                const response = await fetch(
                    `http://172.29.148.167:8000/user/${recepientId}`
                );
                
                const data = await response.json();
                console.log(data.chatroom)
                setRecepientData(data.chatroom);
            } catch (error) {
                console.log("error retrieving details", error);
            }
        };

        fetchRecepientData();
    }, []);
    const handleSend = async (messageType, imageUri) => {
        try {
            const formData = new FormData();
            formData.append("senderUid", userId);
            formData.append("chatRoomId", recepientId);

            //if the message type id image or a normal text
            if (messageType === "image") {
                formData.append("messageType", "image");
                formData.append("imageFile", {
                    uri: imageUri,
                    name: "image.jpg",
                    type: "image/jpeg",
                });
            } else {
                formData.append("messageType", "text");
                formData.append("messageText", message);
            }

            const response = await fetch("http://172.29.148.167:8000/messages", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setMessage("");
                setSelectedImage("");

                fetchMessages();
            }
        } catch (error) {
            console.log("error in sending the message", error);
        }
    };

    console.log("messages", selectedMessages);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons
                        onPress={() => navigation.goBack()}
                        name="arrow-back"
                        size={24}
                        color="black"
                    />

                    {selectedMessages.length > 0 ? (
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: "500" }}>
                                {selectedMessages.length}
                            </Text>
                        </View>
                    ) : (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image
                                style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 15,
                                    resizeMode: "cover",
                                }}
                                source={{ uri: recepientData?.image }}
                            />

                            <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
                                {recepientData?.name}
                            </Text>
                        </View>
                    )}
                </View>
            ),
            headerRight: () =>
                selectedMessages.length > 0 ? (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <Ionicons name="md-arrow-redo-sharp" size={24} color="black" />
                        <Ionicons name="md-arrow-undo" size={24} color="black" />
                        <FontAwesome name="star" size={24} color="black" />
                        <MaterialIcons
                            onPress={() => deleteMessages(selectedMessages)}
                            name="delete"
                            size={24}
                            color="black"
                        />
                    </View>
                ) : null,
        });
    }, [recepientData, selectedMessages]);

    const deleteMessages = async (messageIds) => {
        try {
            const response = await fetch("http://172.29.148.167:8000/deleteMessages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ messages: messageIds }),
            });

            if (response.ok) {
                setSelectedMessages((prevSelectedMessages) =>
                    prevSelectedMessages.filter((id) => !messageIds.includes(id))
                );

                fetchMessages();
            } else {
                console.log("error deleting messages", response.status);
            }
        } catch (error) {
            console.log("error deleting messages", error);
        }
    };
    const formatTime = (time) => {
        const options = { hour: "numeric", minute: "numeric" };
        return new Date(time).toLocaleString("en-US", options);
    };
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);
        if (!result.canceled) {
            handleSend("image", result.uri);
        }
    };
    const handleSelectMessage = (message) => {
        //check if the message is already selected
        const isSelected = selectedMessages.includes(message._id);

        if (isSelected) {
            setSelectedMessages((previousMessages) =>
                previousMessages.filter((id) => id !== message._id)
            );
        } else {
            setSelectedMessages((previousMessages) => [
                ...previousMessages,
                message._id,
            ]);
        }
    };
    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
            <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }} onContentSizeChange={handleContentSizeChange}>
                {messages.map((item, index) => {
                    if (item.messageType === "text") {
                        const isSelected = selectedMessages.includes(item._id);
                        return (
                            <Pressable
                                onLongPress={() => handleSelectMessage(item)}
                                key={index}
                                style={[
                                    item?.senderId?._id === userId
                                        ? {
                                            alignSelf: "flex-end",
                                            backgroundColor: "#DCF8C6",
                                            padding: 8,
                                            maxWidth: "60%",
                                            borderRadius: 7,
                                            margin: 10,
                                        }
                                        : {
                                            alignSelf: "flex-start",
                                            backgroundColor: "white",
                                            padding: 8,
                                            margin: 10,
                                            borderRadius: 7,
                                            maxWidth: "60%",
                                        },

                                    isSelected && { width: "100%", backgroundColor: "#F0FFFF" },
                                ]}
                            >
                                <Text
                                    style={{
                                        fontSize: 13,
                                        textAlign: isSelected ? "right" : "left",
                                    }}
                                >
                                    {item?.message}
                                </Text>
                                <Text
                                    style={{
                                        textAlign: "right",
                                        fontSize: 9,
                                        color: "gray",
                                        marginTop: 5,
                                    }}
                                >
                                    {formatTime(item.timeStamp)}
                                </Text>
                            </Pressable>
                        );
                    }

                    if (item.messageType === "image") {
                        const baseUrl =
                            "/Users/sujananand/Build/messenger-project/api/files/";
                        const imageUrl = item.imageUrl;
                        const filename = imageUrl.split("/").pop();
                        const source = { uri: baseUrl + filename };
                        return (
                            <Pressable
                                key={index}
                                style={[
                                    item?.senderId?._id === userId
                                        ? {
                                            alignSelf: "flex-end",
                                            backgroundColor: "#DCF8C6",
                                            padding: 8,
                                            maxWidth: "60%",
                                            borderRadius: 7,
                                            margin: 10,
                                        }
                                        : {
                                            alignSelf: "flex-start",
                                            backgroundColor: "white",
                                            padding: 8,
                                            margin: 10,
                                            borderRadius: 7,
                                            maxWidth: "60%",
                                        },
                                ]}
                            >
                                <View>
                                    <Image
                                        source={source}
                                        style={{ width: 200, height: 200, borderRadius: 7 }}
                                    />
                                    <Text
                                        style={{
                                            textAlign: "right",
                                            fontSize: 9,
                                            position: "absolute",
                                            right: 10,
                                            bottom: 7,
                                            color: "white",
                                            marginTop: 5,
                                        }}
                                    >
                                        {formatTime(item?.timeStamp)}
                                    </Text>
                                </View>
                            </Pressable>
                        );
                    }
                })}
            </ScrollView>

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderTopWidth: 1,
                    borderTopColor: "#dddddd",
                    marginBottom: showEmojiSelector ? 0 : 25,
                }}
            >
                <Entypo
                    onPress={handleEmojiPress}
                    style={{ marginRight: 5 }}
                    name="emoji-happy"
                    size={24}
                    color="gray"
                />

                <TextInput
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                    style={{
                        flex: 1,
                        height: 40,
                        borderWidth: 1,
                        borderColor: "#dddddd",
                        borderRadius: 20,
                        paddingHorizontal: 10,
                    }}
                    placeholder="Type Your message..."
                />

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 7,
                        marginHorizontal: 8,
                    }}
                >
                    <Entypo onPress={pickImage} name="camera" size={24} color="gray" />

                    <Feather name="mic" size={24} color="gray" />
                </View>

                <Pressable
                    onPress={() => handleSend("text")}
                    style={{
                        backgroundColor: "#007bff",
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 20,
                    }}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
                </Pressable>
            </View>

            {showEmojiSelector && (
                <EmojiSelector
                    onEmojiSelected={(emoji) => {
                        setMessage((prevMessage) => prevMessage + emoji);
                    }}
                    style={{ height: 250 }}
                />
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({});



/*
import {
    StyleSheet, Text, View, ScrollView,
    KeyboardAvoidingView, TextInput, Pressable, Image, FlatList, ActivityIndicator
} from "react-native";
import React, { useState, useContext, useLayoutEffect, useEffect, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../../context/UserContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

const ChatMessagesScreen = () => {
    const [showEmojiSelector, setShowEmojiSelector] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [messages, setMessages] = useState([]);
    const [recepientData, setRecepientData] = useState();
    const navigation = useNavigation();
    const [selectedImage, setSelectedImage] = useState("");
    const route = useRoute();
    const [loading, setLoading] = useState(false);
    const { recepientId } = route.params;
    const [message, setMessage] = useState("");
    const { userId, setUserId } = useContext(UserType);

    const scrollViewRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, []);

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: false });
        }
    }

    const handleContentSizeChange = () => {
        scrollToBottom();
    }

    const handleEmojiPress = () => {
        setShowEmojiSelector(!showEmojiSelector);
    };

    const fetchMessages = async () => {
        try {
            setLoading(true);
            console.log("fetch message by DB.\n")
            const response = await fetch(`http://172.29.148.167:8000/messages/${userId}/${recepientId}`);
            const data = await response.json();

            if (response.ok) {
                setMessages(data);
                setLoading(false);
            } else {
                console.log("Error showing messages", response.status.message);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error fetching messages", error);
            setLoading(false);
        }
    };

    const subscribeToTopic = async () => {
        try {
            console.log("scribe chatroom by kafka.\n")
            const response = await fetch(`http://172.29.148.167:8000/subscribe/${userId}/${recepientId}`);
            if (!response.ok) {
                throw new Error('Failed to subscribe to chat room');
            }
            console.log('Subscribed to chat room');
        } catch (error) {
            console.error('Error subscribing to chat room:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
        subscribeToTopic();
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                console.log("fetch-message by kafka.\n")
                const response = await fetch(`http://172.29.148.167:8000/fetch-messages/${recepientId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch messages');
                }
                const data = await response.json();
                setMessages(prevMessages => [...prevMessages, ...data]);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        }, 500); // 每5秒获取一次消息

        return () => clearInterval(interval); // 清除定时器
    }, [recepientId]);

    const handleSend = async (messageType, imageUri) => {
        try {
            const formData = new FormData();
            formData.append("senderId", userId);
            formData.append("chatRoomId", recepientId);

            // 如果消息类型是图片或普通文本
            if (messageType === "image") {
                formData.append("messageType", "image");
                formData.append("imageFile", {
                    uri: imageUri,
                    name: "image.jpg",
                    type: "image/jpeg",
                });
            } else {
                formData.append("messageType", "text");
                formData.append("messageText", message);
            }
            console.log("fetch messages by DB.\n")
            const response = await fetch("http://172.29.148.167:8000/messages", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setMessage("");
                setSelectedImage("");
                //fetchMessages();
            }
        } catch (error) {
            console.log("Error in sending the message", error);
        }
    };

    const deleteMessages = async (messageIds) => {
        try {
            console.log("delete message by DB.\n")
            const response = await fetch("http://172.29.148.167:8000/deleteMessages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ messages: messageIds }),
            });

            if (response.ok) {
                setSelectedMessages((prevSelectedMessages) =>
                    prevSelectedMessages.filter((id) => !messageIds.includes(id))
                );

                fetchMessages();
            } else {
                console.log("Error deleting messages", response.status);
            }
        } catch (error) {
            console.log("Error deleting messages", error);
        }
    };

    const formatTime = (time) => {
        const options = { hour: "numeric", minute: "numeric" };
        return new Date(time).toLocaleString("en-US", options);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);
        if (!result.canceled) {
            handleSend("image", result.uri);
        }
    };

    const handleSelectMessage = (message) => {
        // 检查消息是否已被选中
        const isSelected = selectedMessages.includes(message._id);

        if (isSelected) {
            setSelectedMessages((previousMessages) =>
                previousMessages.filter((id) => id !== message._id)
            );
        } else {
            setSelectedMessages((previousMessages) => [
                ...previousMessages,
                message._id,
            ]);
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons
                        onPress={() => navigation.goBack()}
                        name="arrow-back"
                        size={24}
                        color="black"
                    />

                    {selectedMessages.length > 0 ? (
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: "500" }}>
                                {selectedMessages.length}
                            </Text>
                        </View>
                    ) : (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image
                                style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 15,
                                    resizeMode: "cover",
                                }}
                                source={{ uri: recepientData?.image }}
                            />

                            <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
                                {recepientData?.name}
                            </Text>
                        </View>
                    )}
                </View>
            ),
            headerRight: () =>
                selectedMessages.length > 0 ? (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <Ionicons name="md-arrow-redo-sharp" size={24} color="black" />
                        <Ionicons name="md-arrow-undo" size={24} color="black" />
                        <FontAwesome name="star" size={24} color="black" />
                        <MaterialIcons
                            onPress={() => deleteMessages(selectedMessages)}
                            name="delete"
                            size={24}
                            color="black"
                        />
                    </View>
                ) : null,
        });
    }, [recepientData, selectedMessages]);

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
            <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }} onContentSizeChange={handleContentSizeChange}>
                {messages.map((item, index) => {
                    if (item.messageType === "text") {
                        const isSelected = selectedMessages.includes(item._id);
                        return (
                            <Pressable
                                onLongPress={() => handleSelectMessage(item)}
                                key={index}
                                style={[
                                    item?.senderId?._id === userId
                                        ? {
                                            alignSelf: "flex-end",
                                            backgroundColor: "#DCF8C6",
                                            padding: 8,
                                            maxWidth: "60%",
                                            borderRadius: 7,
                                            margin: 10,
                                        }
                                        : {
                                            alignSelf: "flex-start",
                                            backgroundColor: "white",
                                            padding: 8,
                                            margin: 10,
                                            borderRadius: 7,
                                            maxWidth: "60%",
                                        },

                                    isSelected && { width: "100%", backgroundColor: "#F0FFFF" },
                                ]}
                            >
                                <Text
                                    style={{
                                        fontSize: 13,
                                        textAlign: isSelected ? "right" : "left",
                                    }}
                                >
                                    {item?.message}
                                </Text>
                                <Text
                                    style={{
                                        textAlign: "right",
                                        fontSize: 9,
                                        color: "gray",
                                        marginTop: 5,
                                    }}
                                >
                                    {formatTime(item.timeStamp)}
                                </Text>
                            </Pressable>
                        );
                    }

                    if (item.messageType === "image") {
                        const baseUrl =
                            "/Users/sujananand/Build/messenger-project/api/files/";
                        const imageUrl = item.imageUrl;
                        const filename = imageUrl.split("/").pop();
                        const source = { uri: baseUrl + filename };
                        return (
                            <Pressable
                                key={index}
                                style={[
                                    item?.senderId?._id === userId
                                        ? {
                                            alignSelf: "flex-end",
                                            backgroundColor: "#DCF8C6",
                                            padding: 8,
                                            maxWidth: "60%",
                                            borderRadius: 7,
                                            margin: 10,
                                        }
                                        : {
                                            alignSelf: "flex-start",
                                            backgroundColor: "white",
                                            padding: 8,
                                            margin: 10,
                                            borderRadius: 7,
                                            maxWidth: "60%",
                                        },
                                ]}
                            >
                                <View>
                                    <Image
                                        source={source}
                                        style={{ width: 200, height: 200, borderRadius: 7 }}
                                    />
                                    <Text
                                        style={{
                                            textAlign: "right",
                                            fontSize: 9,
                                            position: "absolute",
                                            right: 10,
                                            bottom: 7,
                                            color: "white",
                                            marginTop: 5,
                                        }}
                                    >
                                        {formatTime(item?.timeStamp)}
                                    </Text>
                                </View>
                            </Pressable>
                        );
                    }
                })}
            </ScrollView>

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderTopWidth: 1,
                    borderTopColor: "#dddddd",
                    marginBottom: showEmojiSelector ? 0 : 25,
                }}
            >
                <Entypo
                    onPress={handleEmojiPress}
                    style={{ marginRight: 5 }}
                    name="emoji-happy"
                    size={24}
                    color="gray"
                />

                <TextInput
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                    style={{
                        flex: 1,
                        height: 40,
                        borderWidth: 1,
                        borderColor: "#dddddd",
                        borderRadius: 20,
                        paddingHorizontal: 10,
                    }}
                    placeholder="Type Your message..."
                />

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 7,
                        marginHorizontal: 8,
                    }}
                >
                    <Entypo onPress={pickImage} name="camera" size={24} color="gray" />

                    <Feather name="mic" size={24} color="gray" />
                </View>

                <Pressable
                    onPress={() => handleSend("text")}
                    style={{
                        backgroundColor: "#007bff",
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 20,
                    }}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
                </Pressable>
            </View>

            {showEmojiSelector && (
                <EmojiSelector
                    onEmojiSelected={(emoji) => {
                        setMessage((prevMessage) => prevMessage + emoji);
                    }}
                    style={{ height: 250 }}
                />
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({});

export default ChatMessagesScreen;
*/
/*
import {
    StyleSheet, Text, View, ScrollView,
    KeyboardAvoidingView, TextInput, Pressable, Image, FlatList, ActivityIndicator
} from "react-native";
import React, { useState, useContext, useLayoutEffect, useEffect, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../../context/UserContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

const ChatMessagesScreen = () => {
    const [showEmojiSelector, setShowEmojiSelector] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [messages, setMessages] = useState([]);
    const [recepientData, setRecepientData] = useState();
    const navigation = useNavigation();
    const [selectedImage, setSelectedImage] = useState("");
    const route = useRoute();
    const [loading, setLoading] = useState(false);
    const { recepientId } = route.params;
    const [message, setMessage] = useState("");
    const { userId, setUserId } = useContext(UserType);

    const scrollViewRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, []);

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: false });
        }
    }

    const handleContentSizeChange = () => {
        scrollToBottom();
    }

    const handleEmojiPress = () => {
        setShowEmojiSelector(!showEmojiSelector);
    };

    const fetchMessages = async () => {
        try {
            setLoading(true);
            console.log("Fetching messages by DB.\n");
            const response = await fetch(`http://172.29.148.167:8000/messages/${userId}/${recepientId}`);
            const data = await response.json();

            if (response.ok) {
                setMessages(data);
                setLoading(false);
            } else {
                console.log("Error showing messages", response.statusText);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error fetching messages", error);
            setLoading(false);
        }
    };

    const subscribeToTopic = async () => {
        try {
            console.log("Subscribing to chatroom by Kafka.\n");
            const response = await fetch(`http://172.29.148.167:8000/subscribe/${userId}/${recepientId}`);
            if (!response.ok) {
                throw new Error('Failed to subscribe to chat room');
            }
            console.log('Subscribed to chat room');
        } catch (error) {
            console.error('Error subscribing to chat room:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
        subscribeToTopic();
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                console.log("Fetching messages by Kafka.\n");
                const response = await fetch(`http://172.29.148.167:8000/fetch-messages/${recepientId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch messages');
                }
                const data = await response.json();
                setMessages(prevMessages => [...prevMessages, ...data]);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        }, 5000); // 每5秒获取一次消息

        return () => clearInterval(interval); // 清除定时器
    }, [recepientId]);

    const handleSend = async (messageType, imageUri) => {
        try {
            const formData = new FormData();
            formData.append("senderUid", userId);
            formData.append("chatRoomId", recepientId);

            //if the message type id image or a normal text
            if (messageType === "image") {
                formData.append("messageType", "image");
                formData.append("imageFile", {
                    uri: imageUri,
                    name: "image.jpg",
                    type: "image/jpeg",
                });
            } else {
                formData.append("messageType", "text");
                formData.append("messageText", message);
            }

            const response = await fetch("http://172.29.148.167:8000/messages", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setMessage("");
                setSelectedImage("");

                fetchMessages();
            }
        } catch (error) {
            console.log("error in sending the message", error);
        }
    };

    const deleteMessages = async (messageIds) => {
        try {
            console.log("Deleting message by DB.\n");
            const response = await fetch("http://172.29.148.167:8000/deleteMessages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ messages: messageIds }),
            });

            if (response.ok) {
                setSelectedMessages((prevSelectedMessages) =>
                    prevSelectedMessages.filter((id) => !messageIds.includes(id))
                );

                fetchMessages();
            } else {
                console.log("Error deleting messages", response.status);
            }
        } catch (error) {
            console.log("Error deleting messages", error);
        }
    };

    const formatTime = (time) => {
        const options = { hour: "numeric", minute: "numeric" };
        return new Date(time).toLocaleString("en-US", options);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);
        if (!result.canceled) {
            handleSend("image", result.uri);
        }
    };

    const handleSelectMessage = (message) => {
        // 检查消息是否已被选中
        const isSelected = selectedMessages.includes(message._id);

        if (isSelected) {
            setSelectedMessages((previousMessages) =>
                previousMessages.filter((id) => id !== message._id)
            );
        } else {
            setSelectedMessages((previousMessages) => [
                ...previousMessages,
                message._id,
            ]);
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons
                        onPress={() => navigation.goBack()}
                        name="arrow-back"
                        size={24}
                        color="black"
                    />

                    {selectedMessages.length > 0 ? (
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: "500" }}>
                                {selectedMessages.length}
                            </Text>
                        </View>
                    ) : (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image
                                style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 15,
                                    resizeMode: "cover",
                                }}
                                source={{ uri: recepientData?.image }}
                            />

                            <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
                                {recepientData?.name}
                            </Text>
                        </View>
                    )}
                </View>
            ),
            headerRight: () =>
                selectedMessages.length > 0 ? (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <Ionicons name="md-arrow-redo-sharp" size={24} color="black" />
                        <Ionicons name="md-arrow-undo" size={24} color="black" />
                        <FontAwesome name="star" size={24} color="black" />
                        <MaterialIcons
                            onPress={() => deleteMessages(selectedMessages)}
                            name="delete"
                            size={24}
                            color="black"
                        />
                    </View>
                ) : null,
        });
    }, [recepientData, selectedMessages]);

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
            <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }} onContentSizeChange={handleContentSizeChange}>
                {messages.map((item, index) => {
                    if (item.messageType === "text") {
                        const isSelected = selectedMessages.includes(item._id);
                        return (
                            <Pressable
                                onLongPress={() => handleSelectMessage(item)}
                                key={index}
                                style={[
                                    item?.senderId?._id === userId
                                        ? {
                                            alignSelf: "flex-end",
                                            backgroundColor: "#DCF8C6",
                                            padding: 8,
                                            maxWidth: "60%",
                                            borderRadius: 7,
                                            margin: 10,
                                        }
                                        : {
                                            alignSelf: "flex-start",
                                            backgroundColor: "white",
                                            padding: 8,
                                            margin: 10,
                                            borderRadius: 7,
                                            maxWidth: "60%",
                                        },

                                    isSelected && { width: "100%", backgroundColor: "#F0FFFF" },
                                ]}
                            >
                                <Text
                                    style={{
                                        fontSize: 13,
                                        textAlign: isSelected ? "right" : "left",
                                    }}
                                >
                                    {item?.message}
                                </Text>
                                <Text
                                    style={{
                                        textAlign: "right",
                                        fontSize: 9,
                                        color: "gray",
                                        marginTop: 5,
                                    }}
                                >
                                    {formatTime(item.timeStamp)}
                                </Text>
                            </Pressable>
                        );
                    }

                    if (item.messageType === "image") {
                        const baseUrl =
                            "/Users/sujananand/Build/messenger-project/api/files/";
                        const imageUrl = item.imageUrl;
                        const filename = imageUrl.split("/").pop();
                        const source = { uri: baseUrl + filename };
                        return (
                            <Pressable
                                key={index}
                                style={[
                                    item?.senderId?._id === userId
                                        ? {
                                            alignSelf: "flex-end",
                                            backgroundColor: "#DCF8C6",
                                            padding: 8,
                                            maxWidth: "60%",
                                            borderRadius: 7,
                                            margin: 10,
                                        }
                                        : {
                                            alignSelf: "flex-start",
                                            backgroundColor: "white",
                                            padding: 8,
                                            margin: 10,
                                            borderRadius: 7,
                                            maxWidth: "60%",
                                        },
                                ]}
                            >
                                <View>
                                    <Image
                                        source={source}
                                        style={{ width: 200, height: 200, borderRadius: 7 }}
                                    />
                                    <Text
                                        style={{
                                            textAlign: "right",
                                            fontSize: 9,
                                            position: "absolute",
                                            right: 10,
                                            bottom: 7,
                                            color: "white",
                                            marginTop: 5,
                                        }}
                                    >
                                        {formatTime(item?.timeStamp)}
                                    </Text>
                                </View>
                            </Pressable>
                        );
                    }
                })}
            </ScrollView>

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderTopWidth: 1,
                    borderTopColor: "#dddddd",
                    marginBottom: showEmojiSelector ? 0 : 25,
                }}
            >
                <Entypo
                    onPress={handleEmojiPress}
                    style={{ marginRight: 5 }}
                    name="emoji-happy"
                    size={24}
                    color="gray"
                />

                <TextInput
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                    style={{
                        flex: 1,
                        height: 40,
                        borderWidth: 1,
                        borderColor: "#dddddd",
                        borderRadius: 20,
                        paddingHorizontal: 10,
                    }}
                    placeholder="Type Your message..."
                />

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 7,
                        marginHorizontal: 8,
                    }}
                >
                    <Entypo onPress={pickImage} name="camera" size={24} color="gray" />

                    <Feather name="mic" size={24} color="gray" />
                </View>

                <Pressable
                    onPress={() => handleSend("text")}
                    style={{
                        backgroundColor: "#007bff",
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 20,
                    }}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
                </Pressable>
            </View>

            {showEmojiSelector && (
                <EmojiSelector
                    onEmojiSelected={(emoji) => {
                        setMessage((prevMessage) => prevMessage + emoji);
                    }}
                    style={{ height: 250 }}
                />
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({});

export default ChatMessagesScreen;
*/