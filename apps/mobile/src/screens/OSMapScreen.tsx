import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { tokens } from '@museum/ui';

export default function OSMapScreen({ navigation }: any) {
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapRegion, setMapRegion] = useState({
    latitude: 50.4501, // Киев по умолчанию
    longitude: 30.5234,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    loadCurrentLocation();
  }, []);

  const loadCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const coords = location.coords;
        setCurrentLocation(coords);
        setMapRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    } catch (error) {
      console.error('Error loading location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleConfirm = async () => {
    if (!selectedLocation) {
      Alert.alert('Выберите место', 'Нажмите на карту, чтобы выбрать адрес');
      return;
    }

    Alert.alert(
      'Подтверждение',
      'Использовать выбранное местоположение?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Подтвердить',
          onPress: async () => {
            // Определяем адрес через Nominatim
            await getAddressForLocation(selectedLocation);
          },
        },
      ]
    );
  };

  const getAddressForLocation = async (location: any) => {
    try {
      setIsLoading(true);
      
      // Используем Nominatim API для reverse geocoding
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&accept-language=uk&limit=1`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.display_name) {
        const address = {
          description: data.display_name,
          placeId: `osm_${location.latitude}_${location.longitude}`,
          location: location,
        };
        
        navigation.navigate('Home', { address });
      } else {
        Alert.alert('Ошибка', 'Не удалось определить адрес для этой локации');
      }
    } catch (error: any) {
      console.error('Reverse geocoding error:', error);
      Alert.alert('Ошибка', `Не удалось получить адрес: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    if (!currentLocation) {
      Alert.alert('Ошибка', 'Текущее местоположение недоступно');
      return;
    }

    setSelectedLocation(currentLocation);
    setMapRegion({
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    
    await getAddressForLocation(currentLocation);
  };

  const handleSearchAddress = () => {
    navigation.navigate('AddressSearch');
  };

  if (isLoading && !currentLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={tokens.colors.primary} />
        <Text style={styles.loadingText}>Загрузка карты...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={setMapRegion}
        onPress={handleMapPress}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            pinColor={tokens.colors.primary}
            draggable
            onDragEnd={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
          />
        )}
      </MapView>

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleUseCurrentLocation}>
          <Text style={styles.buttonText}>📍 Моё местоположение</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleSearchAddress}>
          <Text style={styles.buttonText}>🔍 Поиск адреса</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.confirmButton, !selectedLocation && styles.confirmButtonDisabled]}
        onPress={handleConfirm}
        disabled={!selectedLocation}
      >
        <Text style={styles.confirmButtonText}>
          {selectedLocation ? '✓ Подтвердить адрес' : 'Выберите место на карте'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.bg,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.colors.bg,
  },
  loadingText: {
    color: tokens.colors.text,
    marginTop: 16,
    fontSize: 16,
  },
  controlsContainer: {
    position: 'absolute',
    top: 20,
    right: 16,
    gap: 8,
  },
  button: {
    backgroundColor: tokens.colors.bg,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: tokens.colors.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: tokens.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: tokens.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    color: tokens.colors.bg,
    fontSize: 16,
    fontWeight: '700',
  },
});

