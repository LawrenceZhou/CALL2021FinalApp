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
        <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("ChatDetail", {
                      chatName: "1st Group",
                    });
                  }}
        >  
        <ChatItem
            avatar={{ uri: 'https://placeimg.com/140/144/any' }}
            alt={'Reactjs'}
            title={'User1'}
            subtitle={'What are you doing?'}
            date={new Date()}
            unread={0} />
        </TouchableOpacity>

       <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("ChatDetail", {
                      chatName: "1st Group",
                    });
                  }}
                >  
            <ChatItem
            avatar={{ uri: 'https://placeimg.com/140/143/any' }}
            alt={'Reactjs'}
            title={'User2'}
            subtitle={'What are you doing?'}
            date={new Date()}
            unread={0} />
        </TouchableOpacity>
        
        <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("ChatDetail", {
                      chatName: "1st Group",
                    });
                  }}
                >  
            <ChatItem
            avatar={{ uri: 'https://placeimg.com/140/142/any' }}
            alt={'Reactjs'}
            title={'User3'}
            subtitle={'What are you doing?'}
            date={new Date()}
            unread={0} />
        </TouchableOpacity>
        
        <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("ChatDetail", {
                      chatName: "1st Group",
                    });
                  }}
                >  
            <ChatItem
            avatar={{ uri: 'https://placeimg.com/140/140/any' }}
            alt={'Reactjs'}
            title={'user3'}
            subtitle={'What are you doing?'}
            date={new Date()}
            unread={0} />
        </TouchableOpacity>
        
        <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("ChatDetail", {
                      chatName: "1st Group",
                    });
                  }}
                >  
            <ChatItem
            avatar={{ uri: 'https://placeimg.com/140/141/any' }}
            alt={'Reactjs'}
            title={'User4'}
            subtitle={'What are you doing?'}
            date={new Date()}
            unread={0} />
        </TouchableOpacity>
        
        <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("ChatDetail", {
                      chatName: "1st Group",
                    });
                  }}
                >  
            <ChatItem
            avatar={{ uri: 'https://placeimg.com/140/145/any' }}
            alt={'Reactjs'}
            title={'User5'}
            subtitle={'What are you doing?'}
            date={new Date()}
            unread={0} />
        </TouchableOpacity>
        
        <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("ChatDetail", {
                      chatName: "1st Group",
                    });
                  }}
                >  
            <ChatItem
            avatar={{ uri: 'https://placeimg.com/140/146/any' }}
            alt={'Reactjs'}
            title={'User6'}
            subtitle={'What are you doing?'}
            date={new Date()}
            unread={0} />
        </TouchableOpacity>
        
        <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("ChatDetail", {
                      chatName: "1st Group",
                    });
                  }}
                >  
            <ChatItem
            avatar={{ uri: 'https://placeimg.com/140/147/any' }}
            alt={'Reactjs'}
            title={'User7'}
            subtitle={'What are you doing?'}
            date={new Date()}
            unread={0} />
        </TouchableOpacity>
        

    </ScrollView>
    <FAB
            style={{position: "absolute", left: 0, bottom: 0, margin: 20, backgroundColor: "blue",}}
            icon="robot"
            onPress={() => {this.props.navigation.navigate("ChatDetail", {chatName: "AI Bot",});}}
          />
    </View>

    );
  }
}
