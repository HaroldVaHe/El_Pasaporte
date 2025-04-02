import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/utils/supabase';

 export interface CameraModalProps {
    isVisible: boolean;
    image?: any;
    onClose: () => void;
    setImage: React.Dispatch<React.SetStateAction<string | undefined>>;
}
const uploadImage = async (uri: string) => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();

        const fileName = `images/${Date.now()}.jpg`;

        const { data, error } = await supabase.storage
            .from('dish.image') // Reemplaza con el nombre de tu bucket en Supabase
            .upload(fileName, blob, {
                contentType: 'image/jpeg',
            });

        if (error) {
            console.error('Error subiendo la imagen:', error);
            return;
        }

        console.log('Imagen subida:', data);
    } catch (error) {
        console.error('Error en la subida:', error);
    }
};
export default function CameraModal(props: CameraModalProps) {

    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);

    const flip = async () => {
        setFacing(facing === 'back' ? 'front' : 'back');
    }

    const take = async () => {
        if (!cameraRef.current) return;
    
        let result = await cameraRef.current.takePictureAsync({
            quality: 1,
            base64: true,
        });
    
        if (result) {
            await uploadImage(result.uri);
        }
    };
    
    const open = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.canceled && result.assets.length > 0) {
            await uploadImage(result.assets[0].uri);
        }
    };
    

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={{
                flex: 1
            }}>
                <Text >We need your permission to show the camera</Text>
            </View>
        );
    }

    return (
        <Modal
            visible={props.isVisible}
        >
            <View
                style={{
                    flex: 1
                }}
            >
                <CameraView style={{
                    flex: 1
                }}
                    facing={facing}
                    ref={cameraRef}
                >
                    <View style={{
                        flexDirection: "row"
                    }}>
                        <TouchableOpacity onPress={take}>
                        <Text>Take a photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={open}
                        >
                            <Text>Open Library</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={flip}
                        >
                            <Text>Flip camera</Text>
                        </TouchableOpacity>
                        {/* Take a photo */}
                        {/* Open Library */}
                        {/* Flip camera */}
                    </View>
                </CameraView>
            </View>
        </Modal>
    )
}