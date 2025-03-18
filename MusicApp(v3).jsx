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

// Color Theme
const COLORS = {
  background: '#121212',
  surface: '#282828',
  primary: '#1DB954', // Spotify green
  primaryVariant: '#1ED760',
  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B3',
  inactive: '#535353',
  divider: '#333333',
  overlay: 'rgba(0, 0, 0, 0.7)',
  cardBackground: '#1E1E1E',
};

const SpotifyClone = () => {
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  
  const soundRef = useRef(null);
  const playerAnimation = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
