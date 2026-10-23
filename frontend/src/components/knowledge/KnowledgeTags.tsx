import type { Category, Tag } from "../../types/knowledge";

interface KnowledgeTagsProps {
  category: Category | null;
  tags: Tag[];
  max?: number;
  onTagClick?: (name: string) => void;
}

function KnowledgeTags({ category, tags, max, onTagClick }: KnowledgeTagsProps) {
  const visibleTags = max ? tags.slice(0, max) : tags;
  const hiddenCount = tags.length - visibleTags.length;
  if (category === null && tags.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {category && (
        <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
          {category.name}
        </span>
      )}
      {visibleTags.map((tag) => (
        <button
          key={tag.id}
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onTagClick?.(tag.name);
          }}
          className="text-muted text-xs hover:text-primary"
        >
          #{tag.name}
        </button>
      ))}
      {hiddenCount > 0 && <span className="text-muted text-xs">+{hiddenCount}</span>}
    </div>
  );
}

export default KnowledgeTags;
