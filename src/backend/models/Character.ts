export interface Character {
  id?: string;
  name: string;
  universe: "Marvel" | "DC" | "Naruto" | "One Piece";
  role: "hero" | "villain" | "antihero";
  team: string;
  bio: string;
  powers: string;
  firstAppearance: string;
  imageUrl: string;
  arcNumber: number;
  arcName: string;
}

export interface GraphData {
  nodes: {
    id: string;
    name: string;
    role: string;
    arcNumber: number;
    arcName: string;
    imageUrl: string;
  }[];
  edges: {
    from: string;
    to: string;
    type: string;
  }[];
}

export interface CharacterDetail extends Character {
  allies: { id: string; name: string }[];
  enemies: { id: string; name: string }[];
  knows: { id: string; name: string }[];
}
