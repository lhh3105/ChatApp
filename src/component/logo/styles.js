import { StyleSheet } from "react-native";
import { color, appStyle } from "../../utility";
import { smallDeviceHeight } from "../../utility/constants";

const getDimensions = () => {
  const baseDimensions = {
    height: appStyle.deviceHeight > smallDeviceHeight ? 120 : 150,
    width: appStyle.deviceHeight > smallDeviceHeight ? 120 : 150,
    borderRadius: appStyle.deviceHeight > smallDeviceHeight ? 40 : 21,
    logoFontSize: appStyle.deviceHeight > smallDeviceHeight ? 70 : 30,
  };
  return baseDimensions;
};

export default StyleSheet.create({
  logo: {
    ...getDimensions(),
    backgroundColor: 'transparent',
    alignItems: "center",
    justifyContent: "center",
    position: 'relative',
    overflow: 'hidden', 
  },
  text: {
    fontSize: getDimensions().logoFontSize,
    fontWeight: "bold",
    color: color.DARK_GREEN,
    textAlign: 'center',
    zIndex: 1, 
    position: 'relative', 
    top: -10, 
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0, 
  },
  image: {
    width: '80%',
    height: '80%',
    borderRadius: getDimensions().borderRadius,
  },
});
