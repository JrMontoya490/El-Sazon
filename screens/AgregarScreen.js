import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Button, Alert } from 'react-native';
import firebaseConfig from '../database/firebase';

const AgregarScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [autor, setAutor] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [pasos, setPasos] = useState('');
  const [tiempo, setTiempo] = useState('');
  const [dificultad, setDificultad] = useState('');
  const [imagen, setImagen] = useState('');

  const agregarReceta = async () => {
    if (!nombre || !descripcion || !autor || !ingredientes || !pasos || !tiempo || !dificultad || !imagen) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      await firebaseConfig.db.collection('recetas').add({
        nombre,
        descripcion,
        autor,
        ingredientes: ingredientes.split('\n').map(i => i.trim()).filter(i => i), // separa por saltos de línea
        pasos: pasos.split('\n').map(p => p.trim()).filter(p => p), // separa por saltos de línea
        tiempo,
        dificultad,
        imagen,
      });

      Alert.alert('¡Receta agregada!', 'La receta se ha guardado correctamente');

      // Limpiar campos
      setNombre('');
      setDescripcion('');
      setAutor('');
      setIngredientes('');
      setPasos('');
      setTiempo('');
      setDificultad('');
      setImagen('');

      navigation.navigate('InicioMain'); // vuelve a la pantalla de inicio
    } catch (error) {
      console.log('Error al agregar receta:', error);
      Alert.alert('Error', 'No se pudo guardar la receta');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nombre</Text>
      <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

      <Text style={styles.label}>Descripción</Text>
      <TextInput style={styles.input} value={descripcion} onChangeText={setDescripcion} />

      <Text style={styles.label}>Autor</Text>
      <TextInput style={styles.input} value={autor} onChangeText={setAutor} />

      <Text style={styles.label}>Ingredientes (uno por línea)</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={ingredientes}
        onChangeText={setIngredientes}
        multiline
        placeholder="Ej: Masa{enter}Queso{enter}Frijoles"
      />

      <Text style={styles.label}>Pasos (uno por línea)</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={pasos}
        onChangeText={setPasos}
        multiline
        placeholder="Ej: Mezclar ingredientes{enter}Formar bolas{enter}Hornear"
      />

      <Text style={styles.label}>Tiempo de preparación</Text>
      <TextInput style={styles.input} value={tiempo} onChangeText={setTiempo} />

      <Text style={styles.label}>Dificultad</Text>
      <TextInput style={styles.input} value={dificultad} onChangeText={setDificultad} />

      <Text style={styles.label}>URL de imagen</Text>
      <TextInput style={styles.input} value={imagen} onChangeText={setImagen} />

      <Text style={styles.previewTitle}>📄 Vista previa:</Text>
      <View style={styles.preview}>
        <Text style={styles.previewText}>Nombre: {nombre}</Text>
        <Text style={styles.previewText}>Descripción: {descripcion}</Text>
        <Text style={styles.previewText}>Autor: {autor}</Text>
        <Text style={styles.previewText}>Ingredientes:</Text>
        {ingredientes.split('\n').map((i, idx) => i.trim() && <Text key={idx}>• {i.trim()}</Text>)}
        <Text style={styles.previewText}>Pasos:</Text>
        {pasos.split('\n').map((p, idx) => p.trim() && <Text key={idx}>{idx + 1}. {p.trim()}</Text>)}
        <Text style={styles.previewText}>Tiempo: {tiempo}</Text>
        <Text style={styles.previewText}>Dificultad: {dificultad}</Text>
        <Text style={styles.previewText}>Imagen: {imagen}</Text>
      </View>

      <View style={styles.button}>
        <Button title="Agregar Receta" onPress={agregarReceta} />
      </View>
    </ScrollView>
  );
};

export default AgregarScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginTop: 5 },
  multiline: { height: 80, textAlignVertical: 'top' },
  button: { marginTop: 20, marginBottom: 50 },
  previewTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  preview: { backgroundColor: '#f1f1f1', padding: 10, borderRadius: 8 },
  previewText: { fontSize: 14, marginBottom: 2 },
});
