export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email?: string;
}

export interface MediaItem {
  id: number;
  url: string;
  type: 'image' | 'video';
  alt?: string;
}

export interface Rubric {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  created_at: string;
  updated_at: string;
  user: User;
  rubric: Rubric;
  media: string[]; // URL de l'image principale
  tags?: string[];
  views?: number;
}

export interface ApiResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}