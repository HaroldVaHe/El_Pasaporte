import { supabase } from '@/utils/supabase';
import 'react-native-url-polyfill/auto';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';

export const uploadImageToSupabase = async (
  uri: string,
  fileName: string
): Promise<string | null> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const { data, error } = await supabase.storage
      .from('dish.image')
      .upload(`dishes/${fileName}`, blob, {
        contentType: blob.type,
        upsert: true,
      });

    if (error) {
      console.error('Error al subir imagen:', error);
      return null;
    }

    const { data: publicURL } = supabase
      .storage
      .from('dish.image')
      .getPublicUrl(`dishes/${fileName}`);

    return publicURL?.publicUrl || null;
  } catch (e) {
    console.error('Error general al subir imagen:', e);
    return null;
  }
};

