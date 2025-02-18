export interface CreateStoryDTO {
  title: string;
  description: string;
}

export interface UpdateStoryDTO {
  title?: string;
  description?: string;
}
