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

import Colors from '../constants/Colors';

const iconSize = 30;

export default class MovieScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);
    this.state = {
      liked: false
    }
  }


  render() {
    const { navigation } = this.props;
    const title = navigation.getParam('title');
    const image_url = navigation.getParam('image_url');
    const description = navigation.getParam('description');
    const genres = navigation.getParam('genres', ['Unknown']);
    const releaseDate = navigation.getParam('releaseDate');

    const heartIconAndroid = this.state.liked ? 'md-heart' : 'md-heart-empty';
    const heartIconIos = this.state.liked ? 'ios-heart' : 'ios-heart-empty';

    return (
      <View style={styles.container}>
        <Text style={styles.backText}
              onPress={() => navigation.goBack()}>Back</Text>
            <Image style={styles.heroImage} source={{uri: image_url}}></Image>
        <View style={styles.infoContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.text}>
            <Text style={{fontWeight: 'bold'}}>Genres: </Text>
            {genres.join(', ')}
          </Text>
          <Text style={styles.text}>
            <Text style={{fontWeight: 'bold'}}>Release Date: </Text>
            {releaseDate}
          </Text>
          <Text style={styles.summary}>
            <Text style={{fontWeight: 'bold'}}>Summary: </Text>
            {description}
          </Text>
        </View>
      </View>
    )
  }
  // <View style={styles.iconContainer}>
  //   <Icon.Ionicons
  //     name={Platform.OS === 'ios' ? heartIconIos : heartIconAndroid}
  //     size={iconSize}
  //     style={styles.heartIcon}
  //     onPress={() => this.setState((state) => {
  //       //TODO: add/remove this movie from the users liked movies
  //       return {liked: !state.liked}
  //     })}
  //   />
  // </View>
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
    color: Colors.mainColor,
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
    color: Colors.mainColor,
  },
  iconContainer: {
    position: 'absolute',
    top: 30,
    right: 30,
    zIndex: 2,
  },
  backText: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 2,
    color: '#fff',
    fontSize: 20
  }

})
