import * as ImagePicker from 'expo-image-picker';
import { ImageData } from '@/types';

/**
 * Request camera permissions
 */
export async function requestCameraPermissions(): Promise<boolean> {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting camera permissions:', error);
    return false;
  }
}

/**
 * Request media library permissions
 */
export async function requestMediaLibraryPermissions(): Promise<boolean> {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting media library permissions:', error);
    return false;
  }
}

/**
 * Pick image from library with error handling
 */
export async function pickImageFromLibrary(): Promise<ImageData | null> {
  try {
    const hasPermission = await requestMediaLibraryPermissions();
    if (!hasPermission) {
      throw new Error('Media library permission denied');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8, // Reduce quality to prevent memory issues
    });

    if (result.canceled) {
      return null;
    }

    const asset = result.assets[0];
    
    if (!asset.uri) {
      throw new Error('Image URI is missing');
    }

    return {
      uri: asset.uri,
      type: asset.type || 'image',
      name: asset.fileName || 'image.jpg',
    };
  } catch (error) {
    console.error('Error picking image from library:', error);
    throw error;
  }
}

/**
 * Take photo with camera with error handling
 */
export async function takePhotoWithCamera(): Promise<ImageData | null> {
  try {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) {
      throw new Error('Camera permission denied');
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8, // Reduce quality to prevent memory issues
    });

    if (result.canceled) {
      return null;
    }

    const asset = result.assets[0];
    
    if (!asset.uri) {
      throw new Error('Image URI is missing');
    }

    return {
      uri: asset.uri,
      type: asset.type || 'image',
      name: asset.fileName || 'photo.jpg',
    };
  } catch (error) {
    console.error('Error taking photo:', error);
    throw error;
  }
}
