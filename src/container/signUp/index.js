import React, { useState, useContext } from "react";
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
import { SignUpRequest, AddUser } from "../../network";
import { InputField, RoundCornerButton, Logo } from "../../component";
import { globalStyle, color } from "../../utility";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import firebase from "../../firebase/config"; // Ensure this path is correct


export default ({ navigation }) => {
  const globalState = useContext(Store);
  const { dispatchLoaderAction } = globalState;
  const [credential, setCredential] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [logo, toggleLogo] = useState(true);
  const [error, setError] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);

  const setInitialState = () => {
    setCredential({ email: "", password: "", confirmPassword: "" });
    setError("");
  };

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const toggleConfirmSecureEntry = () => {
    setConfirmSecureTextEntry(!confirmSecureTextEntry);
  };

  const onSignUpPress = () => {
    Keyboard.dismiss();
    const { name, email, password, confirmPassword } = credential;
    if (!name || !email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin!.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác thực không hợp lệ!");
      return;
    }
    dispatchLoaderAction({ type: LOADING_START });
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      let uid = userCredential.user.uid;
      let profileImg = "";
      AddUser(name, email, uid, profileImg)
        .then(() => {
          setAsyncStorage(keys.uuid, uid);
          setUniqueValue(uid);
          dispatchLoaderAction({ type: LOADING_STOP });
          navigation.replace("Dashboard");
        })
        .catch((err) => {
          dispatchLoaderAction({ type: LOADING_STOP });
          setError("Có lỗi xảy ra: " + err.message);
        });
    })
    .catch((error) => {
      dispatchLoaderAction({ type: LOADING_STOP });
      if (error.code === "auth/email-already-in-use") {
        setError("Email đã tồn tại!.");
      } else {
        setError("Có lỗi xảy ra: " + error.message);
      }
    });  
  };

  const handleOnChange = (name, value) => {
    setCredential({ ...credential, [name]: value });
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

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={keyboardVerticalOffset}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={[globalStyle.flex1, { backgroundColor: color.BLACK }]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ flex: 1, backgroundColor: color.DARK_GREEN }}>
          {logo && (
            <View style={[globalStyle.containerCentered]}>
              <Logo />
            </View>
          )}

          <View style={[globalStyle.flex2, globalStyle.sectionCentered]}>
            {error ? (
              <Text style={{ color: '#FFFFFF', marginBottom: 10 }}>{error}</Text>
            ) : null}
            <InputField
              placeholder="Nhập tên tài khoản"
              value={credential.name}
              onChangeText={(text) => handleOnChange("name", text)}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <InputField
              placeholder="Nhập gmail cần đăng ký"
              value={credential.email}
              onChangeText={(text) => handleOnChange("email", text)}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InputField
                placeholder="Nhập mật khẩu"
                secureTextEntry={secureTextEntry}
                value={credential.password}
                onChangeText={(text) => handleOnChange("password", text)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{ flex: 1 }}
              />
              <FontAwesome5
                name={secureTextEntry ? 'eye-slash' : 'eye'}
                size={20}
                color={color.BLACK}
                style={{ position: 'absolute', right: 10 }}
                onPress={toggleSecureEntry}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InputField
                placeholder="Xác nhận mật khẩu"
                secureTextEntry={confirmSecureTextEntry}
                value={credential.confirmPassword}
                onChangeText={(text) => handleOnChange("confirmPassword", text)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{ flex: 1 }}
              />
              <FontAwesome5
                name={confirmSecureTextEntry ? 'eye-slash' : 'eye'}
                size={20}
                color={color.BLACK}
                style={{ position: 'absolute', right: 10 }}
                onPress={toggleConfirmSecureEntry}
              />
            </View>

            <RoundCornerButton
              title="Đăng ký"
              onPress={onSignUpPress}
            />
            <Text
              style={{
                fontSize: 26,
                fontWeight: "bold",
                color: color.YELLOW,
              }}
              onPress={() => {
                setInitialState();
                navigation.navigate("Login");
              }}
            >
              Đăng nhập
            </Text>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
