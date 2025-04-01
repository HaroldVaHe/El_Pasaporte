import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import React, { useState } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import CameraModal from '@/components/CameraModal';

export default function DishCRUD() {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<string | undefined>(undefined);
    const [isVisible, setIsVisible] = useState(false);

    const handleSave = () => {
        // Lógica para guardar el plato
        console.log({ title, price, description, image });
    };

    const handleDelete = () => {
        // Lógica para eliminar el plato
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
                <TouchableOpacity onPress={() => setIsVisible(true)}>
                    <Entypo name="camera" size={24} color="white" />
                </TouchableOpacity>
            )}

            {/* Campos de entrada */}
            <TextInput 
                placeholder="Título" 
                value={title} 
                onChangeText={setTitle} 
                style={{ borderBottomWidth: 1, marginBottom: 10 , color: '#FFF'}} 
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

            {/* Modal de Cámara */}
            <CameraModal isVisible={isVisible} setImage={setImage} onClose={() => setIsVisible(false)} />
        </View>
    );
}
