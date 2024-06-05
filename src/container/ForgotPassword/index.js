import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  View,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Alert,
} from "react-native";
import { InputField, RoundCornerButton } from "../../component";
import { globalStyle, color } from "../../utility";
import forgotPasswordRequest from "../../network/forgotPasswordRequest";

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleOnChange = (value) => {
    setEmail(value);
  };

  const onSendPress = async () => {
    Keyboard.dismiss();

    if (!email) {
      setError("Yêu cầu nhập email");
    } else {
      const response = await forgotPasswordRequest(email);
      if (response.success) {
        Alert.alert("Yêu cầu đã được gửi", "Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ]);
        setEmail("");
        setError("");
      } else {
        setError(response.error.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[globalStyle.flex1, { backgroundColor: color.BLACK }]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={[globalStyle.flex1, { backgroundColor: color.DARK_GREEN }]}>
          <View style={[globalStyle.flex2, globalStyle.sectionCentered]}>
            {error ? (
              <Text style={{ color: "#FFFFFF", marginBottom: 10 }}>{error}</Text>
            ) : null}
            <InputField
              placeholder="Nhập Email"
              value={email}
              onChangeText={(text) => handleOnChange(text)}
              accessibilityLabel="Email Input Field"
            />
            <RoundCornerButton
              title="Gửi"
              onPress={onSendPress}
              accessibilityLabel="Send Button"
            />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;
