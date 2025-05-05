export interface Plant {
  id?: number;
  name: string;
  nickname?: string;
  species: number;
  imageUrl?: string;
  dateAdded: Date;
  userId: number;
  status?: string; //newly added property
}
