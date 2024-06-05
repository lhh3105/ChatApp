import React from 'react';
import { Text, View, Image } from 'react-native';
import styles from './styles';

const Logo = ({ logoStyle, logoTextStyle }) => {
  return (
    <View style={[styles.logo, logoStyle]}>
      <Image
        style={styles.image}
        source={require('../../utility/pictures/chat.png')}
      />
      <View style={styles.overlayContainer}>
        <Text style={[styles.text, logoTextStyle]}>ChatApp</Text>
      </View>
    </View>
  );
};

export default Logo;
