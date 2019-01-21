import React from 'react';
import {
  AsyncStorage, ScrollView,
  Text, View, Animated,
  StyleSheet, Image, PanResponder,
  Platform, ImageBackground, TouchableOpacity
} from 'react-native';
import { Icon } from 'expo';

import Api from '../common/api';
import FBApi from '../common/fbApi';

import Layout from '../constants/Layout';
import Colors from '../constants/Colors';

const profileUri = require("../assets/images/profile.jpg");
const iconSize = 20;

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      user: null,
      movies: null,
    }

    // Used for knowing when this screen is navigated to
    const willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      payload => {
        //console.log("willFocus", payload);
        //Means that we are navigating with the tab bar
        if(payload.action.type === "Navigation/NAVIGATE"){
          this.getUserInfo().then((data) => this.setState({user: data.user, movies: data.movies}));
        }
        console.log('Going to Profile screen');
      }
    );

  }

  renderMovies = () => {
    return this.state.movies.map((movie, i) => {
      return (
        <TouchableOpacity key={i} style={styles.listItem}
          onPress={() => this.props.navigation.navigate("Movie", movie)}>
          <Image style={styles.movieImage} source={{uri: movie.image_url}} />
          <Text style={styles.movieTitle}>{movie.title}</Text>
          <Icon.Ionicons
            name={Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-forward'}
            size={iconSize}
            style={styles.arrowIcon}
            />
        </TouchableOpacity>
      )
    })
  }

  async getUserInfo () {
    try{
      console.log("Getting user info....");
      const userToken = await AsyncStorage.getItem('userToken');

      console.log('Aquiring facebook info...');
      const fb = new FBApi(userToken);

      const userInfo = await fb.getUserInfo();
      userInfo.movies = userInfo.movies.data;

      const hostString = await AsyncStorage.getItem('hostString');
      const api = hostString === 'mock' ? new MockApi(hostString) : new Api(hostString);
      //Get user from Api
      let user = await api.getUser(userInfo.email);
      if(user.length === 0) {
        //Create new user
        console.log("Creating new user...");
        user = await api.addUser(userInfo);
        console.log("New user created");
        console.log("Getting new user");
        user = await api.getUser(userInfo.email);
        console.log("Created user: ", user);
      }

      return user;

    }
    catch (e) {
      console.log(e);
    }
  }

  componentWillMount() {

    this.getUserInfo().then((data) => this.setState({user: data.user, movies: data.movies}));

  }

  render() {

    if(!this.state.user)
      return null;

    return (
      <View style={styles.container}>
        <Image style={styles.profilePic} source={profileUri} />
        <Text style={styles.nameText}>{this.state.user.name}</Text>
        <Text style={styles.listHeader}>Liked Movies</Text>
        <ScrollView>
          {this.renderMovies()}
        </ScrollView>
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
    height: '100%',
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
    marginTop: 10,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  moviesList: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
    marginTop: 50,
    padding: 10,
  },
  listItem: {
    height: 100,
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
  },
  movieTitle: {
    color: "#fff",
    fontSize: 20,
    marginLeft: 10,
    width: "70%",
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
