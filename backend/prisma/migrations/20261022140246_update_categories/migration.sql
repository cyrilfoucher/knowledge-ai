-- Renommer la catégorie JavaScript / TypeScript en catégorie générale
UPDATE "Category" SET "name" = 'Langages' WHERE "name" = 'JavaScript / TypeScript';

-- Ajouter les nouvelles catégories
INSERT INTO "Category" ("id", "name") VALUES
  (gen_random_uuid(), 'Tests'),
  (gen_random_uuid(), 'Architecture'),
  (gen_random_uuid(), 'Algorithmique');