import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import firebaseConfig from '../database/firebase';

export default function UsuarioScreen({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = firebaseConfig.firebase.auth().currentUser;

  useEffect(() => {
    if (!user) return;

    const docRef = firebaseConfig.db.collection('usuarios').doc(user.uid);
    const unsubscribe = docRef.onSnapshot((doc) => {
      if (doc.exists) {
        setUsuario(doc.data());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    firebaseConfig.firebase.auth().signOut()
      .then(() => {
        navigation.replace('Login');
      });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {usuario && (
        <View style={styles.card}>
          <Image source={{ uri: usuario.imagen }} style={styles.imagen} />
          <Text style={styles.nombre}>{usuario.nombre}</Text>
          <Text style={styles.usuario}>@{usuario.usuario}</Text>
          <Text style={styles.correo}>{usuario.correo}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 30
  },
  imagen: { width: 120, height: 120, borderRadius: 60, marginBottom: 15 },
  nombre: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  usuario: { fontSize: 18, color: '#777', marginBottom: 5 },
  correo: { fontSize: 16, color: '#555' },
  button: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 2
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
