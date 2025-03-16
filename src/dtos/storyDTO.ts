export interface CreateStoryDTO {
  title: string;
  description: string;
  tags?: string[];
}

export interface UpdateStoryDTO {
  title?: string;
  description?: string;
  tags?: string[];
}
