import { View, Text, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import CameraModal from '@/components/CameraModal';
import { addDish } from '@/app/services/CRUD/dishesCRUD'; // Importamos la función para guardar en Firebase

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
            const newDishId = await addDish(title, parseFloat(price), description, category);
            if (newDishId) {
                Alert.alert("Éxito", "Platillo guardado correctamente.");
                setTitle('');
                setPrice('');
                setDescription('');
                setImage(undefined);
                setCategory(''); // ¡Resetea también la categoría!
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

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: '#1E1E2D' }}>
            {/* Imagen del Plato */}
            {image ? (
                <TouchableOpacity onPress={() => setIsVisible(true)}>
                    <Image source={{ uri: image }} style={{ width: 100, height: 100, marginBottom: 10 }} />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={() => setIsVisible(true)} style={{ alignItems: 'center' }}>
                    <Entypo name="camera" size={24} color="white" />
                </TouchableOpacity>
            )}

            {/* Campos de entrada */}
            <TextInput 
                placeholder="Título" 
                value={title} 
                onChangeText={setTitle} 
                style={{ borderBottomWidth: 1, marginBottom: 10, color: '#FFF' }} 
            />
            <TextInput 
                placeholder="Precio" 
                value={price} 
                onChangeText={setPrice} 
                keyboardType="numeric" 
                style={{ borderBottomWidth: 1, marginBottom: 10, color: '#FFF' }} 
            />
            <TextInput 
                placeholder="Descripción" 
                value={description} 
                onChangeText={setDescription} 
                multiline 
                style={{ borderBottomWidth: 1, marginBottom: 10, color: '#FFF' }} 
            />

            {/* Botones */}
            <TouchableOpacity onPress={handleSave} style={{ backgroundColor: 'green', padding: 10, marginBottom: 10 }}>
                <Text style={{ color: 'white', textAlign: 'center' }}>Guardar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleDelete} style={{ backgroundColor: 'red', padding: 10 }}>
                <Text style={{ color: 'white', textAlign: 'center' }}>Eliminar</Text>
            </TouchableOpacity>
            <Text style={{ color: '#FFF', marginBottom: 5 }}>Categoría:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 }}>
            {['entrada', 'principal', 'postre', 'bebida'].map((cat) => (
                <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat as any)}
                style={{
                    backgroundColor: category === cat ? '#4CAF50' : '#333',
                    padding: 10,
                    borderRadius: 5,
                    marginRight: 10,
                    marginBottom: 10
                }}
                >
                <Text style={{ color: '#FFF' }}>{cat}</Text>
                </TouchableOpacity>
            ))}
            </View>
            {/* Modal de Cámara */}
            <CameraModal isVisible={isVisible} setImage={setImage} onClose={() => setIsVisible(false)} />
        </View>
        
        
    );
    
}
