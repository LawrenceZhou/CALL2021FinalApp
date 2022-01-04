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
  Colors,
  Searchbar,
} from "react-native-paper";


import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

import * as firebase from "firebase";

import * as ImagePicker from "expo-image-picker";

import { convertEpochToDateMonthYear } from "../logic/helpers";

import { ChatItem } from 'react-chat-elements/native';

const DATA = [
  {
    title: "Grammar",
    data: [{title: "Grammar1", logo: "https://museumpalazzo.s3.us-west-2.amazonaws.com/learning.png"},
          {title: "Grammar2", logo: "https://museumpalazzo.s3.us-west-2.amazonaws.com/learning.png"},
          {title: "Grammar3", logo: "https://museumpalazzo.s3.us-west-2.amazonaws.com/learning.png"},]
  },
  {
    title: "Q&A",
    data: [{title: "Q&A1", logo: "https://museumpalazzo.s3.us-west-2.amazonaws.com/qa.png"},
          {title: "Q&A2", logo: "https://museumpalazzo.s3.us-west-2.amazonaws.com/qa.png"},
          {title: "Q&A3", logo: "https://museumpalazzo.s3.us-west-2.amazonaws.com/qa.png"},]
  },
  {
    title: "Feedback",
    data: [{title: "Feedback1", logo: "https://museumpalazzo.s3.us-west-2.amazonaws.com/feedback.png"}]
  },
];

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>

  </View>
);


export default class Me extends Component {
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
      query: null
    }
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

  setIndex(i) {
    this.setState({index: i});
  }

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
      <View style={{flex:1 }}>
      <ImageBackground source={{ uri: "https://dz2cdn1.dzone.com/storage/temp/13633683-gradient-colors.png" }} resizeMode="cover" style={{flex: 3, justifyContent: "center"}} >
        <View style={{flex: 1, flexDirection: "column", padding: 20}}>

            <View style={{flex: 1, flexDirection: "row", direction: "rtl", marginTop: 20}}>
              <AntDesign name="logout" size={30} style={{marginRight: 15, marginTop: 3}} color="white" onPress={() => {
                this.setState({
                  loading: true,
                  loading_dialog_text: "Logging out...",
                });
                firebase
                  .auth()
                  .signOut()
                  .then(() => {
                    this.props.navigation.reset({
                      index: 0,
                      routes: [{ name: "Login" }],
                    });
                  })
                  .catch((error) => {
                    alert(error.message);
                  });
              }}/>
              <AntDesign name="setting" size={36} color="white" />
            </View>
            
            <View style={{flex: 3}}>
              <View style={{flex: 3, flexDirection: "row"}}>
                <Image
                  source={
                  this.state.imageURI == null
                    ? require("../assets/default_profile.png")
                    : { uri: this.state.imageURI }
                  }
                  style={{ width: 80, height: 80, borderRadius: 40 }}
                />

                <Text style={styles.email}> {email} </Text>
              </View>

              <View style={{flex: 1, flexDirection: "row", marginTop: 20}}>
                <Entypo name="open-book" size={20} style={{marginRight: 5}} color="white" />
                <Text style={{color: "white"}}>English</Text>
              </View>

              <View style={{flex: 1, flexDirection: "row"}}>
                <AntDesign name="staro" size={20} style={{marginRight: 5}} color="white" />
                <Text style={{color: "white", marginTop: 3}}>Medium Level</Text>
              </View>

            </View>
         
        </View>
         </ImageBackground>
          <View style={{flex: 5}}>
          <View style={{flexDirection: "row", height: "10%"}}>
          <Text style={styles.header}>Liked</Text>
          <View style={{marginTop: 5, marginBottom: 0, marginLeft: "10%",  alignItems: 'center', justifyContent: 'center', width: "70%", height: "80%", align: "center"}}>
            <Searchbar
              placeholder="Search"
              onChangeText={(q)=>this.onChangeSearch(q)}
              value={this.state.query}
              style={{height: "100%"}}
            />
          </View>
          </View>

          <SectionList
      sections={DATA}
      keyExtractor={(item, index) => item + index}
      renderItem={({ item }) => 
        <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("Grammar", {});
                  }}
                >  
            <ChatItem
            avatar={{ uri: item.logo }}
            alt={'Reactjs'}
            title={item.title}
            date={null}
            unread={0} />
        </TouchableOpacity>}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
      )}
      />
          </View>

           <View style={{flex: 2}}>
            <Text style={styles.header}>Appointment</Text>
            <ScrollView >
            <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("ChatDetail", {
                      chatName: "1st Group",
                    });
                  }}
                >  
            <ChatItem
            avatar={{ uri: "https://museumpalazzo.s3.us-west-2.amazonaws.com/schedule.png" }}
            alt={'Reactjs'}
            title={"Tomorrow 17:00 ~ 18:00"}
            date={null}
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
            avatar={{ uri: "https://museumpalazzo.s3.us-west-2.amazonaws.com/schedule.png" }}
            alt={'Reactjs'}
            title={"Tomorrow 18:30 ~ 19:00"}
            date={null}
            unread={0} />
        </TouchableOpacity>
        </ScrollView >
          </View>

           <FAB
            style={{position: "absolute", left: 0, bottom: 0, margin: 20, backgroundColor: "blue",}}
            icon="robot"
            onPress={() => {this.props.navigation.navigate("ChatDetail", {chatName: "AI Bot",});}}
          />
      </View>

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
    paddingTop: 10,
    marginHorizontal: 16
  },
  item: {
    color: "#546263",
    padding: 20,
    
    borderBottomWidth:1
  },
  header: {
    fontSize: 26,
    marginLeft:6,
    marginTop:4,
    fontWeight: "500",
    color: "grey"
  },
  sectionHeader: {
    fontSize: 18,
    paddingLeft:6,
    fontWeight: "300",
    color: "grey",
    backgroundColor: "#FFF"
  },
  title: {
    fontSize: 16
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
    marginTop: 15,
    marginLeft: 10,
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
