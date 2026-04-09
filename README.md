<div align="center">

# 🌌 Cineverse Explorer

### *Your Gateway to the Ultimate Entertainment Universe*

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=24&duration=3000&pause=1000&color=8B5CF6&center=true&vCenter=true&width=600&lines=Explore+1%2C728+Characters;Across+4+Epic+Universes;Marvel+%7C+DC+%7C+Naruto+%7C+One+Piece;Graph-Based+Discovery;Find+Hidden+Connections" alt="Typing SVG" />

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Neo4j](https://img.shields.io/badge/Neo4j_Aura-008CC1?style=for-the-badge&logo=neo4j&logoColor=white)](https://neo4j.com/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Now-8B5CF6?style=for-the-badge)](https://cineverse-explorer-production.up.railway.app)
[![Railway](https://img.shields.io/badge/Railway-Deployed-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="700">

**[🌐 Live Demo](https://cineverse-explorer-production.up.railway.app)** • **[📖 Documentation](#-features)** • **[🐛 Report Bug](https://github.com/Rohit-Tangirala/cineverse-explorer/issues)** • **[✨ Request Feature](https://github.com/Rohit-Tangirala/cineverse-explorer/issues)**

</div>

---

## 📊 Project Stats

<div align="center">

| 📈 Metric | 🔢 Value |
|-----------|---------|
| **Total Characters** | 1,728 across 4 universes |
| **Graph Relationships** | 5,632 connections |
| **Marvel Characters** | 339 heroes & villains |
| **DC Characters** | 188 iconic figures |
| **Naruto Universe** | ~280 shinobi |
| **One Piece Universe** | ~921 pirates & marines |
| **API Sources** | SuperheroAPI + Jikan API |
| **Build Time** | 69 seconds |
| **First Load Time** | ~8 minutes (auto-seeding) |

</div>

---

## 🎯 The Problem We Solve

<div align="center">
<img src="https://user-images.githubusercontent.com/74038190/229223263-cf2e4b07-2615-4f87-9c38-e37600f8381a.gif" width="400">
</div>

Entertainment fans exploring complex fictional universes face **critical challenges**:

❌ **Fragmented Information** - Character data scattered across Wikipedia, fan wikis, Reddit, and YouTube  
❌ **No Relationship Visualization** - Traditional lists hide connections between characters  
❌ **Spoiler Exposure** - Existing platforms reveal the entire universe regardless of viewing progress  
❌ **Timeline Confusion** - Franchises spanning decades make watch orders impossible to navigate  
❌ **Scattered Data** - Marvel has 8,000+ characters, DC has 10,000+, yet no unified platform exists  

### ✅ Our Solution

**Cineverse Explorer** solves all these problems through:
- 🕸️ **Graph-Based Data Modeling** using Neo4j
- 🔍 **BFS Shortest Path Algorithm** to find connections between any two characters
- 🛡️ **Dynamic Spoiler Control** that filters by story arc
- 🎨 **Interactive Visual Exploration** with physics-based graph layouts
- 🤖 **AI-Powered Character Chat** using Google Gemini API

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [🚀 Getting Started](#-getting-started)
- [📸 Screenshots](#-screenshots)
- [🔌 API Documentation](#-api-documentation)
- [💾 Database Schema](#-database-schema)
- [🎨 Key Features Deep Dive](#-key-features-deep-dive)
- [📊 Data Pipeline](#-data-pipeline)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [👥 Team](#-team)
- [📜 License](#-license)

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎬 Core Features
- 🌐 **Interactive Graph Visualization** - Physics-based network rendering
- 🔥 **4 Complete Universes** - Marvel, DC, Naruto, One Piece
- 🛡️ **Spoiler Control** - Arc-based character filtering
- 🔍 **Relationship Finder** - BFS pathfinding between characters
- 📊 **Statistics Dashboard** - Universe analytics with charts
- 👤 **Character Profiles** - Detailed bios, powers, relationships

</td>
<td width="50%">

### ⚡ Advanced Features
- 🔐 **JWT Authentication** - Secure user accounts
- 👑 **Role-Based Access** - User & Admin permissions
- ⭐ **Favorites System** - Save and track characters
- 🤖 **AI Character Chat** - Talk to characters via Gemini API
- 🎯 **Character Comparison** - Side-by-side analysis
- 🖼️ **Image Proxy** - Bypass CDN hotlink protection

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

### Frontend
<div align="center">

![React](https://img.shields.io/badge/react_19-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

**Libraries:** vis-network `10.0.2` • Recharts `3.8.1` • Framer Motion `12.23.24` • Axios `1.14.0` • React Hot Toast `2.6.0`

</div>

### Backend
<div align="center">

![NodeJS](https://img.shields.io/badge/node.js_22-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

**Libraries:** neo4j-driver `6.0.1` • jsonwebtoken `9.0.3` • bcryptjs `3.0.3` • express-validator `7.3.2` • @google/genai `1.29.0`

</div>

### Database & APIs
<div align="center">

![Neo4j](https://img.shields.io/badge/Neo4j_Aura-008CC1?style=for-the-badge&logo=neo4j&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white)

**External APIs:** SuperheroAPI (Marvel/DC) • Jikan API (MyAnimeList - Naruto/One Piece)

</div>

### Deployment
<div align="center">

![Railway](https://img.shields.io/badge/Railway-%230B0D0E.svg?style=for-the-badge&logo=railway&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)

</div>

---

## 🏗️ Architecture

### 🎨 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Browser                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React 19 SPA (TypeScript + Tailwind CSS)               │  │
│  │  • vis-network graph visualization                       │  │
│  │  • React Router for navigation                           │  │
│  │  • Recharts for statistics                               │  │
│  │  • Framer Motion for animations                          │  │
│  └────────────────┬─────────────────────────────────────────┘  │
└───────────────────┼─────────────────────────────────────────────┘
                    │ HTTPS / REST API
                    │ JWT in Authorization Header
┌───────────────────┼─────────────────────────────────────────────┐
│                   ▼                                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Express.js Server (Node.js 22 + TypeScript)            │  │
│  │  • REST API Endpoints (/api/*)                           │  │
│  │  • JWT Authentication Middleware                         │  │
│  │  • Role-Based Access Control                             │  │
│  │  • Image Proxy Service                                   │  │
│  │  • Static File Serving (dist/)                           │  │
│  └────┬─────────────────────────────┬───────────────────────┘  │
│       │                             │                           │
│       │ Bolt Protocol (neo4j+s://)  │ HTTPS API Calls          │
│       ▼                             ▼                           │
│  ┌─────────────────────┐   ┌───────────────────────────────┐  │
│  │  Neo4j Aura Cloud   │   │  External APIs                │  │
│  │  • Graph Database   │   │  • SuperheroAPI (Marvel/DC)   │  │
│  │  • 200K nodes       │   │  • Jikan API (Naruto/OnePiece)│  │
│  │  • 400K edges       │   │  • Google Gemini API (AI)     │  │
│  │  • Cypher queries   │   └───────────────────────────────┘  │
│  └─────────────────────┘                                        │
│              Railway Cloud Platform                             │
└─────────────────────────────────────────────────────────────────┘
```

### 🗂️ Three-Tier Architecture

| Layer | Technology | Responsibility |
|-------|-----------|----------------|
| **Presentation** | React 19 + Tailwind CSS + vis-network | UI rendering, graph visualization, routing, auth state |
| **Business Logic** | Express.js + Node.js + TypeScript | REST API, authentication, data seeding, path finding |
| **Data** | Neo4j Aura (Cloud) | Graph storage, Cypher queries, relationship traversal |
| **External** | SuperheroAPI + Jikan API + Gemini | Real character data, AI chat |

---

## 🚀 Getting Started

### 📋 Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
```

### 🔑 API Keys Setup

You'll need API keys from these services:

1. **Neo4j Aura** (Free Tier)
   - Sign up at [neo4j.com/cloud/aura](https://neo4j.com/cloud/aura/)
   - Create a free AuraDB instance
   - Copy the connection URI and password

2. **SuperheroAPI** (Free)
   - Get your access token at [superheroapi.com](https://superheroapi.com/)

3. **Google Gemini API** (Free)
   - Get API key at [ai.google.dev](https://ai.google.dev/)

### 💾 Installation

#### 📦 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Rohit-Tangirala/cineverse-explorer.git
cd cineverse-explorer

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
```

#### 🔧 Environment Configuration

Create a `.env` file in the root directory:

```env
# Neo4j Database
NEO4J_URI=neo4j+s://your-instance-id.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_neo4j_password

# External APIs
SUPERHERO_API_TOKEN=your_superhero_api_token
GEMINI_API_KEY=your_gemini_api_key

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

#### ▶️ Run Development Server

```bash
# Start the backend server (runs on port 3000)
npm run dev

# In a new terminal, start the frontend (runs on port 5173)
cd client
npm run dev

# Or run both concurrently
npm run dev:all
```

Open [http://localhost:5173](http://localhost:5173) in your browser 🎉

#### 🏗️ Build for Production

```bash
# Build the React frontend
cd client
npm run build

# The backend will automatically serve the built files from client/dist/
npm start
```

---

## 📸 Screenshots

<div align="center">

### 🏠 Interactive Graph Visualization
> **Explore 1,728 characters across 4 universes with physics-based network rendering**

<img src="https://via.placeholder.com/900x500/0f172a/8b5cf6?text=Universe+Graph+with+vis-network+%7C+Color-coded+by+Role+%7C+Physics+Simulation" alt="Graph View" width="90%">

*Nodes colored by role: 🟢 Heroes | 🔴 Villains | 🟡 Antiheroes | Edges: 💚 Allied | ❤️ Enemy*

---

### 🛡️ Spoiler Control System
> **Dynamic arc-based filtering prevents spoilers for new fans**

<img src="https://via.placeholder.com/900x500/0f172a/ec4899?text=Spoiler+Control+Slider+%7C+Filter+by+Story+Arc+%7C+Safe+Exploration" alt="Spoiler Control" width="90%">

*Adjust the arc slider to show only characters from arcs you've watched*

---

### 🔍 Relationship Path Finder
> **BFS algorithm finds shortest connection between any two characters**

<img src="https://via.placeholder.com/900x500/0f172a/10b981?text=Path+Finder+%7C+BFS+Algorithm+%7C+Character+Connections" alt="Path Finder" width="90%">

*Example: Black Widow → Iron Man → Thanos → Thor (3 steps)*

---

### 👤 Character Profile Pages
> **Detailed information with allies, enemies, powers, and AI chat**

<img src="https://via.placeholder.com/900x500/0f172a/f59e0b?text=Character+Profile+%7C+Bio+%7C+Powers+%7C+Relationships+%7C+AI+Chat" alt="Character Profile" width="90%">

*Full biography, power stats, team affiliations, and AI-powered character conversations*

---

### 📊 Statistics Dashboard
> **Analytics across all universes with interactive charts**

<img src="https://via.placeholder.com/900x500/0f172a/6366f1?text=Statistics+Dashboard+%7C+Universe+Analytics+%7C+Charts+%26+Metrics" alt="Stats Dashboard" width="90%">

*Universe distribution, role breakdown, most connected characters, and more*

---

### 🎯 Character Comparison
> **Side-by-side analysis of any two characters**

<img src="https://via.placeholder.com/900x500/0f172a/14b8a6?text=Character+Comparison+%7C+Side-by-Side+Analysis+%7C+Powers+%26+Stats" alt="Comparison" width="90%">

---

### 📱 Fully Responsive Design

<table align="center">
<tr>
<td width="30%">
<img src="https://via.placeholder.com/300x600/0f172a/8b5cf6?text=Mobile+View" alt="Mobile">
<p align="center"><strong>Mobile</strong></p>
</td>
<td width="35%">
<img src="https://via.placeholder.com/400x600/0f172a/8b5cf6?text=Tablet+View" alt="Tablet">
<p align="center"><strong>Tablet</strong></p>
</td>
<td width="35%">
<img src="https://via.placeholder.com/500x350/0f172a/8b5cf6?text=Desktop+View" alt="Desktop">
<p align="center"><strong>Desktop</strong></p>
</td>
</tr>
</table>

</div>

---

## 🔌 API Documentation

### 🔐 Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | Public | Register new user, returns JWT |
| `POST` | `/api/auth/login` | Public | Login with email/password, returns JWT |
| `GET` | `/api/auth/me` | 🔒 User | Get current user profile |

**Example Login Request:**
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "tony@stark.com",
  "password": "iamironman"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "email": "tony@stark.com",
    "username": "tonystark",
    "role": "USER"
  }
}
```

### 🎭 Character Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/characters/graph?universe=X` | Public | Get graph data for vis-network (nodes + edges) |
| `GET` | `/api/characters/detail/:name` | Public | Full character profile with relationships |
| `GET` | `/api/characters/path?from=X&to=Y` | Public | BFS shortest path between two characters |
| `GET` | `/api/characters/search?q=keyword` | Public | Search characters by name |
| `POST` | `/api/characters` | 🔒 Admin | Add new character to database |
| `PUT` | `/api/characters/:id` | 🔒 Admin | Update character properties |
| `DELETE` | `/api/characters/:id` | 🔒 Admin | Delete character from database |

**Example Graph Query:**
```javascript
GET /api/characters/graph?universe=Marvel

// Response
{
  "nodes": [
    {
      "id": "Iron Man",
      "label": "Iron Man",
      "role": "hero",
      "team": "Avengers",
      "color": "#22c55e",
      "arcNumber": 1
    },
    // ... more nodes
  ],
  "edges": [
    {
      "from": "Iron Man",
      "to": "Captain America",
      "label": "ALLIED_WITH",
      "color": "#22c55e"
    },
    // ... more edges
  ]
}
```

### ⭐ Favorites Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/favourites/add` | 🔒 User | Add character to favorites |
| `DELETE` | `/api/favourites/remove` | 🔒 User | Remove character from favorites |
| `GET` | `/api/favourites` | 🔒 User | Get all favorited characters |

### 📊 Statistics Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/stats/overview` | Public | Stats across all 4 universes |
| `GET` | `/api/stats/universe/:name` | Public | Detailed stats for one universe |

### 🖼️ Utility Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/proxy-image?url=X` | Public | Image proxy to bypass CDN blocking |
| `GET` | `/api/debug` | Public | Database health check and counts |

---

## 💾 Database Schema

### 📊 Neo4j Graph Model

<div align="center">

```
┌──────────────────┐         ALLIED_WITH          ┌──────────────────┐
│   Character A    │─────────────────────────────▶│   Character B    │
│                  │                               │                  │
│ • name           │         ENEMY_OF              │ • name           │
│ • universe       │◀─────────────────────────────│ • universe       │
│ • role           │                               │ • role           │
│ • team           │         KNOWS                 │ • team           │
│ • bio            │─────────────────────────────▶│ • bio            │
│ • powers         │                               │ • powers         │
│ • imageUrl       │                               │ • imageUrl       │
│ • arcNumber      │                               │ • arcNumber      │
└──────────────────┘                               └──────────────────┘
         ▲                                                  ▲
         │                                                  │
         │ FAVOURITED                        FAVOURITED    │
         │                                                  │
    ┌────┴─────────────────────────────────────────────────┴────┐
    │                       User Node                            │
    │  • username • email • passwordHash • role • createdAt      │
    └────────────────────────────────────────────────────────────┘
```

</div>

### 📝 Node Properties

#### Character Node
```cypher
CREATE (c:Character {
  name: "Iron Man",
  universe: "Marvel",
  role: "hero",           // hero | villain | antihero
  team: "Avengers",
  bio: "Genius, billionaire, playboy, philanthropist...",
  powers: "Powered Armor, Genius Intelligence, Energy Projection",
  imageUrl: "https://...",
  firstAppearance: "Tales of Suspense #39",
  arcNumber: 1,           // For spoiler control
  arcName: "Phase 1"
})
```

#### User Node
```cypher
CREATE (u:User {
  username: "tonystark",
  email: "tony@stark.com",
  passwordHash: "$2a$10$...",  // BCrypt hash
  role: "USER",                // USER | ADMIN
  createdAt: "2024-01-15T10:30:00Z"
})
```

### 🔗 Relationship Types

| Relationship | Direction | Meaning |
|--------------|-----------|---------|
| `ALLIED_WITH` | Directional | Character A is allied with B (same team/faction) |
| `ENEMY_OF` | Directional | Character A is an enemy of B |
| `KNOWS` | Directional | Character A and B have interacted |
| `FAVOURITED` | User → Character | User has favorited this character |

### 🔍 Key Cypher Queries

**Shortest Path (BFS Algorithm)**
```cypher
MATCH path = shortestPath(
  (a:Character {name: $name1})-[*..10]-(b:Character {name: $name2})
)
RETURN [node IN nodes(path) | node.name] AS names
```

**Universe Graph**
```cypher
MATCH (c:Character {universe: $universe})
OPTIONAL MATCH (c)-[:ALLIED_WITH]->(ally:Character {universe: $universe})
OPTIONAL MATCH (c)-[:ENEMY_OF]->(enemy:Character {universe: $universe})
RETURN c, 
       collect(distinct ally) as allies, 
       collect(distinct enemy) as enemies
```

**Character with Relationships**
```cypher
MATCH (c:Character {name: $name})
OPTIONAL MATCH (c)-[:ALLIED_WITH]->(ally:Character)
OPTIONAL MATCH (c)-[:ENEMY_OF]->(enemy:Character)
RETURN c, 
       collect(distinct ally) as allies, 
       collect(distinct enemy) as enemies
```

---

## 🎨 Key Features Deep Dive

### 🌐 Interactive Graph Visualization

Built with **vis-network**, the graph uses a **physics-based force-directed layout** (Barnes-Hut algorithm) to automatically arrange nodes into readable structures.

**Visual Encoding:**
- 🟢 **Green nodes**: Heroes
- 🔴 **Red nodes**: Villains  
- 🟡 **Gold nodes**: Antiheroes
- 💚 **Green edges**: ALLIED_WITH relationships
- ❤️ **Red edges**: ENEMY_OF relationships
- **Node size**: Uniform (can be customized by connection count)

**Interactions:**
- Click node → Navigate to character profile
- Drag nodes → Rearrange layout
- Scroll → Zoom in/out
- Physics simulation → Auto-stabilizes network

---

### 🛡️ Spoiler Control Mechanism

**Problem:** New fans can't explore without encountering major spoilers.

**Solution:** Every character has an `arcNumber` property (1 to N). Users set their viewing progress via a slider:

```javascript
// User sets slider to Arc 3
const visibleCharacters = allCharacters.filter(c => c.arcNumber <= 3);
const visibleEdges = allEdges.filter(e => 
  visibleCharacters.includes(e.from) && visibleCharacters.includes(e.to)
);
```

An **orange warning banner** appears when spoiler mode is active. Default: Show all arcs.

---

### 🔍 Relationship Path Finder

**Algorithm:** Breadth-First Search (BFS) implemented in Cypher

**How it works:**
1. User enters two character names
2. Backend queries Neo4j: `shortestPath((a)-[*..10]-(b))`
3. Returns ordered array of character names
4. Frontend renders as horizontal chain: `A → B → C → D`

**Example:**
```
Black Widow → Iron Man → Thanos → Thor
(3 steps)
```

**Edge cases handled:**
- No path exists → "No connection found"
- Same character → "Characters are the same"
- Invalid names → "Character not found"

---

### 🤖 AI Character Chat (Google Gemini)

Click the chat bubble on any character profile to **talk to the character**!

**Implementation:**
```javascript
const systemPrompt = `You are ${characterName}, a character from ${universe}. 
Respond as this character would, matching their personality, speaking style, 
and knowledge. Stay in character at all times.`;

const response = await gemini.generateContent({
  systemInstruction: systemPrompt,
  contents: [{ role: 'user', parts: [{ text: userMessage }] }]
});
```

**Example conversations:**
- *User:* "What do you think about Thanos?"  
- *Iron Man:* "That purple Grimace-looking guy? Let's just say he's not on my Christmas card list. We had a... disagreement about the whole 'snap away half the universe' thing."

---

### 🖼️ Image Proxy Service

**Problem:** MyAnimeList CDN blocks external hotlinking (403 Forbidden)

**Solution:** Backend proxy endpoint that fetches images server-side:

```javascript
app.get('/api/proxy-image', async (req, res) => {
  const imageUrl = req.query.url;
  const response = await axios.get(imageUrl, {
    headers: { 'Referer': 'https://myanimelist.net' },
    responseType: 'stream'
  });
  response.data.pipe(res);
});
```

Frontend uses:
```html
<img src={`/api/proxy-image?url=${encodeURIComponent(imageUrl)}`} />
```

---

## 📊 Data Pipeline

### 🔄 Automatic Seeding on First Startup

When the Neo4j database is empty, the **DataSeeder** automatically runs:

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: SuperheroAPI (Marvel + DC)                             │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  • Loop through IDs 1-731 (15 parallel threads)           │ │
│  │  • Fetch: https://superheroapi.com/api/{token}/{id}       │ │
│  │  • Filter: publisher = 'Marvel Comics' | 'DC Comics'      │ │
│  │  • Map: alignment → role (good=hero, bad=villain)         │ │
│  │  • Result: 339 Marvel + 188 DC characters                 │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Step 2: Jikan API (Naruto + One Piece)                         │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  • Fetch character lists from anime IDs:                  │ │
│  │    - 20 (Naruto)                                          │ │
│  │    - 1735 (Naruto Shippuden)                              │ │
│  │    - 21 (One Piece)                                       │ │
│  │  • Deduplicate by mal_id                                  │ │
│  │  • Fetch individual details with 400ms delay              │ │
│  │  • Result: ~280 Naruto + ~921 One Piece characters        │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Step 3: Relationship Building                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  For each universe independently:                         │ │
│  │  • Team keyword overlap → ALLIED_WITH                     │ │
│  │  • Opposing alignments → ENEMY_OF                         │ │
│  │  • Any relation → KNOWS                                   │ │
│  │  • Limits: 10 allies, 8 enemies per character            │ │
│  │  • Result: 5,632 total relationships                      │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Total seeding time:** ~8 minutes (only runs once on first deployment)

---

## 🗺️ Roadmap

### ✅ Completed (v1.0)
- [x] Graph-based database architecture
- [x] 4 complete universes (Marvel, DC, Naruto, One Piece)
- [x] Interactive graph visualization
- [x] Spoiler control system
- [x] BFS path finding
- [x] JWT authentication
- [x] AI character chat
- [x] Character profiles & comparison
- [x] Statistics dashboard
- [x] Railway deployment

### 🚧 In Progress (v1.1)
- [ ] **Enhanced Search** - Fuzzy matching, filters by universe/role/team
- [ ] **Watch List** - Track which arcs/movies you've completed
- [ ] **User Reviews** - Rate and review characters
- [ ] **Dark/Light Theme Toggle** - User preference persistence

### 🔮 Future Features (v2.0)
- [ ] **ML-Based Recommendations** - Suggest characters based on viewing history
- [ ] **Timeline Explorer** - Episode-by-episode character appearance timeline
- [ ] **Fan Theory Board** - Community theories linked to characters
- [ ] **Mobile App** - React Native port with offline graph caching
- [ ] **Extended Universes** - Dragon Ball, Attack on Titan, Harry Potter, Star Wars
- [ ] **Real-Time Collaboration** - Multi-user graph exploration sessions
- [ ] **Advanced AI** - Relationship inference from character bios using LLMs
- [ ] **3D Graph Visualization** - Three.js force-directed 3D network
- [ ] **Comic/Manga Reader Integration** - Link to official reading platforms
- [ ] **Character Power Calculator** - Compare power levels and stats

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 Found a Bug?
Open an issue with:
- Bug description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

### ✨ Want to Add a Feature?
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

### 📝 Code Style
- TypeScript for all new code
- ESLint + Prettier for formatting
- Meaningful commit messages
- Add tests for new features

### 🌟 Areas We Need Help
- Adding more universes (Dragon Ball, Harry Potter, Star Wars)
- Improving relationship inference algorithm
- Mobile responsive design enhancements
- Performance optimizations for large graphs
- Documentation and tutorials

---

## 👥 Team

<div align="center">

| ![Rohit](https://github.com/Rohit-Tangirala.png?size=100) | ![Meghamsh](https://via.placeholder.com/100/8b5cf6/ffffff?text=MA) | ![Thanveesh](https://via.placeholder.com/100/10b981/ffffff?text=ST) | ![Nishanth](https://via.placeholder.com/100/f59e0b/ffffff?text=TN) |
|:---:|:---:|:---:|:---:|
| **[T.G.S.S. Rohit](https://github.com/Rohit-Tangirala)** | **P. Meghamsh Anirudh** | **S. Thanveesh** | **T. Nishanth** |
| 2410030030 | 2410030128 | 2410030419 | 2410030462 |
| Lead Developer | Backend Developer | Frontend Developer | Database Designer |

**Mentor:** Dr. P. Ratna Kumar  
**Institution:** KL University, Department of Computer Science and Engineering  
**Course:** 24GMI3101HF - Full Stack Application Development

</div>

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

<div align="center">

**Special thanks to:**

🎓 **KL University** - For providing the platform and resources  
👨‍🏫 **Dr. P. Ratna Kumar** - For invaluable guidance and mentorship  
🦸 **SuperheroAPI** - For comprehensive Marvel & DC character data  
📺 **Jikan API** - For extensive anime character information  
🤖 **Google Gemini** - For powering the AI character chat feature  
🗄️ **Neo4j** - For the incredible graph database platform  
⚛️ **React Team** - For the amazing frontend framework  
🚂 **Railway** - For seamless cloud deployment  

</div>

---

## 📞 Contact & Links

<div align="center">

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Now-8B5CF6?style=for-the-badge)](https://cineverse-explorer-production.up.railway.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge&logo=github)](https://github.com/Rohit-Tangirala/cineverse-explorer)
[![Report Bug](https://img.shields.io/badge/🐛_Bug-Report-red?style=for-the-badge)](https://github.com/Rohit-Tangirala/cineverse-explorer/issues)
[![Request Feature](https://img.shields.io/badge/✨_Feature-Request-blue?style=for-the-badge)](https://github.com/Rohit-Tangirala/cineverse-explorer/issues)

**Developed with ❤️ by Team Cineverse Explorer**

<img src="https://user-images.githubusercontent.com/74038190/212284115-f47cd8ff-2ffb-4b04-b5bf-4d1c14c0247f.gif" width="1000">

### ⭐ If you found this project helpful, please consider giving it a star!

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="700">

</div>

---

<div align="center">

**© 2026 Cineverse Explorer | KL University | CSE Department**

*Built as a Project Based Learning submission for Full Stack Application Development*

**Made with 🔥 using React, Express.js, Neo4j, and TypeScript**

</div>
