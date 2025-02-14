export interface CreateStoryDTO {
  title: string;
  description: string;
  authorUsername: string;
}

export interface UpdateStoryDTO {
  title?: string;
  description?: string;
}
