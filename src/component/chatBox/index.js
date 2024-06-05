import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity as RNTouchableOpacity } from "react-native"; // Alias as RNTouchableOpacity
import { Card, CardItem } from "native-base";
import { deviceWidth } from "../../utility/styleHelper/appStyle";
import { uuid } from "../../utility/constants";
import { color } from "../../utility";

const ChatBox = ({ userId, msg, img, onImgTap, messageColor }) => {
  let isCurrentUser = userId === uuid ? true : false;

  return (
    <Card
      transparent
      style={{
        maxWidth: deviceWidth / 2 + 10,
        alignSelf: isCurrentUser ? "flex-end" : "flex-start",
      }}
    >
      <View
        style={[
          styles.chatContainer,
          {
            borderTopLeftRadius: isCurrentUser ? 20 : 20,
            borderBottomLeftRadius: isCurrentUser ? 20 : 0,
            borderTopRightRadius: isCurrentUser ? 20 : 20,
            borderBottomRightRadius: isCurrentUser ? 0 : 20,
            backgroundColor: isCurrentUser ? messageColor : color.LIGHT_GRAY,
          },
        ]}
      >
        {img ? (
          <CardItem cardBody>
            <RNTouchableOpacity onPress={onImgTap}>
              <Image
                source={{ uri: img }}
                resizeMode="cover"
                style={{ height: 200, width: deviceWidth / 2 }}
              />
            </RNTouchableOpacity>
          </CardItem>
        ) : (
          <Text
            style={[
              styles.chatTxt,
              !isCurrentUser && { color: color.WHITE },
            ]}
          >
            {msg}
          </Text>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    backgroundColor: color.LIGHT_GRAY,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  chatTxt: {
    color: color.WHITE,
    fontSize: 18,
    marginVertical: 5,
    fontWeight: "500",
    padding: 8,
  },
});

export default ChatBox;
