import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import InicioScreen from '../screens/InicioScreen';
import DetalleScreen from '../screens/DetalleScreen';
import UsuarioScreen from '../screens/UsuarioScreen';
import FavoritosScreen from '../screens/FavoritosScreen';
import AgregarScreen from '../screens/AgregarScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack para Inicio
function InicioStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="InicioMain"
        component={InicioScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detalle"
        component={DetalleScreen}
        options={{ title: 'Detalle de la receta' }}
      />
    </Stack.Navigator>
  );
}

// Stack para Favoritos
function FavoritosStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FavoritosMain"
        component={FavoritosScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detalle"
        component={DetalleScreen}
        options={{ title: 'Detalle de la receta' }}
      />
    </Stack.Navigator>
  );
}

export default function TabNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Inicio': iconName = 'home-outline'; break;
            case 'Favoritos': iconName = 'bookmarks-outline'; break;
            case 'Agregar': iconName = 'add-outline'; break;
            case 'Usuario': iconName = 'person-outline'; break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={InicioStackScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Favoritos"
        component={FavoritosStackScreen} // ✅ Usamos el Stack aquí
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Agregar" component={AgregarScreen} />
      <Tab.Screen name="Usuario" component={UsuarioScreen} />
    </Tab.Navigator>
  );
}
