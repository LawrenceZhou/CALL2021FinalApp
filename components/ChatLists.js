import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  SectionList,
  ScrollView,
} from "react-native";
import {
  Button,
  FAB,
  Dialog,
  Portal,
  Provider as PaperProvider,
  TextInput,
  ActivityIndicator,
  Searchbar,
  Colors,
} from "react-native-paper";
import { ChatItem } from 'react-chat-elements/native';
import * as firebase from "firebase";

import * as ImagePicker from "expo-image-picker";

const users = [
  {identity: "tutor",
  name: "Amrita Smith",
  subtitle: "See you next Thursday!",
  statusColor: "#f5deb3",
  unread: 0,
  date: new Date('January 9, 2022 00:12:00'),
  avatar: 'https://s3.us-east-2.amazonaws.com/storage-app-dev/cb62d4exdk8t4gnhf/thumbnail-26170527_10214525576748161_8444045049145038093_o.jpg',
  },
  {identity: "tutor",
  name: "George",
  subtitle: "Thanks",
  statusColor: "#f5deb3",
  unread: 0,
  date: new Date('January 3, 2022 00:12:00'),
  avatar: 'https://placeimg.com/140/140/people',
  },
  {identity: "native",
  name: "S. Chung",
  subtitle: "^>^",
  statusColor: "#b0c4de",
  unread: 0,
  date: new Date('January 1, 2022 00:12:00'),
  avatar: 'https://placeimg.com/140/142/people',
  },
  {identity: "user",
  name: "東大　花子",
  subtitle: "ありがとう！",
  statusColor: "white",
  unread: 0,
  date: new Date('January 1, 2022 00:12:00'),
  avatar: 'https://placeimg.com/140/143/people',
  },
  {identity: "native",
  name: "Eva-Rose Stott",
  subtitle: "I just don't understand... Would you please give more details?",
  statusColor: "#b0c4de",
  unread: 0,
  date: new Date('December 30, 2021 00:12:00'),
  avatar: 'https://placeimg.com/144/140/people',
  },
  {identity: "native",
  name: "Debbie Fulton",
  subtitle: "Are you available now?",
  statusColor: "#b0c4de",
  unread: 1,
  date: new Date('October 15, 2021 00:12:00'),
  avatar: 'https://placeimg.com/150/150/people',
  },
  {identity: "user",
  name: "文京太郎",
  subtitle: "是非。",
  statusColor: "white",
  unread: 0,
  date: new Date('March 17, 2021 00:12:00'),
  avatar: 'https://placeimg.com/140/138/people',
  },
  {identity: "native",
  name: "Finn Ritter",
  subtitle: "Thx!!!",
  statusColor: "#b0c4de",
  unread: 0,
  date: new Date('October 10, 2019 00:12:00'),
  avatar: 'https://placeimg.com/140/137/people',
  },
]

export default class ChatLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      device_model_name: null,
      user_update: null,
      imageURI: null,
      showCreateGroupDialog: false,
      showCreateGroupDialogLoader: false,
      groupName: null,
      showLoader: false,
      groupData: null,
      loading: false,
      loading_dialog_text: "",
      query: null,
    };
  }
    componentDidMount() {
    const uid = firebase.auth().currentUser.uid;

    this._getDataFromDB(uid);
  }

  _getDataFromDB = (uid) => {
    firebase
      .database()
      .ref("users/" + uid)
      .once("value")
      .then((data) => {
        const data1 = data.val();

        this.setState({
          device_model_name: data1.device.device_model_name,
          imageURI: data1.profile_url,
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  _updateProfileURL = (downloadURL, uid) => {
    this.setState({ loading_dialog_text: "Updating database..." });
    firebase
      .database()
      .ref("users/" + uid)
      .update({
        profile_url: downloadURL,
      })
      .then(() => {
        this.setState({ loading: false });
        console.log("Finished updating database...");
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
    var imageRef = storageRef.child("profiles/" + uid);

    // Fetch the image
    let response = await fetch(fileURI);
    let blob = await response.blob();

    this.setState({
      loading: true,
      loading_dialog_text: "Uploading Profile Picture...",
    });

    // Upload Image
    imageRef
      .put(blob)
      .then(() => {
        console.log("Uploaded...");
        imageRef.getDownloadURL().then((url) => {
          this._updateProfileURL(url, uid);
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
      aspect: [1, 1],
    });

    if (!result.cancelled) {
      this.uploadImageToDB(result.uri);
    }
  };


   onChangeSearch(query) {
    this.setState({query: query});
  } 


  render() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user == null) {
        this.props.navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }
    });

    const { email, uid } = firebase.auth().currentUser;
    const {
      showCreateGroupDialog,
      showLoader,
      groupName,
      groupData,
    } = this.state;

    return (
       <View style={{flex: 1}}> 
        <View style={{marginTop: 50, marginBottom: 20, marginLeft: "5%",  alignItems: 'center', justifyContent: 'center', width: "90%", align: "center"}}>
            <Searchbar
              placeholder="Search"
              onChangeText={(q)=>this.onChangeSearch(q)}
              value={this.state.query}
            />
          </View>
        <ScrollView >
        {users.map((user)=>{
                return(
                  <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("UserChatDetail", {
                      chatName: user.name+"("+user.identity+")",
                      userNumber: 1,
                    });
                  }}
                >  
                  <ChatItem
                    avatar={{ uri: user.avatar }}
                    alt={'user'}
                    title={user.name}
                    subtitle={user.subtitle}
                    date={user.date}
                    unread={user.unread} 
                    statusText={user.identity[0]}
                    statusColor={user.statusColor}
                  />
                </TouchableOpacity>
                )
              }
                )}

    </ScrollView>
    <FAB
            style={{position: "absolute", left: 0, bottom: 0, margin: 20, backgroundColor: "blue",}}
            icon="language-swift"
            onPress={() => {this.props.navigation.navigate("BotChatDetail", {chatName: "Topparrot",});}}
          />
    </View>

    );
  }
}
