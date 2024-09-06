import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const SpotifyClone = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);

  const categories = useMemo(
    () => ['Pop', 'Jazz', 'Rock', 'Country', 'New releases'],
    []
  );

  const playlist = useMemo(
    () => [
      {
        id: 1,
        title: "Breakup with your girlfriend, I'm bored",
        artist: 'Ariana Grande',
        image: '/api/placeholder/60/60',
        audio: 'https://example.com/song1.mp3',
      },
      {
        id: 2,
        title: 'Sucker',
        artist: 'Jonas Brothers',
        image: '/api/placeholder/60/60',
        audio: 'https://example.com/song2.mp3',
      },
      {
        id: 3,
        title: 'Señorita',
        artist: 'Shawn Mendes, Camila Cabello',
        image: '/api/placeholder/60/60',
        audio: 'https://example.com/song3.mp3',
      },
      {
        id: 4,
        title: 'Old Town Road',
        artist: 'Lil Nas X, Billy Ray Cyrus',
        image: '/api/placeholder/60/60',
        audio: 'https://example.com/song4.mp3',
      },
    ],
    []
  );

  const editorsPicks = useMemo(
    () => [
      {
        id: 1,
        title: 'Pressure',
        artist: 'Seyed',
        image: '/api/placeholder/150/150',
      },
      {
        id: 2,
        title: 'Anything III',
        artist: 'Marshmello',
        image: '/api/placeholder/150/150',
      },
      {
        id: 3,
        title: 'Memories feat. Fernida',
        artist: 'Marshmello',
        image: '/api/placeholder/150/150',
      },
      { id: 4, title: 'Tropical Hits', image: '/api/placeholder/150/150' },
      { id: 5, title: 'Late Night Vibes', image: '/api/placeholder/150/150' },
      { id: 6, title: 'Jukebox Joint', image: '/api/placeholder/150/150' },
    ],
    []
  );

  useEffect(() => {
    if (typeof Audio !== 'undefined') {
      audioRef.current = new Audio(playlist[currentTrackIndex].audio);
    }
  }, [playlist, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = playlist[currentTrackIndex].audio;
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((error) => console.error('Audio playback failed', error));
      }
    }
  }, [currentTrackIndex, isPlaying, playlist]);

  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .catch((error) => console.error('Audio playback failed', error));
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  }, [playlist.length]);

  const prevTrack = useCallback(() => {
    setCurrentTrackIndex(
      (prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length
    );
  }, [playlist.length]);

  return (
    <View style={{ flex: 1, backgroundColor: 'black', padding: 10 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 10,
          paddingHorizontal: 20,
          backgroundColor: '#1C1C1C',
        }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>For You</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ position: 'relative', marginRight: 20 }}>
            <MaterialIcon
              name="search"
              size={24}
              color="gray"
              style={{ position: 'absolute', left: 10, top: 12 }}
            />
            <TextInput
              placeholder="Search Album, Artist, Playlists"
              placeholderTextColor="gray"
              style={{
                backgroundColor: '#333',
                borderRadius: 20,
                paddingVertical: 10,
                paddingLeft: 40,
                paddingRight: 20,
                color: 'white',
                width: 250,
              }}
            />
          </View>
          <MaterialIcon name="settings" size={24} color="gray" />
          <Image
            source={{ uri: '/api/placeholder/32/32' }}
            style={{ width: 32, height: 32, borderRadius: 16, marginLeft: 20 }}
          />
        </View>
      </View>

      {/* Categories */}
      <ScrollView horizontal style={{ flexDirection: 'row', marginVertical: 10 }}>
        {categories.map((category) => (
          <Text
            key={category}
            style={{
              fontSize: 14,
              color: 'white',
              marginRight: 20,
            }}>
            {category}
          </Text>
        ))}
      </ScrollView>

      {/* Playlists */}
      <ScrollView style={{ flex: 1 }}>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
            For You
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {playlist.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#333',
                  borderRadius: 8,
                  padding: 10,
                  marginBottom: 10,
                  marginRight: 10,
                }}
                onPress={() => {
                  setCurrentTrackIndex(index);
                  setIsPlaying(true);
                }}>
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 48, height: 48, borderRadius: 8, marginRight: 10 }}
                />
                <View>
                  <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 4 }}>
                    {item.title}
                  </Text>
                  <Text style={{ color: 'gray' }}>{item.artist}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Editor's Picks */}
        <View>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
            Editor's Picks
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {editorsPicks.map((item) => (
              <View
                key={item.id}
                style={{
                  backgroundColor: '#333',
                  borderRadius: 8,
                  padding: 10,
                  marginBottom: 10,
                  marginRight: 10,
                }}>
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 100, height: 100, borderRadius: 8, marginBottom: 10 }}
                />
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{item.title}</Text>
                {item.artist && <Text style={{ color: 'gray' }}>{item.artist}</Text>}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Now Playing */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#1C1C1C',
          padding: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: playlist[currentTrackIndex].image }}
            style={{ width: 48, height: 48, borderRadius: 8, marginRight: 10 }}
          />
          <View>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              {playlist[currentTrackIndex].title}
            </Text>
            <Text style={{ color: 'gray' }}>{playlist[currentTrackIndex].artist}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={prevTrack}>
            <Icon name="step-backward" size={24} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePlay} style={{ marginHorizontal: 20 }}>
            {isPlaying ? (
              <Icon name="pause" size={24} color="white" />
            ) : (
              <Icon name="play" size={24} color="white" />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={nextTrack}>
            <Icon name="step-forward" size={24} color="gray" />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="volume-up" size={24} color="gray" style={{ marginRight: 10 }} />
          <View
            style={{
              width: 100,
              height: 4,
              backgroundColor: '#555',
              borderRadius: 2,
              overflow: 'hidden',
            }}>
            <View style={{ width: '75%', height: '100%', backgroundColor: 'white' }} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default SpotifyClone;
