import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.SUPERHERO_API_KEY || "6241416199614401";
const BASE_URL = `https://superheroapi.com/api/${API_KEY}`;

export async function fetchSuperheroCharacters(onCharacterFetched?: (char: any) => Promise<void>) {
  const maxId = 731;
  const concurrency = 15;
  const ids = Array.from({ length: maxId }, (_, i) => i + 1);
  const results: any[] = [];

  console.log(`Starting SuperheroAPI fetch for ${maxId} characters with concurrency ${concurrency}...`);

  const fetchById = async (id: number) => {
    try {
      if (id <= 10) console.log(`Fetching Superhero ID ${id}...`);
      const response = await axios.get(`${BASE_URL}/${id}`);
      const data = response.data;

      if (id <= 10) console.log(`Response for ID ${id}:`, data.response, data.name || data.error);

      if (data.response === "error") return null;

      const publisher = data.biography.publisher;
      let universe = "Other";
      if (publisher?.includes("Marvel")) universe = "Marvel";
      else if (publisher?.includes("DC")) universe = "DC";

      if (universe === "Other") return null;

      const alignment = data.biography.alignment;
      const role = alignment === "good" ? "hero" : alignment === "bad" ? "villain" : "antihero";

      const bio = data.biography["full-name"] 
        ? `Real name: ${data.biography["full-name"]}. Born in ${data.biography["place-of-birth"] || "unknown"}.`
        : `Character from the ${universe} universe`;

      const character = {
        name: data.name,
        universe,
        role,
        team: data.connections["group-affiliation"] !== "-" ? data.connections["group-affiliation"] : "Unknown",
        bio: bio,
        powers: Object.entries(data.powerstats)
          .map(([stat, value]) => `${stat}: ${value}`)
          .join(", "),
        firstAppearance: data.biography["first-appearance"] !== "-" ? data.biography["first-appearance"] : "Unknown",
        imageUrl: data.image.url ? data.image.url.replace('http://', 'https://') : null,
        arcNumber: 1,
        arcName: "Main Story"
      };

      if (onCharacterFetched) {
        await onCharacterFetched(character);
      }

      return character;
    } catch (error) {
      return null;
    }
  };

  // Parallel fetching with concurrency control
  for (let i = 0; i < ids.length; i += concurrency) {
    const chunk = ids.slice(i, i + concurrency);
    const chunkResults = await Promise.all(chunk.map(id => fetchById(id)));
    chunkResults.forEach(res => {
      if (res) results.push(res);
    });
    
    const processedCount = i + chunk.length;
    if (processedCount % 100 === 0 || processedCount === maxId) {
      console.log(`Processed ${processedCount} IDs...`);
    }
  }

  // Fallback if API fails completely
  if (results.length === 0) {
    console.warn("SuperheroAPI returned no results. Using fallback character list.");
    const fallbacks = [
      { name: "Spider-Man", universe: "Marvel", role: "hero", team: "Avengers", bio: "Peter Parker, bit by a radioactive spider.", powers: "Web-slinging, Wall-crawling", firstAppearance: "Amazing Fantasy #15", imageUrl: "https://picsum.photos/seed/spiderman/200/300", arcNumber: 1, arcName: "Origins" },
      { name: "Iron Man", universe: "Marvel", role: "hero", team: "Avengers", bio: "Tony Stark, billionaire in a suit of armor.", powers: "Flight, Lasers, Genius", firstAppearance: "Tales of Suspense #39", imageUrl: "https://picsum.photos/seed/ironman/200/300", arcNumber: 1, arcName: "Origins" },
      { name: "Captain America", universe: "Marvel", role: "hero", team: "Avengers", bio: "Steve Rogers, the first super soldier.", powers: "Super strength, Shield", firstAppearance: "Captain America Comics #1", imageUrl: "https://picsum.photos/seed/cap/200/300", arcNumber: 1, arcName: "Origins" },
      { name: "Thanos", universe: "Marvel", role: "villain", team: "Black Order", bio: "The Mad Titan seeking the Infinity Stones.", powers: "Super strength, Eternal physiology", firstAppearance: "Iron Man #55", imageUrl: "https://picsum.photos/seed/thanos/200/300", arcNumber: 2, arcName: "Infinity Saga" },
      { name: "Batman", universe: "DC", role: "hero", team: "Justice League", bio: "Bruce Wayne, the Dark Knight of Gotham.", powers: "Genius, Gadgets, Martial Arts", firstAppearance: "Detective Comics #27", imageUrl: "https://picsum.photos/seed/batman/200/300", arcNumber: 1, arcName: "Origins" },
      { name: "Superman", universe: "DC", role: "hero", team: "Justice League", bio: "Clark Kent, the Man of Steel from Krypton.", powers: "Flight, Strength, Heat Vision", firstAppearance: "Action Comics #1", imageUrl: "https://picsum.photos/seed/superman/200/300", arcNumber: 1, arcName: "Origins" },
      { name: "Wonder Woman", universe: "DC", role: "hero", team: "Justice League", bio: "Diana Prince, Amazonian warrior princess.", powers: "Strength, Lasso of Truth", firstAppearance: "All Star Comics #8", imageUrl: "https://picsum.photos/seed/ww/200/300", arcNumber: 1, arcName: "Origins" },
      { name: "Joker", universe: "DC", role: "villain", team: "Injustice League", bio: "The Clown Prince of Crime.", powers: "Chaos, Gadgets", firstAppearance: "Batman #1", imageUrl: "https://picsum.photos/seed/joker/200/300", arcNumber: 2, arcName: "Gotham Chaos" }
    ];
    
    for (const fb of fallbacks) {
      if (onCharacterFetched) await onCharacterFetched(fb);
      results.push(fb);
    }
  }

  const marvelList = results.filter(c => c.universe === "Marvel");
  const dcList = results.filter(c => c.universe === "DC");
  
  console.log(`SuperheroAPI complete: ${marvelList.length} Marvel, ${dcList.length} DC`);

  return { marvelList, dcList };
}
