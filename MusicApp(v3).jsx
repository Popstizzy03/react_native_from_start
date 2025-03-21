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

  // Player Pan Responder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        playerAnimation.extractOffset();
      },
      onPanResponderMove: (event, gestureState) => {
        // Only allow dragging down when expanded, or up when minimized
        if ((isPlayerExpanded && gestureState.dy > 0) || (!isPlayerExpanded && gestureState.dy < 0)) {
          playerAnimation.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (event, gestureState) => {
        playerAnimation.flattenOffset();
        // If dragged more than 100px, toggle state
        if (Math.abs(gestureState.dy) > 100) {
          togglePlayerExpansion();
        } else {
          // Otherwise, snap back to current state
          Animated.spring(playerAnimation, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  // Audio setup
  useEffect(() => {
    setupAudio();
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // Update slider based on playback position
  useEffect(() => {
    if (!isSeeking && playbackDuration > 0) {
      setSliderValue(playbackPosition / playbackDuration);
    }
  }, [playbackPosition, playbackDuration, isSeeking]);

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

  // Player expansion animation
  const togglePlayerExpansion = () => {
    const toValue = isPlayerExpanded ? 0 : 1;
    
    Animated.spring(playerAnimation, {
      toValue: 0, // Reset animation value
      useNativeDriver: false,
    }).start(() => {
      setIsPlayerExpanded(!isPlayerExpanded);
    });
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

  const handleSliderChange = (value) => {
    setSliderValue(value);
  };

  const handleSliderComplete = async (value) => {
    if (soundRef.current && playbackDuration) {
      const newPosition = value * playbackDuration;
      await soundRef.current.setPositionAsync(newPosition);
      setPlaybackPosition(newPosition);
      setIsSeeking(false);
    }
  };

  const handleSliderStart = () => {
    setIsSeeking(true);
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

  // Calculate player height based on animation value and current state
  const playerHeight = playerAnimation.interpolate({
    inputRange: isPlayerExpanded ? [0, FULL_PLAYER_HEIGHT - MINI_PLAYER_HEIGHT] : [-FULL_PLAYER_HEIGHT + MINI_PLAYER_HEIGHT, 0],
    outputRange: isPlayerExpanded ? [FULL_PLAYER_HEIGHT, MINI_PLAYER_HEIGHT] : [MINI_PLAYER_HEIGHT, FULL_PLAYER_HEIGHT],
    extrapolate: 'clamp',
  });

  // Calculate opacity for full player content
  const fullPlayerOpacity = playerAnimation.interpolate({
    inputRange: isPlayerExpanded ? [0, 100] : [-100, 0],
    outputRange: isPlayerExpanded ? [1, 0] : [0, 1],
    extrapolate: 'clamp',
  });

  // Calculate opacity for mini player content
  const miniPlayerOpacity = playerAnimation.interpolate({
    inputRange: isPlayerExpanded ? [0, 100] : [-100, 0],
    outputRange: isPlayerExpanded ? [0, 1] : [1, 0],
    extrapolate: 'clamp',
  });

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
        contentContainerStyle={[
          styles.trackListContainer,
          { paddingBottom: isPlayerExpanded ? FULL_PLAYER_HEIGHT + 20 : MINI_PLAYER_HEIGHT + 20 }
        ]}
        columnWrapperStyle={styles.trackList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Recommended for you</Text>
        }
      />

      {/* Now Playing Bar (Combined Mini and Full Player) */}
      <Animated.View 
        style={[
          styles.playerContainer,
          { height: playerHeight }
        ]}
      >
        {/* Draggable Handle */}
        <View style={styles.dragHandleContainer} {...panResponder.panHandlers}>
          <View style={styles.dragHandle} />
        </View>

        {/* Mini Player */}
        <Animated.View style={[styles.miniPlayer, { opacity: miniPlayerOpacity }]}>
          <TouchableWithoutFeedback onPress={togglePlayerExpansion}>
            <View style={styles.miniPlayerContent}>
              <Image
                source={{ uri: playlist[currentTrackIndex].image }}
                style={styles.nowPlayingImageMini}
              />
              
              <View style={styles.miniPlayerInfo}>
                <Text style={styles.nowPlayingTitle} numberOfLines={1}>
                  {playlist[currentTrackIndex].title}
                </Text>
                <Text style={styles.nowPlayingArtist} numberOfLines={1}>
                  {playlist[currentTrackIndex].artist}
                </Text>
              </View>
              
              <View style={styles.miniPlayerControls}>
                <TouchableOpacity onPress={handlePlayPause} style={styles.miniPlayButton}>
                  <Icon
                    name={isPlaying ? 'pause' : 'play'}
                    size={18}
                    color={COLORS.textPrimary}
                  />
                </TouchableOpacity>
                
                <TouchableOpacity onPress={handleNextTrack} style={styles.miniControlButton}>
                  <Icon name="step-forward" size={18} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>

                    
          {/* Mini Progress Bar */}
          <View style={styles.miniProgressBarContainer}>
            <View style={styles.miniProgressBar}>
              <View
                style={[
                  styles.miniProgressFill,
                  {
                    width: `${(playbackPosition / playbackDuration) * 100 || 0}%`,
                  },
                ]}
              />
            </View>
          </View>
        </Animated.View>
        
        {/* Full Player */}
        <Animated.View style={[styles.fullPlayer, { opacity: fullPlayerOpacity }]}>
          <ScrollView 
            ref={scrollViewRef}
            style={styles.fullPlayerScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.fullPlayerScrollContent}
          >
            {/* Album Artwork */}
            <Image
              source={{ uri: playlist[currentTrackIndex].image }}
              style={styles.fullPlayerArtwork}
            />
            
            {/* Track Info */}
            <View style={styles.fullPlayerTrackInfo}>
              <Text style={styles.fullPlayerTitle}>{playlist[currentTrackIndex].title}</Text>
              <Text style={styles.fullPlayerArtist}>{playlist[currentTrackIndex].artist}</Text>
            </View>
            
            {/* Progress Bar */}
            <View style={styles.fullPlayerProgress}>
              <View style={styles.progressBar}>
                <TouchableWithoutFeedback
                  onPress={(event) => {
                    const newPosition = event.nativeEvent.locationX / styles.progressBar.width;
                    handleSliderComplete(Math.min(Math.max(newPosition, 0), 1));
                  }}
                >
                  <View style={{ width: '100%', height: 20, justifyContent: 'center' }}>
                    <View style={styles.progressBarBackground} />
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${sliderValue * 100}%`,
                        },
                      ]}
                    />
                    <View 
                      style={[
                        styles.progressThumb,
                        {
                          left: `${sliderValue * 100}%`,
                          transform: [{ translateX: -8 }]
                        }
                      ]} 
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
              
              <View style={styles.timeLabels}>
                <Text style={styles.timeText}>{formatTime(playbackPosition)}</Text>
                <Text style={styles.timeText}>{formatTime(playbackDuration)}</Text>
              </View>
            </View>
            
            {/* Main Controls */}
            <View style={styles.fullPlayerControls}>
              <TouchableOpacity style={styles.secondaryControlButton}>
                <Icon name="random" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handlePrevTrack} style={styles.mainControlButton}>
                <Icon name="step-backward" size={26} color={COLORS.textPrimary} />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handlePlayPause} style={styles.playButtonLarge}>
                <Icon
                  name={isPlaying ? 'pause' : 'play'}
                  size={32}
                  color={COLORS.background}
                />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleNextTrack} style={styles.mainControlButton}>
                <Icon name="step-forward" size={26} color={COLORS.textPrimary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.secondaryControlButton}>
                <Icon name="repeat" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
            
            {/* Secondary Controls */}
            <View style={styles.secondaryControls}>
              <TouchableOpacity style={styles.iconButtonTransparent}>
                <MaterialIcon name="devices" size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.iconButtonTransparent}>
                <MaterialIcon name="share" size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.iconButtonTransparent}>
                <MaterialIcon name="playlist-play" size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.iconButtonTransparent}>
                <MaterialIcon name="favorite-border" size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
            
            {/* Lyrics Section - Just a placeholder */}
            <View style={styles.lyricsSection}>
              <View style={styles.lyricsSectionHeader}>
                <Text style={styles.lyricsSectionTitle}>Lyrics</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.lyricPreview}>
                <Text style={styles.lyricLine}>♪ First line of the song lyrics...</Text>
                <Text style={styles.lyricLine}>♪ Second line with more lyrics...</Text>
                <Text style={styles.lyricLine}>♪ Third line continues the story...</Text>
              </View>
            </View>
            
            {/* Up Next Section */}
            <View style={styles.upNextSection}>
              <View style={styles.upNextHeader}>
                <Text style={styles.upNextTitle}>Up Next</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>Queue</Text>
                </TouchableOpacity>
              </View>
              
              {playlist.slice(0, 3).map((track, index) => (
                index !== currentTrackIndex && (
                  <TouchableOpacity 
                    key={track.id} 
                    style={styles.upNextTrack}
                    onPress={() => handleTrackSelection(index)}
                  >
                    <Image source={{ uri: track.image }} style={styles.upNextTrackImage} />
                    <View style={styles.upNextTrackInfo}>
                      <Text style={styles.upNextTrackTitle} numberOfLines={1}>{track.title}</Text>
                      <Text style={styles.upNextTrackArtist} numberOfLines={1}>{track.artist}</Text>
                    </View>
                    <TouchableOpacity style={styles.upNextTrackAction}>
                      <MaterialIcon name="more-vert" size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                )
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
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
    paddingBottom: 100, // Space for Now Playing bar - adjusted dynamically
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
  
  // Player Container (both mini and full)
  playerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    overflow: 'hidden',
  },
  
  // Drag Handle
  dragHandleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
    height: 20,
    zIndex: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.inactive,
    borderRadius: 2,
  },
  
  // Mini Player
  miniPlayer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    height: MINI_PLAYER_HEIGHT - 20,
  },
  miniPlayerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: '100%',
  },
  nowPlayingImageMini: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginRight: 12,
  },
  miniPlayerInfo: {
    flex: 1,
  },
  miniPlayerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniPlayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  miniControlButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniProgressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  miniProgressBar: {
    height: '100%',
    backgroundColor: COLORS.inactive,
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  
  // Full Player
  fullPlayer: {
    position: 'absolute',
    top: 20, // Below drag handle
    left: 0,
    right: 0,
    bottom: 0,
  },
  fullPlayerScroll: {
    flex: 1,
  },
  fullPlayerScrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  fullPlayerArtwork: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 24,
  },
  fullPlayerTrackInfo: {
    marginBottom: 24,
  },
  fullPlayerTitle: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  fullPlayerArtist: {
    color: COLORS.textSecondary,
    fontSize: 18,
  },
  fullPlayerProgress: {
    marginBottom: 24,
  },
  progressBar: {
    width: '100%',
    height: 4,
    marginBottom: 8,
  },
  progressBarBackground: {
    width: '100%',
    height: 4,
    backgroundColor: COLORS.inactive,
    borderRadius: 2,
    position: 'absolute',
  },
  progressFill: {
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    position: 'absolute',
  },
  progressThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    top: -6,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  fullPlayerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  secondaryControlButton: {
    padding: 12,
  },
  mainControlButton: {
    padding: 12,
  },
  playButtonLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  iconButtonTransparent: {
    padding: 12,
  },
  
  // Lyrics Section
  lyricsSection: {
    marginBottom: 32,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    padding: 16,
  },
  lyricsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },


    lyricsSectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  lyricPreview: {
    
  },
  lyricLine: {
    color: COLORS.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  
  // Up Next Section
  upNextSection: {
    marginBottom: 24,
  },
  upNextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  upNextTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  upNextTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: COLORS.cardBackground,
    padding: 8,
    borderRadius: 8,
  },
  upNextTrackImage: {
    width: 48,
    height: 48,
    borderRadius: 4,
    marginRight: 12,
  },
  upNextTrackInfo: {
    flex: 1,
  },
  upNextTrackTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  upNextTrackArtist: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  upNextTrackAction: {
    padding: 8,
  },
  
  // Legacy styles kept for compatibility
  nowPlayingTitle: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  nowPlayingArtist: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  playbackControls: {
    flex: 1,
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
