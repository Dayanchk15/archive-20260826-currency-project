import { Router } from "express";
import { getCurrencies, getHistory, getRate } from "../services/frankfurterService.js";

const router = Router();
const currencyCode = /^[A-Z]{3}$/;

function validatePair(from: unknown, to: unknown): asserts from is string {
  if (typeof from !== "string" || typeof to !== "string" || !currencyCode.test(from) || !currencyCode.test(to) || from === to) {
    const error = new Error("from and to must be different three-letter currency codes");
    (error as Error & { status?: number }).status = 400;
    throw error;
  }
}

router.get("/currencies", async (_request, response, next) => {
  try {
    response.json(await getCurrencies());
  } catch (error) {
    next(error);
  }
});

router.get("/rate", async (request, response, next) => {
  try {
    const from = String(request.query.from ?? "").toUpperCase();
    const to = String(request.query.to ?? "").toUpperCase();
    validatePair(from, to);
    response.json(await getRate(from, to));
  } catch (error) {
    next(error);
  }
});

router.get("/history", async (request, response, next) => {
  try {
    const from = String(request.query.from ?? "").toUpperCase();
    const to = String(request.query.to ?? "").toUpperCase();
    const period = Number(request.query.period ?? 7);
    validatePair(from, to);
    if (![1, 7, 30].includes(period)) {
      const error = new Error("period must be 1, 7, or 30");
      (error as Error & { status?: number }).status = 400;
      throw error;
    }

    const end = new Date();
    const start = new Date(end);
    start.setUTCDate(end.getUTCDate() - period);
    const date = (value: Date) => value.toISOString().slice(0, 10);
    response.json(await getHistory(from, to, date(start), date(end)));
  } catch (error) {
    next(error);
  }
});

export default router;
