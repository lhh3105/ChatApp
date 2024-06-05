import React, { useLayoutEffect, useState, useEffect, Fragment } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { globalStyle, color, appStyle } from "../../utility";
import styles from "./styles";
import { InputField, ChatBox } from "../../component";
import firebase from "../../firebase/config";
import { senderMsg, recieverMsg } from "../../network";
import { deviceHeight } from "../../utility/styleHelper/appStyle";
import { smallDeviceHeight } from "../../utility/constants";
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = ({ route, navigation }) => {
  const { params } = route;
  const { name, img, imgText, guestUserId, currentUserId } = params;
  const [msgValue, setMsgValue] = useState("");
  const [messeges, setMesseges] = useState([]);
  const [messageColor, setMessageColor] = useState(color.DARK_GREEN);
  const [headerColor, setHeaderColor] = useState(color.DARK_GREEN); // Màu của header

  const messageColors = [color.DARK_GREEN, color.BLUE, color.RED]; // Thêm màu sắc khác vào đây

  useEffect(() => {
    // Load saved color from AsyncStorage for the current user
    const userColorKey = `${currentUserId}_${guestUserId}_messageColor`; // Unique key for each pair of users
    AsyncStorage.getItem(userColorKey).then((savedColor) => {
      if (savedColor) {
        setMessageColor(savedColor);
        setHeaderColor(savedColor); // Cập nhật màu của header
      }
    });
  }, [currentUserId, guestUserId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={styles.headerTitle}>{name}</Text>,
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 10 }}>
          {messageColors.map((color, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleColorChange(color)}
              style={{ 
                marginLeft: index > 0 ? 10 : 0,
                borderWidth: 1.5,  // Thêm viền
                borderColor: 'white', // Màu của viền
                borderRadius: 20 // Bo tròn viền
              }}
            >
              <View style={{ backgroundColor: color, width: 20, height: 20, borderRadius: 10 }} />
            </TouchableOpacity>

          ))}
        </View>
      ),
      headerStyle: { backgroundColor: headerColor }, // Thay đổi màu của header
    });
  }, [navigation, name, messageColors, headerColor]);

  const handleColorChange = async (color) => {
    // Save selected color to AsyncStorage with a unique key for each pair of users
    const userColorKey = `${currentUserId}_${guestUserId}_messageColor`; // Unique key for each pair of users
    await AsyncStorage.setItem(userColorKey, color);
    setMessageColor(color);
    setHeaderColor(color); // Cập nhật màu của header
  };

  useEffect(() => {
    try {
      firebase
        .database()
        .ref("messeges")
        .child(currentUserId)
        .child(guestUserId)
        .on("value", (dataSnapshot) => {
          let msgs = [];
          dataSnapshot.forEach((child) => {
            msgs.push({
              sendBy: child.val().messege.sender,
              recievedBy: child.val().messege.reciever,
              msg: child.val().messege.msg,
              img: child.val().messege.img,
            });
          });
          setMesseges(msgs.reverse());
        });
    } catch (error) {
      alert(error);
    }
  }, []);

  const handleSend = () => {
    setMsgValue("");
    if (msgValue) {
      senderMsg(msgValue, currentUserId, guestUserId, "")
        .then(() => {})
        .catch((err) => alert(err));

      recieverMsg(msgValue, currentUserId, guestUserId, "")
        .then(() => {})
        .catch((err) => alert(err));
    }
  };

  const handleCamera = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("Người dùng huỷ chọn hình ảnh");
      } else if (response.error) {
        console.log(" Chọn hình ảnh lỗi!", response.error);
      } else {
        let source = { uri: response.assets[0].uri };

        senderMsg(msgValue, currentUserId, guestUserId, source.uri)
          .then(() => {})
          .catch((err) => alert(err));

        recieverMsg(msgValue, currentUserId, guestUserId, source.uri)
          .then(() => {})
          .catch((err) => alert(err));
      }
    });
  };

  const handleOnChange = (text) => {
    setMsgValue(text);
  };

  const imgTap = (chatImg) => {
    navigation.navigate("ShowFullImg", { name, img: chatImg });
  };

  return (
    <SafeAreaView style={[globalStyle.flex1, { backgroundColor: color.WHITE }]}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={deviceHeight > smallDeviceHeight ? 100 : 70}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[globalStyle.flex1, { backgroundColor: color.D }]}
      >
        <TouchableWithoutFeedback
          style={[globalStyle.flex1]}
          onPress={Keyboard.dismiss}
        >
          <Fragment>
            <FlatList
              inverted
              data={messeges}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <ChatBox
                  msg={item.msg}
                  userId={item.sendBy}
                  img={item.img}
                  onImgTap={() => imgTap(item.img)}
                  messageColor={messageColor}
                />
              )}
            />

            <View style={[styles.sendMessageContainer, { backgroundColor: messageColor }]}>
              <InputField
                placeholder="Nhắn tin"
                numberOfLines={10}
                inputStyle={styles.input}
                value={msgValue}
                onChangeText={(text) => handleOnChange(text)}
              />
              <View style={[styles.sendBtnContainer, { backgroundColor: messageColor }]}>
                <MaterialCommunityIcons
                  name="image"
                  color={color.WHITE}
                  size={appStyle.fieldHeight}
                  onPress={handleCamera}
                />
                <MaterialCommunityIcons
                  name="send-circle"
                  color={color.WHITE}
                  size={appStyle.fieldHeight}
                  onPress={() => handleSend()}
                />
              </View>
            </View>
          </Fragment>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;
