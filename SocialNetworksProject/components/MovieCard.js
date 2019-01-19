import React from 'react';
import {
  AsyncStorage,
  Text, View, Animated,
  StyleSheet, Image, PanResponder,
  Platform, ImageBackground, TouchableHighlight,
} from 'react-native';
import { Icon, LinearGradient } from 'expo';

import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import Api, { MockApi } from '../common/api';
import FBApi from '../common/fbApi';

const iconSize = 120;
//Fetch new movies when there is only this amount left
const minNrOfMovies = 5;
//The amount of movies to cache before the API should be updated
const nrOfCachedMovied = 5;
const nrOfMoviesToFetch = 20;
let api;

export default class MovieCard extends React.Component {

  constructor(props){
    super(props);

    this.position = new Animated.ValueXY();
    this.state = {
      currentIndex: 0,
      movies: [],
      fbApi: null,
      mainApi: null,
      likedMovies: [],
      dislikedMovies: [],
    }

    this.updateMovieList = this.updateMovieList.bind(this);
    this.updateApis = this.updateApis.bind(this);

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

  updateMovieList(movies) {
    //Create list of movies
    movies = movies.movies.map((movie) => {
      return movie.movie;
    });
    this.setState({
      ...this.state,
      movies: this.state.movies.concat(movies)
    });
  }

  redirectToMovieScreen = (movie) => {
    this.props.navigation.navigate("Movie", movie);
  }

  updateApis(fbApi, mainApi) {
    this.setState({
      ...this.state,
      fbApi, mainApi
    })
  }

  async getApis() {
    if (!this.state.fbApi || this.state.mainApi) {
      const userToken = await AsyncStorage.getItem('userToken');
      const apiHostString = await AsyncStorage.getItem('hostString');

      this.updateApis(
        new FBApi(userToken),
        apiHostString === "mock" ? new MockApi('') : new Api(apiHostString)
      );
    }

    return {fbApi: this.state.fbApi, api: this.state.mainApi};
  }

  async getNextBatchOfMovies() {
    try
    {
      console.log('Resolving the api connections...');
      const { fbApi, api } = await this.getApis();

      console.log('Resolving user email...');


      let { email } = await fbApi.getUserInfo();
      console.log('Email is ', email);

      // TESTING: Override the email
      email = 'l@gmail.com';

      console.log(`Getting recommendations for user ${email}.`);
      return api.getRecommendations(email, 0, nrOfMoviesToFetch);
    }
    catch (e) {
      console.log('Error happened :(');
      console.log(e);
      return [];
    }
  }

  async postCachedMovies(data) {
    try {
      console.log("Posting swiped movies to API");

      const email = 'l@gmail.com';
      const hostString = 'http://192.168.5.9:8080'; //Change this to your IP

      //Pass the movies to the algorithm
      const data = {
        likes: this.state.likedMovies,
        dislikes: this.state.dislikedMovies,
      };
      console.log(data);
      //Resett liked/disliked movies
      this.setState({...this.state,
        likedMovies: [],
        dislikedMovies: [],
      }, () => console.log("Liked/disliked movies resetted"))

      return api.addMovie(email, data);
    }
    catch (e) {
      console.log(e);
      throw e;
    }
  }

  componentWillMount() {

    this.getNextBatchOfMovies()
      .then(this.updateMovieList);

    this.PanResponder = PanResponder.create({

      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (evt, gestureState) => {
        //User liked the movie
        if(gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: Layout.window.width + 100, y: gestureState.dy }
          }).start(() => {
            this.setState({
              currentIndex: this.state.currentIndex + 1,
              likedMovies: this.state.likedMovies.concat([{fb_id: this.state.movies[this.state.currentIndex].fb_id}])
            },
            () => {
              if(this.state.movies.length - this.state.currentIndex < minNrOfMovies ){
                //Fetch new movies
                this.getNextBatchOfMovies()
                  .then(this.updateMovieList);
              }
              let swipedMovies = this.state.likedMovies.length + this.state.dislikedMovies.length;
              if(swipedMovies >= nrOfCachedMovied){
                this.postCachedMovies()
                  .then(() => console.log("Movies posted to API!"));
              }
              this.position.setValue({ x: 0, y: 0})
            })
          })
        }
        //User disliked the movie
        else if(gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -Layout.window.width - 100, y: gestureState.dy }
          }).start(() => {
            this.setState({
              currentIndex: this.state.currentIndex + 1,
              dislikedMovies: this.state.dislikedMovies.concat([{fb_id: this.state.movies[this.state.currentIndex].fb_id}])
            },
            () => {
              if(this.state.movies.length - this.state.currentIndex < minNrOfMovies ){
                //Fetch new movies
                this.getNextBatchOfMovies()
                  .then(this.updateMovieList);
              }
              let swipedMovies = this.state.likedMovies.length + this.state.dislikedMovies.length;
              if(swipedMovies >= nrOfCachedMovied){
                this.postCachedMovies()
                  .then(() => console.log("Movies posted to API!"));
              }
              this.position.setValue({ x: 0, y: 0})
            })
          })
        }
        //If the user clicks on the card more information about the movie should be shown
        else if(gestureState.dx > -10 && gestureState.dx < 10){
          this.redirectToMovieScreen(this.state.movies[this.state.currentIndex]);
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
    if (!this.state.movies) {
      return null;
    }

    const moviesToRender = this.state.movies
      .filter((_, i) => i >= this.state.currentIndex);

    return this.state.movies.map((movie, i) => {
      if(i == this.state.currentIndex) {
        return (
          <Animated.View
            {...this.PanResponder.panHandlers}
            key={i} style={[
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

            <LinearGradient style={styles.gradient}
              colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']}>
              <Text style={styles.titleText}>{movie.title}</Text>
            </LinearGradient>

            <Image style={styles.cardImage} source={{uri: movie.image_url}} />
          </Animated.View>
        )
      }
      else{
        return (
          <Animated.View
            key={i} style={{
              opacity: this.nextCardOpacity,
              transform: [{ scale: this.nextCardScale}],
              ...styles.cardImageContainer}}>

            <LinearGradient style={styles.gradient}
              colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']}>
              <Text style={styles.titleText}>{movie.title}</Text>
            </LinearGradient>

            <Image style={styles.cardImage} source={{uri: movie.image_url}} />
          </Animated.View>
        )
      }
    }).reverse();
  }

  render() {
    if (this.state.movies.length === 0) {
      return <View>
        <Text>"Loading movies..."</Text>
      </View>;
    }
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
    backgroundColor: Colors.backgroundColor
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
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    paddingBottom: 10,
    paddingTop: 30,
    left: 10,
    bottom: 10,
    zIndex: 3,
    width: '100%',
    borderRadius: 20,
    height: '40%',
  }
});
