import axios from "axios";

const BASE_URL = "https://api.jikan.moe/v4";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchJikanCharacters(animeId: number, universe: "Naruto" | "One Piece") {
  const characters: any[] = [];
  
  try {
    const url = `${BASE_URL}/anime/${animeId}/characters`;
    const response = await axios.get(url);
    
    if (response.data && response.data.data) {
      // Limit to top 30 characters for seeding performance
      const items = response.data.data.slice(0, 30);
      
      for (const item of items) {
        await delay(400); // Rate limit compliance
        
        try {
          const detailUrl = `${BASE_URL}/characters/${item.character.mal_id}`;
          const detailRes = await axios.get(detailUrl);
          const detail = detailRes.data.data;
          
          characters.push({
            name: detail.name,
            universe,
            role: "hero", // Default, logic can be refined
            team: universe === "Naruto" ? "Hidden Leaf" : "Straw Hat Pirates",
            bio: detail.about || "No biography available.",
            powers: "Various techniques",
            firstAppearance: "Chapter 1",
            imageUrl: detail.images?.jpg?.image_url || "",
            arcNumber: characters.length + 1,
            arcName: `Arc ${Math.ceil((characters.length + 1) / 5)}`
          });
        } catch (err) {
          console.error(`Error fetching detail for ${item.character.name}:`, err);
        }
      }
    }
  } catch (error) {
    console.error(`Error fetching ${universe} characters:`, error);
  }

  return characters;
}
