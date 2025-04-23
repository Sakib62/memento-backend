interface Story {
  id?: string;
  title: string;
  description: string;
  authorUsername: string;
  authorName: string;
  tags?: string[];
  createdAt: Date;
}

export default Story;
