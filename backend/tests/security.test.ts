import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app.js";

describe("Routes protégées", () => {
  it("refuse /auth/me sans être connecté", async () => {
    const response = await request(app).get("/auth/me");
    expect(response.status).toBe(401);
  });
  it("refuse GET/knowledges sans connexion", async () => {
    const response = await request(app).get("/knowledges");
    expect(response.status).toBe(401);
  });
  it("refuse GET /admin/stats sans conexion", async () => {
    const response = await request(app).get("/admin/stats");
    expect(response.status).toBe(401);
  });
});

describe("Validation des données", () => {
  it("refuse l'enregistrement avec un email invalide", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "pas-un-email",
    });
    expect(response.status).toBe(400);
  });
  it("refuse d'afficher une limite d'affichage supérieur a 50 par page sur la page explorer", async () => {
    const response = await request(app).get("/explore?limit=100");
    expect(response.status).toBe(400);
  });
});
