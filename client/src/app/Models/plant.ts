export interface Plant {
  id?: number;
  name: string;
  nickname?: string;
  species: number;
  dateAdded: Date;
  userId: number;
  status?: string; //for watering status
  fertilizingStatus?: string; // For fertilizing status
}
