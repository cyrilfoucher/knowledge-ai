import { Link, useNavigate } from "react-router-dom";
import type { Knowledge } from "../../types/knowledge";
import { useAuth } from "../../hooks/useAuth";
import Card from "../ui/Card";
import KnowledgeTags from "./KnowledgeTags";
import FavoriteButton from "./FavoriteButton";
import LikeButton from "./LikeButton";

interface KnowledgeCardProps {
  knowledge: Knowledge & { author?: { name: string } };
  to: string;
  showAuthor?: boolean;
  showVisibility?: boolean;
  onTagClick?: (name: string) => void;
}

function KnowledgeCard({
  knowledge,
  to,
  showAuthor,
  showVisibility,
  onTagClick,
}: KnowledgeCardProps) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const canLike = isAuthenticated && knowledge.authorId !== user?.id;
  return (
    <Link to={to} className="block hover:opacity-80">
      <Card>
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-heading min-w-0 wrap-break-word">
            {knowledge.title}
          </h2>
          <div className="flex shrink-0 items-center gap-2">
            {showVisibility && (
              <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                {knowledge.visibility === "PUBLIC" ? "Publique" : "Privée"}
              </span>
            )}
            {isAuthenticated && <FavoriteButton knowledgeId={knowledge.id} compact />}
          </div>
        </div>
        <div className="mt-2">
          <KnowledgeTags
            category={knowledge.category}
            tags={knowledge.tags}
            max={3}
            onTagClick={onTagClick}
          />
        </div>
        <p className="mt-2 text-muted line-clamp-2">{knowledge.content}</p>
        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="text-muted text-xs">
            {showAuthor && knowledge.author && (
              <>
                Par{" "}
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    navigate(`/users/${knowledge.authorId}`);
                  }}
                  className="cursor-pointer font-medium text-link hover:underline"
                >
                  {knowledge.author.name}
                </button>{" "}
                ·{" "}
              </>
            )}
            Modifiée le {new Date(knowledge.updatedAt).toLocaleDateString("fr-FR")}
          </p>
          {knowledge.visibility === "PUBLIC" && (
            <LikeButton
              knowledgeId={knowledge.id}
              initialCount={knowledge._count.likes}
              canLike={canLike}
            />
          )}
        </div>
      </Card>
    </Link>
  );
}

export default KnowledgeCard;
