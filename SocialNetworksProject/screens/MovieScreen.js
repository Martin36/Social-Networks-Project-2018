import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'expo';

const movie = {
  id: "0",
  title: "Aquaman",
  uri: require('../assets/images/aquaman.jpg'),
  summary: "Arthur Curry learns that he is the heir to the underwater kingdom of Atlantis, and must step forward to lead his people and be a hero to the world.",
  genres: ["Action", "Adventure", "Fantasy"],
  releaseDate: "2018-12-13"
}

const iconSize = 30;

export default class MovieScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.heroImage} source={movie.uri}></Image>
        <View style={styles.infoContainer}>
          <Text style={styles.titleText}>{movie.title}</Text>
          <Text style={styles.text}>
            <Text style={{fontWeight: 'bold'}}>Genres: </Text>
            {movie.genres.join(', ')}
          </Text>
          <Text style={styles.text}>
            <Text style={{fontWeight: 'bold'}}>Release Date: </Text>
            {movie.releaseDate}
          </Text>
          <Text style={styles.summary}>
            <Text style={{fontWeight: 'bold'}}>Summary: </Text>
            {movie.summary}
          </Text>

          <View style={styles.iconContainer}>
            <Icon.Ionicons
              name={Platform.OS === 'ios' ? 'ios-heart-empty' : 'md-heart-empty'}
              size={iconSize}
              style={styles.heartIcon}
            />
          </View>

        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: '30%',
  },
  infoContainer: {
    width: '100%',
    height: '70%',
    flex: 1,
    backgroundColor: '#222',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 10,
    shadowOpacity: 1.0,
    elevation: 2
  },
  titleText: {
    color: '#ff8c00',
    fontSize: 30,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  summary: {
    color: '#fff',
    fontSize: 13,
    marginTop: 10,
  },
  heartIcon: {
    color: '#ff8c00',
  },
  iconContainer: {
    position: 'absolute',
    top: 30,
    right: 30,
    zIndex: 2,
  },

})
