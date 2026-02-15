<div align="center">
  <img src="public/icons/icon-192.png" alt="BrawlTracker ULTIMATE" width="140" height="140">
  
  # BrawlTracker ULTIMATE
  
  **The Ultimate Brawl Stars Stats Tracker**
  
  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
</div>

---

## 🎮 About

BrawlTracker ULTIMATE is the most complete and advanced Brawl Stars stats analysis tool. Featuring a premium UI, advanced analytics engine, and full official API integration.

### 🏆 Project Goals

- **100,000 Trophies** - Detailed progress tracking
- **1,000 per Brawler** - Individual analysis with smart prioritization
- **Resource Management** - Coins and power points optimization

---

## ✨ Features

### 📊 Complete Dashboard
- Player profile hero section
- Visual goal progress tracking
- Real-time statistics
- Recent matches timeline
- Daily recommendations

### ⚔️ Brawler Analysis
- **80+ Brawlers** cataloged
- **Tier List System** (S/A/B/C/D)
- Priority filters (Focus/Improve/OK)
- Best modes and maps for each brawler
- Personalized tips

### 🥇 Global Rankings
- Brazil and Global rankings
- Top 50 players in real-time
- Club information for top players
- Click to view any player's profile

### 📡 Live Events
- Current rotating events
- Active maps and modes
- Automatic countdown

### 🧠 Advanced Analysis
- Identified strengths
- Areas for improvement
- Personalized recommendations
- Daily game plan
- Current meta insights

### 🔬 LAB - Unique Features
- **Smart Push Planner** - Best times to play, tilt detection
- **Matchup Matrix** - Your win rates vs each brawler
- **True Skill Rating** - Adjusted win rate, consistency score
- **Resource Optimizer** - ROI calculator, upgrade priority queue
- **Achievement Hunter** - All achievements tracked

### 🎨 Premium Interface
- Glassmorphism design
- Smooth gradients and animations
- 100% responsive
- Elegant dark theme
- Micro-interactions

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| **Next.js 16** | React framework with App Router |
| **TypeScript 5** | Complete static typing |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | Accessible UI components |
| **Framer Motion** | Smooth animations |
| **Lucide React** | Premium icons |

---

## 📡 API Endpoints Used

- `GET /players/{tag}` - Player information
- `GET /players/{tag}/battlelog` - Battle history
- `GET /brawlers` - Brawlers list
- `GET /brawlers/{id}` - Brawler details
- `GET /clubs/{tag}` - Club information
- `GET /rankings/{region}/players` - Rankings
- `GET /events/rotation` - Active events

---

## 🚀 Installation

### Prerequisites

- [Node.js 18+](https://nodejs.org/) or [Bun](https://bun.sh/)
- Account on [Brawl Stars Developer Portal](https://developer.brawlstars.com/)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/bfrpaulondev/BrawlTracker.git
cd BrawlTracker

# Install dependencies
npm install

# Run development server
npm run dev
```

### Configuration

1. Visit [developer.brawlstars.com](https://developer.brawlstars.com/)
2. Create an API Key with your local IP
3. Configure your API key in `src/lib/config.ts`

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main page
│   ├── layout.tsx        # Global layout
│   ├── providers.tsx     # Providers
│   ├── globals.css       # Global styles
│   └── api/              # API routes
├── components/
│   ├── ui/               # Base UI components
│   └── brawl/            # Brawl-specific components
├── services/
│   ├── BrawlAPIClient.ts # Complete API client
│   ├── AnalysisService.ts # Analysis engine
│   ├── MetaDataService.ts # Meta data
│   └── AssetService.ts   # Asset management
├── lib/
│   ├── config.ts         # Configuration
│   └── utils.ts          # Utilities
├── types/
│   └── index.ts          # TypeScript types
└── hooks/
    └── use-toast.ts      # Toast notifications
```

---

## 🎯 Roadmap

- [ ] Trophy evolution charts
- [ ] Player comparison
- [ ] Persistent favorites system
- [ ] Push notifications
- [ ] Offline mode with cache
- [ ] Discord integration
- [ ] Mobile widget

---

## 👤 Author

**Bruno Paulon**

Full Stack Developer passionate about creating amazing digital experiences.

- GitHub: [@bfrpaulondev](https://github.com/bfrpaulondev)

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Supercell](https://supercell.com/) for Brawl Stars
- [Brawl Stars API](https://developer.brawlstars.com/) for the official API

---

<div align="center">
  <p>Made with 💜 by <strong>Bruno Paulon</strong></p>
  <p><strong>BrawlTracker ULTIMATE</strong> © 2025</p>
</div>
