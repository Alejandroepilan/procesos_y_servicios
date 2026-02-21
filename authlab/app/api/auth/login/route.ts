import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { readUsers } from "../../../../lib/users";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email y contraseña son obligatorios" }, { status: 400 });
    }

    const users = await readUsers();
    const user = users.find(u => u.email === email); // buscamos usuario con ese email
    if (!user) {
      return NextResponse.json({ ok: false, error: "Credenciales inválidas" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash); // comparamos contraseña con hash guardado
    if (!ok) {
      return NextResponse.json({ ok: false, error: "Credenciales inválidas" }, { status: 401 });
    }

    return NextResponse.json({ ok: true, email });
  } catch {
    return NextResponse.json({ ok: false, error: "Error interno" }, { status: 500 });
  }
}