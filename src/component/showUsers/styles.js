import { StyleSheet } from "react-native";
import { color } from "../../utility";

export default StyleSheet.create({
  cardStyle: {
    backgroundColor: color.SEMI_TRANSPARENT,
    borderBottomWidth: 1,
    borderColor: color.SILVER,
    borderRadius: 50, // Rounded corners for the card
  },
  cardItemStyle: {
    backgroundColor: color.DARK_GREEN,
    borderRadius: 50, // Rounded corners for the card item
  },
  logoContainer: {
    height: 60,
    width: 60,
    backgroundColor: color.DARK_GRAY,
    borderRadius: 30, // Rounded corners for the logo container
    borderWidth: 2,
    borderColor: color.WHITE,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnailName: { 
    fontSize: 30, 
    color: color.WHITE, 
    fontWeight: "bold" 
  },
  profileName: { 
    fontSize: 20, 
    color: color.WHITE, 
    fontWeight: "bold" 
  },
});
