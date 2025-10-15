export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email?: string;
}

export interface Media {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  youtubeUrl?: string;
  filename: string;
  size: number;
  creator:ArticleCreator;
  created_at: string;
  updated_at: string;
}

export interface Rubric {
  id: number;
  name: string;
  slug: string;
  description?: string;
}
export interface ArticleCreator {
  id: string;
  name: string;
}
export interface Article {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  creator: ArticleCreator;
  created_at: string;
  updated_at: string;
  head: string;
  user: User;
  rubric: Rubric;
  media: Media[]; // URL de l'image principale
  tags?: string[];
  views?: number;
}

export interface ApiResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}