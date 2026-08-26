import cors from "cors";
import express from "express";
import currencyRoutes from "./routes/currencyRoutes.js";

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api", currencyRoutes);

app.use((error: Error & { status?: number }, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  const status = error.status ?? 502;
  response.status(status).json({ error: status === 502 ? "Upstream currency service unavailable" : error.message });
});

app.listen(port, () => {
  console.log(`Currency Tracker API listening on http://localhost:${port}`);
});
