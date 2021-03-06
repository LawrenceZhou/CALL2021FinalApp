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
  List,
} from "react-native-paper";
import * as firebase from "firebase";

import * as ImagePicker from "expo-image-picker";

import { convertEpochToDateMonthYear } from "../logic/helpers";

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


const Questions = {
  "Hottest": [
    {
      title: "What is the difference between venture and startup?",
      tag: "Business",
      responses: 9,
    },
    {
      title: "'I like TV.' and 'I like watching TV', Which sentence is more correct, more natural?",
      tag: "Life",
      responses: 4,
    },
    {
      title: "How do you say this in English (US)? ホテルのプールが使えるかどうか、ホテルに電話して聞いてみるね。",
      tag: "Travel",
      responses: 8,
    },
  ],
  "Newest": [
    {
      title: "How do you say this in English (US)? 氷少なめでお願いします。（Starbucks でアイスコーヒー頼む時）",
      tag: "Life",
      responses: 6,
    },
    {
      title: "Is the use of 'ASAP' common in daily life?",
      tag: "Life",
      responses: 2,
    },
    {
      title: "What TV shows are popular in US recently?(2022)",
      tag: "Art",
      responses: 3,
    },
  ],
  "Normal": [
    {
      title: "Is this natural in American English? 'My wife and I always exchange anniversary gifts, together with those for our birthdays and Christmas.'",
      tag: "Life",
      responses: 6,
    },
    {
      title: "What is the difference between class and course?",
      tag: "Education",
      responses: 2,
    },
    {
      title: "What one to use when I want to cite some other work on the similar topic, 'Related Work' or 'Relative Work'.",
      tag: "Research",
      responses: 4,
    },
  ],
}
export default class Forum extends Component {
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
      type: "Hottest",
      topQuestions: Questions["Hottest"],
      btmQuestions: Questions["Normal"],
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

  createGroup = (groupName, uid) => {
    // console.log(groupName);
    this.setState({
      showLoader: true,
    });

    const dateNow = Date.now();

    // Get a reference to the Group Unique ID
    let groupRef = firebase.database().ref("groups/").push();

    let groupKey = groupRef.key;
    // console.log(groupKey);

    let updateUserData = {};
    updateUserData["users/" + uid + "/groups/" + groupKey] = {
      group_id: groupKey,
      group_name: groupName,
      created_at: dateNow,
    };
    updateUserData["groups/" + groupKey] = {
      group_name: groupName,
      adminId: uid,
      created_at: dateNow,
      members: {
        [uid]: uid,
      },
    };

    // Save the data in firebase
    firebase
      .database()
      .ref()
      .update(updateUserData)
      .then(() => {
        this.getAllGroupData(uid);
        // Successfully executed
        // Hide the dialog box
        // Hide the show loader
        this.setState({
          groupName: null,
          showCreateGroupDialog: false,
          showLoader: false,
        });
      })
      .catch((error) => {
        alert(error.message);
      });

    // Get the group data
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

  selectType(type) {
    this.setState({type: type, topQuestions: Questions[type]});
    console.log(type, Questions[type]);
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

            <Dialog
              dismissable={showLoader == true ? false : true}
              visible={showCreateGroupDialog}
              onDismiss={() => {
                this.setState({ showCreateGroupDialog: false });
              }}
            >
              <Dialog.Title>Create Group</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  disabled={showLoader}
                  mode="flat"
                  placeholder="Enter Group Name"
                  value={this.state.groupName}
                  onChangeText={(groupName) => {
                    this.setState({ groupName });
                  }}
                  style={styles.textInput}
                />
              </Dialog.Content>
              <Dialog.Actions>
                {showLoader == true ? (
                  <ActivityIndicator
                    size="large"
                    animating={true}
                    color={Colors.purple500}
                  />
                ) : (
                  <Button onPress={() => this.createGroup(groupName, uid)}>
                    Done
                  </Button>
                )}
              </Dialog.Actions>
            </Dialog>

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
              placeholder="Search Questions"
              onChangeText={(q)=>this.onChangeSearch(q)}
              value={this.state.query}
            />
          </View>
          <ScrollView style={{flexDirection:"column", flex: 1, marginHorizontal: 20, width:"90%"}}>
          <View style={{flexDirection: "row", width:"100%"}}>
            <Chip style={{margin: 2 }} mode="outlined" selected={this.state.type=="Hottest"} onPress={() => this.selectType('Hottest')}>Hottest</Chip>
            <Chip style={{margin: 2 }} mode="outlined"  selected={this.state.type=="Newest"} onPress={() => this.selectType('Newest')}>Newest</Chip>
          </View>

          <View>
             {this.state.topQuestions.map((question)=>{
                return(

                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("QuestionDetail", {});
                  }}
                  style={{
                    alignItems: "center",
                    marginTop: 10,
                    marginBottom: 10,
                    width: "100%",
                  }}
                >  
                  <View style={{  flex:0, width: "100%", marginVertical: 0}}>
                      <View style={{backgroundColor:"white", width: "100%"}}>
                      <Title style={{marginLeft: 10, color: "black"}}>{question.title}</Title>
                      <View style={{flexDirection: 'row', marginVertical: 3}}><FontAwesome5 name="tags" size={14} style={{marginLeft: 20, marginRight: 10, marginTop: 2}} color="grey" />
                        <View style={{backgroundColor: "#d9138a", borderRadius: 4, paddingHorizontal: 6}}><Text style={{color: "white", fontSize: 14 }}>{question.tag}</Text></View>         
                      </View>
                      <View style={{flexDirection: 'row', marginVertical: 3, marginLeft: 10}}>
                        <Text style={{marginLeft: 10, color: "grey"}}>Responses: </Text>
                        <View style={{backgroundColor:"orange", borderRadius: 4, marginHorizontal: 4, paddingHorizontal: 6}}><Text style={{color: "white", fontSize: 14 }}>{question.responses}</Text></View>
                      </View>
                      </View>
                  </View>
                </TouchableOpacity>
                )}
              )}

          </View>

          <View style={{flexDirection: "row", width:"100%"}}>
            <Text style={{marginRight: 5, marginTop: 8, color: "grey", fontSize: 14}}>Category</Text>
            <ScrollView horizontal={true}>

              <Chip style={{margin: 2 }} icon="school" mode="outlined" onPress={() => console.log('Pressed')}>Education</Chip>
              <Chip style={{margin: 2 }} icon="home" mode="outlined" onPress={() => console.log('Pressed')}>Life</Chip>
              <Chip style={{margin: 2 }} icon="movie" mode="outlined" onPress={() => console.log('Pressed')}>Art</Chip>
              <Chip style={{margin: 2 }} icon="airplane" mode="outlined" onPress={() => console.log('Pressed')}>Travel</Chip>
              <Chip style={{margin: 2 }} icon="briefcase" mode="outlined" onPress={() => console.log('Pressed')}>Business</Chip>
              <Chip style={{margin: 2 }} icon="library" mode="outlined" onPress={() => console.log('Pressed')}>Research</Chip>
         
            </ScrollView>
          </View>

          <View>
            {this.state.btmQuestions.map((question)=>{
                return(

                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("QuestionDetail", {});
                  }}
                  style={{
                    alignItems: "center",
                    marginTop: 10,
                    marginBottom: 10,
                    width: "100%",
                  }}
                >  
                  <View style={{  flex:0, width: "100%", marginVertical: 0}}>
                      <View style={{backgroundColor:"white", width: "100%"}}>
                      <Title style={{marginHorizontal: 10, color: "black"}}>{question.title}</Title>
                      <View style={{flexDirection: 'row', marginVertical: 3}}><FontAwesome5 name="tags" size={14} style={{marginLeft: 20, marginRight: 10, marginTop: 2}} color="grey" />
                        <View style={{backgroundColor: "#d9138a", borderRadius: 4, paddingHorizontal: 6}}><Text style={{color: "white", fontSize: 14 }}>{question.tag}</Text></View>         
                      </View>
                      <View style={{flexDirection: 'row', marginVertical: 3, marginLeft: 10}}>
                        <Text style={{marginLeft: 10, color: "grey"}}>Responses: </Text>
                        <View style={{backgroundColor:"orange", borderRadius: 4, marginHorizontal: 4, paddingHorizontal: 6}}><Text style={{color: "white", fontSize: 14 }}>{question.responses}</Text></View>
                      </View>
                      </View>
                  </View>
                </TouchableOpacity>
                )}
              )}
            
          </View>
          </ScrollView>

          {/* || groupData == null || groupData == "" ? (
            <Text>You don't have any groups!</Text>
          ) : (
            <FlatList
              style={{ paddingTop: 10, paddingBottom: 10 }}
              data={groupData}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("ChatDetail", {
                      groupName: item.group_name,
                      createdAt: convertEpochToDateMonthYear(item.created_at),
                    });
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 16,
                    backgroundColor: Colors.white,
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    width: 380,
                    borderWidth: 1,
                    borderColor: Colors.blueGrey500,
                    borderRadius: 14,
                  }}
                >
                  <Image
                    style={styles.groupImage}
                    source={
                      item.group_image == null
                        ? require("../assets/team.png")
                        : { uri: item.group_image }
                    }
                  />
                  <View>
                    <Text style={styles.groupTitle}>{item.group_name}</Text>
                    <Text style={styles.groupSubTitle}>
                      {convertEpochToDateMonthYear(item.created_at)}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.group_id}
            />
          )*/}


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
