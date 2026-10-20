import type { Category, Tag } from "../../types/knowledge";

interface KnowledgeTagsProps {
  category: Category | null;
  tags: Tag[];
  max?: number;
}

function KnowledgeTags({ category, tags, max }: KnowledgeTagsProps) {
  const visibleTags = max ? tags.slice(0, max) : tags;
  const hiddenCount = tags.length - visibleTags.length;
  if (category === null && tags.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-wrap gap-2 itemps-center">
      {category && (
        <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
          {category.name}
        </span>
      )}
      {visibleTags.map((tag) => (
        <span key={tag.id} className="text-muted text-xs">
          #{tag.name}
        </span>
      ))}
      {hiddenCount > 0 && <span className="text-muted text-xs">+{hiddenCount}</span>}
    </div>
  );
}

export default KnowledgeTags;
