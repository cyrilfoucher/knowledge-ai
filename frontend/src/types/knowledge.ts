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
