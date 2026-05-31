import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { TeamFormation } from '@/types';
import { analyzeMatch } from '@/services/geminiService';

export default function ConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [homeTeam, setHomeTeam] = useState<TeamFormation | null>(null);
  const [awayTeam, setAwayTeam] = useState<TeamFormation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.homeTeam && params.awayTeam) {
      setHomeTeam(JSON.parse(params.homeTeam as string));
      setAwayTeam(JSON.parse(params.awayTeam as string));
    }
  }, [params.homeTeam, params.awayTeam]);

  const handleTeamNameChange = (team: 'home' | 'away', name: string) => {
    if (team === 'home' && homeTeam) {
      setHomeTeam({ ...homeTeam, team: name });
    } else if (team === 'away' && awayTeam) {
      setAwayTeam({ ...awayTeam, team: name });
    }
  };

  const handleFormationChange = (team: 'home' | 'away', formation: string) => {
    if (team === 'home' && homeTeam) {
      setHomeTeam({ ...homeTeam, formation });
    } else if (team === 'away' && awayTeam) {
      setAwayTeam({ ...awayTeam, formation });
    }
  };

  const handlePlayerNameChange = (
    team: 'home' | 'away',
    playerIndex: number,
    name: string
  ) => {
    if (team === 'home' && homeTeam) {
      const updatedPlayers = [...homeTeam.players];
      updatedPlayers[playerIndex] = { ...updatedPlayers[playerIndex], name };
      setHomeTeam({ ...homeTeam, players: updatedPlayers });
    } else if (team === 'away' && awayTeam) {
      const updatedPlayers = [...awayTeam.players];
      updatedPlayers[playerIndex] = { ...updatedPlayers[playerIndex], name };
      setAwayTeam({ ...awayTeam, players: updatedPlayers });
    }
  };

  const handleAnalyze = async () => {
    if (!homeTeam || !awayTeam) {
      Alert.alert('エラー', 'チーム情報が不完全です');
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeMatch(homeTeam, awayTeam);
      router.push({
        pathname: '/result',
        params: {
          result: JSON.stringify(result),
        },
      });
    } catch (error) {
      Alert.alert('エラー', '試合分析に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (!homeTeam || !awayTeam) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerBadge}>✏️ 認識結果を確認</Text>
          <Text style={styles.headerTitle}>AIが認識した情報を編集できます</Text>
        </View>

        {/* Home Team */}
        <View style={styles.teamSection}>
          <View style={styles.teamSectionHeader}>
            <Text style={styles.teamSectionBadge}>🏠</Text>
            <Text style={styles.teamSectionTitle}>ホームチーム</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>チーム名</Text>
            <TextInput
              style={styles.input}
              value={homeTeam.team}
              onChangeText={(text) => handleTeamNameChange('home', text)}
              placeholder="チーム名を入力"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>フォーメーション</Text>
            <TextInput
              style={styles.input}
              value={homeTeam.formation}
              onChangeText={(text) => handleFormationChange('home', text)}
              placeholder="例: 4-3-3"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>スタメン</Text>
            {homeTeam.players.map((player, index) => (
              <View key={index} style={styles.playerInputContainer}>
                <Text style={styles.playerPosition}>{player.position}</Text>
                <TextInput
                  style={styles.playerInput}
                  value={player.name}
                  onChangeText={(text) => handlePlayerNameChange('home', index, text)}
                  placeholder="選手名"
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Away Team */}
        <View style={styles.teamSection}>
          <View style={styles.teamSectionHeader}>
            <Text style={styles.teamSectionBadge}>✈️</Text>
            <Text style={styles.teamSectionTitle}>アウェイチーム</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>チーム名</Text>
            <TextInput
              style={styles.input}
              value={awayTeam.team}
              onChangeText={(text) => handleTeamNameChange('away', text)}
              placeholder="チーム名を入力"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>フォーメーション</Text>
            <TextInput
              style={styles.input}
              value={awayTeam.formation}
              onChangeText={(text) => handleFormationChange('away', text)}
              placeholder="例: 4-2-3-1"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>スタメン</Text>
            {awayTeam.players.map((player, index) => (
              <View key={index} style={styles.playerInputContainer}>
                <Text style={styles.playerPosition}>{player.position}</Text>
                <TextInput
                  style={styles.playerInput}
                  value={player.name}
                  onChangeText={(text) => handlePlayerNameChange('away', index, text)}
                  placeholder="選手名"
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={handleAnalyze}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.analyzeButtonText}>試合分析を開始</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            disabled={loading}
          >
            <Text style={styles.backButtonText}>戻る</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 40,
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
    marginBottom: 12,
    backgroundColor: Colors.primaryLight2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  // Team Section
  teamSection: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  teamSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  teamSectionBadge: {
    fontSize: 24,
    marginRight: 12,
  },
  teamSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  // Form Group
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },

  // Player Input
  playerInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  playerPosition: {
    width: 50,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'center',
  },
  playerInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 24,
  },

  // Buttons
  buttonGroup: {
    gap: 12,
    marginTop: 24,
  },
  analyzeButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  analyzeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  backButton: {
    backgroundColor: Colors.surface,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
