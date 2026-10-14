import PageHeader from "../layouts/PageHeader";
import { useState, useEffect } from "react";
import api from "../api/axios";
import Alert from "../components/ui/Alert";
import Card from "../components/ui/Card";
import type { AdminStats } from "../types/admin";
import UserList from "../components/admin/UserList";

function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  useEffect(() => {
    async function loadStats() {
      try {
        const response = await api.get<{ stats: AdminStats }>("/admin/stats");
        setStats(response.data.stats);
      } catch {
        setError("Impossible de charger les statistiques");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);
  function renderContent() {
    if (loading) {
      return <p className="text-muted">Chargement...</p>;
    }
    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }
    if (!stats) {
      return <p className="text-muted">Aucune donnée à afficher</p>;
    }
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-muted text-center">Utilisateurs</p>
          <p className="mt-1 text-3xl font-semibold text-heading text-center">{stats.users}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted text-center">Fiches totales</p>
          <p className="mt-1 text-3xl font-semibold text-heading text-center">{stats.knowledges}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted text-center">Fiches publiques</p>
          <p className="mt-1 text-3xl font-semibold text-heading text-center">
            {stats.publicKnowledges}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Administration" subtitle="Informations de la plateforme" />
      {renderContent()}

      <h2 className="mt-10 mb-4 text-xl font-semibold text-heading">Utilisateurs</h2>
      <UserList />
    </>
  );
}
export default AdminPage;
