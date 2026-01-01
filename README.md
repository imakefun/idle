# Norrath Idle

A text-based idle RPG inspired by classic MMORPGs (specifically EverQuest). Built with React and optimized for mobile-first gameplay.

## 🎮 Play Now

**Live Demo:** `https://yourusername.github.io/idle/` *(after deployment)*

**Local Development:**
```bash
npm install
npm run dev
```

## 📖 About

Norrath Idle is a browser-based idle RPG featuring:

- ⚔️ **Classic MMORPG Systems** - Races, classes, skills, and combat inspired by EverQuest
- 📱 **Mobile-First Design** - Optimized for phones, works great on desktop
- 💾 **Auto-Save System** - Progress saved to localStorage automatically
- 📊 **Google Sheets Integration** - Game data managed via spreadsheets for easy balancing
- 🎯 **Idle Gameplay** - Progress even when not actively playing
- 🌙 **Dark Mode** - Easy on the eyes with optional light mode

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/idle.git
cd idle

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

## 📦 Deployment

Deploy to GitHub Pages in one command:

```bash
npm run deploy
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🏗️ Project Structure

```
src/
├── components/     # React components (Character, Combat, Inventory, etc.)
├── data/          # Game data (synced from Google Sheets)
│   └── fallback/  # Static fallback data
├── hooks/         # Custom React hooks
│   ├── useGameLoop.js    # 10 tick/second game loop
│   └── useSaveGame.js    # Auto-save functionality
├── systems/       # Core game systems
│   └── SaveSystem.js     # localStorage persistence
├── utils/         # Helper functions
├── App.jsx        # Main game component
└── main.jsx       # React entry point
```

## 🛠️ Tech Stack

- **Frontend:** React 18.3 with functional components and hooks
- **Build Tool:** Vite 6 (fast builds, HMR, optimized production bundles)
- **Hosting:** GitHub Pages (free, static hosting)
- **Data Management:** Google Sheets API v4
- **Styling:** Mobile-first CSS with CSS variables (dark mode default)
- **State:** useState + useRef (no external state library needed)
- **Persistence:** localStorage with auto-save

## 🎯 Features

### Phase 1: Core Foundation ✅
- [x] Project setup with Vite + React
- [x] Game loop (100ms intervals, delta-time tracking)
- [x] Save/load system (localStorage with versioning)
- [x] GitHub Pages deployment configuration
- [x] Mobile-responsive UI

### Phase 2: Character System (In Progress)
- [ ] Race selection (5 races with unique stats)
- [ ] Class selection (4 classes: Warrior, Monk, Rogue, Cleric)
- [ ] Stat system (STR, STA, AGI, DEX, WIS, INT, CHA)
- [ ] HP/Stamina calculations
- [ ] Experience and leveling

### Phase 3+: Game Systems (Planned)
- [ ] Inventory (10 slots, stacking, equipment)
- [ ] Zones (Town, Newbie Yard, Blackburrow, High Keep)
- [ ] Combat (targeting, attacks, death/respawn)
- [ ] Skills (usage-based progression, active abilities)
- [ ] Survival (hunger/thirst, food/water)
- [ ] Quests (kill/collect quests, daily limits)
- [ ] Economy (currency, merchants, loot drops)
- [ ] Tradeskills (baking, brewing, crafting)
- [ ] NPCs (merchants, trainers, quest givers)

See [NORRATH_IDLE_PROJECT_PLAN.md](./NORRATH_IDLE_PROJECT_PLAN.md) for complete roadmap.

## 📱 Mobile Support

Optimized for mobile devices with:
- Touch-friendly buttons (48x48px minimum)
- 16px base font (prevents iOS zoom)
- Responsive breakpoints (mobile → tablet → desktop)
- Fixed header/footer for key controls
- PWA-ready (add to home screen)

## 🎨 Design Philosophy

- **Text-based UI** - Focus on gameplay, minimal graphics
- **Slow progression** - Meaningful choices, not mindless clicking
- **Mobile-first** - Designed for phones, enhanced on desktop
- **No backend** - Runs entirely in the browser (static hosting)
- **Data-driven** - Game content in Google Sheets for easy balancing

## 🤝 Contributing

This is a personal project, but suggestions and bug reports are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source. Feel free to use and modify as needed.

## 🙏 Acknowledgments

- Inspired by EverQuest (Daybreak Game Company)
- Built with React and Vite
- Deployed on GitHub Pages

## 🐛 Known Issues

- None yet! This is early development (Phase 1).

## 📧 Contact

- GitHub Issues: [Report a bug or suggest a feature](https://github.com/yourusername/idle/issues)

---

**Current Version:** v0.1.0 - Phase 1: Core Foundation ✅

**Status:** In active development
