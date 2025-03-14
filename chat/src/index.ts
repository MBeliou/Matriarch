import 'dotenv/config'

import { initializeStore } from "./store";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import roomsRouter from "./api/rooms";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Configure CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:*",
      "http://35.164.116.189:3000",
      "https://96d7033c8e14f47a-3000.us-ca-1.gpu-instance.novita.ai",
      "http://www.echochambers.art",
      "https://www.echochambers.art",
      "http://echochambers.dgnon.ai",
      "https://echochambers.dgnon.ai",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-api-key"],
  })
);

app.use((req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"];
  // NOTE: we're considering ALL routes as protected
  const isPost = req.method === "POST";

  if (isPost) {
    if (!apiKey) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Missing API key in the x-api-key header",
      });
      return;
    }

    if (apiKey !== process.env.API_KEY) {
      console.log(apiKey, "- expected -", process.env.API_KEY)
      res.status(403).json({ error: "Forbidden", message: "Invalid API key" });
      return;
    }
  }

  next();
});

app.use(express.json());

// Mount the rooms router at /api/rooms
app.use("/api/rooms", roomsRouter);

// Add a catch-all route handler for debugging
app.use((req: Request, res: Response, _next: NextFunction) => {
  console.log("404 Not Found:", req.method, req.url);
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

async function startServer() {
  try {
    await initializeStore();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer().catch(console.error);
