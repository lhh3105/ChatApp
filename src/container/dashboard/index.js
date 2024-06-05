import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import { SafeAreaView, Alert, Text, View, FlatList, TextInput, TouchableOpacity, Modal, StyleSheet } from "react-native"; // Import StyleSheet here
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { launchImageLibrary } from 'react-native-image-picker';
import { Profile, ShowUsers, StickyHeader } from "../../component";
import firebase from "../../firebase/config";
import { color } from "../../utility";
import { Store } from "../../context/store";
import { LOADING_STOP, LOADING_START } from "../../context/actions/type";
import { uuid, smallDeviceHeight } from "../../utility/constants";
import { clearAsyncStorage } from "../../asyncStorage";
import { deviceHeight } from "../../utility/styleHelper/appStyle";
import { UpdateUser, LogOutUser } from "../../network";
import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default ({ navigation }) => {
  const globalState = useContext(Store);
  const { dispatchLoaderAction } = globalState;

  const [userDetail, setUserDetail] = useState({
    id: "",
    name: "",
    profileImg: "",
    email: "",
  });
  const [getScrollPosition, setScrollPosition] = useState(0);
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const { profileImg, name, email } = userDetail;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => setModalVisible(true)}>
          <FontAwesome name="bars" size={24} color={color.WHITE} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <SimpleLineIcons
          name="logout"
          size={26}
          color={color.WHITE}
          style={{ right: 10 }}
          onPress={confirmLogout}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    dispatchLoaderAction({ type: LOADING_START });
    const usersRef = firebase.database().ref("users");
    usersRef.on("value", handleSnapshot);
    return () => usersRef.off("value", handleSnapshot);
  }, []);

  const handleSnapshot = (dataSnapshot) => {
    const users = [];
    let currentUser = { id: "", name: "", profileImg: "", email: "" };
    dataSnapshot.forEach((child) => {
      const userData = child.val();
      if (uuid === userData.uuid) {
        currentUser.id = uuid;
        currentUser.name = userData.name;
        currentUser.profileImg = userData.profileImg;
        currentUser.email = userData.email;
      } else {
        users.push({
          id: userData.uuid,
          name: userData.name,
          profileImg: userData.profileImg,
          email: userData.email,
        });
      }
    });
    setUserDetail(currentUser);
    setAllUsers(users);
    dispatchLoaderAction({ type: LOADING_STOP });
  };

  const confirmLogout = () => {
    Alert.alert(
      "Chat",
      "Bạn có chắc chắn bạn muốn thoát?",
      [
        {
          text: "Có",
          onPress: logout,
        },
        {
          text: "Không",
        },
      ],
      { cancelable: false }
    );
  };

  const logout = () => {
    LogOutUser()
      .then(() => {
        clearAsyncStorage()
          .then(() => navigation.replace("Login"))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  const selectPhotoTapped = () => {
    const options = { mediaType: 'photo', includeBase64: false };
    launchImageLibrary(options, handleImageSelection);
  };

  const handleImageSelection = (response) => {
    if (response.didCancel) {
      console.log("Người dùng đã hủy công cụ chọn ảnh");
    } else if (response.error) {
      console.log("ImagePicker Lỗi: ", response.error);
    } else if (response.customButton) {
      console.log("Người dùng nhấn vào nút tùy chỉnh: ", response.customButton);
    } else {
      const source = { uri: response.assets[0].uri };
      dispatchLoaderAction({ type: LOADING_START });
      UpdateUser(uuid, source.uri)
        .then(() => {
          setUserDetail({ ...userDetail, profileImg: source.uri });
          dispatchLoaderAction({ type: LOADING_STOP });
        })
        .catch((err) => {
          console.log(err);
          dispatchLoaderAction({ type: LOADING_STOP });
        });
    }
  };

  const imgTap = (profileImg, name) => {
    if (!profileImg) {
      navigation.navigate("ShowFullImg", { name, imgText: name.charAt(0) });
    } else {
      navigation.navigate("ShowFullImg", { name, img: profileImg });
    }
  };

  const nameTap = (profileImg, name, guestUserId) => {
    if (!profileImg) {
      navigation.navigate("Chat", {
        name,
        imgText: name.charAt(0),
        guestUserId,
        currentUserId: uuid,
      });
    } else {
      navigation.navigate("Chat", {
        name,
        img: profileImg,
        guestUserId,
        currentUserId: uuid,
      });
    }
  };

  const getOpacity = () => {
    return deviceHeight < smallDeviceHeight ? deviceHeight / 4 : deviceHeight / 6;
  };

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.WHITE }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Profile
            img={profileImg}
            onImgTap={() => imgTap(profileImg, name)}
            onEditImgTap={() => {setModalVisible(false); selectPhotoTapped();}}
            name={name}
            email={email} // Display email in Profile component
          />
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {getScrollPosition > getOpacity() && (
        <StickyHeader
          name={name}
          img={profileImg}
          onImgTap={() => imgTap(profileImg, name)}
        />
      )}

      <View style={styles.searchBar}>
        <SimpleLineIcons name="magnifier" size={20} color={color.BLACK} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm..."
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        onScroll={(event) => setScrollPosition(event.nativeEvent.contentOffset.y)}
        renderItem={({ item }) => (
          <ShowUsers
            name={item.name}
            img={item.profileImg}
            onImgTap={() => imgTap(item.profileImg, item.name)}
            onNameTap={() => nameTap(item.profileImg, item.name, item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 5,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: color.BLACK
  },
  searchInput: {
    flex: 1,
    marginLeft: 5
  },
  modalContainer: {
    flex: 0.7,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
  }
});
