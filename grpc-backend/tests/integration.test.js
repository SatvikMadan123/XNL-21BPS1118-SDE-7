const request = require("supertest");
const express = require("express");

const app = express();
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

test("GET /health should return status OK", async () => {
  const res = await request(app).get("/health");
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ status: "OK" });
});
