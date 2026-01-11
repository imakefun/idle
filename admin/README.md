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

### 🚧 Phase 2: Data Browser & Editor (In Progress)
- ✅ Google Sheets API integration (read & write)
- ✅ OAuth2 authentication for write access
- ✅ Data service with CRUD operations
- ✅ React context for global state management
- ✅ DataTable component (sortable, filterable, paginated)
- ✅ RowEditor modal for creating/editing
- ✅ Monsters page with full CRUD
- ⏳ Items page (next)
- ⏳ Quests page (next)

### 📋 Future Phases
- Phase 3: Remaining Content Types (Races, Classes, Zones, etc.)
- Phase 4: Data Visualization & Analytics
- Phase 5: AI Content Generation
- Phase 6: Asset Generation
- Phase 7: Polish & Advanced Features

## Features Implemented

### Google Sheets Integration
- **Read Mode**: Loads data using API key (no authentication required)
- **Write Mode**: Requires Google OAuth2 sign-in
- **CRUD Operations**: Create, Read, Update, Delete rows
- **Auto-sync**: Changes save directly to Google Sheets
- **Error Handling**: Clear error messages and retry logic

### Data Table
- Sort by any column (click header to toggle asc/desc)
- Search across specified fields
- Pagination (50 rows per page)
- Edit/Delete actions per row
- Add new row button
- Read-only mode when not signed in
- Responsive mobile layout

### Row Editor
- Modal form for creating/editing rows
- Field type support: text, number, textarea, select
- Validation (required fields, min/max, patterns)
- Real-time error feedback
- Loading states during save

### Monsters Page
- Browse all monsters with search & sort
- Create new monsters
- Edit existing monsters
- Delete with confirmation
- Field validation (levels 1-50, positive HP/damage/XP)

## Testing the Admin Dashboard

### Prerequisites
1. Set up environment variables (copy `admin/.env.example` to `admin/.env`):
   ```
   VITE_GOOGLE_SHEETS_API_KEY=your_api_key
   VITE_SPREADSHEET_ID=your_spreadsheet_id
   VITE_GOOGLE_CLIENT_ID=your_client_id
   ```

2. Enable Google Sheets API in Google Cloud Console
3. Create OAuth2 credentials for write access

### Running Locally
```bash
cd admin
npm install
npm run dev
```

Visit `http://localhost:5174`

### Testing Features
1. **Read-Only Mode**: Opens automatically without sign-in
   - View all data
   - Search and filter
   - Edit/Delete buttons disabled

2. **Write Mode**: Click "Sign In to Edit" button
   - Authenticate with Google OAuth2
   - Create, edit, delete monsters
   - Changes sync to Google Sheets instantly

3. **Monsters Page**: Navigate to Monsters from sidebar
   - Search by name, level, or icon
   - Click column headers to sort
   - Click ✏️ to edit, 🗑️ to delete
   - Click "➕ Add New" to create monster

## Related Documentation

- [Admin Dashboard Design Document](../ADMIN_DASHBOARD_DESIGN.md)
- [Project Status](../PROJECT_STATUS.md)

## Deployment

The admin dashboard is configured to deploy to `/idle/admin/` path. It can be deployed alongside the main game or moved to a separate repository for independent deployment.

**Future:** Move to separate `norrath-idle-admin` repository with independent deployment to `admin.imakefun.github.io/norrath-idle-admin`
