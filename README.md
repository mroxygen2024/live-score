# ⚽ **Football Match Tracker — Real-Time LiveScore App**

A fully working real-time football match tracking system built with:

- **Vite + React + TypeScript (TSX)**
- **Tailwind CSS v4**
- **shadcn UI**
- **Express.js**
- **Server-Sent Events (SSE / Event Streams)**

Admins can create matches and broadcast live events.
Users can see live updates instantly — **no refresh required**.

---

## 🎥 **Demo Video**

👉 **Demo Video:**

```
https://go.screenpal.com/watch/cTXui1nqgiO
```

---

## 🚀 **Features**

### 👑 Admin

- Create matches (Team A vs Team B)
- Start (broadcast) a match
- Automatically sends real-time events via **SSE**

### 👤 Users

#### Match List Page

- See all live matches
- Realtime score updates
- “View Details” button

#### Match Details Page

- Real-time stream of:

  - Goals
  - Cards
  - Fouls / events

---

## 🏗️ **Tech Stack**

### Frontend

- **React + TSX (Vite)**
- **Tailwind CSS v4**
- **shadcn UI**
- **react-router-dom**
- **EventSource API** (SSE)

### Backend

- **Node.js + Express**
- **Server-Sent Events**
- **CORS**
- **In-memory database** (simple JS objects)

---

## 📂 **Project Structure**

```
.
├── server/
│   ├── server.ts
│   ├── routes/
│   ├── data/
    ├── events/
│   └── services/
│
└── client/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── App.tsx
    │   └── main.tsx
```

---

## ⚙️ **Installation & Setup**

### 📌 1. Clone Repo

```bash
git clone https://github.com/mroxygen2024/live-score.git
cd live-score
```

---

## 🖥️ **Backend Setup**

```bash
cd server
npm install
npm start
```

Backend will run on:

```
http://localhost:4000
```

---

## 💻 **Frontend Setup**

```bash
cd client
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

🚀 Features
👑 Admin

Create matches

Start matches

Add live match events (goals, cards, fouls)

Automatically broadcast real-time updates with SSE

👤 Users
Match List Page

See all live matches

Real-time scores

Match Details Page

Real-time event stream for selected match

### 3️⃣ Open Frontend → Live Updates Appear Instantly

---

## 📌 **Event Types Supported**

| Event   | Description                 |
| ------- | --------------------------- |
| `goal`  | Real-time goal update       |
| `card`  | Yellow/red card event       |
| `foul`  | Foul or general match event |
| `score` | Auto-updated match score    |

---

## 🎨 **UI Theme **

- `#001433` (Main Background)
- `#607D8B` (Buttons)
- `#e87e10` (Accent)
- `#F57C00` (Hover)
- `slate-100` (Text)

---

## 🛠️ **Development Notes**

- No database used (in-memory data)
- SSE stays open until users close browser
- Auto flush for streaming events
- Works perfectly on local network

---

## 📜 **License**

MIT License — free to use, modify, and distribute.

---
