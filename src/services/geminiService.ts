import axios from 'axios';
import { TeamFormation, AnalysisResult } from '@/types';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

/**
 * Extract formation and player information from an image
 */
export async function extractFormationFromImage(imageUri: string): Promise<TeamFormation> {
  try {
    // Convert image to base64
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const base64 = await blobToBase64(blob);

    const prompt = `
    この画像からサッカーのスタメン/フォーメーション情報を抽出してください。
    以下の情報をJSON形式で返してください：
    {
      "team": "チーム名",
      "formation": "フォーメーション（例：4-3-3）",
      "players": [
        {"name": "選手名", "position": "ポジション"},
        ...
      ]
    }
    
    注意事項：
    - 画像はスクリーンショット、テレビ撮影、スタジアム撮影の可能性があります
    - 多少のノイズや傾きがあっても、できる限りフォーメーションと選手名を抽出してください
    - チーム名が不明な場合は"Unknown"と記入してください
    - フォーメーションが不明な場合は"Unknown"と記入してください
    - JSONのみを返してください。説明文は不要です。
    `;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: base64,
              },
            },
          ],
        },
      ],
    };

    const result = await axios.post<GeminiResponse>(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      requestBody
    );

    const responseText = result.data.candidates[0].content.parts[0].text;
    
    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse formation data from response');
    }

    const formationData = JSON.parse(jsonMatch[0]);
    
    return {
      team: formationData.team || 'Unknown',
      formation: formationData.formation || 'Unknown',
      players: formationData.players || [],
    };
  } catch (error) {
    console.error('Error extracting formation:', error);
    throw error;
  }
}

/**
 * Analyze match based on both teams' formations
 */
export async function analyzeMatch(
  homeTeam: TeamFormation,
  awayTeam: TeamFormation
): Promise<AnalysisResult> {
  try {
    const prompt = `
    以下のサッカーの試合情報を分析してください：
    
    ホームチーム: ${homeTeam.team}
    フォーメーション: ${homeTeam.formation}
    スタメン: ${homeTeam.players.map(p => p.name).join(', ')}
    
    アウェイチーム: ${awayTeam.team}
    フォーメーション: ${awayTeam.formation}
    スタメン: ${awayTeam.players.map(p => p.name).join(', ')}
    
    以下の情報をJSON形式で返してください：
    {
      "homeWinProbability": 数値（0-100）,
      "drawProbability": 数値（0-100）,
      "awayWinProbability": 数値（0-100）,
      "predictedScore": "例：2-1",
      "matchAnalysis": "200〜300文字の試合展開予想"
    }
    
    注意事項：
    - 確率の合計は100になるようにしてください
    - 予想スコアは現実的な結果を予想してください
    - 試合展開予想は、フォーメーション、スタメンの強さ、戦術を考慮して記述してください
    - JSONのみを返してください。説明文は不要です。
    `;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const result = await axios.post<GeminiResponse>(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      requestBody
    );

    const responseText = result.data.candidates[0].content.parts[0].text;
    
    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse analysis data from response');
    }

    const analysisData = JSON.parse(jsonMatch[0]);

    return {
      homeTeam,
      awayTeam,
      homeWinProbability: analysisData.homeWinProbability || 0,
      drawProbability: analysisData.drawProbability || 0,
      awayWinProbability: analysisData.awayWinProbability || 0,
      predictedScore: analysisData.predictedScore || '0-0',
      matchAnalysis: analysisData.matchAnalysis || '',
    };
  } catch (error) {
    console.error('Error analyzing match:', error);
    throw error;
  }
}

/**
 * Convert blob to base64
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
