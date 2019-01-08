import React from 'react';
import {
  Text, View, Animated,
  StyleSheet, Image, PanResponder,
  Platform, ImageBackground, TouchableHighlight,
} from 'react-native';
import { Icon } from 'expo';

import Layout from '../constants/Layout';
import Colors from '../constants/Colors';

const movies = [
  {
    id: "0",
    title: "Aquaman",
    uri: require('../assets/images/aquaman.jpg'),
    summary: "Arthur Curry learns that he is the heir to the underwater kingdom of Atlantis, and must step forward to lead his people and be a hero to the world.",
    genres: ["Action", "Adventure", "Fantasy"],
    releaseDate: "2018-12-13"
  },
  {
    id: "1",
    title: "Bohemian Rhapsody",
    uri: require('../assets/images/bohemian-rhapsody.jpg'),
    summary: "The story of the legendary rock music band Queen and lead singer Freddie Mercury, leading up to their famous performance at Live Aid (1985).",
    genres: ["Biography", "Drama", "Music"],
    releaseDate: "2018-10-31"
  },
  {
    id: "2",
    title: "Robin Hood",
    uri: require('../assets/images/robin-hood.jpg'),
    summary: "A war-hardened Crusader and his Moorish commander mount an audacious revolt against the corrupt English crown in a thrilling action-adventure packed with gritty battlefield exploits, mind-blowing fight choreography, and a timeless romance.",
    genres: ["Action", "Adventure", "Thriller"],
    releaseDate: "2018-11-30"
  },
]

const iconSize = 120;

export default class MovieCard extends React.Component {

  constructor(props){
    super(props);

    //console.log(this.props);

    this.position = new Animated.ValueXY();
    this.state = {
      currentIndex: 0
    }

    this.rotate = this.position.x.interpolate({
      inputRange: [-Layout.window.width/2, 0, Layout.window.width/2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    });

    this.rotateAndTranslate = {
      transform: [{
        rotate: this.rotate
      },
    ...this.position.getTranslateTransform() ]
    };

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-Layout.window.width/2, 0, Layout.window.width/2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    });
    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-Layout.window.width/2, 0, Layout.window.width/2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    });
    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-Layout.window.width/2, 0, Layout.window.width/2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    });
    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-Layout.window.width/2, 0, Layout.window.width/2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp'
    });
  }

  redirectToMovieScreen = (movie) => {
    this.props.navigation.navigate("Movie", movie);
  }

  componentWillMount() {
    this.PanResponder = PanResponder.create({

      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (evt, gestureState) => {
        if(gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: Layout.window.width + 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1},
            () => {
              this.position.setValue({ x: 0, y: 0})
            })
          })
        }
        else if(gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -Layout.window.width - 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1},
            () => {
              this.position.setValue({ x: 0, y: 0})
            })
          })
        }
        //If the user clicks on the card more information about the movie should be shown
        else if(gestureState.dx > -10 && gestureState.dx < 10){
          this.redirectToMovieScreen(movies[this.state.currentIndex]);
        }
        else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0},
            friction: 4
          }).start()
        }
      }
    })
  }

  renderMovies = () => {
    return movies.map((movie, i) => {

      if(i < this.state.currentIndex){
        return null;
      }
      else if(i == this.state.currentIndex){
        return (
          <Animated.View
            {...this.PanResponder.panHandlers}
            key={movie.id} style={[
              this.rotateAndTranslate,
              styles.cardImageContainer,
            ]}>

            <Animated.View style={{opacity: this.likeOpacity ,...styles.likeContainer}}>
              <Text style={styles.likeText}>LIKE</Text>
            </Animated.View>

            <Animated.View style={{opacity: this.dislikeOpacity, ...styles.dislikeContainer}}>
              <Text style={styles.dislikeText}>NOPE</Text>
            </Animated.View>

            <Animated.View style={{opacity: this.likeOpacity, ...styles.iconContainer}}>
              <Icon.Ionicons
                name={Platform.OS === 'ios' ? 'ios-thumbs-up' : 'md-thumbs-up'}
                size={iconSize}
                style={styles.thumbsUpIcon}
              />
            </Animated.View>

            <Animated.View style={{opacity: this.dislikeOpacity, ...styles.iconContainer}}>
              <Icon.Ionicons
                name={Platform.OS === 'ios' ? 'ios-thumbs-down' : 'md-thumbs-down'}
                size={iconSize}
                style={styles.thumbsDownIcon}
              />
            </Animated.View>

            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{movie.title}</Text>
            </View>

            <Image style={styles.cardImage} source={movie.uri} />
          </Animated.View>
        )
      }
      else{
        return (
          <Animated.View
            key={movie.id} style={{
              opacity: this.nextCardOpacity,
              transform: [{ scale: this.nextCardScale}],
              ...styles.cardImageContainer}}>

            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{movie.title}</Text>
            </View>

            <Image style={styles.cardImage} source={movie.uri} />
          </Animated.View>
        )
      }
    }).reverse();
  }

  render() {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>

        </View>
        <View style={styles.flex}>
          {this.renderMovies()}
        </View>

        <View style={styles.cardFooter}>

        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
  },
  cardHeader: {
    height: 60,
  },
  cardImageContainer: {
    height: Layout.window.height - 120,
    width: Layout.window.width,
    padding: 10,
    position: 'absolute',
  },
  cardImage: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: 'cover',
    borderRadius: 20
  },
  cardFooter: {
    height: 60,
  },
  iconContainer: {
    position: 'absolute',
    top: (Layout.window.height - 120)/2 - iconSize/2,
    left: Layout.window.width/2 - iconSize/2,
    zIndex: 2,
  },
  thumbsUpIcon: {
    color: Colors.likeColor,
  },
  thumbsDownIcon: {
    color: Colors.dislikeColor,
  },
  likeContainer: {
    transform: [{rotate: '-30deg'}],
    position: 'absolute',
    top: 50,
    left: 40,
    zIndex: 2,
  },
  likeText: {
    borderWidth: 1,
    borderColor: Colors.likeColor,
    color: Colors.likeColor,
    fontSize: 32,
    fontWeight: '800',
    padding: 10,
  },
  dislikeContainer: {
    transform: [{rotate: '30deg'}],
    position: 'absolute',
    top: 50,
    right: 40,
    zIndex: 2,
  },
  dislikeText: {
    borderWidth: 1,
    borderColor: Colors.dislikeColor,
    color: Colors.dislikeColor,
    fontSize: 32,
    fontWeight: '800',
    padding: 10,
  },
  titleText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 30,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    left: 10,
    zIndex: 3,
    width: '100%',
  }
});
