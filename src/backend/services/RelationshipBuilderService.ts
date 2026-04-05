import { getSession } from "../config/neo4j.ts";
import { CharacterRepository } from "../repositories/CharacterRepository.ts";

export class RelationshipBuilderService {
  private repo = new CharacterRepository();

  async buildAll() {
    const universes = ["Marvel", "DC", "Naruto", "One Piece"];
    const session = await getSession();
    let totalUpdated = 0;

    try {
      for (const universe of universes) {
        // 1. Load all characters for the universe using the repository
        const characters = await this.repo.findByUniverse(universe);
        let universeUpdated = 0;

        // 2. For each character A, loop through all other characters B in the SAME universe list
        for (let i = 0; i < characters.length; i++) {
          const charA = characters[i];
          const allies: number[] = [];
          const enemies: number[] = [];
          const knows: number[] = [];

          const teamAWords = this.getKeywords(charA.team);

          for (let j = 0; j < characters.length; j++) {
            if (i === j) continue;
            const charB = characters[j];

            // Safety filter: only pair characters within the same universe list
            if (charA.universe !== charB.universe) continue;

            let isAlly = false;
            let isEnemy = false;

            // ALLIED_WITH condition
            if (allies.length < 10) {
              const teamBWords = this.getKeywords(charB.team);
              if (teamAWords.length > 0 && teamBWords.length > 0) {
                const hasMatch = teamAWords.some(wordA => 
                  teamBWords.some(wordB => wordA.toLowerCase() === wordB.toLowerCase())
                );
                if (hasMatch) {
                  isAlly = true;
                  allies.push(charB.id);
                }
              }
            }

            // ENEMY_OF condition
            if (!isAlly && enemies.length < 8) {
              if (
                (charA.role === "hero" && charB.role === "villain") ||
                (charA.role === "villain" && charB.role === "hero")
              ) {
                isEnemy = true;
                enemies.push(charB.id);
              }
            }

            // KNOWS condition
            if (isAlly || isEnemy) {
              knows.push(charB.id);
            }
          }

          // 3. Save relationships for character A using UNWIND for better performance and reliability
          if (allies.length > 0 || enemies.length > 0 || knows.length > 0) {
            await session.run(`
              MATCH (a:Character) WHERE id(a) = toInteger($idA)
              WITH a
              
              // Allies
              OPTIONAL MATCH (b:Character) WHERE id(b) IN [id IN $allies | toInteger(id)]
              WITH a, collect(b) as alliesNodes
              FOREACH (ally IN alliesNodes | MERGE (a)-[:ALLIED_WITH]->(ally))
              
              // Enemies
              WITH a
              OPTIONAL MATCH (c:Character) WHERE id(c) IN [id IN $enemies | toInteger(id)]
              WITH a, collect(c) as enemiesNodes
              FOREACH (enemy IN enemiesNodes | MERGE (a)-[:ENEMY_OF]->(enemy))
              
              // Knows
              WITH a
              OPTIONAL MATCH (d:Character) WHERE id(d) IN [id IN $knows | toInteger(id)]
              WITH a, collect(d) as knowsNodes
              FOREACH (known IN knowsNodes | MERGE (a)-[:KNOWS]->(known))
            `, {
              idA: charA.id,
              allies,
              enemies,
              knows
            });
          }

          universeUpdated++;
          totalUpdated++;
        }

        console.log(`${universe}: built relationships for ${universeUpdated} characters`);
      }

      console.log(`Relationship building complete. Total characters updated: ${totalUpdated}`);
    } catch (error) {
      console.error("Error building relationships:", error);
    } finally {
      await session.close();
    }
  }

  private getKeywords(teamStr: string | null | undefined): string[] {
    if (!teamStr || teamStr.trim() === "" || teamStr === "Unknown") return [];
    return teamStr
      .split(/[\s,]+/)
      .filter(word => word.length > 3);
  }
}
