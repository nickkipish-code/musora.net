import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Navigation from './src/navigation';
import { ordersStorage } from './src/storage/ordersStorage';

export default function App() {
  useEffect(() => {
    // Инициализируем хранилище при запуске приложения
    ordersStorage.init();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Navigation />
    </View>
  );
}


