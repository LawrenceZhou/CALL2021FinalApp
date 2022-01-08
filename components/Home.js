import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
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
  Chip,
  Searchbar,
  Card,
  Title,
  Paragraph,
  Avatar,
} from "react-native-paper";
import * as firebase from "firebase";

import * as ImagePicker from "expo-image-picker";

import { convertEpochToDateMonthYear } from "../logic/helpers";

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const rooms = [
  {
    name: "At The Airport",
    teacher: 2,
    nativeSpeaker: 4,
    student: 15,
    image: "https://blog.aci.aero/wp-content/uploads/2019/03/shutterstock_745544935-1904x1269.jpg",
    labels: [{text: "Medium Level", color: "#12a4d9"}, {text: "Travel", color: "#d9138a"}]
  },
  {
    name: "At The Shop/Supermarket",
    teacher: 1,
    nativeSpeaker: 9,
    student: 35,
    image: "https://www.nambaskyo.com/en/wp/wp-content/uploads/2019/03/20190323_SkyO_211.jpg",
    labels: [{text: "Medium Level", color: "#12a4d9"}, {text: "Life", color: "#d9138a"}]
  },
  {
    name: "Research Guidance",
    teacher: 2,
    nativeSpeaker: 2,
    student: 19,
    image: "https://leverageedu.com/blog/wp-content/uploads/2020/03/Types-of-Research-Design-1600x1000.jpg",
    labels: [{text: "Medium Level", color: "#12a4d9"}, {text: "Research", color: "#d9138a"}, {text: "Economy", color: "#ff6e40"}]
  },
  {
    name: "Movie",
    teacher: 1,
    nativeSpeaker: 4,
    student: 62,
    image: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/best-movies-1614634680.jpg",
    labels: [{text: "Medium Level", color: "#12a4d9"}, {text: "Art", color: "#d9138a"}]
  },
  {
    name: "Sports/Gym",
    teacher: 3,
    nativeSpeaker: 5,
    student: 20,
    image: "https://webunwto.s3.eu-west-1.amazonaws.com/2020-01/sport-congresse.jpg",
    labels: [{text: "Medium Level", color: "#12a4d9"}, {text: "Life", color: "#d9138a"}]
  },
  {
    name: "Advertisement/Billboard/Fly/Notice",
    teacher: 3,
    nativeSpeaker: 17,
    student: 28,
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Infinite-corridor-bboard.jpeg",
    labels: [{text: "Medium Level", color: "#12a4d9"}, {text: "Life", color: "#d9138a"}]
  },
  {
    name: "Workplace Mail",
    teacher: 1,
    nativeSpeaker: 3,
    student: 15,
    image: "https://i1.wp.com/www.hrreview.co.uk/wp-content/uploads/email-1.jpg",
    labels: [{text: "Medium Level", color: "#12a4d9"}, {text: "Business", color: "#d9138a"}]
  },
  {
    name: "Classroom",
    teacher: 5,
    nativeSpeaker: 4,
    student: 52,
    image: "https://www.commonsense.org/education/sites/default/files/styles/16_9_medium/public/blog-share/5-free-classroom-management-tools-any-teacher-can-use-article.png?itok=DZHuco5d",
    labels: [{text: "Medium Level", color: "#12a4d9"}, {text: "Education", color: "#d9138a"}]
  },
  {
    name: "At The Restaurant/Cafe",
    teacher: 3,
    nativeSpeaker: 10,
    student: 37,
    image: "https://restaurantclicks.com/wp-content/uploads/2021/09/restaurants-knoxville.jpg",
    labels: [{text: "Medium Level", color: "#12a4d9"}, {text: "Life", color: "#d9138a"}]
  },
  {
    name: "Research Plan",
    teacher: 4,
    nativeSpeaker: 2,
    student: 9,
    image: "http://www.ecohealthasia.net/images/research/09/Capture1.PNG",
    labels: [{text: "Medium Level", color: "#12a4d9"}, {text: "Research", color: "#d9138a"}]
  },
  {
    name: "Workplace Talk",
    teacher: 2,
    nativeSpeaker: 11,
    student: 73,
    image: "https://www.irishtimes.com/polopoly_fs/1.4030031.1570039218!/image/image.jpg_gen/derivatives/box_460_245/image.jpg",
    labels: [{text: "Medium Level", color: "#12a4d9"}, {text: "Business", color: "#d9138a"}]
  },
  {
    name: "Fiction",
    teacher: 3,
    nativeSpeaker: 4,
    student: 10,
    image: "https://static01.nyt.com/images/2020/12/03/books/00HISTORICAL-TOP-TEN-COMBO/00HISTORICAL-TOP-TEN-COMBO-jumbo-v2.jpg",
    labels: [{text: "Medium Level", color: "#12a4d9"}, {text: "Art", color: "#d9138a"}]
  },
  {
    name: "Asking For Help",
    teacher: 2,
    nativeSpeaker: 21,
    student: 95,
    image: "https://st4.depositphotos.com/4290619/25571/i/950/depositphotos_255719860-stock-photo-young-tourist-asking-for-directions.jpg",
    labels: [{text: "Medium Level", color: "#12a4d9"}, {text: "Life", color: "#d9138a"}]
  },
  {
    name: "Community",
    teacher: 8,
    nativeSpeaker: 31,
    student: 102,
    image: "https://images.fastcompany.net/image/upload/w_937,ar_16:9,c_fill,g_auto,f_auto,q_auto,fl_lossy/wp-cms/uploads/2018/01/p-3-wellness-communities-grow-from-niche-to-booming-real-estate-trend.jpg",
    labels: [{text: "Medium Level", color: "#12a4d9"}, {text: "Life", color: "#d9138a"}]
  },
  {
    name: "Hotel",
    teacher: 3,
    nativeSpeaker: 9,
    student: 42,
    image: "https://skytouchtechnology.com/wp-content/uploads/2018/03/Monetize-hotel-guest-check-in-1200x900.jpg",
    labels: [{text: "Medium Level", color: "#12a4d9"}, {text: "Travel", color: "#d9138a"}]
  },
]
export default class Home extends Component {
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
      category: "",
      rooms: rooms,
    };

  }

  componentDidMount() {
    const uid = firebase.auth().currentUser.uid;

    this._getDataFromDB(uid);
    this.getAllGroupData(uid);
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


  getAllGroupData = (uid) => {
    this.setState({
      loading: true,
      loading_dialog_text: "Getting group data...",
    });
    // Get all group data
    firebase
      .database()
      .ref("users/" + uid + "/groups/")
      .once("value")
      .then((snapshot) => {
        const data = snapshot.val();
        // console.log("================================");
        // console.log(data);

        let dataArray = new Array();
        for (const key in data) {
          dataArray.push(data[key]);
          // const element = object[key];
          // console.log(data[key]["group_name"]); // key["group_name"]
        }

        this.setState({
          groupData: dataArray,
          loading: false,
        });
      });
  };

  onChangeSearch(query) {
    this.setState({query: query});
  }

  selectCategory(category) {
    if(this.state.category != category){   
      var newRooms = rooms.filter((room) => this.filterRooms(room, category));
      this.setState({category: category, rooms: newRooms});
    }else{  
      var newRooms = rooms;
      this.setState({category: "", rooms: newRooms});
    }
  }

  filterRooms(room, category) {

    return (category==room.labels[1].text);

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
      <PaperProvider>
        <View style={styles.container}>

          <Portal>
            <Dialog visible={this.state.loading} dismissable={false}>
              <Dialog.Title>{this.state.loading_dialog_text}</Dialog.Title>
              <Dialog.Content>
                <ActivityIndicator
                  size={60}
                  animating={true}
                  hidesWhenStopped={true}
                  color="#6200EE"
                />
              </Dialog.Content>
            </Dialog>
          </Portal>

          <View style={{marginTop: 30, marginBottom: 20, padding: 0, width: "90%"}}>
            <Searchbar
              placeholder="Search Groups"
              onChangeText={(q)=>this.onChangeSearch(q)}
              value={this.state.query}
            />
          </View>

          <View style={{flexDirection: "row", width:"90%"}}>
            <Text style={{marginRight: 5, marginTop: 8, color: "grey", fontSize: 14}}>Category</Text>
            <ScrollView horizontal={true}>

              <Chip style={{margin: 2 }} icon="school" mode="outlined" selected={this.state.category=="Education"} onPress={() => this.selectCategory("Education")}>Education</Chip>
              <Chip style={{margin: 2 }} icon="home" mode="outlined" selected={this.state.category=="Life"} onPress={() => this.selectCategory("Life")}>Life</Chip>
              <Chip style={{margin: 2 }} icon="movie" mode="outlined" selected={this.state.category=="Art"} onPress={() => this.selectCategory("Art")}>Art</Chip>
              <Chip style={{margin: 2 }} icon="airplane" mode="outlined" selected={this.state.category=="Travel"} onPress={() => this.selectCategory("Travel")}>Travel</Chip>
              <Chip style={{margin: 2 }} icon="briefcase" mode="outlined" selected={this.state.category=="Business"} onPress={() => this.selectCategory("Business")}>Business</Chip>
              <Chip style={{margin: 2 }} icon="library" mode="outlined" selected={this.state.category=="Research"} onPress={() => this.selectCategory("Research")}>Research</Chip>
         
            </ScrollView>
          </View>

          <View>
            <ScrollView style={{marginHorizontal: 20, marginBottom: 140}}>
              {this.state.rooms.map((room)=>{
                return(
                  <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("GroupChatDetail", {
                      chatName: room.name,
                      userNumber: room.teacher + room.nativeSpeaker + room.student + 1,
                    });
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 20,

                    width: 370,
                    borderRadius: 30,
                  }}
                >  
                  <View style={{flex: 1, width: "100%", height: 150, marginVertical: 0}}>
                    <ImageBackground source={{ uri: room.image }} resizeMode="cover" style={{flex: 1, justifyContent: "center"}} imageStyle={{ borderRadius: 30}}>
                      <View style={{backgroundColor:"rgba(0, 0, 0, 0.5)", width: "100%", height: "100%", borderRadius: 30}}>
                      <Title style={{marginLeft: 20, color: "white"}}>{room.name}</Title>
                      <View style={{flexDirection: 'row', marginVertical: 3}}><FontAwesome5 name="user-graduate" size={16} style={{marginLeft: 20, marginTop: 2}} color="#f5deb3" /><Text style={{ marginHorizontal: 3, color: "white", fontSize: 16}}>tutors {room.teacher}</Text></View>
                      <View style={{flexDirection: 'row', marginVertical: 3}}><FontAwesome5 name="user-ninja" size={16} style={{marginLeft: 20, marginTop: 2}} color="#b0c4de" /><Text style={{marginHorizontal: 3, color: "white", fontSize: 16}}>natives {room.nativeSpeaker}</Text></View>
                      <View style={{flexDirection: 'row', marginVertical: 3}}><FontAwesome5 name="user-alt" size={16} style={{marginLeft: 20, marginTop: 2}} color="white" /><Text style={{marginHorizontal: 3, color: "white", fontSize: 16}}>users {room.student}</Text></View>
                      <View style={{flexDirection: 'row', marginVertical: 3}}><FontAwesome5 name="tags" size={16} style={{marginLeft: 20, marginRight: 10, marginTop: 2}} color="white" />
                        {room.labels.map((label)=> {
                          return(
                        <View style={{backgroundColor:label.color, borderRadius: 4, marginHorizontal: 4, paddingHorizontal: 6}}><Text style={{color: "white", fontSize: 14 }}>{label.text}</Text></View>
                          )}
                        )}
                        
                      </View>
                      </View>
                    </ImageBackground>
                  </View>
                </TouchableOpacity>
                )
              }
                )}

            </ScrollView>
          </View>

          <FAB
            style={{position: "absolute", left: 0, bottom: 0, margin: 20, backgroundColor: "blue",}}
            icon="language-swift"
            onPress={() => {this.props.navigation.navigate("BotChatDetail", {chatName: "Topparrot",});}}
          />

        </View>
      </PaperProvider>
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
    backgroundColor: "blue",
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
