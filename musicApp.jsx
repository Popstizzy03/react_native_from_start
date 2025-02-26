import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 10;
const TRACK_CARD_WIDTH = (width - CARD_MARGIN * 4) / 2;

const SpotifyClone = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const soundRef = useRef(null);

  const categories = ['Pop', 'Jazz', 'Rock', 'Country', 'New releases'];

  const playlist = [
    {
      id: 1,
      title: 'Lucid Dreams',
      artist: 'Juice WRLD',
      image: 'https://picsum.photos/310',
      audio: 'https://example.com/song1.mp3',
    },
    {
      id: 1,
      title: 'Black Panther',
      artist: 'Crystal Castles',
      image: 'https://picsum.photos/299',
      audio: 'https://example.com/song1.mp3',
    },
    {
      id: 1,
      title: 'Pausewidth',
      artist: 'Aphex Twin',
      image: 'https://picsum.photos/115',
      audio: 'https://example.com/song1.mp3',
    },
    {
      id: 1,
      title: "Breakup with your girlfriend, I'm bored",
      artist: 'Ariana Grande',
      image: 'https://picsum.photos/208',
      audio: 'https://example.com/song1.mp3',
    },
    {
      id: 1,
      title: "Breakup with your girlfriend, I'm bored",
      artist: 'Ariana Grande',
      image: 'https://picsum.photos/299',
      audio: 'https://example.com/song1.mp3',
    },
    {
      id: 2,
      title: 'Sucker',
      artist: 'Jonas Brothers',
      image: 'https://picsum.photos/399',
      audio: 'https://example.com/song2.mp3',
    },
    {
      id: 3,
      title: 'Señorita',
      artist: 'Shawn Mendes, Camila Cabello',
      image: 'https://picsum.photos/299',
      audio: 'https://example.com/song3.mp3',
    },
    {
      id: 4,
      title: 'Old Town Road',
      artist: 'Lil Nas X, Billy Ray Cyrus',
      image: 'https://picsum.photos/299',
      audio: 'https://example.com/song4.mp3',
    },
    // Add other tracks...
  ];

  const editorsPicks = [
    {
      id: 1,
      title: 'Pressure',
      artist: 'Seyed',
      image: 'https://picsum.photos/201',
    },
    {
      id: 1,
      title: 'Pressure',
      artist: 'Seyed',
      image: 'https://picsum.photos/201',
    },
    {
      id: 2,
      title: 'Anything III',
      artist: 'Marshmello',
      image: 'https://picsum.photos/201',
    },
    {
      id: 3,
      title: 'Memories feat. Fernida',
      artist: 'Marshmello',
      image: 'https://picsum.photos/201',
    },
    // Add other picks...
  ];

  useEffect(() => {
    (async () => {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
    })();
  }, []);

  const loadAudio = async (index) => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }

    const { sound } = await Audio.Sound.createAsync(
      playlist[index].audio,
      { shouldPlay: isPlaying },
      onPlaybackStatusUpdate
    );
    soundRef.current = sound;
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPlaybackPosition(status.positionMillis);
      setPlaybackDuration(status.durationMillis || 0);
      if (status.didJustFinish) {
        nextTrack();
      }
    }
  };

  const togglePlay = async () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
    loadAudio(nextIndex);
  };

  const prevTrack = () => {
    const prevIndex =
      (currentTrackIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrackIndex(prevIndex);
    loadAudio(prevIndex);
  };

  const formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  const renderTrackItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.trackItem}
      onPress={() => {
        setCurrentTrackIndex(index);
        setIsPlaying(true);
        loadAudio(index);
      }}>
      <Image source={{ uri: item.image }} style={styles.trackImage} />
      <Text style={styles.trackTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.trackArtist} numberOfLines={1}>
        {item.artist}
      </Text>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryButton}>
      <Text style={styles.categoryText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>For You</Text>
        <View style={styles.headerRight}>
          <MaterialIcon name="search" size={24} color="white" />
          <Image
            source={{ uri: 'https://picsum.photos/202' }}
            style={styles.profileImage}
          />
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

      {/* Playlist */}
      <Text style={styles.sectionTitle}>For You</Text>
      <FlatList
        data={playlist}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.trackList}
        showsVerticalScrollIndicator={false}
      />

      {/* Now Playing Bar */}
      <View style={styles.nowPlayingBar}>
        <Image
          source={{ uri: playlist[currentTrackIndex].image }}
          style={styles.nowPlayingImage}
        />

        <View style={styles.playbackControls}>
          <Text style={styles.nowPlayingTitle}>
            {playlist[currentTrackIndex].title}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(playbackPosition / playbackDuration) * 100}%`,
                },
              ]}
            />
          </View>
          <View style={styles.timeLabels}>
            <Text style={styles.timeText}>{formatTime(playbackPosition)}</Text>
            <Text style={styles.timeText}>{formatTime(playbackDuration)}</Text>
          </View>
          <View style={styles.controlsRow}>
            <TouchableOpacity onPress={prevTrack}>
              <Icon name="step-backward" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={togglePlay} style={styles.playButton}>
              <Icon
                name={isPlaying ? 'pause' : 'play'}
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={nextTrack}>
              <Icon name="step-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  header: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 200,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  categoriesList: {
    gap: 12,
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#333',
    padding: 10,
    paddingHorizontal: 26,
    borderRadius: 20,
  },
  categoryText: {
    color: 'white',
    fontSize: 14,
    paddingVertical: 15,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  trackList: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  trackItem: {
    width: TRACK_CARD_WIDTH,
    marginBottom: CARD_MARGIN,
  },
  trackImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  trackTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  trackArtist: {
    color: '#b3b3b3',
    fontSize: 12,
  },
  nowPlayingBar: {
    backgroundColor: '#181818',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  nowPlayingImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 16,
  },
  playbackControls: {
    flex: 1,
  },
  nowPlayingTitle: {
    color: 'white',
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#404040',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1db954',
    borderRadius: 2,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeText: {
    color: '#b3b3b3',
    fontSize: 10,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  playButton: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 12,
  },
});

export default SpotifyClone;
