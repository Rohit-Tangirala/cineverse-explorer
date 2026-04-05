import { getSession } from "../config/neo4j.ts";
import { fetchSuperheroCharacters } from "./SuperheroAPIService.ts";
import { JikanFetcherService } from "./JikanFetcherService.ts";
import { RelationshipBuilderService } from "./RelationshipBuilderService.ts";

export async function seedData(force: boolean = false) {
  const session = await getSession();
  
  try {
    const result = await session.run("MATCH (n:Character) RETURN count(n) as count");
    const count = result.records[0].get("count").toNumber();
    
    if (count > 50 && !force) {
      console.log(`Database already has ${count} characters. Skipping seeding.`);
      return;
    }

    console.log("Seeding database...");
    let savedCount = 0;

    // SuperheroAPI (Marvel & DC)
    try {
      console.log("Fetching Marvel and DC characters from SuperheroAPI...");
      let savedCountInStep = 0;
      
      const onFetched = async (char: any) => {
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
        `, char);
        savedCountInStep++;
        savedCount++;
        if (savedCountInStep % 50 === 0) {
          console.log(`Saved ${savedCountInStep} Marvel/DC characters so far...`);
        }
      };

      await fetchSuperheroCharacters(onFetched);
      console.log(`SuperheroAPI seeding complete. Total saved in this step: ${savedCountInStep}`);
    } catch (error) {
      console.error("Error during SuperheroAPI seeding:", error.message);
    }

    // Naruto & One Piece via updated JikanFetcherService
    try {
      console.log("Fetching Naruto and One Piece characters from Jikan...");
      const jikanService = new JikanFetcherService();
      const jikanSavedCount = await jikanService.fetchAndSave();
      savedCount += jikanSavedCount;
      console.log(`Saved ${jikanSavedCount} Naruto/One Piece characters to Neo4j.`);
    } catch (error) {
      console.error("Error during Jikan seeding:", error.message);
    }

    // Build relationships via new RelationshipBuilderService
    try {
      console.log("Building character relationships...");
      const relationshipBuilder = new RelationshipBuilderService();
      await relationshipBuilder.buildAll();
      console.log("Relationship building complete.");
    } catch (error) {
      console.error("Error during relationship building:", error.message);
    }
    
    console.log(`Total saved to Neo4j: ${savedCount}`);
    console.log("Seeding complete.");
  } finally {
    await session.close();
  }
}
