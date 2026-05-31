// Formation and player types
export interface Player {
  name: string;
  position: string;
}

export interface TeamFormation {
  team: string;
  formation: string;
  players: Player[];
}

export interface AnalysisResult {
  homeTeam: TeamFormation;
  awayTeam: TeamFormation;
  homeWinProbability: number;
  drawProbability: number;
  awayWinProbability: number;
  predictedScore: string;
  matchAnalysis: string;
}

export interface ImageData {
  uri: string;
  type: string;
  name: string;
}
