import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useRef, useState } from 'react';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '@/utils/supabase';

export interface CameraModalProps {
  isVisible: boolean;
  image?: any;
  onClose: () => void;
  setImage: React.Dispatch<React.SetStateAction<string | undefined>>;
}

// ✅ Usa uploadAsync para evitar errores de fetch(uri)
const uploadImage = async (uri: string) => {
  try {
    const fileName = `images/${Date.now()}.jpg`;

    const { data, error } = await supabase.storage
      .from('dish.image')
      .upload(fileName, {
        uri,
        type: 'image/jpeg',
        name: fileName,
      } as any); // cast necesario para evitar error de tipo

    if (error) {
      console.error('❌ Error subiendo la imagen:', error);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('dish.image')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('❌ Error en la subida:', error);
    return null;
  }
};

export default function CameraModal(props: CameraModalProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const flip = () => {
    setFacing(facing === 'back' ? 'front' : 'back');
  };

  const take = async () => {
    if (!cameraRef.current) return;

    const result = await cameraRef.current.takePictureAsync({
      quality: 1,
    });

    if (result?.uri) {
      const uploadedUrl = await uploadImage(result.uri);
      if (uploadedUrl) {
        props.setImage(uploadedUrl);
        props.onClose(); // cerrar el modal
      }
    }
  };

  const open = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      const uploadedUrl = await uploadImage(imageUri);
      if (uploadedUrl) {
        props.setImage(uploadedUrl);
        props.onClose(); // cerrar el modal
      }
    }
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text>Necesitamos permisos para usar la cámara.</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={{ color: '#FFD700' }}>Conceder permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Modal visible={props.isVisible} animationType="slide">
      <View style={{ flex: 1 }}>
        <CameraView
          style={{ flex: 1 }}
          facing={facing}
          ref={cameraRef}
        >
          <View style={styles.controls}>
            <TouchableOpacity onPress={take} style={styles.button}>
              <Text style={styles.buttonText}>📸 Tomar foto</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={open} style={styles.button}>
              <Text style={styles.buttonText}>🖼️ Galería</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={flip} style={styles.button}>
              <Text style={styles.buttonText}>🔄 Voltear</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={props.onClose} style={[styles.button, styles.closeButton]}>
              <Text style={styles.buttonText}>❌ Cerrar</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  controls: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 12,
  },
  button: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeButton: {
    backgroundColor: '#FF4C4C',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1E2D',
  },
});
