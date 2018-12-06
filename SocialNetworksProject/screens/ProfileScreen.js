import React from 'react';
import {
  Text, View, Animated,
  StyleSheet, Image, PanResponder,
  Platform, ImageBackground,
} from 'react-native';
import { Icon } from 'expo';

import Layout from '../constants/Layout';
import Colors from '../constants/Colors';

const user = {
  id: "0",
  name: "John Doe",
  profileUri: require("../assets/images/profile.jpg"),
  likedMovies: [
    {id: "0", title: "Aquaman", uri: require('../assets/images/aquaman.jpg')},
    {id: "1", title: "Bohemian Rhapsody", uri: require('../assets/images/bohemian-rhapsody.jpg')},
    {id: "2", title: "Robin Hood", uri: require('../assets/images/robin-hood.jpg')},
  ]
}

const iconSize = 20;

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  renderMovies = () => {
    return user.likedMovies.map((movie, i) => {
      return (
        <View key={movie.id} style={styles.listItem}>
          <Image style={styles.movieImage} source={movie.uri} />
          <Text style={styles.movieTitle}>{movie.title}</Text>
          <Icon.Ionicons
            name={Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-forward'}
            size={iconSize}
            style={styles.arrowIcon}
            />
        </View>
      )
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.profilePic} source={user.profileUri} />
        <Text style={styles.nameText}>{user.name}</Text>
        <View style={styles.moviesList}>
          <Text style={styles.listHeader}>Liked Movies</Text>
          {this.renderMovies()}
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
