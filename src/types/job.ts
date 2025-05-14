
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: number;
  category: string;
  type: string;
  publishedDate: string;
  shortDescription: string;
  description: string;
  requirements?: string[];
  applyUrl: string;
}
