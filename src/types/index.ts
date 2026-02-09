export interface Player {
  id: string;
  name: string;
  club: string;
  ageGroup: string;
  dateOfBirth: string;
  preferredFoot: 'Direito' | 'Esquerdo' | 'Ambidestro';
  height: number;
  position: string;
  photoUrl: string | null;
  nationality: string;
}

export type Grade = 'A' | 'B' | 'C' | 'D' | 'E';

export type FollowUp =
  | 'Passar à frente'
  | 'Acompanhar'
  | 'Acompanhar com reservas'
  | 'Descartar';

export interface ScoutingReport {
  playerId: string;
  player: Player;
  matchDate: string;
  matchDescription: string;
  performanceGrade: Grade;
  potentialGrade: Grade;
  followUp: FollowUp;
  physicality: string;
  offensively: string;
  defensively: string;
  conclusion: string;
  authorName: string;
  createdAt: string;
}

export interface ScoutingReportWidgetProps {
  initialPlayer?: Player;
  onSubmit?: (report: ScoutingReport) => Promise<void>;
  searchPlayers?: (query: string) => Promise<Player[]>;
  embedded?: boolean;
}
