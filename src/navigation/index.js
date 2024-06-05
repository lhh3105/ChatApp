import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import {
  Login,
  SignUp,
  Dashboard,
  Splash,
  ShowFullImg,
  Chat,
  ForgotPassword, // Import the ForgotPassword component
} from "../container";
import { color } from "../utility";

const Stack = createStackNavigator();

function NavContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: { backgroundColor: color.DARK_GRAY },
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          headerTintColor: color.WHITE,
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            headerTitle: "", // Ẩn tên trang
            headerLeft: null,
            headerStyle: { backgroundColor: color.DARK_GREEN },
          }}
        />
        <Stack.Screen
          name="ShowFullImg"
          component={ShowFullImg}
          options={{
            headerTransparent: true, 
            headerBackTitle: null,
          }}
        />

        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{
            headerTitle: "", // Ẩn tên trang
            headerBackTitle: null,
            //headerStyle: { backgroundColor: color.DARK_GREEN },
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword} // Add the ForgotPassword screen
          options={{
            headerTitle: "Quên mật khẩu",
            headerBackTitle: null,
            headerStyle: { backgroundColor: color.DARK_GREEN },
            headerTitleStyle: { fontSize: 30 },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default NavContainer;
