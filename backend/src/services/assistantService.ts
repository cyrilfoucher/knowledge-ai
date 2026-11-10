import { findKnowledgesForQuestion } from "./embeddingService.js";
import { answerQuestion } from "./aiService.js";

export async function askAssistant(question: string, userId?: string) {
  const knowledges = await findKnowledgesForQuestion(question, userId);
  if (knowledges.length === 0) {
    return {
      answer: "Je n'ai trouvé aucune fiche en rapport avec ta question.",
      sources: [],
    };
  }

  const result = await answerQuestion(question, knowledges);

  const sources = [...new Set(result.sources)]
    .map((number) => knowledges[number - 1])
    .filter((knowledge) => knowledge !== undefined)
    .map((knowledge) => ({
      id: knowledge.id,
      title: knowledge.title,
      visibility: knowledge.visibility,
    }));

  return { answer: result.answer, sources };
}
