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
  }, [params]);

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
      Alert.alert('エラー', '分析に失敗しました。もう一度お試しください。');
      console.error(error);
    } finally {
      setLoading(false);
    }
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>認識結果確認</Text>
        <Text style={styles.subtitle}>内容を確認・修正してください</Text>

        {/* Home Team */}
        <View style={styles.teamCard}>
          <Text style={styles.teamTitle}>ホームチーム</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>チーム名</Text>
            <TextInput
              style={styles.input}
              value={homeTeam.team}
              onChangeText={(text) => handleTeamNameChange('home', text)}
              placeholder="チーム名を入力"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>フォーメーション</Text>
            <TextInput
              style={styles.input}
              value={homeTeam.formation}
              onChangeText={(text) => handleFormationChange('home', text)}
              placeholder="例：4-3-3"
            />
          </View>
          <View style={styles.playersSection}>
            <Text style={styles.label}>スタメン</Text>
            {homeTeam.players.map((player, index) => (
              <View key={index} style={styles.playerRow}>
                <Text style={styles.playerPosition}>{player.position}</Text>
                <TextInput
                  style={styles.playerInput}
                  value={player.name}
                  onChangeText={(text) =>
                    handlePlayerNameChange('home', index, text)
                  }
                  placeholder="選手名"
                />
              </View>
            ))}
          </View>
        </View>

        {/* Away Team */}
        <View style={styles.teamCard}>
          <Text style={styles.teamTitle}>アウェイチーム</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>チーム名</Text>
            <TextInput
              style={styles.input}
              value={awayTeam.team}
              onChangeText={(text) => handleTeamNameChange('away', text)}
              placeholder="チーム名を入力"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>フォーメーション</Text>
            <TextInput
              style={styles.input}
              value={awayTeam.formation}
              onChangeText={(text) => handleFormationChange('away', text)}
              placeholder="例：4-3-3"
            />
          </View>
          <View style={styles.playersSection}>
            <Text style={styles.label}>スタメン</Text>
            {awayTeam.players.map((player, index) => (
              <View key={index} style={styles.playerRow}>
                <Text style={styles.playerPosition}>{player.position}</Text>
                <TextInput
                  style={styles.playerInput}
                  value={player.name}
                  onChangeText={(text) =>
                    handlePlayerNameChange('away', index, text)
                  }
                  placeholder="選手名"
                />
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>戻る</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={handleAnalyze}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.analyzeButtonText}>分析開始</Text>
            )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  teamCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  teamTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  playersSection: {
    marginTop: 16,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  playerPosition: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    width: 50,
  },
  playerInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  backButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  analyzeButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
