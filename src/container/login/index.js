import React, { useContext, useState } from "react";
import {
  Text,
  SafeAreaView,
  View,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { Store } from "../../context/store";
import { LOADING_START, LOADING_STOP } from "../../context/actions/type";
import { setAsyncStorage, keys } from "../../asyncStorage";
import { setUniqueValue, keyboardVerticalOffset } from "../../utility/constants";
import { LoginRequest } from "../../network";
import { InputField, RoundCornerButton, Logo } from "../../component";
import { globalStyle, color } from "../../utility";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default ({ navigation }) => {
  const globalState = useContext(Store);
  const { dispatchLoaderAction } = globalState;
  const [credential, setCredential] = useState({ email: "", password: "" });
  const [logo, toggleLogo] = useState(true);
  const [error, setError] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const setInitialState = () => {
    setCredential({ email: "", password: "" });
    setError("");
  };

  const handleOnChange = (name, value) => {
    setCredential({
      ...credential,
      [name]: value,
    });
  };

  const onLoginPress = () => {
    Keyboard.dismiss();
    const { email, password } = credential;

    if (!email) {
      setError("Yêu cầu nhập email");
    } else if (!password) {
      setError("Yêu cầu nhập mật khẩu");
    } else {
      dispatchLoaderAction({ type: LOADING_START });
      LoginRequest(email, password)
        .then((res) => {
          if (!res.additionalUserInfo) {
            dispatchLoaderAction({ type: LOADING_STOP });
            setError("Tài khoản hoặc mật khẩu không chính xác");
            return;
          }
          setAsyncStorage(keys.uuid, res.user.uid);
          setUniqueValue(res.user.uid);
          dispatchLoaderAction({ type: LOADING_STOP });
          setInitialState();
          navigation.navigate("Dashboard");
        })
        .catch(() => {
          dispatchLoaderAction({ type: LOADING_STOP });
          setError("Đăng nhập thất bại. Vui lòng thử lại.");
        });
    }
  };

  const handleFocus = () => {
    setTimeout(() => {
      toggleLogo(false);
    }, 200);
  };

  const handleBlur = () => {
    setTimeout(() => {
      toggleLogo(true);
    }, 200);
  };

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={keyboardVerticalOffset}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[globalStyle.flex1, { backgroundColor: color.BLACK }]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView
          style={[globalStyle.flex1, { backgroundColor: color.DARK_GREEN }]}
        >
          {logo && (
            <View style={[globalStyle.containerCentered]}>
              <Logo />
            </View>
          )}
          <View style={[globalStyle.flex2, globalStyle.sectionCentered]}>
            {error ? (
              <Text style={{ color: "#FFFFFF", marginBottom: 10 }}>{error}</Text>
            ) : null}
            <InputField
              placeholder="Nhập Email"
              value={credential.email}
              onChangeText={(text) => handleOnChange("email", text)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              accessibilityLabel="Email Input Field"
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <InputField
                placeholder="Nhập Mật Khẩu"
                value={credential.password}
                secureTextEntry={secureTextEntry}
                onChangeText={(text) => handleOnChange("password", text)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{ flex: 1 }}
                accessibilityLabel="Password Input Field"
              />
              <FontAwesome5
                name={secureTextEntry ? "eye-slash" : "eye"}
                size={20}
                color={color.BLACK}
                style={{ position: "absolute", right: 10 }}
                onPress={toggleSecureTextEntry}
                accessibilityLabel="Toggle Password Visibility"
              />
            </View>
            <RoundCornerButton
              title="Đăng nhập"
              onPress={onLoginPress}
              accessibilityLabel="Login Button"
            />
            <Text
              style={{
                fontSize: 26,
                fontWeight: "bold",
                color: color.YELLOW,
                marginTop: 10,
              }}
              onPress={() => {
                setInitialState();
                navigation.navigate("SignUp");
              }}
              accessibilityLabel="Sign Up Link"
            >
              Đăng Ký
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: color.WHITE,
                marginTop: 10,
              }}
              onPress={() => {
                setInitialState();
                navigation.navigate("ForgotPassword");
              }}
              accessibilityLabel="Forgot Password Link"
            >
              Quên mật khẩu?
            </Text>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
