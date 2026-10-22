import AppError from "../errors/AppError.js";

type AiMessage = {
  role: "system" | "user";
  content: string;
};

async function callMistral(messages: AiMessage[]): Promise<string> {
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
      body: JSON.stringify({ model, messages }),
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
        "Tu es un assistant qui résume des fiches de connaissances techniques pour les developpeurs web, fais un court résumé en français de ce texte de façon simple mais précise et claire en gardant que l'essentiel, pour les termes techniques conserve les en anglais quand cela est d'usage par rapport au developpement web. Le résumé ne doit faire au maximum que en trois ou quatre phrases sans superflu. Le tout en texte brut sans markdown, n'invente rien qui ne soit pas dans la fiche. Réponds uniquement le résumé sans introduction",
    },
    { role: "user", content: `Titre : ${title}\n\n${content}` },
  ]);
  return summary.replaceAll("**", "").replaceAll("`", "");
}

export async function suggestTags(
  title: string,
  content: string,
): Promise<string[]> {
  const answer = await callMistral([
    {
      role: "system",
      content:
        "Tu es un assistant qui suggère des tags en rapport avec la fiche que tu auras analysée au préalable, tu en proposeras entre 3 et 5, les tags seront suggérés en minuscule,en rapport avec le developpement web, en français ou si c'est l'usage en anglais,un ou deux mot maximum par tag et tu les proposera séparés par des virgules sans phrase,ni numéro ni symbole mais uniquement des lettres minuscules,des chiffres ou un tiret (si le tag comporte deux mot comme react-router)corréspondant au tag, réponds uniquement par la liste de tag sans introduction",
    },
    { role: "user", content: `Titre : ${title}\n\n${content}` },
  ]);
  const tags = answer
    .split(/[,\n]/)
    .map((tag) => tag.toLocaleLowerCase().trim())
    .filter((tag) => tag.length <= 20 && tag.length > 0)
    .slice(0, 5);
  return [...new Set(tags)];
}
