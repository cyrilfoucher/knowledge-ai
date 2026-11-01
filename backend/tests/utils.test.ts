import { describe, it, expect } from "vitest";
import { maskEmail } from "../src/utils/maskEmail.js";
import {
  buildKnowledgeFilters,
  buildKnowledgeOrderBy,
} from "../src/utils/knowledgeFilters.js";

describe("maskEmail", () => {
  it("garde la première lettre et le domaine seulement", () => {
    expect(maskEmail("testmasquage@domaine.fr")).toBe("t*****@domaine.fr");
  });
});

describe("buildKnowledgeOrderBy", () => {
  it("trie par nombre de like puis par date avec popular", () => {
    expect(buildKnowledgeOrderBy("popular")).toEqual([
      { likes: { _count: "desc" } },
      { updatedAt: "desc" },
    ]);
  });
  it("trie par le plus récent par défaut", () => {
    expect(buildKnowledgeOrderBy("recent")).toEqual({
      updatedAt: "desc",
    });
  });
});

describe("buildKnowledgeFilters", () => {
  it("filtre par auteur quand un auteur est renseigné", () => {
    const authorId = "123";
    expect(
      buildKnowledgeFilters({
        page: 1,
        limit: 10,
        sort: "recent",
        author: authorId,
      }),
    ).toEqual({ authorId });
  });
});
