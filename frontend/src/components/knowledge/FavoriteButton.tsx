import api from "../../api/axios";
import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { toast } from "sonner";
import { Heart } from "lucide-react";

interface FavoriteProps {
  knowledgeId: string;
  compact?: boolean;
}

function FavoriteButton({ knowledgeId, compact }: FavoriteProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadFavorites() {
      try {
        const response = await api.get<{ isFavorite: boolean }>(`/favorites/${knowledgeId}`);
        setIsFavorite(response.data.isFavorite);
      } catch {
        //En cas d'echec de l'appel le bouton reste sur "Ajouter aux favoris"
      } finally {
        setLoading(false);
      }
    }
    loadFavorites();
  }, [knowledgeId]);
  async function handleToggle(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${knowledgeId}`);
        setIsFavorite(false);
        toast.success("Retiré des favoris");
      } else {
        await api.post(`/favorites/${knowledgeId}`);
        setIsFavorite(true);
        toast.success("Ajouté aux favoris");
      }
    } catch {
      toast.error("Impossible de modifier les favoris actuellement");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleToggle}
      disabled={loading}
      className="inline-flex shrink-0 items-center gap-2 text-heading"
      aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
      {!compact && (
        <span className="hidden sm:inline">
          {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        </span>
      )}
    </Button>
  );
}

export default FavoriteButton;
