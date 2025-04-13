export interface ProblemReport {
  id?: number;
  plantId: number;
  dateReported?: string;
  severity: string;
  description: string;
}
