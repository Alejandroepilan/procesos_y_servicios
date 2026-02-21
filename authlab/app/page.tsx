"use client";

import { useMemo, useState } from "react";
import axios from "axios";

type ApiResp = { ok: true; email: string } | { ok: false; error: string };

export default function Page() {
  const [mode, setMode] = useState<"register" | "login">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResp | null>(null);

  // titulo segun mdo guardado en memo
  const title = useMemo(
    () => (mode === "register" ? "Registro" : "Login"),
    [mode],
  );

  // peticion post segun el modo, y guardamos resultado o error
  async function submit() {
    try {
      setLoading(true);
      setResult(null);

      const { data } = await axios.post<ApiResp>(`/api/auth/${mode}`, {
        email,
        password,
      });

      setResult(data);
    } catch (error: any) {
      // Si el servidor devuelve error con mensaje lo mostramos, sino genereico
      if (error.response?.data) {
        setResult(error.response.data);
      } else {
        setResult({ ok: false, error: "Error de red" });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-xl px-4 py-12">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">AuthLab</h1>
          <p className="mt-1 text-sm text-slate-600">
            Registro/Login con hashing seguro usando bcrypt.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex gap-2">
            <button
              onClick={() => setMode("register")}
              className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                mode === "register"
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Registro
            </button>
            <button
              onClick={() => setMode("login")}
              className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                mode === "login"
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Login
            </button>
          </div>

          <div className="mt-5 space-y-3">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                placeholder="usuario@correo.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Contraseña</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                placeholder="mínimo 6 caracteres"
              />
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Procesando…" : title}
            </button>

            {result && (
              <div
                className={`rounded-xl border p-3 text-sm ${
                  result.ok
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-rose-200 bg-rose-50 text-rose-800"
                }`}
              >
                {result.ok ? `✅ OK: ${result.email}` : `❌ ${result.error}`}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
