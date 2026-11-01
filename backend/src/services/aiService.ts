import AppError from "../errors/AppError.js";
import { aiTagsSchema } from "../schemas/aiSchema.js";

type AiMessage = {
  role: "system" | "user";
  content: string;
};

async function callMistral(
  messages: AiMessage[],
  json = false,
): Promise<string> {
  const apiKey = process.env.MISTRAL_API_KEY;
  const model = process.env.AI_MODEL;
  if (!apiKey || !model) {
    throw new Error("MISTRAL_API_KEY ou AI_MODEL manquant dans le .env");
  }
  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        response_format: json ? { type: "json_object" } : undefined,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      console.error(response.status, await response.text());
      throw new AppError(
        "Le service d'IA est indisponible pour le moment. Réessaie plus tard.",
        503,
      );
    }
    const data = (await response.json()) as {
      choices: { message: { content: string } }[];
    };
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Appel à Mistral impossible :", error);
    throw new AppError(
      "Le service d'IA est indisponible pour le moment. Réessaie plus tard.",
      503,
    );
  }
}

export async function summarizeText(
  title: string,
  content: string,
): Promise<string> {
  const summary = await callMistral([
    {
      role: "system",
      content:
        "Tu es un assistant qui résume des fiches de connaissances techniques pour les developpeurs web, fais un court résumé en français de ce texte de façon simple mais précise et claire en gardant que l'essentiel, pour les termes techniques conserve les en anglais quand cela est d'usage par rapport au developpement web. Le résumé ne doit faire au maximum que en trois courtes phrases sans superflu(Le résumé tient en un seul paragraphe de 60 mots maximum). Le tout en texte brut sans markdown, n'invente rien qui ne soit pas dans la fiche. Réponds uniquement le résumé sans introduction",
    },
    { role: "user", content: `Titre : ${title}\n\n${content}` },
  ]);
  return summary.replace(/[*`#]/g, "").trim();
}

export async function suggestTags(
  title: string,
  content: string,
): Promise<string[]> {
  const answer = await callMistral(
    [
      {
        role: "system",
        content:
          'Tu es un assistant qui suggère des tags pour une fiche de connaissances sur le développement web. Propose entre 3 et 5 tags, en commençant par la technologie principale de la fiche. Privilégie des tags d\'un seul mot, généraux et réutilisables sur d\'autres fiches, en français ou en anglais selon l\'usage. Chaque tag ne contient que des lettres minuscules, des chiffres ou un tiret, par exemple react-router. Réponds uniquement en JSON, au format {"tags": ["tag1", "tag2"]}.',
      },
      { role: "user", content: `Titre : ${title}\n\n${content}` },
    ],
    true,
  );
  let parsed: unknown;
  try {
    parsed = JSON.parse(answer);
  } catch {
    throw new AppError("La réponse de l'IA est illisible. Réessaie.", 502);
  }
  const result = aiTagsSchema.safeParse(parsed);
  if (!result.success) {
    console.error(result.error);
    throw new AppError("La réponse de l'IA est illisible. Réessaie.", 502);
  }
  return [...new Set(result.data.tags)].slice(0, 5);
}
