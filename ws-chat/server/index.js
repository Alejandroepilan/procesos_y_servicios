import { WebSocketServer } from "ws";

// creamos un servidor websocket en el puerto 8080
const wss = new WebSocketServer({ port: 8080 });

// funcion para enviar un mensaje a todos los clientes conectados
function broadcast(obj) {
  const msg = JSON.stringify(obj);
  for (const client of wss.clients) {
    if (client.readyState === 1) {
      client.send(msg);
    }
  }
}

// cada vez que un cliente se conecta, le asignamos un manejador de mensajes
wss.on("connection", (ws) => {
  ws.on("message", (raw) => {
    let data;
    try {
      data = JSON.parse(raw.toString());
    } catch {
      return;
    }

    // si el mensaje es de tipo "chat", lo enviamos a todos los clientes
    if (data.type === "chat") {
      const name = String(data.name || "Anónimo").trim();
      const text = String(data.text || "").trim();
      if (!text) return;

      broadcast({
        type: "chat",
        name,
        text,
        ts: Date.now(), // timestamp para ordenar los mensajes
      });
    }
  });
});

console.log("Chat server running on ws://localhost:8080");
