"use client";

import { useEffect, useRef, useState } from "react";

type Msg = {
  type: "chat";
  name: string;
  text: string;
  ts: number;
};

export default function Page() {
  const [status, setStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");
  const [name, setName] = useState("Alejandro");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);

  const wsRef = useRef<WebSocket | null>(null);

  // conectamos al servidor ws
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;

    ws.onopen = () => setStatus("connected");
    ws.onclose = () => setStatus("disconnected");

    // cada vez que recibimos un mensaje, lo añadimos al estado
    ws.onmessage = (e) => {
      const msg: Msg = JSON.parse(e.data);
      setMessages((prev) => [...prev, msg]);
    };

    return () => ws.close();
  }, []);

  // funcion para enviar un mensaje al servidor
  function send() {
    const ws = wsRef.current;
    // si no hay conexion no hacemos nada
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    const trimmed = text.trim();
    if (!trimmed) return;

    // enviamos el mensaje como json
    ws.send(
      JSON.stringify({
        type: "chat",
        name,
        text: trimmed,
      }),
    );

    setText("");
  }

  return (
    <main className="min-h-screen bg-indigo-950 text-slate-100 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
        <h1 className="text-xl font-semibold mb-5 text-slate-200">WS Chat</h1>

        <div className="mb-4">
          <label className="text-sm text-slate-400">Nombre</label>
          <input
            className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="border border-slate-800 rounded-lg h-64 overflow-y-auto p-3 bg-slate-800 mb-4 space-y-2">
          {messages.map((m, i) => (
            <div key={i} className="text-sm">
              <span className="font-semibold text-indigo-400">{m.name}</span>
              <span className="text-slate-400"> · </span>
              <span className="text-slate-200">{m.text}</span>
              <span className="text-xs text-slate-500 ml-2">
                {new Date(m.ts).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Escribe un mensaje..."
          />
          <button
            onClick={send}
            className="bg-indigo-600 hover:bg-indigo-500 transition px-4 rounded-lg font-medium"
          >
            Enviar
          </button>
        </div>

        <div className="mt-3 text-xs text-slate-500">
          Estado conexión: {status}
        </div>
      </div>
    </main>
  );
}
