// musicApp(v2).jsx
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
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Audio } from 'expo-av';

// Constants
const { width } = Dimensions.get('window');
const CARD_MARGIN = 10;
const GRID_SPACING = 16;
const TRACK_CARD_WIDTH = (width - (GRID_SPACING * 3)) / 2;

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
};

const SpotifyClone = () => {
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const soundRef = useRef(null);

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

  // Audio setup
  useEffect(() => {
    setupAudio();
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.error('Failed to set audio mode', error);
    }
  };

const loadAudio = async (index) => {
  try {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }

    console.log(`Loading audio: ${playlist[index].audio}`);
    
    const { sound } = await Audio.Sound.createAsync(
      { uri: playlist[index].audio },
      { shouldPlay: isPlaying },
      onPlaybackStatusUpdate
    );
    
    soundRef.current = sound;
  } catch (error) {
    console.error('Failed to load audio', error);
    // Provide user feedback that audio failed to load
    alert('Could not load audio track. Please try another track.');
  }
};

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPlaybackPosition(status.positionMillis);
      if (status.durationMillis) {
        setPlaybackDuration(status.durationMillis);
      }
      if (status.didJustFinish) {
        handleNextTrack();
      }
    }
  };

  // Playback Controls
  const handlePlayPause = async () => {
    try {
      if (!soundRef.current) {
        await loadAudio(currentTrackIndex);
      }

      if (isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling playback', error);
    }
  };

  const handleNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
    loadAudio(nextIndex);
  };

  const handlePrevTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrackIndex(prevIndex);
    loadAudio(prevIndex);
  };

  const handleTrackSelection = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    loadAudio(index);
  };

  // Utility Functions
  const formatTime = (millis) => {
    if (!millis) return '0:00';
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  // UI Rendering
  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryButton}>
      <Text style={styles.categoryText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderTrackItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.trackItem}
      onPress={() => handleTrackSelection(index)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.trackImage} />
      <Text style={styles.trackTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.trackArtist} numberOfLines={1}>
        {item.artist}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcon name="notifications-none" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcon name="search" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={{ uri: 'https://picsum.photos/202' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.categoriesList}
        showsHorizontalScrollIndicator={false}
      />

      {/* Main Content */}
      <FlatList
        data={playlist}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.trackListContainer}
        columnWrapperStyle={styles.trackList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Recommended for you</Text>
        }
      />

      {/* Now Playing Bar */}
      <View style={styles.nowPlayingBar}>
        <Image
          source={{ uri: playlist[currentTrackIndex].image }}
          style={styles.nowPlayingImage}
        />

        <View style={styles.playbackControls}>
          <View style={styles.trackInfoContainer}>
            <Text style={styles.nowPlayingTitle} numberOfLines={1}>
              {playlist[currentTrackIndex].title}
            </Text>
            <Text style={styles.nowPlayingArtist} numberOfLines={1}>
              {playlist[currentTrackIndex].artist}
            </Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(playbackPosition / playbackDuration) * 100 || 0}%`,
                  },
                ]}
              />
            </View>
            <View style={styles.timeLabels}>
              <Text style={styles.timeText}>{formatTime(playbackPosition)}</Text>
              <Text style={styles.timeText}>{formatTime(playbackDuration)}</Text>
            </View>
          </View>
          
          <View style={styles.controlsRow}>
            <TouchableOpacity onPress={handlePrevTrack} style={styles.controlButton}>
              <Icon name="step-backward" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
              <Icon
                name={isPlaying ? 'pause' : 'play'}
                size={22}
                color={COLORS.background}
              />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleNextTrack} style={styles.controlButton}>
              <Icon name="step-forward" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginHorizontal: 12,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 8,
  },
  categoriesList: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  trackListContainer: {
    paddingBottom: 100, // Space for Now Playing bar
  },
  trackList: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  trackItem: {
    width: TRACK_CARD_WIDTH,
    marginBottom: 24,
  },
  trackImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  trackTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  trackArtist: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  nowPlayingBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  nowPlayingImage: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginRight: 12,
  },
  playbackControls: {
    flex: 1,
  },
  trackInfoContainer: {
    marginBottom: 6,
  },
  nowPlayingTitle: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  nowPlayingArtist: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 3,
    backgroundColor: COLORS.inactive,
    borderRadius: 1.5,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 1.5,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButton: {
    padding: 10,
  },
  playButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
  },
});

export default SpotifyClone;
