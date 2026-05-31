import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { pickImageFromLibrary, takePhotoWithCamera } from '@/services/imageService';
import { extractFormationFromImage } from '@/services/geminiService';
import { ImageData, TeamFormation } from '@/types';
import { handleError, ErrorCodes } from '@/utils/errorHandler';
import { canAnalyze, getRemainingAnalysisCount, incrementAnalysisCount, getDailyLimit } from '@/services/analysisLimitService';

export default function HomeScreen() {
  const router = useRouter();
  const [homeTeamImage, setHomeTeamImage] = useState<ImageData | null>(null);
  const [awayTeamImage, setAwayTeamImage] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [remainingAnalysis, setRemainingAnalysis] = useState(getDailyLimit());
  const [analysisAllowed, setAnalysisAllowed] = useState(true);

  useEffect(() => {
    const checkAnalysisLimit = async () => {
      const allowed = await canAnalyze();
      const remaining = await getRemainingAnalysisCount();
      setAnalysisAllowed(allowed);
      setRemainingAnalysis(remaining);
    };
    checkAnalysisLimit();
  }, []);

  const handlePickHomeTeamImage = async () => {
    try {
      const image = await pickImageFromLibrary();
      if (image) {
        setHomeTeamImage(image);
      }
    } catch (error) {
      handleError(error, ErrorCodes.IMAGE_SELECTION_FAILED);
    }
  };

  const handleTakeHomeTeamPhoto = async () => {
    try {
      const image = await takePhotoWithCamera();
      if (image) {
        setHomeTeamImage(image);
      }
    } catch (error) {
      handleError(error, ErrorCodes.CAMERA_PERMISSION_DENIED);
    }
  };

  const handlePickAwayTeamImage = async () => {
    try {
      const image = await pickImageFromLibrary();
      if (image) {
        setAwayTeamImage(image);
      }
    } catch (error) {
      handleError(error, ErrorCodes.IMAGE_SELECTION_FAILED);
    }
  };

  const handleTakeAwayTeamPhoto = async () => {
    try {
      const image = await takePhotoWithCamera();
      if (image) {
        setAwayTeamImage(image);
      }
    } catch (error) {
      handleError(error, ErrorCodes.CAMERA_PERMISSION_DENIED);
    }
  };

  const handleAnalyze = async () => {
    if (!homeTeamImage || !awayTeamImage) {
      handleError('両チームの画像を選択してください', ErrorCodes.MISSING_DATA);
      return;
    }

    const allowed = await canAnalyze();
    if (!allowed) {
      handleError('本日の分析回数の上限に達しました。明日以降にお試しください。', ErrorCodes.MISSING_DATA);
      return;
    }

    setLoading(true);
    try {
      const homeFormation = await extractFormationFromImage(homeTeamImage.uri);
      const awayFormation = await extractFormationFromImage(awayTeamImage.uri);

      // Increment analysis count on successful analysis
      await incrementAnalysisCount();
      const remaining = await getRemainingAnalysisCount();
      setRemainingAnalysis(remaining);

      router.push({
        pathname: '/confirmation',
        params: {
          homeTeam: JSON.stringify(homeFormation),
          awayTeam: JSON.stringify(awayFormation),
        },
      });
    } catch (error) {
      handleError(error, ErrorCodes.FORMATION_EXTRACTION_FAILED);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Premium Header */}
        <View style={styles.header}>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>⚽ AI POWERED</Text>
          </View>
          <Text style={styles.title}>サッカーAI予想</Text>
          <Text style={styles.subtitle}>シミュレーション</Text>
          <Text style={styles.description}>
            スタメン画像から試合展開を予測
          </Text>
        </View>

        {/* Home Team Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>1</Text>
            </View>
            <Text style={styles.sectionTitle}>ホームチーム</Text>
          </View>

          {homeTeamImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: homeTeamImage.uri }} style={styles.image} />
              <View style={styles.imageOverlay}>
                <TouchableOpacity
                  style={styles.changeImageButton}
                  onPress={handlePickHomeTeamImage}
                >
                  <Text style={styles.changeImageButtonText}>画像を変更</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.uploadArea}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handlePickHomeTeamImage}
              >
                <Text style={styles.uploadButtonIcon}>📷</Text>
                <Text style={styles.uploadButtonText}>ライブラリから選択</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.uploadButton, styles.uploadButtonSecondary]}
                onPress={handleTakeHomeTeamPhoto}
              >
                <Text style={styles.uploadButtonIcon}>📸</Text>
                <Text style={styles.uploadButtonText}>カメラで撮影</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* VS Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>VS</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Away Team Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>2</Text>
            </View>
            <Text style={styles.sectionTitle}>アウェイチーム</Text>
          </View>

          {awayTeamImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: awayTeamImage.uri }} style={styles.image} />
              <View style={styles.imageOverlay}>
                <TouchableOpacity
                  style={styles.changeImageButton}
                  onPress={handlePickAwayTeamImage}
                >
                  <Text style={styles.changeImageButtonText}>画像を変更</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.uploadArea}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handlePickAwayTeamImage}
              >
                <Text style={styles.uploadButtonIcon}>📷</Text>
                <Text style={styles.uploadButtonText}>ライブラリから選択</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.uploadButton, styles.uploadButtonSecondary]}
                onPress={handleTakeAwayTeamPhoto}
              >
                <Text style={styles.uploadButtonIcon}>📸</Text>
                <Text style={styles.uploadButtonText}>カメラで撮影</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* CTA Button */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={[
              styles.analyzeButton,
              (!homeTeamImage || !awayTeamImage || !analysisAllowed) && styles.analyzeButtonDisabled,
            ]}
            onPress={handleAnalyze}
            disabled={!homeTeamImage || !awayTeamImage || loading || !analysisAllowed}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <>
                <Text style={styles.analyzeButtonText}>試合分析を開始</Text>
                <Text style={styles.analyzeButtonSubtext}>AI予想を見る</Text>
              </>
            )}
          </TouchableOpacity>
          <View style={styles.limitInfoContainer}>
            <Text style={styles.limitInfoText}>
              📊 本日の分析回数: {getDailyLimit() - remainingAnalysis}/{getDailyLimit()}
            </Text>
            <Text style={styles.limitInfoSubtext}>
              残り: {remainingAnalysis}回
            </Text>
          </View>
          <Text style={styles.ctaHint}>
            {!analysisAllowed
              ? '本日の分析回数上限に達しました'
              : !homeTeamImage || !awayTeamImage
              ? '両チームの画像を選択してください'
              : '分析を開始します'}
          </Text>
        </View>
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
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  // Header
  header: {
    marginTop: 24,
    marginBottom: 40,
    alignItems: 'center',
  },
  headerBadge: {
    backgroundColor: Colors.primaryLight2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.accent,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Section
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionBadgeText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  // Upload Area
  uploadArea: {
    gap: 12,
  },
  uploadButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  uploadButtonSecondary: {
    backgroundColor: Colors.accent,
    shadowColor: Colors.accent,
  },
  uploadButtonIcon: {
    fontSize: 20,
  },
  uploadButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },

  // Image Container
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 220,
    backgroundColor: Colors.gray200,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  changeImageButton: {
    backgroundColor: Colors.white,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  changeImageButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },

  // CTA
  ctaContainer: {
    marginTop: 16,
  },
  analyzeButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  analyzeButtonDisabled: {
    backgroundColor: Colors.gray400,
    opacity: 0.6,
    shadowOpacity: 0.1,
  },
  analyzeButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  analyzeButtonSubtext: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    opacity: 0.9,
  },
  ctaHint: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  limitInfoContainer: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.primaryLight2,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  limitInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  limitInfoSubtext: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
});
