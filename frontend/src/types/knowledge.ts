import type { KnowledgeFormData } from "../schemas/knowledgeSchema";

export type Visibility = "PRIVATE" | "PUBLIC";

export interface Knowledge {
  id: string;
  title: string;
  content: string;
  visibility: Visibility;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  category: Category | null;
  tags: Tag[];
  summary: string | null;
  _count: { likes: number };
  isFavorite: boolean;
  liked: boolean;
}

export type PublicKnowledge = Knowledge & { author: { name: string } };

export type ExploreResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  knowledges: PublicKnowledge[];
};

export type MyKnowledgesResponse = {
  knowledges: Knowledge[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Tag = {
  id: string;
  name: string;
};

export type Category = {
  id: string;
  name: string;
};

export type KnowledgePayload = Omit<KnowledgeFormData, "categoryId" | "tags"> & {
  categoryId: string | null;
  tags: string[];
};
