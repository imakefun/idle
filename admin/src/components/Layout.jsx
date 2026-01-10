import { Outlet, NavLink } from 'react-router-dom'
import './Layout.css'

function Layout() {
  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="header-content">
          <h1>🎮 Norrath Idle Admin</h1>
          <div className="header-actions">
            <span className="sync-status">⚪ Not Synced</span>
            <button className="btn-header">Settings</button>
          </div>
        </div>
      </header>

      <div className="admin-container">
        <aside className="admin-sidebar">
          <nav className="sidebar-nav">
            <NavLink to="/" end className="nav-item">
              📊 Dashboard
            </NavLink>

            <div className="nav-section">Content Types</div>
            <NavLink to="/races" className="nav-item">
              👤 Races
            </NavLink>
            <NavLink to="/classes" className="nav-item">
              ⚔️ Classes
            </NavLink>
            <NavLink to="/monsters" className="nav-item">
              👹 Monsters
            </NavLink>
            <NavLink to="/items" className="nav-item">
              🎒 Items
            </NavLink>
            <NavLink to="/zones" className="nav-item">
              🗺️ Zones
            </NavLink>
            <NavLink to="/camps" className="nav-item">
              🏕️ Camps
            </NavLink>
            <NavLink to="/skills" className="nav-item">
              ⚡ Skills
            </NavLink>
            <NavLink to="/spawns" className="nav-item">
              📍 Spawns
            </NavLink>
            <NavLink to="/loot-tables" className="nav-item">
              💰 Loot Tables
            </NavLink>
            <NavLink to="/merchants" className="nav-item">
              🏪 Merchants
            </NavLink>
            <NavLink to="/quests" className="nav-item">
              📜 Quests
            </NavLink>
            <NavLink to="/recipes" className="nav-item">
              🔨 Recipes
            </NavLink>
            <NavLink to="/tradeskills" className="nav-item">
              🛠️ Tradeskills
            </NavLink>

            <div className="nav-section">Tools</div>
            <NavLink to="/ai" className="nav-item">
              🤖 AI Generation
            </NavLink>
            <NavLink to="/assets" className="nav-item">
              🎨 Assets
            </NavLink>
            <NavLink to="/validation" className="nav-item">
              ✅ Validation
            </NavLink>
            <NavLink to="/settings" className="nav-item">
              ⚙️ Settings
            </NavLink>
          </nav>
        </aside>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
