import React from 'react';
import {
  AsyncStorage,
  Text, View, Animated,
  StyleSheet, Image, PanResponder,
  Platform, ImageBackground, TouchableOpacity
} from 'react-native';
import { Icon } from 'expo';

import Api from '../common/api';
import FBApi from '../common/fbApi';

import Layout from '../constants/Layout';
import Colors from '../constants/Colors';

const hostString = "http://192.168.1.12:8080";
// const user = {
//   id: "0",
//   name: "John Doe",
//   profileUri: require("../assets/images/profile.jpg"),
//   likedMovies: [
//     {
//       id: "0",
//       title: "Aquaman",
//       uri: require('../assets/images/aquaman.jpg'),
//       summary: "Arthur Curry learns that he is the heir to the underwater kingdom of Atlantis, and must step forward to lead his people and be a hero to the world.",
//       genres: ["Action", "Adventure", "Fantasy"],
//       releaseDate: "2018-12-13"
//     },
//     {
//       id: "1",
//       title: "Bohemian Rhapsody",
//       uri: require('../assets/images/bohemian-rhapsody.jpg'),
//       summary: "The story of the legendary rock music band Queen and lead singer Freddie Mercury, leading up to their famous performance at Live Aid (1985).",
//       genres: ["Biography", "Drama", "Music"],
//       releaseDate: "2018-10-31"
//     },
//     {
//       id: "2",
//       title: "Robin Hood",
//       uri: require('../assets/images/robin-hood.jpg'),
//       summary: "A war-hardened Crusader and his Moorish commander mount an audacious revolt against the corrupt English crown in a thrilling action-adventure packed with gritty battlefield exploits, mind-blowing fight choreography, and a timeless romance.",
//       genres: ["Action", "Adventure", "Thriller"],
//       releaseDate: "2018-11-30"
//     },
//   ]
// }

const profileUri = require("../assets/images/profile.jpg");
const iconSize = 20;

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      user: {},
    }

  }

  // renderMovies = () => {
  //   return user.likedMovies.map((movie, i) => {
  //     return (
  //       <TouchableOpacity key={movie.id} style={styles.listItem}
  //         onPress={() => this.props.navigation.navigate("Movie", movie)}>
  //         <Image style={styles.movieImage} source={movie.uri} />
  //         <Text style={styles.movieTitle}>{movie.title}</Text>
  //         <Icon.Ionicons
  //           name={Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-forward'}
  //           size={iconSize}
  //           style={styles.arrowIcon}
  //           />
  //       </TouchableOpacity>
  //     )
  //   })
  // }

  async getUserInfo () {
    try{
      console.log("Getting user info....");
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('User token is ', userToken);

      console.log('Aquiring facebook info...');
      const fb = new FBApi(userToken);

      const userInfo = await fb.getUserInfo();
      userInfo.movies = userInfo.movies.data;
      console.log('User info: ', userInfo);

      api = hostString === 'mock' ? new MockApi(hostString) : new Api(hostString);
      //Get user from Api
      let user = await api.getUser(userInfo.email);
      if(user.length === 0) {
        //Create new user
        console.log("Creating new user...");
        user = await api.addUser(userInfo);
        console.log("New user created");
      }

      return user;

    }
    catch (e) {
      console.log(e);
    }
  }

  componentWillMount() {

    this.getUserInfo().then((user) => this.setState({user: user}));

  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.profilePic} source={profileUri} />
        <Text style={styles.nameText}>{this.state.user.name}</Text>
        <View style={styles.moviesList}>
          <Text style={styles.listHeader}>Liked Movies</Text>
          {/*this.renderMovies()*/}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
    paddingTop: 50,

  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  nameText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
  },
  listHeader: {
    color: "#fff",
    fontSize: 25,
    marginBottom: 10,
  },
  moviesList: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
    marginTop: 50,
    padding: 10,
  },
  listItem: {
    height: 50,
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
  },
  movieTitle: {
    color: "#fff",
    fontSize: 20,
    marginLeft: 10,
  },
  movieImage: {
    height: '100%',
    width: 70,
  },
  arrowIcon: {
    color: '#fff',
    position: 'absolute',
    top: 30,
    right: 10,
  }
})
