import neo4j from "neo4j-driver";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.NEO4J_URI || "neo4j+s://3f001a67.databases.neo4j.io";
const user = process.env.NEO4J_USER || "3f001a67";
const password = process.env.NEO4J_PASSWORD || "QsNPiRoPbaM7tKgvLfzlnNCfWnW62XO5-q2WeGMJPyU";

export const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

export async function getSession() {
  return driver.session();
}
