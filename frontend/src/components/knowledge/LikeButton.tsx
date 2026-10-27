import Button from "../ui/Button";
import api from "../../api/axios";
import { useState, useEffect } from "react";
import { ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";

interface LikeButtonProps {
  knowledgeId: string;
  initialCount: number;
  canLike: boolean;
}

function LikeButton({ knowledgeId, initialCount, canLike }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(canLike);
  const [count, setCount] = useState(initialCount);
  useEffect(() => {
    if (!canLike) {
      return;
    }
    async function loadingLike() {
      try {
        setLoading(true);
        const response = await api.get<{ liked: boolean }>(`/likes/${knowledgeId}`);
        setLiked(response.data.liked);
      } catch {
        // le catch est vide pour garder le bouton like en place même en cas d'erreur
      } finally {
        setLoading(false);
      }
    }
    loadingLike();
  }, [knowledgeId, canLike]);
  async function handleToggle(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setLoading(true);
    try {
      const response = liked
        ? await api.delete<{ liked: boolean; count: number }>(`/likes/${knowledgeId}`)
        : await api.post<{ liked: boolean; count: number }>(`/likes/${knowledgeId}`);
      setLiked(response.data.liked);
      setCount(response.data.count);
    } catch (error) {
      let message = "Impossible de modifier le like.";
      if (isAxiosError<{ message?: string }>(error)) {
        message = error.response?.data?.message ?? message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }
  function renderContent() {
    if (!canLike) {
      return (
        <span className="inline-flex shrink-0 items-center gap-1 text-sm text-muted">
          <ThumbsUp size={16} />
          {count}
          <span className="sr-only">{count > 1 ? "mentions J'aime" : "mention J'aime"}</span>
        </span>
      );
    }
    return (
      <Button
        type="button"
        variant="secondary"
        onClick={handleToggle}
        disabled={loading}
        className="inline-flex shrink-0 items-center gap-2 text-heading"
        aria-label={liked ? "Retirer mon J'aime" : "Aimer cette fiche"}
        aria-pressed={liked}
      >
        <ThumbsUp size={16} fill={liked ? "currentColor" : "none"} />
        {count}
      </Button>
    );
  }
  return renderContent();
}
export default LikeButton;
