import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import firebaseConfig from '../database/firebase';

const FavoritosScreen = ({ navigation }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = firebaseConfig.firebase.auth().currentUser;

  useEffect(() => {
    if (!user) return;

    const unsubscribe = firebaseConfig.db
      .collection('usuarios')
      .doc(user.uid)
      .collection('favoritos')
      .onSnapshot((snapshot) => {
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFavoritos(lista);
        setLoading(false);
      }, (error) => {
        console.log('Error al obtener favoritos:', error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Debes iniciar sesión para ver tus favoritos</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6347" />
        <Text>Cargando favoritos...</Text>
      </View>
    );
  }

  if (favoritos.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No tienes recetas favoritas aún</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Detalle', { receta: item })}>
      <View style={styles.card}>
        <Image source={{ uri: item.imagen }} style={styles.imagen} />
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.descripcion} numberOfLines={2}>{item.descripcion}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favoritos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default FavoritosScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imagen: { width: '100%', height: 180, borderRadius: 15 },
  nombre: { fontSize: 20, fontWeight: 'bold', marginTop: 8, color: '#333' },
  descripcion: { fontSize: 14, color: '#555', marginTop: 4 },
});
