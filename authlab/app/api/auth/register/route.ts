import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { readUsers, writeUsers } from "../../../../lib/users";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email y contraseña son obligatorios" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ ok: false, error: "Contraseña mínima: 6 caracteres" }, { status: 400 });
    }

    const users = await readUsers();
    const exists = users.some(u => u.email === email); // comprobamos si ya existe usuario con ese email
    if (exists) {
      return NextResponse.json({ ok: false, error: "El usuario ya existe" }, { status: 409 }); 
    }

    const saltRounds = 10; // numero de rondas de salt para bcrypt
    const passwordHash = await bcrypt.hash(password, saltRounds); // hasheamos la contraseña

    users.push({ email, passwordHash, createdAt: new Date().toISOString() }); // añadimos nuevo usuario al array
    await writeUsers(users);

    return NextResponse.json({ ok: true, email });
  } catch {
    return NextResponse.json({ ok: false, error: "Error interno" }, { status: 500 });
  }
}