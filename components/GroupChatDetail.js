import React, { Component, useCallback } from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from "react-native";
import { Colors, FAB } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { GiftedChat, InputToolbar, Composer, Actions, Bubble, Time } from 'react-native-gifted-chat';
import * as firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Audio, Video, AVPlaybackStatus } from 'expo-av';
import { MessageBox } from 'react-chat-elements/native';


export default class GroupChatDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sound: null,
      isRecording: false,
      messages: [
      {
        _id: 1,
        text: 'Thank you guys!@Toshiki @Leanne @Alex',
        createdAt: new Date('January 12, 2022 10:12:00'),
        user: {
          _id: firebase.auth().currentUser.email,
          name: 'Lawrence Zhou',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: '@Toshiki You are welcome!!(^ ^)ノ',
        createdAt: new Date('January 12, 2022 10:12:00'),
        user: {
          _id: 1,
          name: 'Leanne',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 3,
        text: "Oh!!! I got it! Thanks a lot (^O^)  ",
        createdAt: new Date('January 12, 2022 10:11:00'),
        user: {
          _id: 2,
          name: 'Toshiki',
          avatar: 'https://placeimg.com/140/142/any',
        },
      },
      {
        _id: 4,
        text: 'You can say that too! I hear ppl say that',
        createdAt: new Date('January 12, 2022 10:11:00'),
        user: {
          _id: 1,
          name: 'Leanne',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 5,
        text: "Cause the staff of Starbucks said that sounds like 'light'. But I cannot hear it clearly...",
        createdAt: new Date('January 12, 2022 10:11:00'),
        user: {
          _id: 2,
          name: 'Toshiki',
          avatar: 'https://placeimg.com/140/142/any',
        },
      },
      {
        _id: 6,
        text: "How about 'light ice please'?",
        createdAt: new Date('January 12, 2022 10:11:00'),
        user: {
          _id: 2,
          name: 'Toshiki',
          avatar: 'https://placeimg.com/140/142/any',
        },
      },
      {
        _id: 7,
        text: 'Ah yes! You can say that:)',
        createdAt: new Date('January 12, 2022 10:09:00'),
        user: {
          _id: 1,
          name: 'Leanne',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 8,
        text: '@Lawrence Zhou You are welcome!',
        createdAt: new Date('January 12, 2022 10:09:00'),
        user: {
          _id: 1,
          name: 'Leanne',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 9,
        text: "Thanks! But can I say 'less ice please'?",
        createdAt: new Date('January 12, 2022 10:08:00'),
        user: {
          _id: firebase.auth().currentUser.email,
          name: 'Lawrence Zhou',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 10,
        text: "'I would like a little bit ice.'と思います。",
        createdAt: new Date('January 12, 2022 10:07:00'),
        user: {
          _id: 1,
          name: 'Leanne',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 11,
        text: "Anyone knows Japanese can help?",
        createdAt: new Date('January 12, 2022 10:07:00'),
        user: {
          _id: 3,
          name: 'Alex',
          avatar: 'https://placeimg.com/140/145/any',
        },
      },
      {
        _id: 12,
        text: "How do you say this in English (US)? 氷少なめでお願いします。（Starbucks でアイスコーヒー頼む時）",
        createdAt: new Date('January 12, 2022 10:05:00'),
        user: {
          _id: firebase.auth().currentUser.email,
          name: 'Lawrence Zhou',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 13,
        text: "Hey guys! I have a question.",
        createdAt: new Date('January 12, 2022 10:05:00'),
        user: {
          _id: firebase.auth().currentUser.email,
          name: 'Lawrence Zhou',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 14,
        image: "https://i.pinimg.com/736x/3e/5f/6e/3e5f6ea7b6088f73ae8257b81c7686f1.jpg",
        createdAt: new Date('January 11, 2022 23:45:00'),
        user: {
          _id: 4,
          name: 'Yuka',
          avatar: 'https://placeimg.com/140/148/any',
        },
      },
      {
        _id: 15,
        text: "@Yuka Greet the staff then ask 'Can I have the menu please?'",
        createdAt: new Date('January 11, 2022 23:37:00'),
        user: {
          _id: 5,
          name: 'Yi-Pei',
          avatar: 'https://placeimg.com/150/150/any',
        },
      },
      {
        _id: 16,
        audio: "https://s3.us-east-2.amazonaws.com/storage-app-dev/mp3/cb62d4ctnk8uibk1v.mp3",
        createdAt: new Date('January 11, 2022 23:34:00'),
        user: {
          _id: 3,
          name: 'Alex',
          avatar: 'https://placeimg.com/140/145/any',
        },
      },
      {
        _id: 17,
        text: "How to order a steak in the restaurant ?",
        createdAt: new Date('January 11, 2022 23:30:00'),
        user: {
          _id: 4,
          name: 'Yuka',
          avatar: 'https://placeimg.com/140/148/any',
        },
      },
    ],
    };

    this.ref = this._get_ref();
    this.recording =  new Audio.Recording();


  
  }

  setSound(sound){
    this.setState({sound: sound});
  }

setRecording(recording){
    this.setState({recording: recording});
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
  const { timestamp: numberStamp, text, user, image, audio } = snapshot.val();
  const { key: _id } = snapshot;
  // 2.
  const timestamp = new Date(numberStamp);
  // 3.
  const message = {
    _id,
    timestamp,
    text,
    user,
    image,
    audio,
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
  this.initSound();

}

componentWillUnmount() {
  this.off();
}

makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

append= (message) => {this.ref.push(message)};

initSound = async () =>{
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
       require('../assets/sample.wav')
    );
    this.setSound(sound);
    this.sound=sound;

    console.log('Initiating Sound');
  }


playSound = async (uri) =>{
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
       { uri: uri },
    );
    this.sound=sound;
    this.setSound(sound);

    console.log('Playing Sound');
    await this.sound.playAsync(); 
  }

  startRecording = async () => {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); 
      console.log('Starting recording..');
      this.setState({isRecording: true});
      const { recording } = await Audio.Recording.createAsync(
         Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      this.recording = recording;
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }


  stopRecording = async () => {
    console.log('Stopping recording..');
    await this.recording.stopAndUnloadAsync();
    this.setState({isRecording: false});
    const uri = this.recording.getURI(); 
    console.log('Recording stopped and stored at', uri);
     const { sound } = await Audio.Sound.createAsync({
  uri: uri});
      this.recording = new Audio.Recording();
    this.sound = sound;
    this.setSound(sound);
    this.uploadRecordingToDB(uri);
  }


uploadRecordingToDB = async (fileURI) => {
    this.setState({
      recordingURI: fileURI,
    });

    // Pull UID of the current user
    const uid = firebase.auth().currentUser.uid;

    // Create Reference
    var storageRef = firebase.storage().ref();

    // Define path and image name
    var recordingRef = storageRef.child("chatting/" + this.makeid(20));

    // Fetch the image
    let response = await fetch(fileURI);
    let blob = await response.blob();

    this.setState({
      loading: true,
      loading_dialog_text: "Uploading Recording...",
    });

    // Upload Image
    recordingRef
      .put(blob)
      .then(() => {
        console.log("Uploaded...");
        recordingRef.getDownloadURL().then((url) => {
          //this._updateProfileURL(url, uid);
          console.log(url);
          const message = {
      user: {
                _id: firebase.auth().currentUser.email,
                name: firebase.auth().currentUser.displayName,
                avatar: firebase.auth().currentUser.photoURL
            },
      audio: url,
      timestamp: new Date(),
    };
    this.append(message);
        });
      })
      .catch((error) => {
        alert(error.message);
        this.setState({ loading: false });
      });
  };



uploadImageToDB = async (fileURI) => {
    this.setState({
      imageURI: fileURI,
    });

    // Pull UID of the current user
    const uid = firebase.auth().currentUser.uid;

    // Create Reference
    var storageRef = firebase.storage().ref();

    // Define path and image name
    var imageRef = storageRef.child("chatting/" + this.makeid(20));

    // Fetch the image
    let response = await fetch(fileURI);
    let blob = await response.blob();

    this.setState({
      loading: true,
      loading_dialog_text: "Uploading Picture...",
    });

    // Upload Image
    imageRef
      .put(blob)
      .then(() => {
        console.log("Uploaded...");
        imageRef.getDownloadURL().then((url) => {
          //this._updateProfileURL(url, uid);
          console.log(url);
          const message = {
      user: {
                _id: firebase.auth().currentUser.email,
                name: firebase.auth().currentUser.displayName,
                avatar: firebase.auth().currentUser.photoURL
            },
      image: url,
      timestamp: new Date(),
    };
    this.append(message);
        });
      })
      .catch((error) => {
        alert(error.message);
        this.setState({ loading: false });
      });
  };

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.4,
      allowsEditing: true,
    });

    if (!result.cancelled) {
      this.uploadImageToDB(result.uri);
    }
  };



  onSend(messages = []) {
    /*this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });*/

    for (let i = 0; i < messages.length; i++) {
      console.log(messages[i]);
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

  renderMessageAudio (props) {
     //Add the extra styles via containerStyle
    return( 
      <TouchableOpacity onPress={()=> {
        console.log(props);
    this.playSound(props.currentMessage.audio);
    }
  }>
    <View style={{width: 150, minHeight:40, height: 40, padding: 10, flexDirection: "row"}} >
     <Ionicons
            name={"volume-high-outline"}
            size={22}
            style={{color:firebase.auth().currentUser.email == props.currentMessage.user._id? 'white':'black'}}
          />
        <Text style={{marginTop: 2, color:firebase.auth().currentUser.email == props.currentMessage.user._id? 'white':'black'}}>15''</Text>
    </View>
    </TouchableOpacity>
    )
  }

  imagePressed(){
    alert("pressed");
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
          <TouchableOpacity 
          onPressIn={()=> {
            this.startRecording();
            }}
            onPressOut={()=> {
            this.stopRecording();
            }}>
          <FontAwesome5
            name={"microphone"}
            size={22}
            color="grey"
            
          />
          </TouchableOpacity>
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
            onPress={() => {
                this.pickImage();
              }}
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
            onPress={() => {
              this.props.navigation.navigate("Video", {});
            }}
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

  renderFooter(props) {
    if (this.state.isRecording) {
      return (
      <View>
      <FontAwesome5
            name={"microphone"}
            size={48}
            color= {"rgba(0,0,255,0.6)"}
            tyle={{position: 'absolute',marginBottom:200,left: "50%"}}
          />
        </View>
      );
    }
    return null
  }

  render() {

    return (

       <GiftedChat
            messages={this.state.messages}
            showAvatarForEveryMessage={true}
            onSend={(messages) => this.onSend(messages)}
            user={{
                _id: firebase.auth().currentUser.email,
                name: firebase.auth().currentUser.displayName,
                avatar: firebase.auth().currentUser.photoURL
            }}
            renderInputToolbar={props => this.renderInputToolbar(props)}
            renderActions={(props) => this.renderActions(props)}
            renderBubble={(props) => this.renderBubble(props)}
            renderMessageAudio={(props) => this.renderMessageAudio(props)}
            renderFooter={(props) => this.renderFooter(props)}
      /> 
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
