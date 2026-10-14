import { useState, useEffect } from "react";
import api from "../../api/axios";
import Alert from "../ui/Alert";
import type { AdminUsersResponse } from "../../types/admin";
import PageSizeSelect from "../ui/PageSizeSelect";
import Pagination from "../ui/Pagination";

function UserList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AdminUsersResponse | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  useEffect(() => {
    async function loadData() {
      try {
        const response = await api.get<AdminUsersResponse>("/admin/users", {
          params: { page, limit },
        });
        setData(response.data);
      } catch {
        setError("Une erreur est survenue lors du chargement des utilisateurs");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [page, limit]);
  function renderContent() {
    if (loading) {
      return <p className="text-muted">Chargement...</p>;
    }
    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }
    if (!data) {
      return <p className="text-muted">Aucun utilisateur</p>;
    }
    return (
      <>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted">
            <span className="font-semibold text-heading">{data.total}</span>{" "}
            {data.total > 1 ? "utilisateurs" : "utilisateur"}
          </p>
          <PageSizeSelect
            value={limit}
            onChange={(value) => {
              setLimit(value);
              setPage(1);
            }}
          />
        </div>
        <div className="overflow-x-auto">
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="py-2 text-muted whitespace-nowrap pr-4 ">Nom</th>
                <th className="py-2 text-muted whitespace-nowrap pr-4 ">Email</th>
                <th className="py-2 text-muted whitespace-nowrap pr-4 ">Rôle</th>
                <th className="py-2 text-muted whitespace-nowrap pr-4 ">Inscrit le</th>
                <th className="py-2 text-muted whitespace-nowrap pr-4 ">Fiches</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user.id} className="border-t border-border">
                  <td className="py-2 pr-4 whitespace-nowrap">{user.name}</td>
                  <td className="py-2 pr-4 whitespace-nowrap">{user.email}</td>
                  <td className="py-2 pr-4 whitespace-nowrap">
                    {user.role === "ADMIN" ? "Admin" : "Utilisateur"}
                  </td>
                  <td className="py-2 pr-4 whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="py-2 pr-4 whitespace-nowrap">{user._count.knowledges}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }
  return <>{renderContent()}</>;
}
export default UserList;
