import { useState } from "react";
import { isAxiosError } from "axios";
import type { AssistantResponse } from "../types/assistant";
import api from "../api/axios";
import { Link } from "react-router-dom";
import PageHeader from "../layouts/PageHeader";
import Card from "../components/ui/Card";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Textarea from "../components/ui/Textarea";
import MarkdownContent from "../components/knowledge/MarkdownContent";
import { useAuth } from "../hooks/useAuth";

function AssistantPage() {
  const [question, setQuestion] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AssistantResponse | null>(null);
  const { isAuthenticated } = useAuth();

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (question.trim().length < 5) {
      setError("Ta question doit faire au moins 5 caractères.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await api.post<AssistantResponse>("/assistant", { question });
      setResult(response.data);
    } catch (err) {
      setError(
        isAxiosError<{ message?: string }>(err)
          ? (err.response?.data?.message ?? "L'assistant est indisponible. Réessaie plus tard.")
          : "L'assistant est indisponible. Réessaie plus tard."
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <PageHeader
        title="Assistant"
        subtitle="Pose une question, l'assistant te répond à partir des fiches."
      />

      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          id="question"
          label="Ta question"
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Par exemple : comment protéger mon token JWT contre le vol ?"
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {!isAuthenticated && (
            <p className="text-sm text-muted">
              Connecte-toi pour que l'assistant consulte aussi tes fiches privées.
            </p>
          )}
          <Button type="submit" disabled={loading} className="sm:ml-auto">
            {loading ? "Recherche en cours…" : "Demander"}
          </Button>
        </div>
      </form>

      <div className="mt-6">
        {loading && <p className="text-muted">L'assistant consulte les fiches…</p>}
        {error && <Alert variant="danger">{error}</Alert>}
        {result && (
          <Card>
            <MarkdownContent content={result.answer} />
            {result.sources.length > 0 && (
              <div className="mt-6 border-t border-border pt-4">
                <p className="mb-2 text-sm font-semibold text-heading">Sources</p>
                <ul className="space-y-1">
                  {result.sources.map((source) => (
                    <li key={source.id}>
                      <Link
                        to={
                          source.visibility === "PUBLIC"
                            ? `/explore/${source.id}`
                            : `/knowledge/${source.id}`
                        }
                        className="text-sm text-link hover:underline"
                      >
                        {source.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}
      </div>
    </>
  );
}
export default AssistantPage;
