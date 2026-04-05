import { getSession } from "../config/neo4j.ts";
import { User } from "../models/User.ts";

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const session = await getSession();
    try {
      const result = await session.run(
        "MATCH (u:User {email: $email}) RETURN u, id(u) as id",
        { email }
      );
      if (result.records.length === 0) return null;
      const record = result.records[0];
      const props = record.get("u").properties;
      return { 
        ...props, 
        id: record.get("id").toNumber() 
      } as User;
    } finally {
      await session.close();
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    const session = await getSession();
    try {
      const result = await session.run(
        "MATCH (u:User {username: $username}) RETURN u, id(u) as id",
        { username }
      );
      if (result.records.length === 0) return null;
      const record = result.records[0];
      const props = record.get("u").properties;
      return { 
        ...props, 
        id: record.get("id").toNumber() 
      } as User;
    } finally {
      await session.close();
    }
  }

  async create(user: Omit<User, "id">): Promise<User> {
    const session = await getSession();
    try {
      const result = await session.run(
        `CREATE (u:User {
          username: $username, 
          email: $email, 
          passwordHash: $passwordHash, 
          createdAt: $createdAt,
          role: $role
        }) RETURN u, id(u) as id`,
        user
      );
      const record = result.records[0];
      const props = record.get("u").properties;
      return { 
        ...props, 
        id: record.get("id").toNumber() 
      } as User;
    } finally {
      await session.close();
    }
  }

  async addFavorite(userId: number, characterName: string): Promise<void> {
    const session = await getSession();
    try {
      await session.run(
        `MATCH (u:User) WHERE id(u) = $userId
         MATCH (c:Character {name: $characterName})
         MERGE (u)-[:FAVOURITED {createdAt: datetime()}]->(c)`,
        { userId, characterName }
      );
    } finally {
      await session.close();
    }
  }

  async removeFavorite(userId: number, characterName: string): Promise<void> {
    const session = await getSession();
    try {
      await session.run(
        `MATCH (u:User) WHERE id(u) = $userId
         MATCH (c:Character {name: $characterName})
         MATCH (u)-[r:FAVOURITED]->(c)
         DELETE r`,
        { userId, characterName }
      );
    } finally {
      await session.close();
    }
  }

  async isFavorite(userId: number, characterName: string): Promise<boolean> {
    const session = await getSession();
    try {
      const result = await session.run(
        `MATCH (u:User) WHERE id(u) = $userId
         MATCH (c:Character {name: $characterName})
         RETURN EXISTS((u)-[:FAVOURITED]->(c)) as isFav`,
        { userId, characterName }
      );
      return result.records[0].get("isFav");
    } finally {
      await session.close();
    }
  }

  async getFavorites(userId: number): Promise<any[]> {
    const session = await getSession();
    try {
      const result = await session.run(
        `MATCH (u:User) WHERE id(u) = $userId
         MATCH (u)-[:FAVOURITED]->(c:Character)
         RETURN c, id(c) as id ORDER BY c.name ASC`,
        { userId }
      );
      return result.records.map(r => {
        const props = r.get("c").properties;
        return { 
          ...props, 
          id: r.get("id").toNumber(),
          arcNumber: typeof props.arcNumber?.toNumber === 'function' ? props.arcNumber.toNumber() : (props.arcNumber || 1)
        };
      });
    } finally {
      await session.close();
    }
  }

  async checkAdminExists(): Promise<boolean> {
    const session = await getSession();
    try {
      const result = await session.run(
        "MATCH (u:User {role: 'ADMIN'}) RETURN count(u) as count",
        {}
      );
      return result.records[0].get("count").toNumber() > 0;
    } finally {
      await session.close();
    }
  }
}
