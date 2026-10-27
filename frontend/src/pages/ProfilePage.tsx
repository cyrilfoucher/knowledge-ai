import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import type { PublicProfile } from "../types/profile";
import Card from "../components/ui/Card";
import Alert from "../components/ui/Alert";
import type { ExploreResponse } from "../types/knowledge";
import { useAuth } from "../hooks/useAuth";
import KnowledgeFilters from "../components/knowledge/KnowledgeFilters";
import KnowledgeTags from "../components/knowledge/KnowledgeTags";
import FavoriteButton from "../components/knowledge/FavoriteButton";
import LikeButton from "../components/knowledge/LikeButton";
import Pagination from "../components/ui/Pagination";
import PageSizeSelect from "../components/ui/PageSizeSelect";
import { ArrowLeft } from "lucide-react";
import KnowledgeCard from "../components/knowledge/KnowledgeCard";

function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [list, setList] = useState<ExploreResponse | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const q = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "recent";
  const category = searchParams.get("category") ?? "";
  const tag = searchParams.get("tag") ?? "";
  useEffect(() => {
    async function loadProfile() {
      try {
        setError(null);
        const response = await api.get<{ user: PublicProfile }>(`/users/${id}`);
        setProfile(response.data.user);
      } catch {
        setError("Une erreur est survenue lors du chargement");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [id]);
  function updateParams(values: Record<string, string>) {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(values)) {
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
    }
    setSearchParams(next);
  }
  useEffect(() => {
    async function loadList() {
      try {
        const response = await api.get<ExploreResponse>("/explore", {
          params: { ...Object.fromEntries(searchParams), author: id },
        });
        setList(response.data);
      } catch {
        setList(null);
      } finally {
        setListLoading(false);
      }
    }
    loadList();
  }, [id, searchParams]);
  function handleBack() {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate("/explore");
    }
  }
  function renderHeader() {
    if (loading) {
      return <p className="text-muted">Chargement en cours...</p>;
    }
    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }
    if (!profile) {
      return null;
    }
    return (
      <Card>
        <div className="flex items-center gap-4">
          <div
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-semibold text-on-primary"
          >
            {profile.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-heading">{profile.name}</h1>
            <p className="mt-1 text-sm text-muted">
              Membre depuis{" "}
              {new Date(profile.createdAt).toLocaleDateString("fr-FR", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-6 text-sm">
          <p>
            <span className="font-semibold text-heading">{profile.publicKnowledges}</span>{" "}
            {profile.publicKnowledges > 1 ? "fiches publiques" : "fiche publique"}
          </p>
          <p>
            <span className="font-semibold text-heading">{profile.totalLikes}</span>{" "}
            {profile.totalLikes > 1 ? "J'aime reçus" : "J'aime reçu"}
          </p>
        </div>
      </Card>
    );
  }
  function renderList() {
    if (listLoading) {
      return <p className="text-muted">Chargement des fiches...</p>;
    }
    if (!list || list.knowledges.length === 0) {
      if (q || category || tag) {
        return <p className="text-muted">Aucune fiche ne correspond à ta recherche</p>;
      }
      return <p className="text-muted">Aucune fiche publique pour le moment</p>;
    }
    return (
      <>
        <div className="mb-4 flex justify-end">
          <PageSizeSelect
            value={limit}
            onChange={(value) => updateParams({ limit: String(value), page: "" })}
          />
        </div>
        <ul className="space-y-4">
          {list.knowledges.map((knowledge) => (
            <li key={knowledge.id}>
              <KnowledgeCard
                knowledge={knowledge}
                to={`/explore/${knowledge.id}`}
                onTagClick={(name) => updateParams({ tag: name, page: "" })}
              />
            </li>
          ))}
        </ul>
        <Pagination
          page={page}
          totalPages={list.totalPages}
          onPageChange={(newPage) => updateParams({ page: String(newPage) })}
        />
      </>
    );
  }
  return (
    <>
      <button
        type="button"
        onClick={handleBack}
        className="mb-4 inline-flex cursor-pointer items-center gap-1 text-sm text-muted hover:text-text"
      >
        <ArrowLeft size={16} />
        Retour
      </button>
      {renderHeader()}
      {profile && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-heading">Fiches publiques</h2>
          <div className="mb-6">
            <KnowledgeFilters
              q={q}
              sort={sort}
              category={category}
              tag={tag}
              onChange={updateParams}
            />
          </div>
          {renderList()}
        </section>
      )}
    </>
  );
}

export default ProfilePage;
