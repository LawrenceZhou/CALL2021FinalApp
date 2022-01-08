import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  Button,
  FAB,
  Dialog,
  Portal,
  Provider as PaperProvider,
  TextInput,
  ActivityIndicator,
  Colors,
} from "react-native-paper";
import * as firebase from "firebase";

import * as ImagePicker from "expo-image-picker";

import { convertEpochToDateMonthYear } from "../logic/helpers";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import Home from "./Home";
import Login from "./Login";
import ChatLists from "./ChatLists";
import Forum from "./Forum";
import Me from "./Me";


const Tab = createBottomTabNavigator();

export default class HomeTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      device_model_name: null,
    };
  }

  render() {

    return (
    <Tab.Navigator tabBarOptions={{ activeTintColor:'blue', inactiveTintColor: "grey"}} >
      <Tab.Screen name="Groups" component={Home} options={{ tabBarIcon:({color, focused}) => (<Ionicon  size={30} color={color} focused={focused} name="ios-chatbubbles" />)}}/>
      <Tab.Screen name="Chat" component={ChatLists}  options={{ tabBarIcon:({color, focused}) => (<MaterialCommunityIcon size={30}  color={color} focused={focused}  name="chat" />) }}/>
      <Tab.Screen name="Forum" component={Forum} options={{ tabBarIcon:({color, focused}) => (<MaterialCommunityIcon  size={30}  color={color} focused={focused} name="bulletin-board" />) }}/>
      <Tab.Screen name="Me" component={Me} options={{ tabBarIcon:({color, focused}) => (<Ionicon  color={color} focused={focused}  size={30} name="ios-person" />) }} />
    </Tab.Navigator>
  );
  }
}

const styles = StyleSheet.create({
  // loaderView: {
  //   height: "100%",
  //   width: "100%",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   position: "absolute",
  //   zIndex: 20,
  //   backgroundColor: "rgba(0, 0, 0, 0.4)",
  // },
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  textInput: {
    width: 200,
    borderColor: "#000",
    borderWidth: 2,
    margin: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    marginTop: 20,
  },
  uploadImageButton: {
    marginRight: 12,
  },
  email: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
  },
  fab: {
    position: "absolute",
    right: 0,
    bottom: 0,
    margin: 20,
    backgroundColor: "#ba0089",
  },
  fabLeft: {
    position: "absolute",
    left: 0,
    bottom: 0,
    margin: 20,
    backgroundColor: "#ba0089",
  },

  groupTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  groupSubTitle: {
    fontSize: 16,
    color: Colors.blueGrey600,
  },
  groupImage: {
    width: 60,
    height: 60,
    marginRight: 20,
    borderRadius: 30,
    backgroundColor: Colors.grey50,
  },
});
