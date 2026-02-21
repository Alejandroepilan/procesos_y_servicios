import { promises as fs } from "fs";
import path from "path";

export type User = {
  email: string;
  passwordHash: string;
  createdAt: string;
};

// obtenemos ruta absoluta y guardamos en data/users.json
const filePath = path.join(process.cwd(), "data", "users.json");

// aseguramos que el directorio y el archivo existen, si no los creamos
async function ensureFile() {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]", "utf-8");
  }
}

// leemos usuarios, parseamos json a objeto y devolvemos array de usuarios
export async function readUsers(): Promise<User[]> {
  await ensureFile();
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as User[];
}

// escribimos array de usuarios, convirtiendo a json
export async function writeUsers(users: User[]) {
  await ensureFile();
  await fs.writeFile(filePath, JSON.stringify(users, null, 2), "utf-8");
}