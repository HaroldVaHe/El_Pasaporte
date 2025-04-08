import { View, Text, TouchableOpacity, TextInput, Image, Alert, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import * as ImagePicker from 'expo-image-picker';
import CameraModal from '@/components/CameraModal';
import { addDish } from '@/app/services/CRUD/dishesCRUD';
import { uploadImageToSupabase } from '@/app/services/CRUD/uploadToSupabase';


export default function DishCRUD() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);
  const [isVisible, setIsVisible] = useState(false);
  const [category, setCategory] = useState<'entrada' | 'principal' | 'postre' | 'bebida' | ''>('');

  const handleSave = async () => {
    if (!title || !price || !description || !category) {
      Alert.alert("Error", "Todos los campos son obligatorios, incluyendo la categoría.");
      return;
    }
  
    try {
      let imageUrl = '';
  
      if (image) {
        const fileName = `dish-${Date.now()}.jpg`;
        const url = await uploadImageToSupabase(image, fileName);
        if (!url) {
          Alert.alert("Error", "No se pudo subir la imagen");
          return;
        }
        imageUrl = url;
      }
  
      const newDishId = await addDish(title, parseFloat(price), description, category, imageUrl);
      if (newDishId) {
        Alert.alert("Éxito", "Platillo guardado correctamente.");
        setTitle('');
        setPrice('');
        setDescription('');
        setImage(undefined);
        setCategory('');
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el platillo. Intenta de nuevo.");
      console.error(error);
    }
  };
  

  const handleDelete = () => {
    setTitle('');
    setPrice('');
    setDescription('');
    setImage(undefined);
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {image ? (
        <TouchableOpacity onPress={() => setIsVisible(true)}>
          <Image source={{ uri: image }} style={styles.image} />
        </TouchableOpacity>
      ) : (
        <View style={styles.imageButtonsContainer}>
          <TouchableOpacity onPress={() => setIsVisible(true)} style={styles.cameraButton}>
            <Entypo name="camera" size={28} color="#FFD700" />
            <Text style={styles.cameraText}>Tomar foto</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImageFromGallery} style={styles.cameraButton}>
            <Entypo name="image" size={28} color="#FFD700" />
            <Text style={styles.cameraText}>Desde galería</Text>
          </TouchableOpacity>
        </View>
      )}

      <TextInput
        placeholder="Título"
        placeholderTextColor="#AAA"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Precio"
        placeholderTextColor="#AAA"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Descripción"
        placeholderTextColor="#AAA"
        value={description}
        onChangeText={setDescription}
        multiline
        style={[styles.input, { height: 80 }]}
      />

      <Text style={styles.label}>Categoría:</Text>
      <View style={styles.categoryContainer}>
        {['entrada', 'principal', 'postre', 'bebida'].map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setCategory(cat as any)}
            style={[
              styles.categoryButton,
              category === cat && styles.categoryButtonSelected,
            ]}
          >
            <Text
              style={[
                styles.categoryButtonText,
                category === cat && styles.categoryButtonTextSelected,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Eliminar</Text>
      </TouchableOpacity>

      <CameraModal isVisible={isVisible} setImage={setImage} onClose={() => setIsVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2D',
    padding: 16,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 16,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  cameraButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderColor: '#FFD700',
    borderWidth: 1,
    width: '45%',
  },
  cameraText: {
    color: '#FFD700',
    marginTop: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#2E2E3E',
    color: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  label: {
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 10,
  },
  categoryButton: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  categoryButtonSelected: {
    backgroundColor: '#FFD700',
  },
  categoryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  categoryButtonTextSelected: {
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#FFD700',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#FF4C4C',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
