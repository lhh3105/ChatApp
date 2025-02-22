import React from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { globalStyle, color } from "../../utility";
import styles from "./styles";

const Profile = ({ img, name, email, onImgTap, onEditImgTap }) => (
  <View style={[globalStyle.sectionCentered, styles.container]}>
    <View style={styles.imgContainer}>
      <TouchableOpacity onPress={onImgTap} activeOpacity={0.8}>
        {img ? (
          <Image source={{ uri: img }} style={styles.img} resizeMode="cover" />
        ) : (
          <View
            style={[
              globalStyle.sectionCentered,
              styles.img,
              { backgroundColor: color.DARK_GRAY },
            ]}
          >
            <Text style={styles.name}>{name.charAt(0)}</Text>
          </View>
        )}
      </TouchableOpacity>
      <View style={[globalStyle.sectionCentered, styles.editImgContainer]}>
        <FontAwesome5
          name="user-edit"
          size={20}
          onPress={onEditImgTap}
          color={color.WHITE}
        />
      </View>
    </View>
    <Text style={styles.welcome}>{name}</Text>
    <Text style={styles.email}>{email}</Text>
  </View>
);

export default Profile;
