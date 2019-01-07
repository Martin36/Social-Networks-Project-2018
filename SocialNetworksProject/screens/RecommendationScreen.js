import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';

import MovieCard from '../components/MovieCard';

export default class RecommendationScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return(
      <MovieCard {...this.props}></MovieCard>      
    )
  }
}
