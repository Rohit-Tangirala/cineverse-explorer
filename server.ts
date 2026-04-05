import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { characterRouter } from "./src/backend/controllers/CharacterController.ts";
import { authRouter } from "./src/backend/controllers/AuthController.ts";
import { seedData } from "./src/backend/services/DataSeeder.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // API Routes
  app.use("/api/characters", characterRouter);
  app.use("/api/auth", authRouter);

  // Debug endpoint (as requested)
  app.get("/api/debug", async (req, res) => {
    const { CharacterRepository } = await import("./src/backend/repositories/CharacterRepository.ts");
    const repo = new CharacterRepository();
    const { forceSeed } = req.query;

    try {
      if (forceSeed === "true") {
        console.log("Manual seeding triggered via debug endpoint...");
        await seedData();
      }

      const totalCharacters = await repo.count();
      const totalRelationships = await repo.countRelationships();
      const sampleNames = await repo.getSampleNames(5);
      
      const universes = ["Marvel", "DC", "Naruto", "One Piece"];
      const byUniverse: Record<string, number> = {};
      
      for (const universe of universes) {
        const chars = await repo.findByUniverse(universe);
        byUniverse[universe] = chars.length;
      }

      res.json({
        totalCharacters,
        byUniverse,
        sampleNames,
        totalRelationships,
        status: "OK",
        manualSeedingAvailable: true
      });
    } catch (error) {
      res.status(500).json({ status: "ERROR", error: error.message });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

 app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

}

startServer();
