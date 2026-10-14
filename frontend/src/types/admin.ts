export type AdminStats = {
  users: number;
  knowledges: number;
  publicKnowledges: number;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role: "ADMIN" | "USER";
  _count: { knowledges: number };
};

export type AdminUsersResponse = {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
