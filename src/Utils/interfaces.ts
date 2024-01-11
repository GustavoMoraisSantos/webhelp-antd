export interface Job {
    id: string,
    job: string;
    nivel: string;
    description?: string;
    technologies?: { name: string; ratingRequired: number }[];
    createdAt?: string;
  }