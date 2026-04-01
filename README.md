<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/891523b8-d2ec-476b-82fb-95d8d85f1588

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

# 🚀 AgenticOS – The Operating System for Autonomous Productivity

> **“From prompts to autonomous execution.”**

---

## 🎯 Problem Statement

Students and professionals constantly switch between multiple apps — calendars, task managers, notes — yet still miss deadlines.

### Why does this happen?

* ❌ No coordination between tools
* ❌ No intelligent automation
* ❌ Manual planning is inefficient

---

## 💡 Solution

**AgenticOS** is a **multi-agent AI system** that intelligently orchestrates workflows across tools and data sources.

It:

* Automates task planning
* Schedules events dynamically
* Stores and retrieves knowledge
* Executes multi-step workflows

---

## 🧠 Multi-Agent Architecture

Instead of a single AI, the system uses:

* 🧠 **Orchestrator Agent** – controls decision-making
* 📋 **Task Agent** – manages tasks
* 📅 **Calendar Agent** – handles scheduling
* 📚 **Knowledge Agent** – manages notes & memory
* ⚙️ **Execution Agent** – finalizes workflows

---

## 🔄 Workflow

User Input → Orchestrator → Sub-Agents → MCP Tools → Database → Output + Trace

---

## ⚙️ Architecture Overview

```
User Query
   ↓
Orchestrator Agent
   ↓
-------------------------
| Task Agent            |
| Calendar Agent        |
| Knowledge Agent       |
-------------------------
   ↓
MCP Tool Layer
(create_task, schedule_event, store_note)
   ↓
AlloyDB AI (Structured + Vector Data)
   ↓
Final Output + Agent Trace
```

---

## 🔗 MCP Tool Integration

Integrated tools (simulated or real):

* `create_task()`
* `schedule_event()`
* `store_note()`

---

## 🗄️ Database (AlloyDB AI)

* Stores structured data: tasks, events, notes
* Supports **vector search for semantic retrieval**

Example:

```sql
SELECT * FROM notes
ORDER BY embedding <-> query_embedding
LIMIT 5;
```

---

## 📡 API Endpoint

### POST `/ask`

#### Example Input:

```json
{
  "query": "Plan my exam preparation for 7 days"
}
```

---

## 📊 Sample Output (Key Highlight)

```json
{
  "agents_used": ["Task Agent", "Calendar Agent", "Knowledge Agent"],
  "actions_taken": [
    "Generated study plan",
    "Scheduled time slots",
    "Stored revision notes"
  ],
  "tool_calls": [
    "create_task",
    "schedule_event",
    "store_note"
  ],
  "trace": [
    "Orchestrator → Task Agent",
    "Task Agent → created tasks",
    "Calendar Agent → scheduled events",
    "Knowledge Agent → stored notes"
  ],
  "final_output": "Your study plan is ready."
}
```

---

## 🚀 Tech Stack

* **Gemini (via Google AI Studio)**
* **FastAPI / Node.js Backend**
* **MCP (Model Context Protocol) Tool Layer**
* **AlloyDB AI (Structured + Vector Database)**

---

## 🎥 Demo Scenario

Input:

> “I have exams in 7 days. Plan my preparation.”

System:

* Creates tasks
* Schedules calendar
* Stores notes
* Shows **agent execution trace**

---

## 🏆 Why This Stands Out

* ✅ True multi-agent system
* ✅ Real workflow execution (not just chat)
* ✅ Transparent agent trace
* ✅ Smart use of Google Cloud stack
* ✅ Scalable, API-first design

---

## 👨‍💻 Author

Sai Ganesh
B.Tech CSE (AI & ML)

---

## ⭐ Tagline

**“One system. Multiple agents. Infinite productivity.”**
