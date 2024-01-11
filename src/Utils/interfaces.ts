export interface Job {
  id: string;
  job: string;
  nivel: string;
  description?: string;
  technologies?: { name: string; ratingRequired: number }[];
  createdAt?: string;
}

export interface Candidate {
  id: string;
  candidateName: string;
  contact: string;
  linkedin?: string;
  observations?: string;
  pontuation?: number;
  // Outras propriedades, se necessário
}
