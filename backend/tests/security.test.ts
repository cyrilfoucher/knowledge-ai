import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app.js";

describe("Routes protégées", () => {
  it("refuse GET /auth/me sans être connecté", async () => {
    const response = await request(app).get("/auth/me");
    expect(response.status).toBe(401);
  });
  it("refuse GET /knowledges sans être connecté", async () => {
    const response = await request(app).get("/knowledges");
    expect(response.status).toBe(401);
  });
  it("refuse GET /admin/stats sans être connecté", async () => {
    const response = await request(app).get("/admin/stats");
    expect(response.status).toBe(401);
  });
});

describe("Validation des données", () => {
  it("refuse l'inscription avec un email invalide", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Test",
      email: "pas-un-email",
      password: "MotDePasse123!",
    });
    expect(response.status).toBe(400);
  });
  it("refuse une limite supérieur a 50 sur GET /explore", async () => {
    const response = await request(app).get("/explore?limit=100");
    expect(response.status).toBe(400);
  });
});
