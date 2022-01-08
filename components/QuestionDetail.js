import React, { Component, useCallback } from "react";
import { View, Text, StyleSheet, Image, TextInput } from "react-native";
import { Colors, FAB } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { GiftedChat, InputToolbar, Composer, Actions, Bubble, Time } from 'react-native-gifted-chat';
import * as firebase from "firebase";
import { MessageBox } from 'react-chat-elements/native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const messages = [

  {
    title: 'Lawrence Zhou',
    text: "How do you say this in English (US)? 氷少なめでお願いします。（Starbucks でアイスコーヒー頼む時）",
    dateString: 'January 12, 2022 10:05',
    avatar: 'http://yijunzhou.xyz/assets/img/profile.jpg',
  },

  {
    title: 'Leanne',
    text: "'I would like a little bit ice.'と思います。",
    dateString: 'January 12, 2022 10:07',
    avatar: 'https://placeimg.com/140/140/any',
  },

  {
    title: 'Lawrence Zhou',
    text: "Thanks! But can I say 'less ice please'?",
    dateString: 'January 12, 2022 10:05',
    avatar: 'http://yijunzhou.xyz/assets/img/profile.jpg',
  },

  {
    title: 'Leanne',
    text: "'Ah yes! You can say that:)",
    dateString: 'January 12, 2022 10:09',
    avatar: 'https://placeimg.com/140/140/any',
  },

  {
    title: 'Toshiki',
    text: "'How about 'light ice please'?",
    dateString: 'January 12, 2022 10:11',
    avatar: 'https://placeimg.com/140/142/any',
  },

  {
    title: 'Toshiki',
    text: "'Cause the staff of Starbucks said that sounds like 'light'. But I cannot hear it clearly...",
    dateString: 'January 12, 2022 10:11',
    avatar: 'https://placeimg.com/140/142/any',
  },

  {
    title: 'Leanne',
    text: "You can say that too! I hear ppl say that",
    dateString: 'January 12, 2022 10:11',
    avatar: 'https://placeimg.com/140/140/any',
  },
      
]


export default class QuestionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
  <View style={{flex: 1}}>      
     <View>

       {messages.map((message)=>{
          return(
            <MessageBox
              position={'left'}
              type={'text'}
              title={message.title}
              text={message.text}
              dateString={message.dateString}
              avatar={{uri: message.avatar}}
            />)})
        }

        </View>
        <FAB
            style={{position: "absolute", left: 0, bottom: 80, margin: 20, backgroundColor: "blue",}}
            icon="language-swift"
            onPress={() => {this.props.navigation.navigate("BotChatDetail", {chatName: "Topparrot",});}}
          />

        </View>
      /*<View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.topBar}>
          <View style={styles.topBarSection}>
            <Image
              source={require("../assets/team.png")}
              style={styles.groupImage}
            />
            <View>
              <Text style={styles.groupTitle}>{groupName}</Text>
              <Text style={styles.groupDate}>{createdAt}</Text>
            </View>
          </View>
        </View>
        <Text> ChatDetail </Text>
        <View style={styles.messageBox}>
          <TextInput
            style={styles.messageInput}
            keyboardType="default"
            placeholder="Type a message"
            value={this.state.userMessage}
            onChangeText={(userMessage) => this.setState({ userMessage })}
          />
          <FAB
            style={styles.fab}
            icon="send"
            onPress={() => {
              console.log(userMessage);
              this.setState({ userMessage: null });
            }}
          />
        </View>
      </View>*/
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
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
