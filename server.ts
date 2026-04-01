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
    const now = new Date();
    
    // Simulate multi-agent reasoning for the demo
    if (message.toLowerCase().includes("os exam")) {
      setTimeout(() => {
        res.json({
          response: "I've analyzed your workload. Tuesday is busy with your 2 PM meeting, so I've blocked 10 AM - 12 PM for Assignment 1. Since your OS exam is Friday, I've scheduled deep-work study blocks on Wednesday and Thursday morning based on your 'Process Scheduling' notes. I also recommend finishing Assignment 2 by Thursday night to keep Friday clear for the exam.",
          agents_involved: ["TaskAgent", "ScheduleAgent", "KnowledgeAgent"],
          steps: [
            { 
              agent: "Orchestrator", 
              status: "completed", 
              message: "Decomposing request: Exam prep + Task prioritization.",
              timestamp: new Date(now.getTime() + 100).toISOString(),
              decision: "Route to TaskAgent for deadline retrieval."
            },
            { 
              agent: "TaskAgent", 
              status: "completed", 
              message: "Queried AlloyDB: Found 3 pending assignments.",
              timestamp: new Date(now.getTime() + 400).toISOString(),
              decision: "Identify 'Assignment 2' as high-priority due to Friday deadline."
            },
            { 
              agent: "ScheduleAgent", 
              status: "completed", 
              message: "Accessed MCP: Identified conflict on Tuesday 2PM.",
              timestamp: new Date(now.getTime() + 800).toISOString(),
              decision: "Conflict Resolution: Recommend moving Assignment 1 prep to 10 AM Tuesday."
            },
            { 
              agent: "KnowledgeAgent", 
              status: "completed", 
              message: "Vector Search: Retrieved 'Process Scheduling' summaries.",
              timestamp: new Date(now.getTime() + 1200).toISOString(),
              decision: "Inject 'Process Scheduling' context into study plan."
            },
            { 
              agent: "Orchestrator", 
              status: "completed", 
              message: "Synthesizing optimal schedule...",
              timestamp: new Date(now.getTime() + 1600).toISOString(),
              decision: "Finalize plan with conflict-free study blocks."
            }
          ],
          actions: [
            { type: "calendar", detail: "Blocked 10 AM - 12 PM Tuesday" },
            { type: "task", detail: "Prioritized Assignment 2 for Thursday" }
          ]
        });
      }, 2000);
    } else {
      res.json({
        response: "I'm ready to help you manage your university life. What's on your mind?",
        agents_involved: ["OrchestratorAgent"],
        steps: [
          { 
            agent: "Orchestrator", 
            status: "completed", 
            message: "Listening for user input...",
            timestamp: now.toISOString(),
            decision: "Wait for student query."
          }
        ]
      });
    }
  });

  // Demo Setup Endpoint
  app.post("/api/demo/setup", (req, res) => {
    res.json({
      status: "success",
      message: "Demo environment preloaded with sample tasks, calendar events, and lecture notes in AlloyDB AI.",
      data_points: {
        tasks: 12,
        events: 8,
        notes: 45
      }
    });
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
