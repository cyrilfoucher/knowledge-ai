export type Visibility = "PRIVATE" | "PUBLIC";

export interface Knowledge {
  id: string;
  title: string;
  content: string;
  visibility: Visibility;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}
