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

   // Data
  const categories = [
    'All',
    'Pop',
    'Hip-Hop',
    'Rock',
    'Electronic',
    'Jazz',
    'R&B',
    'New Releases',
  ];

  // Replace the audio URLs with these real samples:
  const playlist = [
    {
      id: '1',
      title: 'Lucid Dreams',
      artist: 'Juice WRLD',
      image: 'https://picsum.photos/310',
      audio: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_07_-_Downfall.mp3',
    },
    {
      id: '2',
      title: 'Black Panther',
      artist: 'Crystal Castles',
      image: 'https://picsum.photos/299',
      audio: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3',
    },
    {
      id: '3',
      title: 'Pausewidth',
      artist: 'Aphex Twin',
      image: 'https://picsum.photos/115',
      audio: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3',
    },
    {
      id: '4',
      title: "Breakup with your girlfriend, I'm bored",
      artist: 'Ariana Grande',
      image: 'https://picsum.photos/208',
      audio: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Audiobinger/The_Garden/Audiobinger_-_05_-_Garden_Instrumental.mp3',
    },
    {
      id: '5',
      title: 'Sucker',
      artist: 'Jonas Brothers',
      image: 'https://picsum.photos/399',
      audio: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3',
    },
    {
      id: '6',
      title: 'Señorita',
      artist: 'Shawn Mendes, Camila Cabello',
      image: 'https://picsum.photos/303',
      audio: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3',
    },
    {
      id: '7',
      title: 'Old Town Road',
      artist: 'Lil Nas X, Billy Ray Cyrus',
      image: 'https://picsum.photos/307',
      audio: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_04_-_Sentinel.mp3',
    },
    {
      id: '8',
      title: 'Bad Guy',
      artist: 'Billie Eilish',
      image: 'https://picsum.photos/308',
      audio: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3',
    },
  ];
