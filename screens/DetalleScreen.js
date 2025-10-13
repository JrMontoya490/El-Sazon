import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firebaseConfig from '../database/firebase';

const DetalleScreen = ({ route }) => {
  const { receta } = route.params;
  const user = firebaseConfig.firebase.auth().currentUser;
  const [esFavorito, setEsFavorito] = useState(false);

  useEffect(() => {
    if (!user) return;
    const docRef = firebaseConfig.db
      .collection('usuarios')
      .doc(user.uid)
      .collection('favoritos')
      .doc(receta.id);

    docRef.get().then(doc => setEsFavorito(doc.exists));
  }, []);

  const agregarAFavoritos = async () => {
    if (!user) {
      Alert.alert('Debes iniciar sesión para agregar a favoritos');
      return;
    }

    try {
      await firebaseConfig.db
        .collection('usuarios')
        .doc(user.uid)
        .collection('favoritos')
        .doc(receta.id)
        .set({ ...receta });

      setEsFavorito(true);
      Alert.alert('¡Receta agregada a favoritos!');
    } catch (error) {
      console.log('Error al agregar a favoritos:', error);
      Alert.alert('Error al agregar a favoritos');
    }
  };

  const quitarDeFavoritos = async () => {
    if (!user) return;

    try {
      await firebaseConfig.db
        .collection('usuarios')
        .doc(user.uid)
        .collection('favoritos')
        .doc(receta.id)
        .delete();

      setEsFavorito(false);
      Alert.alert('Receta eliminada de favoritos');
    } catch (error) {
      console.log('Error al eliminar favorito:', error);
      Alert.alert('Error al eliminar favorito');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: receta.imagen }} style={styles.imagen} />
        <Text style={styles.nombre}>{receta.nombre}</Text>
        <Text style={styles.autor}>Autor: {receta.autor}</Text>

        <Text style={styles.titulo}>Ingredientes:</Text>
        {receta.ingredientes.map((ing, index) => (
          <Text key={index} style={styles.texto}>• {ing}</Text>
        ))}

        <Text style={styles.titulo}>Pasos:</Text>
        {receta.pasos.map((paso, index) => (
          <Text key={index} style={styles.texto}>{index + 1}. {paso}</Text>
        ))}

        <View style={styles.infoContainer}>
          <Text style={styles.info}>⏱ Tiempo: {receta.tiempo}</Text>
          <Text style={styles.info}>⭐ Dificultad: {receta.dificultad}</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, esFavorito ? styles.buttonRemove : styles.buttonAdd]}
          onPress={esFavorito ? quitarDeFavoritos : agregarAFavoritos}
        >
          <Text style={styles.buttonText}>
            {esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DetalleScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 15, padding: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  imagen: { width: '100%', height: 250, borderRadius: 15, marginBottom: 15 },
  nombre: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  autor: { fontSize: 16, color: '#777', marginBottom: 15 },
  titulo: { fontSize: 20, fontWeight: 'bold', color: '#FF6347', marginTop: 10, marginBottom: 5 },
  texto: { fontSize: 16, color: '#555', marginBottom: 2 },
  infoContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, marginBottom: 20 },
  info: { fontSize: 16, fontWeight: 'bold', color: '#555' },
  button: { paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  buttonAdd: { backgroundColor: '#FF6347' },
  buttonRemove: { backgroundColor: '#aaa' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
