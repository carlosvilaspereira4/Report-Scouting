export interface Player {
  id: string;
  name: string;
  club: string;
  number: string;
  year: string;
  position: string;
  photoUrl: string | null;
}

export type Grade = 'A' | 'B' | 'C' | 'D' | 'E';

export type FollowUp =
  | 'Avançar para observação detalhada'
  | 'Acompanhar mais tarde'
  | 'Observação insuficiente'
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
  embedded?: boolean;
}
