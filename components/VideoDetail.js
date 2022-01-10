import React, { Component, useCallback } from "react";
import { View, Text, StyleSheet, Image, TextInput } from "react-native";
import { Colors, FAB } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { GiftedChat, InputToolbar, Composer, Actions, Bubble, Time } from 'react-native-gifted-chat';
import * as firebase from "firebase";
import { MessageBox } from 'react-chat-elements/native';
import { Video, AVPlaybackStatus } from 'expo-av';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


export default class VideoDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: true,
      messages: [{
        _id: 1,
        text: 'Let\'s go on our grammar lesson!',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
        image: 'https://picsum.photos/706',
      },
      {
        _id: 2,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
        image: 'https://museumpalazzo.s3.us-west-2.amazonaws.com/screenshot.jpg',
      },



    ],
    };

    this.ref = this._get_ref();
    //this.video = React.useRef();
  }

  setStatus(status) {
    this.setState({status: status});
  }

  // 1.
_get_ref() {
  return firebase.database().ref('messages');
}
// 2.
on = (callback) => {
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));
    }
// 3.
parse = (snapshot) => {
  // 1.
  const { timestamp: numberStamp, text, user } = snapshot.val();
  const { key: _id } = snapshot;
  // 2.
  const timestamp = new Date(numberStamp);
  // 3.
  const message = {
    _id,
    timestamp,
    text,
    user,
  };
 return message;
}
// 4.
off() {
  this.ref.off();
}

componentDidMount() {
  this.on(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
      );
}

componentWillUnmount() {
  this.off();
}

append= (message) => {this.ref.push(message)};


  onSend(messages = []) {
    /*this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });*/

    for (let i = 0; i < messages.length; i++) {
    const { text, user } = messages[i];
    // 4.
    const message = {
      text,
      user,
      timestamp: new Date(),
    };
    this.append(message);
    }
  }

  renderInputToolbar (props) {
     //Add the extra styles via containerStyle
    return( 
      <InputToolbar {...props} placeholder="Type your message..."/>
    )
  }

  renderActions(props) {
    return (
      <View style={{flexDirection:"row"}}>
      
      <Actions
        {...props}

        containerStyle={{
           width: 25,
           marginRight: -8,
         }}

        icon={() => (
          <FontAwesome5
            name={"microphone"}
            size={22}
            color="grey"
          />
        )}

        //onSend={(args) => console.log(args)}
      />

      <Actions
        {...props}

        containerStyle={{
           width: 25,
         }}

        icon={() => (
          <FontAwesome5
            name={"camera"}
            size={22}
            color="grey"
          />
        )}

        //onSend={(args) => console.log(args)}
      />

      <Actions
        {...props}

        containerStyle={{
           width: 25,
         }}

        icon={() => (
          <FontAwesome5
            name={"video"}
            size={22}
            color="grey"
          />
        )}

        //onSend={(args) => console.log(args)}
      />

      </View>
    );
  }

  renderBubble(props) {
    return(
    <Bubble
          {...props}

          textStyle={{
            right: {
              color: 'white',
            },
            left: {
              color: 'black',
            },
          }}
          wrapperStyle={{
            left: {
              backgroundColor: 'white',
            },
            right: {
              backgroundColor: "blue",
            },
          }}
        />
        )
  }

  render() {

    return (
     
    <View >
      <Image
        style={styles.image}
        source={{
          uri: 'https://museumpalazzo.s3.us-west-2.amazonaws.com/call.JPG',
        }}
        resizeMode="contain"
      />
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  image: {
    alignSelf: 'center',
    width: "100%",
    height: "100%",
  },
  topBar: {
    height: 100,
    backgroundColor: Colors.deepPurple800,
    justifyContent: "center",
  },
  topBarSection: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  groupTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 20,
  },
  groupDate: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "400",
    marginLeft: 20,
    marginTop: 2,
  },
  groupImage: {
    width: 50,
    height: 50,
    marginLeft: 20,
    borderRadius: 30,
    backgroundColor: Colors.deepPurple300,
  },
  messageBox: {
    position: "absolute",
    bottom: 0,
    backgroundColor: Colors.grey300,
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageInput: {
    width: "80%",
    fontSize: 14,
    backgroundColor: Colors.white,
    paddingVertical: 12,
    color: Colors.black,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: Colors.deepPurple300,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
