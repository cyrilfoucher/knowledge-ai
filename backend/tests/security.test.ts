import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app.js";

//Tests des routes
describe("Routes protégées", () => {
  it("refuse GET /auth/me sans login", async () => {
    const response = await request(app).get("/auth/me");
    expect(response.status).toBe(401);
  });
  it("refuse GET /knowledges sans login", async () => {
    const response = await request(app).get("/knowledges");
    expect(response.status).toBe(401);
  });
  it("refuse GET /admin/stats sans login", async () => {
    const response = await request(app).get("/admin/stats");
    expect(response.status).toBe(401);
  });
  it("refuse POST /favorites/:id sans login", async () => {
    const response = await request(app).post("/favorites/123");
    expect(response.status).toBe(401);
  });
  it("refuse POST /likes/:id sans login", async () => {
    const response = await request(app).post("/likes/123");
    expect(response.status).toBe(401);
  });
});

//Tests des validations des données
describe("Validation des données", () => {
  it("refuse l'inscription avec un email invalide", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Test",
      email: "pas-un-email",
      password: "MotDePasse123!",
    });
    expect(response.status).toBe(400);
  });
  it("refuse une limite supérieure à 50 sur GET /explore", async () => {
    const response = await request(app).get("/explore?limit=100");
    expect(response.status).toBe(400);
  });
  it("refuse GET /explore avec auteur invalide", async () => {
    const response = await request(app).get("/explore?author=abc");
    expect(response.status).toBe(400);
  });
});

describe("Santé du serveur", () => {
  it("répond 200 sur GET /health", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
