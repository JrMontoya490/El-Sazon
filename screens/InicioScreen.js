import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import firebaseConfig from '../database/firebase';

export default function InicioScreen({ navigation }) {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);

  const obtenerRecetas = async () => {
    try {
      const snapshot = await firebaseConfig.db.collection('recetas').get();
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecetas(data);
    } catch (error) {
      console.error('Error al obtener recetas:', error);
    } finally {
      setLoading(false);
    }
  };

  // 👇 Se ejecuta cada vez que la pantalla se enfoca
  useFocusEffect(
    useCallback(() => {
      obtenerRecetas();
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Detalle', { receta: item })}
    >
      <Image source={{ uri: item.imagen }} style={styles.imagen} />
      <Text style={styles.nombre}>{item.nombre}</Text>
      <Text style={styles.descripcion}>{item.descripcion}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {recetas.length === 0 ? (
        <Text style={styles.vacio}>No hay recetas aún.</Text>
      ) : (
        <FlatList
          data={recetas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    elevation: 2,
  },
  imagen: { width: '100%', height: 200, borderRadius: 10 },
  nombre: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  descripcion: { fontSize: 14, color: '#666' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  vacio: { textAlign: 'center', marginTop: 50, fontSize: 16, color: 'gray' },
});
