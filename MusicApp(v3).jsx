// Improved Ui Ux, basic expandable music conrol, music list 
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Animated,
  PanResponder,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Audio } from 'expo-av';

// Constants
const { width, height } = Dimensions.get('window');
const CARD_MARGIN = 10;
const GRID_SPACING = 16;
const TRACK_CARD_WIDTH = (width - (GRID_SPACING * 3)) / 2;
const MINI_PLAYER_HEIGHT = 80;
const FULL_PLAYER_HEIGHT = height * 0.9;
