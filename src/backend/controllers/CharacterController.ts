import { Router } from "express";
import { getSession } from "../config/neo4j.ts";
import { CharacterRepository } from "../repositories/CharacterRepository.ts";
import { authenticateToken, isAdmin } from "./AuthController.ts";

export const characterRouter = Router();
const repo = new CharacterRepository();

// GET /api/characters/graph?universe={name}
characterRouter.get("/graph", async (req, res) => {
  const { universe } = req.query;
  
  // Fix 3: Universe parameter validation
  const validUniverses = ["Marvel", "DC", "Naruto", "One Piece"];
  if (!universe || typeof universe !== "string" || !validUniverses.includes(universe)) {
    return res.status(400).json({ error: "Invalid or missing universe parameter. Valid options: Marvel, DC, Naruto, One Piece" });
  }

  try {
    console.log(`[Graph] Fetching data for universe: ${universe}`);
    
    // Fix 1: Use the new repository method for strict filtering
    const results = await repo.findByUniverseWithRelationships(universe);

    // Fix 2: Build nodes and edges, ensuring strict universe filtering
    const nodes: any[] = [];
    const edges: any[] = [];
    const nodeIds = new Set<number>();

    // First pass: collect all nodes belonging to the universe
    results.forEach(r => {
      if (r.character.universe === universe) {
        nodes.push({
          id: r.id,
          name: r.character.name,
          role: r.character.role,
          universe: r.character.universe,
          arcNumber: r.character.arcNumber && typeof r.character.arcNumber.toNumber === 'function' 
            ? r.character.arcNumber.toNumber() 
            : (typeof r.character.arcNumber === 'number' ? r.character.arcNumber : 1),
          arcName: r.character.arcName || "Main Story",
          imageUrl: r.character.imageUrl,
          team: r.character.team || "Unknown"
        });
        nodeIds.add(r.id);
      }
    });

    // Second pass: build edges, only including those where both from and to nodes belong to the universe
    results.forEach(r => {
      if (nodeIds.has(r.id)) {
        (r.allies || []).forEach((ally: any) => {
          if (nodeIds.has(ally.id)) {
            edges.push({
              from: r.id,
              to: ally.id,
              type: "ALLIED"
            });
          }
        });
        (r.enemies || []).forEach((enemy: any) => {
          if (nodeIds.has(enemy.id)) {
            edges.push({
              from: r.id,
              to: enemy.id,
              type: "ENEMY"
            });
          }
        });
      }
    });

    // Logging as requested
    console.log(`[Graph] Success: Returned ${nodes.length} nodes and ${edges.length} edges for ${universe}.`);
    
    res.json({ nodes, edges });
  } catch (error) {
    console.error(`[Graph] Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/characters/detail/{name}
characterRouter.get("/detail/:name", async (req, res) => {
  const { name } = req.params;
  const session = await getSession();
  
  try {
    const result = await session.run(`
      MATCH (c:Character {name: $name})
      OPTIONAL MATCH (c)-[:ALLIED_WITH]->(a:Character)
      OPTIONAL MATCH (c)-[:ENEMY_OF]->(e:Character)
      OPTIONAL MATCH (c)-[:KNOWS]->(k:Character)
      RETURN c, 
             collect(distinct {id: id(a), name: a.name}) as allies,
             collect(distinct {id: id(e), name: e.name}) as enemies,
             collect(distinct {id: id(k), name: k.name}) as knows
    `, { name });

    if (result.records.length === 0) {
      return res.status(404).json({ error: "Character not found" });
    }

    const record = result.records[0];
    const character = record.get("c").properties;
    
    const convertId = (obj: any) => ({
      ...obj,
      id: typeof obj.id?.toNumber === 'function' ? obj.id.toNumber() : obj.id
    });

    res.json({
      ...character,
      arcNumber: typeof character.arcNumber?.toNumber === 'function' ? character.arcNumber.toNumber() : (character.arcNumber || 1),
      allies: (record.get("allies") || []).filter((a: any) => a.id !== null).map(convertId),
      enemies: (record.get("enemies") || []).filter((e: any) => e.id !== null).map(convertId),
      knows: (record.get("knows") || []).filter((k: any) => k.id !== null).map(convertId)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

// GET /api/characters/path?from={name}&to={name}
characterRouter.get("/path", async (req, res) => {
  const { from, to } = req.query;
  try {
    const path = await repo.findShortestPath(from as string, to as string);
    if (path.length === 0) {
      return res.status(404).json({ error: "No connection found" });
    }
    res.json(path);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/characters/search?q={keyword}
characterRouter.get("/search", async (req, res) => {
  const { q } = req.query;
  try {
    const characters = await repo.searchByName(q as string);
    res.json(characters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/characters
characterRouter.post("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const character = await repo.create(req.body);
    res.status(201).json(character);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/characters/:id
characterRouter.put("/:id", authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const character = await repo.update(parseInt(id), req.body);
    if (!character) return res.status(404).json({ error: "Character not found" });
    res.json(character);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/characters/:id
characterRouter.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await repo.delete(parseInt(id));
    if (!deleted) return res.status(404).json({ error: "Character not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/characters/universe/{name}
characterRouter.get("/universe/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const characters = await repo.findByUniverse(name);
    res.json(characters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/characters/stats
characterRouter.get("/stats", async (req, res) => {
  try {
    const stats = await repo.getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
