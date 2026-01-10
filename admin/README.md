# Norrath Idle - Admin Dashboard

A visual content management system for the Norrath Idle game that enables rapid content creation, editing, and asset generation through AI assistance.

## Features

- 📊 **Dashboard** - Statistics, quick actions, data health monitoring
- 👤 **Content Management** - Manage races, classes, monsters, items, zones, camps, skills, spawns, loot tables, merchants, quests, recipes, and tradeskills
- 🤖 **AI Generation** - Generate game content using LLM prompts
- 🎨 **Asset Generation** - Create icons and images with AI models
- ✅ **Validation** - Automated data validation and balance checking
- 🔄 **Google Sheets Sync** - Bidirectional sync with game data spreadsheet

## Tech Stack

- **React 18** - UI framework
- **Vite 5** - Build tool and dev server
- **React Router 6** - Client-side routing
- **CSS Custom Properties** - Dark theme with design tokens

## Development

### Prerequisites

- Node.js 18+ and npm

### Install Dependencies

```bash
cd admin
npm install
```

### Run Development Server

```bash
npm run dev
```

The admin dashboard will be available at `http://localhost:5174`

### Build for Production

```bash
npm run build
```

Output will be in the `dist` folder, configured for deployment at `/idle/admin/` path.

## Project Structure

```
admin/
├── src/
│   ├── components/      # Reusable UI components
│   │   └── Layout.jsx   # Main layout with sidebar navigation
│   ├── pages/           # Page components for each route
│   │   ├── Dashboard.jsx
│   │   ├── Monsters.jsx
│   │   ├── Items.jsx
│   │   └── ...
│   ├── styles/          # Global styles and CSS
│   │   └── index.css    # CSS custom properties and utilities
│   ├── App.jsx          # Main app component with routing
│   └── main.jsx         # Entry point
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies
```

## Implementation Status

### ✅ Phase 1: Foundation (Completed)
- React app setup with Vite
- Routing structure with 17 routes
- Sidebar navigation
- Dashboard home page with statistics
- Dark theme styling

### 🚧 Phase 2: Data Browser (Next)
- Google Sheets API integration (read-only)
- Data table components
- Pagination, sorting, filtering
- Search functionality

### 📋 Future Phases
- Phase 3: Visual Editors
- Phase 4: Google Sheets Sync (bidirectional)
- Phase 5: AI Content Generation
- Phase 6: Asset Generation
- Phase 7: Polish & Advanced Features

## Related Documentation

- [Admin Dashboard Design Document](../ADMIN_DASHBOARD_DESIGN.md)
- [Project Status](../PROJECT_STATUS.md)

## Deployment

The admin dashboard is configured to deploy to `/idle/admin/` path. It can be deployed alongside the main game or moved to a separate repository for independent deployment.

**Future:** Move to separate `norrath-idle-admin` repository with independent deployment to `admin.imakefun.github.io/norrath-idle-admin`
