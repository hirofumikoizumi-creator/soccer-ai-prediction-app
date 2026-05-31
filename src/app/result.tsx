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

  const getResultEmoji = (prob: number) => {
    if (prob > 50) return '🏆';
    if (prob > 30) return '⚽';
    return '🤝';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerBadge}>📊 分析結果</Text>
          <View style={styles.matchupContainer}>
            <View style={styles.teamBox}>
              <Text style={styles.teamEmoji}>🏠</Text>
              <Text style={styles.teamName}>{result.homeTeam.team}</Text>
              <Text style={styles.formation}>{result.homeTeam.formation}</Text>
            </View>
            <View style={styles.vsContainer}>
              <Text style={styles.vsText}>VS</Text>
            </View>
            <View style={styles.teamBox}>
              <Text style={styles.teamEmoji}>✈️</Text>
              <Text style={styles.teamName}>{result.awayTeam.team}</Text>
              <Text style={styles.formation}>{result.awayTeam.formation}</Text>
            </View>
          </View>
        </View>

        {/* Predicted Score */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>⚽ 予想スコア</Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.score}>{result.predictedScore}</Text>
          </View>
        </View>

        {/* Win Probability */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🎯 勝率予測</Text>
          </View>

          {/* Home Team */}
          <View style={styles.probabilityItem}>
            <View style={styles.probabilityHeader}>
              <Text style={styles.probabilityTeam}>{result.homeTeam.team}</Text>
              <Text style={styles.probabilityPercent}>{result.homeWinProbability}%</Text>
            </View>
            <View style={styles.probabilityBar}>
              <View
                style={[
                  styles.probabilityFill,
                  {
                    width: `${result.homeWinProbability}%`,
                    backgroundColor: Colors.primary,
                  },
                ]}
              />
            </View>
            <Text style={styles.probabilityLabel}>
              {getResultEmoji(result.homeWinProbability)} ホーム勝利
            </Text>
          </View>

          {/* Draw */}
          <View style={styles.probabilityItem}>
            <View style={styles.probabilityHeader}>
              <Text style={styles.probabilityTeam}>引き分け</Text>
              <Text style={styles.probabilityPercent}>{result.drawProbability}%</Text>
            </View>
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
            <Text style={styles.probabilityLabel}>🤝 引き分け</Text>
          </View>

          {/* Away Team */}
          <View style={styles.probabilityItem}>
            <View style={styles.probabilityHeader}>
              <Text style={styles.probabilityTeam}>{result.awayTeam.team}</Text>
              <Text style={styles.probabilityPercent}>{result.awayWinProbability}%</Text>
            </View>
            <View style={styles.probabilityBar}>
              <View
                style={[
                  styles.probabilityFill,
                  {
                    width: `${result.awayWinProbability}%`,
                    backgroundColor: Colors.accent,
                  },
                ]}
              />
            </View>
            <Text style={styles.probabilityLabel}>✈️ アウェイ勝利</Text>
          </View>
        </View>

        {/* Match Analysis */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>💡 試合展開予想</Text>
          </View>
          <Text style={styles.analysisText}>{result.matchAnalysis}</Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => {
            adShownRef.current = false;
            router.replace('/home');
          }}
        >
          <Text style={styles.homeButtonText}>別の試合を分析</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 40,
  },

  // Ad
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

  // Header
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerBadge: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 16,
    backgroundColor: Colors.primaryLight2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  matchupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  teamBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  teamEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  formation: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  vsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  vsText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },

  // Card
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  // Score
  scoreContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: Colors.primaryLight2,
    borderRadius: 12,
  },
  score: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 2,
  },

  // Probability
  probabilityItem: {
    marginBottom: 16,
  },
  probabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  probabilityTeam: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  probabilityPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  probabilityBar: {
    height: 8,
    backgroundColor: Colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  probabilityFill: {
    height: '100%',
    borderRadius: 4,
  },
  probabilityLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },

  // Analysis
  analysisText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textPrimary,
    fontWeight: '500',
  },

  // Button
  homeButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  homeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
