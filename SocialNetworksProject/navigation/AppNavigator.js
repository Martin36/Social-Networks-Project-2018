import React from 'react';
import {createStackNavigator, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import RecommendationScreen from '../screens/RecommendationScreen';
import MovieScreen from '../screens/MovieScreen';

const RecommendationStack = createStackNavigator({
  Recommendation: RecommendationScreen,
  Movie: MovieScreen
});


export default createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainTabNavigator,
  Recommendation: RecommendationStack
});
