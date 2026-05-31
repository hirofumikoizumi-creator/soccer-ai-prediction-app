import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { pickImageFromLibrary, takePhotoWithCamera } from '@/services/imageService';
import { extractFormationFromImage } from '@/services/geminiService';
import { ImageData, TeamFormation } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const [homeTeamImage, setHomeTeamImage] = useState<ImageData | null>(null);
  const [awayTeamImage, setAwayTeamImage] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePickHomeTeamImage = async () => {
    try {
      const image = await pickImageFromLibrary();
      if (image) {
        setHomeTeamImage(image);
      }
    } catch (error) {
      Alert.alert('エラー', 'ホームチームの画像を取得できませんでした');
    }
  };

  const handleTakeHomeTeamPhoto = async () => {
    try {
      const image = await takePhotoWithCamera();
      if (image) {
        setHomeTeamImage(image);
      }
    } catch (error) {
      Alert.alert('エラー', 'カメラを起動できませんでした');
    }
  };

  const handlePickAwayTeamImage = async () => {
    try {
      const image = await pickImageFromLibrary();
      if (image) {
        setAwayTeamImage(image);
      }
    } catch (error) {
      Alert.alert('エラー', 'アウェイチームの画像を取得できませんでした');
    }
  };

  const handleTakeAwayTeamPhoto = async () => {
    try {
      const image = await takePhotoWithCamera();
      if (image) {
        setAwayTeamImage(image);
      }
    } catch (error) {
      Alert.alert('エラー', 'カメラを起動できませんでした');
    }
  };

  const handleAnalyze = async () => {
    if (!homeTeamImage || !awayTeamImage) {
      Alert.alert('エラー', '両チームの画像を選択してください');
      return;
    }

    setLoading(true);
    try {
      // Extract formations from both images
      const homeFormation = await extractFormationFromImage(homeTeamImage.uri);
      const awayFormation = await extractFormationFromImage(awayTeamImage.uri);

      // Navigate to confirmation screen
      router.push({
        pathname: '/confirmation',
        params: {
          homeTeam: JSON.stringify(homeFormation),
          awayTeam: JSON.stringify(awayFormation),
        },
      });
    } catch (error) {
      Alert.alert('エラー', 'AIが認識できませんでした。手入力で修正してください。');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>サッカーAI予想</Text>
          <Text style={styles.subtitle}>スタメン画像から試合展開を予測</Text>
        </View>

        {/* Home Team Section */}
        <View style={styles.teamSection}>
          <Text style={styles.teamLabel}>ホームチーム</Text>
          {homeTeamImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: homeTeamImage.uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.changeButton}
                onPress={handlePickHomeTeamImage}
              >
                <Text style={styles.changeButtonText}>画像を変更</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imageUploadArea}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handlePickHomeTeamImage}
              >
                <Text style={styles.uploadButtonText}>📷 ライブラリから選択</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.uploadButton, styles.cameraButton]}
                onPress={handleTakeHomeTeamPhoto}
              >
                <Text style={styles.uploadButtonText}>📸 カメラで撮影</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Away Team Section */}
        <View style={styles.teamSection}>
          <Text style={styles.teamLabel}>アウェイチーム</Text>
          {awayTeamImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: awayTeamImage.uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.changeButton}
                onPress={handlePickAwayTeamImage}
              >
                <Text style={styles.changeButtonText}>画像を変更</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imageUploadArea}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handlePickAwayTeamImage}
              >
                <Text style={styles.uploadButtonText}>📷 ライブラリから選択</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.uploadButton, styles.cameraButton]}
                onPress={handleTakeAwayTeamPhoto}
              >
                <Text style={styles.uploadButtonText}>📸 カメラで撮影</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Analyze Button */}
        <TouchableOpacity
          style={[
            styles.analyzeButton,
            (!homeTeamImage || !awayTeamImage) && styles.analyzeButtonDisabled,
          ]}
          onPress={handleAnalyze}
          disabled={!homeTeamImage || !awayTeamImage || loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} size="large" />
          ) : (
            <Text style={styles.analyzeButtonText}>分析開始</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  teamSection: {
    marginBottom: 24,
  },
  teamLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  imageUploadArea: {
    gap: 12,
  },
  uploadButton: {
    backgroundColor: Colors.primaryLight,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    backgroundColor: Colors.accentLight,
  },
  uploadButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: Colors.gray200,
  },
  changeButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.gray300,
    borderRadius: 8,
    alignItems: 'center',
  },
  changeButtonText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  analyzeButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  analyzeButtonDisabled: {
    backgroundColor: Colors.gray400,
    opacity: 0.6,
  },
  analyzeButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
});
