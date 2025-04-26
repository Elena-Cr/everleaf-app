export interface CareLog {
  id?: number;
  action: string;
  date: string; // or Date, depending on your backend
  notes?: string;
  plantId: number;
}
