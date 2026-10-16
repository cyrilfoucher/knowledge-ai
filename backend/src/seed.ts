import { prisma } from "./lib/prisma.js";
import bcrypt from "bcryptjs";

const DEMO_PASSWORD = "demo-password";

const demoUserKnowledges = [
  {
    title: "Git : modifier le dernier commit",
    content:
      "git commit --amend permet de corriger le message ou d'ajouter un fichier oublié au dernier commit.\n\nÀ utiliser uniquement avant git push : après un push, cela réécrit un historique déjà partagé.",
    visibility: "PUBLIC" as const,
  },
  {
    title: "Stocker un JWT dans un cookie HttpOnly",
    content:
      "Un cookie HttpOnly est inaccessible au JavaScript du navigateur, ce qui protège le jeton contre le vol par une faille XSS.\n\nCôté Axios, il faut activer withCredentials: true pour que le cookie soit envoyé à chaque requête.",
    visibility: "PUBLIC" as const,
  },
  {
    title: "React : réutiliser un formulaire pour créer et modifier",
    content:
      "Quand la création et la modification affichent les mêmes champs, on extrait le formulaire dans un composant unique.\n\nLe composant reçoit trois props :\n- defaultValues : les valeurs de départ ;\n- submitLabel : le texte du bouton ;\n- onSubmit : la fonction lancée à l'envoi.",
    visibility: "PUBLIC" as const,
  },
  {
    title: "Docker : arrêter proprement un conteneur Node",
    content:
      'Avec CMD ["sh", "-c", "..."], c\'est sh qui reçoit le signal d\'arrêt, et il ne le transmet pas à Node.\n\nAjouter exec devant la commande finale : Node remplace sh et reçoit directement le signal. Le conteneur s\'arrête immédiatement.',
    visibility: "PUBLIC" as const,
  },
  {
    title: "Checklist avant un déploiement",
    content:
      "- Passer les cookies en secure.\n- Vérifier les variables d'environnement.\n- Retirer les console.log de débogage.\n- Tester la connexion et les droits d'accès.",
    visibility: "PRIVATE" as const,
  },
];

const demoAdminKnowledges = [
  {
    title: "Prisma : ne renvoyer que les champs utiles",
    content:
      "Sans select, Prisma renvoie toutes les colonnes, y compris passwordHash.\n\nSur une route publique, toujours préciser les champs avec select, même dans un include : include: { author: { select: { name: true } } }.",
    visibility: "PUBLIC" as const,
  },
  {
    title: "JavaScript : envoyer un email sans bloquer la réponse",
    content:
      "Sans await, la promesse part en arrière-plan et la réponse HTTP est envoyée tout de suite.\n\nOn accroche .catch() à la promesse pour enregistrer l'erreur éventuelle, puisqu'un try/catch ne peut plus l'attraper.",
    visibility: "PUBLIC" as const,
  },
  {
    title: "Idées de fonctionnalités pour la V2",
    content: "- Favoris\n- Likes\n- Profil public\n- Signalement des fiches",
    visibility: "PRIVATE" as const,
  },
];

async function upsertUser(email: string, name: string, role: "USER" | "ADMIN") {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name, role, passwordHash },
  });
}

async function seedKnowledges(
  authorId: string,
  knowledges: {
    title: string;
    content: string;
    visibility: "PUBLIC" | "PRIVATE";
  }[],
) {
  const existing = await prisma.knowledge.count({ where: { authorId } });
  if (existing > 0) return;

  await prisma.knowledge.createMany({
    data: knowledges.map((knowledge) => ({ ...knowledge, authorId })),
  });
}

async function main() {
  const demoUser = await upsertUser("demo@example.com", "Démo", "USER");
  const demoAdmin = await upsertUser(
    "admin@example.com",
    "Admin Démo",
    "ADMIN",
  );

  await seedKnowledges(demoUser.id, demoUserKnowledges);
  await seedKnowledges(demoAdmin.id, demoAdminKnowledges);

  console.log("Données de démonstration prêtes.");
}

main()
  .catch((error) => {
    console.error("Échec du seed :", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
