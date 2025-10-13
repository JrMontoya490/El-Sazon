import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import firebaseConfig from '../database/firebase';

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [imagen, setImagen] = useState('');

  const handleRegister = async () => {
    if (!nombre || !usuario || !correo || !password || !imagen) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      const res = await firebaseConfig.firebase.auth().createUserWithEmailAndPassword(correo, password);
      const user = res.user;

      await firebaseConfig.db.collection('usuarios').doc(user.uid).set({ nombre, usuario, correo, imagen });

      Alert.alert('¡Usuario creado!', 'Ahora puedes iniciar sesión');
      navigation.replace('Login');
    } catch (error) {
      console.log('Error al registrar usuario:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#f5f5f5' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Crear cuenta</Text>

        <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
        <TextInput style={styles.input} placeholder="Usuario" value={usuario} onChangeText={setUsuario} />
        <TextInput style={styles.input} placeholder="Correo electrónico" value={correo} onChangeText={setCorreo} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="URL de imagen" value={imagen} onChangeText={setImagen} />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, color: '#FF6347' },
  input: { width: '100%', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  button: { backgroundColor: '#FF6347', width: '100%', paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  link: { color: '#FF6347', fontSize: 16, marginTop: 10 }
});
