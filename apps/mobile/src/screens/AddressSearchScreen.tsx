import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { tokens } from '@museum/ui';
import { searchAddress, reverseGeocode, NominatimSearchResult } from '../utils/nominatim';

export default function AddressSearchScreen({ navigation }: any) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  useEffect(() => {
    // Запросить текущее местоположение при загрузке
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.error('Location error:', error);
    }
  };

  async function search(text: string) {
    setQ(text);
    if (!text) {
      setResults([]);
      return;
    }
    
    setIsSearching(true);
    
    try {
      const data = await searchAddress(text);
      setResults(data);
    } catch (e) {
      console.error('Search error:', e);
      Alert.alert('Ошибка', 'Не удалось подключиться к сервису поиска.');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  const handleSelectAddress = (item: NominatimSearchResult) => {
    setSelectedAddress({ description: item.display_name, placeId: item.place_id.toString() });
    Alert.alert(
      'Адрес выбран',
      `Выберите адрес: ${item.display_name}?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Выбрать',
          onPress: () => {
            navigation.navigate('Home', { 
              address: { 
                description: item.display_name, 
                placeId: item.place_id.toString(),
                location: { latitude: parseFloat(item.lat), longitude: parseFloat(item.lon) }
              } 
            });
          },
        },
      ]
    );
  };

  const useCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Необходимо разрешение на использование геолокации');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      console.log('Location obtained:', latitude, longitude);

      // Используем Nominatim reverse geocoding для получения адреса
      const result = await reverseGeocode(latitude, longitude);
      
      if (result && result.display_name) {
        const address = {
          description: result.display_name,
          placeId: result.place_id.toString(),
          location: { latitude, longitude }
        };
        console.log('Address determined:', address.description);
        navigation.navigate('Home', { address });
      } else {
        console.warn('No address found for location:', latitude, longitude);
        Alert.alert('Адрес не найден', 'К сожалению, не удалось определить адрес для этого местоположения. Попробуйте выбрать адрес вручную.');
      }
    } catch (error: any) {
      console.error('Location error:', error);
      Alert.alert('Ошибка', `Не удалось получить текущее местоположение: ${error.message || 'Неизвестная ошибка'}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Поиск адреса</Text>
        <Text style={styles.headerSubtitle}>Введите адрес или используйте геолокацию</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          value={q}
          onChangeText={search}
          placeholder="Введите адрес..."
          placeholderTextColor={tokens.colors.muted}
          style={styles.input}
          autoFocus
        />
        <TouchableOpacity style={styles.locationButton} onPress={useCurrentLocation}>
          <Text style={styles.locationButtonText}>📍 Мое местоположение</Text>
        </TouchableOpacity>
      </View>

      {isSearching && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Поиск...</Text>
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(i) => i.place_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelectAddress(item)}
            style={styles.resultItem}
          >
            <Text style={styles.resultIcon}>📍</Text>
            <View style={styles.resultContent}>
              <Text style={styles.resultMainText}>{item.display_name}</Text>
            </View>
            <Text style={styles.resultArrow}>›</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          q ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Адреса не найдены</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.bg,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.divider,
  },
  headerTitle: {
    color: tokens.colors.primary,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: tokens.colors.muted,
    fontSize: 14,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.divider,
  },
  input: {
    backgroundColor: tokens.colors.surface,
    color: tokens.colors.text,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: tokens.colors.divider,
    marginBottom: 12,
  },
  locationButton: {
    backgroundColor: tokens.colors.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  locationButtonText: {
    color: tokens.colors.bg,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    color: tokens.colors.muted,
    fontSize: 14,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.divider,
    backgroundColor: tokens.colors.bg,
  },
  resultIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  resultContent: {
    flex: 1,
  },
  resultArrow: {
    color: tokens.colors.muted,
    fontSize: 24,
    marginLeft: 12,
  },
  resultMainText: {
    color: tokens.colors.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  resultSecondaryText: {
    color: tokens.colors.muted,
    fontSize: 14,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: tokens.colors.muted,
    fontSize: 16,
  },
});


