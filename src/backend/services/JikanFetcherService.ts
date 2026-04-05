import axios from "axios";
import { getSession } from "../config/neo4j.ts";

const BASE_URL = "https://api.jikan.moe/v4";
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class JikanFetcherService {
  async fetchAndSave() {
    const animeIds = [20, 1735, 21]; // Naruto, Naruto Shippuden, One Piece
    const characterMap = new Map<number, { mal_id: number; name: string; universe: string }>();

    console.log("Step 1: Collecting character lists from Jikan...");

    for (const animeId of animeIds) {
      await delay(1100);
      try {
        const response = await axios.get(`${BASE_URL}/anime/${animeId}/characters`);
        const universe = (animeId === 20 || animeId === 1735) ? "Naruto" : "One Piece";
        
        if (response.data && response.data.data) {
          response.data.data.forEach((item: any) => {
            const malId = item.character.mal_id;
            if (!characterMap.has(malId)) {
              characterMap.set(malId, {
                mal_id: malId,
                name: item.character.name,
                universe: universe
              });
            }
          });
        }
        console.log(`Collected characters for anime ID ${animeId}. Total unique: ${characterMap.size}`);
      } catch (error) {
        console.error(`Error fetching characters for anime ${animeId}:`, error.message);
      }
    }

    console.log("Step 2: Fetching full details for each character and saving incrementally...");
    let count = 0;
    const session = await getSession();

    try {
      const uniqueCharacters = Array.from(characterMap.values());

      for (const char of uniqueCharacters) {
        let success = false;
        let retries = 0;
        const maxRetries = 3;

        while (!success && retries < maxRetries) {
          await delay(1100);
          try {
            const response = await axios.get(`${BASE_URL}/characters/${char.mal_id}`);
            const data = response.data.data;

            const bio = (data.about || `Character from the ${char.universe} universe`)
              .replace(/\n/g, " ")
              .substring(0, 500);

            const characterEntity = {
              name: data.name,
              universe: char.universe,
              role: "hero",
              team: "Unknown",
              bio: bio,
              powers: "See character profile",
              imageUrl: data.images?.jpg?.image_url || null,
              firstAppearance: char.universe === "Naruto" ? "Naruto Series" : "One Piece Series",
              arcNumber: 1,
              arcName: "Main Story"
            };

            // Save incrementally
            await session.run(`
              MERGE (c:Character {name: $name})
              SET c.universe = $universe,
                  c.role = $role,
                  c.team = $team,
                  c.bio = $bio,
                  c.powers = $powers,
                  c.firstAppearance = $firstAppearance,
                  c.imageUrl = $imageUrl,
                  c.arcNumber = toInteger($arcNumber),
                  c.arcName = $arcName
            `, characterEntity);

            success = true;
            count++;
            if (count % 10 === 0) {
              console.log(`Saved ${count} Jikan characters to Neo4j so far...`);
            }
          } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 429) {
              retries++;
              console.warn(`Rate limited (429) for ${char.name}. Retry ${retries}/${maxRetries} after 5s...`);
              await delay(5000);
            } else {
              console.error(`Error fetching details for character ${char.name}:`, error.message);
              break; // Don't retry for other errors
            }
          }
        }
      }
      
      console.log(`Jikan complete: Saved ${count} characters to Neo4j`);
      return count;
    } finally {
      await session.close();
    }
  }
}
