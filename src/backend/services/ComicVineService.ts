import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.COMICVINE_KEY || "f7633378eb1ce1c8ef9be2ab65be5793461b4efb";
const BASE_URL = "https://comicvine.gamespot.com/api";

export async function fetchComicVineCharacters(publisherId: number, universe: "Marvel" | "DC") {
  const characters: any[] = [];
  let offset = 0;
  const limit = 50; // Reduced limit for faster initial seed

  try {
    const url = `${BASE_URL}/characters/?api_key=${API_KEY}&format=json&filter=publisher:${publisherId}&field_list=id,name,real_name,aliases,deck,image,first_appeared_in_issue,powers,teams&limit=${limit}&offset=${offset}`;
    const response = await axios.get(url);
    
    if (response.data && response.data.results) {
      for (const item of response.data.results) {
        const teams = item.teams ? item.teams.map((t: any) => t.name).join(", ") : "";
        let role: "hero" | "villain" | "antihero" = "antihero";
        
        const lowerTeams = teams.toLowerCase();
        if (lowerTeams.includes("avengers") || lowerTeams.includes("justice league") || lowerTeams.includes("x-men") || lowerTeams.includes("fantastic four") || lowerTeams.includes("teen titans")) {
          role = "hero";
        } else if (lowerTeams.includes("hydra") || lowerTeams.includes("sinestro corps") || lowerTeams.includes("legion of doom") || lowerTeams.includes("brotherhood of mutants") || lowerTeams.includes("masters of evil")) {
          role = "villain";
        }

        characters.push({
          name: item.name,
          universe,
          role,
          team: teams,
          bio: item.deck || "No biography available.",
          powers: item.powers ? item.powers.map((p: any) => p.name).join(", ") : "Unknown",
          firstAppearance: item.first_appeared_in_issue ? item.first_appeared_in_issue.name : "Unknown",
          imageUrl: item.image ? item.image.medium_url : "",
          arcNumber: 1,
          arcName: "Phase 1"
        });
      }
    }
  } catch (error) {
    console.error(`Error fetching ${universe} characters:`, error);
  }

  return characters;
}
