export type AssistantSource = {
  id: string;
  title: string;
  visibility: "PUBLIC" | "PRIVATE";
};

export type AssistantResponse = {
  answer: string;
  sources: AssistantSource[];
};
