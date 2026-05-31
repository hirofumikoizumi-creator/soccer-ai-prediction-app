import React, { useState, useEffect, useRef } from 'react';

import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { AnalysisResult } from '@/types';
import { showInterstitialAd } from '@/services/admobService';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showAd, setShowAd] = useState(true);
  const adShownRef = useRef(false);

  useEffect(() => {
    if (params.result && !adShownRef.current) {
      adShownRef.current = true;
      setResult(JSON.parse(params.result as string));
      // Show ad after result is loaded
      showInterstitialAd().finally(() => {
        setShowAd(false);
      });
    }
  }, [params.result]);

  if (!result) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (showAd) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.adContainer}>
          <Text style={styles.adText}>広告を表示中...</Text>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.adSubText}>少々お待ちください</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.matchTitle}>
            {result.homeTeam.team} vs {result.awayTeam.team}
          </Text>
          <View style={styles.formationRow}>
            <Text style={styles.formation}>{result.homeTeam.formation}</Text>
            <Text style={styles.vs}>vs</Text>
            <Text style={styles.formation}>{result.awayTeam.formation}</Text>
          </View>
        </View>

        {/* Win Probability */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>勝率予測</Text>
          <View style={styles.probabilityContainer}>
            <View style={styles.probabilityItem}>
              <Text style={styles.teamName}>{result.homeTeam.team}</Text>
              <View style={styles.probabilityBar}>
                <View
                  style={[
                    styles.probabilityFill,
                    {
                      width: `${result.homeWinProbability}%`,
                      backgroundColor: Colors.primaryLight,
                    },
                  ]}
                />
              </View>
              <Text style={styles.probability}>
                {result.homeWinProbability}%
              </Text>
            </View>

            <View style={styles.probabilityItem}>
              <Text style={styles.teamName}>引き分け</Text>
              <View style={styles.probabilityBar}>
                <View
                  style={[
                    styles.probabilityFill,
                    {
                      width: `${result.drawProbability}%`,
                      backgroundColor: Colors.gray500,
                    },
                  ]}
                />
              </View>
              <Text style={styles.probability}>{result.drawProbability}%</Text>
            </View>

            <View style={styles.probabilityItem}>
              <Text style={styles.teamName}>{result.awayTeam.team}</Text>
              <View style={styles.probabilityBar}>
                <View
                  style={[
                    styles.probabilityFill,
                    {
                      width: `${result.awayWinProbability}%`,
                      backgroundColor: Colors.accentLight,
                    },
                  ]}
                />
              </View>
              <Text style={styles.probability}>
                {result.awayWinProbability}%
              </Text>
            </View>
          </View>
        </View>

        {/* Predicted Score */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>予想スコア</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.score}>{result.predictedScore}</Text>
          </View>
        </View>

        {/* Match Analysis */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>試合展開予想</Text>
          <Text style={styles.analysisText}>{result.matchAnalysis}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => {
              adShownRef.current = false;
              router.replace('/home');
            }}
          >
            <Text style={styles.homeButtonText}>ホームに戻る</Text>
          </TouchableOpacity>
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
    padding: 16,
    paddingBottom: 32,
  },
  adContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  adText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  adSubText: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  matchTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  formationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  formation: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  vs: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 16,
  },
  probabilityContainer: {
    gap: 16,
  },
  probabilityItem: {
    gap: 8,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  probabilityBar: {
    height: 24,
    backgroundColor: Colors.gray200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  probabilityFill: {
    height: '100%',
    borderRadius: 12,
  },
  probability: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  scoreContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  analysisText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  buttonGroup: {
    marginTop: 24,
  },
  homeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
