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
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const { data, error } = await supabase.storage
      .from('dish.image')
      .upload(`dishes/${fileName}`, decode(base64), {
        contentType: 'image/jpeg', // o 'image/png' si es png
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
 