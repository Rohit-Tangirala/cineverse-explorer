import { getSession } from "../config/neo4j.ts";
import { Character } from "../models/Character.ts";

export class CharacterRepository {
  
  async findByName(name: string): Promise<Character | null> {
    const session = await getSession();
    try {
      const result = await session.run(
        "MATCH (c:Character {name: $name}) RETURN c",
        { name }
      );
      if (result.records.length === 0) return null;
      const props = result.records[0].get("c").properties;
      return { ...props, arcNumber: props.arcNumber.toNumber() } as Character;
    } finally {
      await session.close();
    }
  }

  async findByUniverse(universe: string): Promise<any[]> {
    const session = await getSession();
    try {
      const result = await session.run(
        "MATCH (c:Character {universe: $universe}) RETURN c, id(c) as id",
        { universe }
      );
      return result.records.map(r => {
        const props = r.get("c").properties;
        return { 
          ...props, 
          id: r.get("id").toNumber(),
          arcNumber: props.arcNumber.toNumber() 
        };
      });
    } finally {
      await session.close();
    }
  }

  async findByTeam(team: string): Promise<Character[]> {
    const session = await getSession();
    try {
      const result = await session.run(
        "MATCH (c:Character) WHERE c.team CONTAINS $team RETURN c",
        { team }
      );
      return result.records.map(r => {
        const props = r.get("c").properties;
        return { ...props, arcNumber: props.arcNumber.toNumber() } as Character;
      });
    } finally {
      await session.close();
    }
  }

  async findByRole(role: string): Promise<Character[]> {
    const session = await getSession();
    try {
      const result = await session.run(
        "MATCH (c:Character {role: $role}) RETURN c",
        { role }
      );
      return result.records.map(r => {
        const props = r.get("c").properties;
        return { ...props, arcNumber: props.arcNumber.toNumber() } as Character;
      });
    } finally {
      await session.close();
    }
  }

  async searchByName(keyword: string): Promise<Character[]> {
    const session = await getSession();
    try {
      const result = await session.run(
        "MATCH (c:Character) WHERE toLower(c.name) CONTAINS toLower($keyword) RETURN c",
        { keyword }
      );
      return result.records.map(r => {
        const props = r.get("c").properties;
        return { ...props, arcNumber: props.arcNumber.toNumber() } as Character;
      });
    } finally {
      await session.close();
    }
  }

  async findShortestPath(name1: string, name2: string): Promise<string[]> {
    const session = await getSession();
    try {
      const result = await session.run(
        "MATCH path = shortestPath((a:Character {name: $name1})-[*..10]-(b:Character {name: $name2})) RETURN [node IN nodes(path) | node.name] AS names",
        { name1, name2 }
      );
      if (result.records.length === 0) return [];
      return result.records[0].get("names");
    } finally {
      await session.close();
    }
  }

  async count(): Promise<number> {
    const session = await getSession();
    try {
      const result = await session.run("MATCH (c:Character) RETURN count(c) as count");
      return result.records[0].get("count").toNumber();
    } finally {
      await session.close();
    }
  }

  async countRelationships(): Promise<number> {
    const session = await getSession();
    try {
      const result = await session.run("MATCH ()-[r]->() RETURN count(r) as count");
      return result.records[0].get("count").toNumber();
    } finally {
      await session.close();
    }
  }

  async getSampleNames(limit: number): Promise<string[]> {
    const session = await getSession();
    try {
      const result = await session.run("MATCH (c:Character) RETURN c.name as name LIMIT $limit", { limit });
      return result.records.map(r => r.get("name"));
    } finally {
      await session.close();
    }
  }

  async findByUniverseWithRelationships(universe: string): Promise<any[]> {
    const session = await getSession();
    try {
      const result = await session.run(
        "MATCH (c:Character {universe: $universe}) OPTIONAL MATCH (c)-[r:ALLIED_WITH]->(ally:Character {universe: $universe}) OPTIONAL MATCH (c)-[e:ENEMY_OF]->(enemy:Character {universe: $universe}) RETURN c, collect(distinct ally) as allies, collect(distinct enemy) as enemies",
        { universe }
      );
      return result.records.map(r => ({
        character: r.get("c").properties,
        id: r.get("c").identity.toNumber(),
        allies: r.get("allies").map((a: any) => a ? { ...a.properties, id: a.identity.toNumber() } : null).filter(Boolean),
        enemies: r.get("enemies").map((e: any) => e ? { ...e.properties, id: e.identity.toNumber() } : null).filter(Boolean)
      }));
    } finally {
      await session.close();
    }
  }

  async create(character: Omit<Character, "id">): Promise<Character> {
    const session = await getSession();
    try {
      const result = await session.run(
        `CREATE (c:Character {
          name: $name,
          universe: $universe,
          role: $role,
          team: $team,
          bio: $bio,
          powers: $powers,
          firstAppearance: $firstAppearance,
          imageUrl: $imageUrl,
          arcNumber: $arcNumber,
          arcName: $arcName
        }) RETURN c, id(c) as id`,
        character
      );
      const record = result.records[0];
      const props = record.get("c").properties;
      return { 
        ...props, 
        id: record.get("id").toNumber(),
        arcNumber: props.arcNumber.toNumber() 
      } as Character;
    } finally {
      await session.close();
    }
  }

  async update(id: number, character: Partial<Character>): Promise<Character | null> {
    const session = await getSession();
    try {
      const result = await session.run(
        `MATCH (c:Character) WHERE id(c) = $id
         SET c += $props
         RETURN c, id(c) as id`,
        { id, props: character }
      );
      if (result.records.length === 0) return null;
      const record = result.records[0];
      const props = record.get("c").properties;
      return { 
        ...props, 
        id: record.get("id").toNumber(),
        arcNumber: typeof props.arcNumber?.toNumber === 'function' ? props.arcNumber.toNumber() : (props.arcNumber || 1)
      } as Character;
    } finally {
      await session.close();
    }
  }

  async delete(id: number): Promise<boolean> {
    const session = await getSession();
    try {
      const result = await session.run(
        `MATCH (c:Character) WHERE id(c) = $id
         DETACH DELETE c
         RETURN count(c) as deleted`,
        { id }
      );
      return result.records[0].get("deleted").toNumber() > 0;
    } finally {
      await session.close();
    }
  }

  async getDashboardStats(): Promise<any> {
    const session = await getSession();
    try {
      // 1. Global Stats
      const globalResult = await session.run(`
        MATCH (c:Character)
        WITH count(c) as totalCharacters
        MATCH ()-[r]->()
        WITH totalCharacters, count(r) as totalRelationships
        MATCH (c:Character)
        WITH totalCharacters, totalRelationships, c.universe as universe, count(c) as count
        RETURN totalCharacters, totalRelationships, collect({universe: universe, count: count}) as universeDistribution
      `);

      // 2. Universe Specific Stats
      const universeStatsResult = await session.run(`
        MATCH (c:Character)
        WITH c.universe as universe, 
             count(c) as total,
             sum(case when c.role = 'Hero' then 1 else 0 end) as heroes,
             sum(case when c.role = 'Villain' then 1 else 0 end) as villains
        
        // Most connected character per universe
        OPTIONAL MATCH (c2:Character {universe: universe})-[r]-()
        WITH universe, total, heroes, villains, c2, count(r) as connections
        ORDER BY connections DESC
        WITH universe, total, heroes, villains, collect({name: c2.name, connections: connections})[0] as mostConnected
        
        // Top 5 Heroes by connections
        OPTIONAL MATCH (h:Character {universe: universe, role: 'Hero'})-[r1]-()
        WITH universe, total, heroes, villains, mostConnected, h, count(r1) as hConnections
        ORDER BY hConnections DESC
        WITH universe, total, heroes, villains, mostConnected, collect({name: h.name, connections: hConnections})[0..5] as topHeroes
        
        // Top 5 Villains by connections
        OPTIONAL MATCH (v:Character {universe: universe, role: 'Villain'})-[r2]-()
        WITH universe, total, heroes, villains, mostConnected, topHeroes, v, count(r2) as vConnections
        ORDER BY vConnections DESC
        WITH universe, total, heroes, villains, mostConnected, topHeroes, collect({name: v.name, connections: vConnections})[0..5] as topVillains
        
        RETURN universe, total, heroes, villains, mostConnected, topHeroes, topVillains
      `);

      const global = globalResult.records[0];
      const universes = universeStatsResult.records.map(r => ({
        universe: r.get("universe"),
        total: r.get("total").toNumber(),
        heroes: r.get("heroes").toNumber(),
        villains: r.get("villains").toNumber(),
        mostConnected: r.get("mostConnected"),
        topHeroes: r.get("topHeroes").map((h: any) => ({ ...h, connections: h.connections.toNumber() })),
        topVillains: r.get("topVillains").map((v: any) => ({ ...v, connections: v.connections.toNumber() }))
      }));

      return {
        global: {
          totalCharacters: global.get("totalCharacters").toNumber(),
          totalRelationships: global.get("totalRelationships").toNumber(),
          universeDistribution: global.get("universeDistribution").map((d: any) => ({ ...d, count: d.count.toNumber() }))
        },
        universes
      };
    } finally {
      await session.close();
    }
  }
}
