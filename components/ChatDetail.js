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


export default class ChatDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sound: null,
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
      { _id: 3, 
        createdAt: new Date(),
        audio: "https://s3.us-east-2.amazonaws.com/storage-app-dev/mp3/cb62d4ctnk8uibk1v.mp3", 
        user: 
          { _id: 2, 
            avatar: "https://s3.us-east-2.amazonaws.com/storage-app-dev/cb62d4exdk8t4gnhf/thumbnail-26170527_10214525576748161_8444045049145038093_o.jpg", 
            name: "Zach H"
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
      />    
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
