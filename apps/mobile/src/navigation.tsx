import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { tokens } from '@museum/ui';
import HomeScreen from './screens/HomeScreen';
import CreateOrderScreen from './screens/CreateOrderScreen';
import MapScreen from './screens/MapScreen';
import OSMapScreen from './screens/OSMapScreen';
import PaymentScreen from './screens/PaymentScreen';
import CourierModeScreen from './screens/CourierModeScreen';
import AddressSearchScreen from './screens/AddressSearchScreen';
import OrdersHistoryScreen from './screens/OrdersHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import OrderDetailScreen from './screens/OrderDetailScreen';
import RateOrderScreen from './screens/RateOrderScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tokens.colors.surface,
          borderTopColor: tokens.colors.divider,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarActiveTintColor: tokens.colors.primary,
        tabBarInactiveTintColor: tokens.colors.muted,
      }}
    >
      <Tab.Screen 
        name="CustomerStack" 
        options={{
          title: 'Клиент',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
        }}
      >
        {() => (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="CreateOrder" component={CreateOrderScreen} />
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="OSMap" component={OSMapScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="AddressSearch" component={AddressSearchScreen} />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen 
        name="CourierStack" 
        options={{
          title: 'Курьер',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🚚</Text>,
        }}
      >
        {() => (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Courier" component={CourierModeScreen} />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen 
        name="ProfileStack" 
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
        }}
      >
        {() => (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="OrdersHistory" component={OrdersHistoryScreen} />
            <Stack.Screen name="OrderDetails" component={OrderDetailScreen} />
            <Stack.Screen name="RateOrder" component={RateOrderScreen} />
          </Stack.Navigator>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}


