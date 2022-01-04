import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  InteractionManager,
  Clipboard,
} from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import * as firebase from "firebase";
import { firebaseConfig } from "./logic/config";

import Home from "./components/Home";
import HomeTab from "./components/HomeTab";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Loading from "./components/Loading";
import Register from "./components/Register";
import ChatDetail from "./components/ChatDetail";
import QuestionDetail from "./components/QuestionDetail";
import Grammar from "./components/Grammar";
import VideoDetail from "./components/VideoDetail";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

if (__DEV__) {
  Clipboard.setString('')
}


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();

const _setTimeout = global.setTimeout;
const _clearTimeout = global.clearTimeout;
const MAX_TIMER_DURATION_MS = 60 * 1000;
if (Platform.OS === "android") {
  // Work around issue `Setting a timer for long time`
  // see: https://github.com/firebase/firebase-js-sdk/issues/97
  const timerFix = {};
  const runTask = (id, fn, ttl, args) => {
    const waitingTime = ttl - Date.now();
    if (waitingTime <= 1) {
      InteractionManager.runAfterInteractions(() => {
        if (!timerFix[id]) {
          return;
        }
        delete timerFix[id];
        fn(...args);
      });
      return;
    }

    const afterTime = Math.min(waitingTime, MAX_TIMER_DURATION_MS);
    timerFix[id] = _setTimeout(() => runTask(id, fn, ttl, args), afterTime);
  };

  global.setTimeout = (fn, time, ...args) => {
    if (MAX_TIMER_DURATION_MS < time) {
      const ttl = Date.now() + time;
      const id = "_lt_" + Object.keys(timerFix).length;
      runTask(id, fn, ttl, args);
      return id;
    }
    return _setTimeout(fn, time, ...args);
  };

  global.clearTimeout = (id) => {
    if (typeof id === "string" && id.startsWith("_lt_")) {
      _clearTimeout(timerFix[id]);
      delete timerFix[id];
      return;
    }
    _clearTimeout(id);
  };
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Loading" options={{headerShown: false}} component={Loading} />
        <Stack.Screen name="Login" options={{headerShown: false}} component={Login} />
        <Stack.Screen name="Register" options={{headerShown: false}} component={Register} />
        <Stack.Screen name="HomeTab" options={{headerShown: false}} component={HomeTab} />
        <Stack.Screen name="ChatDetail" component={ChatDetail} options={({ route }) => ({headerBackTitle: "Back", title: route.params.chatName+"("+route.params.userNumber+")", headerRight: () => (<Feather name="users" size={28} style={{marginHorizontal: 10, marginTop: 2}} color={"rgb(10, 132, 255)"} />) })} />
        <Stack.Screen name="QuestionDetail" component={QuestionDetail} options={({ route }) => ({headerBackTitle: "Back", title: "Question Details", headerRight: () => (<Feather name="star" size={28} style={{marginHorizontal: 10, marginTop: 2}} color={"rgb(10, 132, 255)"} />) })} />
        <Stack.Screen name="Grammar" component={Grammar} options={({ route }) => ({headerBackTitle: "Back", title: "Grammar", headerRight: () => (<Feather name="star" size={28} style={{marginHorizontal: 10, marginTop: 2}} color={"rgb(10, 132, 255)"} />) })} />
        <Stack.Screen name="Video" component={VideoDetail} options={({ route }) => ({headerBackTitle: "Back", title: "Video Call" })} />
        <Stack.Screen name="ForgotPassword" options={{headerShown: false}} component={ForgotPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
