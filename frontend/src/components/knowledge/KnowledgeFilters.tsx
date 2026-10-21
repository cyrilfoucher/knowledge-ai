import { useState, useEffect } from "react";
import Button from "../ui/Button";
import api from "../../api/axios";
import type { Category } from "../../types/knowledge";

interface KnowledgeFiltersProps {
  q: string;
  onChange: (values: Record<string, string>) => void;
  sort: string;
  category: string;
}

function KnowledgeFilters({ q, onChange, sort, category }: KnowledgeFiltersProps) {
  const [search, setSearch] = useState(q);

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await api.get<{ categories: Category[] }>("/categories");
        setCategories(response.data.categories);
      } catch {
        setCategories([]);
      }
    }
    loadCategories();
  }, []);

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    onChange({ q: search.trim(), page: "" });
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <div className="flex flex-1 gap-2">
        <input
          type="search"
          value={search}
          placeholder="Rechercher une fiche..."
          onChange={(event) => setSearch(event.target.value)}
          className="flex-1  min-w-0 rounded-lg border border-border bg-transparent px-3 py-2"
        />
        <Button type="submit">Rechercher</Button>
      </div>
      <select
        value={category}
        onChange={(event) => onChange({ category: event.target.value, page: "" })}
        className="rounded-lg border border-border bg-transparent px-3 py-2"
      >
        <option value="">Toutes les catégories</option>
        {categories.map((categorie) => (
          <option key={categorie.id} value={categorie.id}>
            {categorie.name}
          </option>
        ))}
      </select>
      <select
        value={sort}
        onChange={(event) => onChange({ sort: event.target.value, page: "" })}
        className="rounded-lg border border-border bg-transparent px-3 py-2"
      >
        <option value="recent">Plus récentes</option>
        <option value="oldest">Plus anciennes</option>
        <option value="title">Titre (A → Z)</option>
      </select>
    </form>
  );
}

export default KnowledgeFilters;
