import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock API for the Hackathon Demo
  app.post("/api/chat", (req, res) => {
    const { message } = req.body;
    
    // Simulate multi-agent reasoning for the demo
    if (message.toLowerCase().includes("os exam")) {
      setTimeout(() => {
        res.json({
          response: "I've analyzed your workload. Tuesday is busy with your 2 PM meeting, so I've blocked 10 AM - 12 PM for Assignment 1. Since your OS exam is Friday, I've scheduled deep-work study blocks on Wednesday and Thursday morning based on your 'Process Scheduling' notes. I also recommend finishing Assignment 2 by Thursday night to keep Friday clear for the exam.",
          agents_involved: ["TaskAgent", "ScheduleAgent", "KnowledgeAgent"],
          actions: [
            { type: "calendar", detail: "Blocked 10 AM - 12 PM Tuesday" },
            { type: "task", detail: "Prioritized Assignment 2 for Thursday" }
          ]
        });
      }, 1500);
    } else {
      res.json({
        response: "I'm ready to help you manage your university life. What's on your mind?",
        agents_involved: ["OrchestratorAgent"]
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
