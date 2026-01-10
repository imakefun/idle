import { Link } from 'react-router-dom'
import './Dashboard.css'

function Dashboard() {
  // Mock data - will be replaced with real data from Google Sheets
  const stats = {
    races: 14,
    classes: 14,
    monsters: 45,
    items: 120,
    zones: 8,
    camps: 25,
    skills: 30,
    spawns: 60,
    lootTables: 28,
    merchants: 12,
    quests: 25,
    recipes: 20,
    tradeskills: 7,
  }

  const quickActions = [
    { icon: '👹', label: 'Add Monster', path: '/monsters' },
    { icon: '🎒', label: 'Add Item', path: '/items' },
    { icon: '📜', label: 'Add Quest', path: '/quests' },
    { icon: '🔨', label: 'Add Recipe', path: '/recipes' },
    { icon: '🤖', label: 'Generate Content', path: '/ai' },
    { icon: '✅', label: 'Validate Data', path: '/validation' },
  ]

  const dataHealth = [
    { type: 'error', message: 'Missing icons', count: 5 },
    { type: 'warning', message: 'Unbalanced items', count: 12 },
    { type: 'warning', message: 'Empty loot tables', count: 3 },
    { type: 'info', message: 'Orphaned spawns', count: 2 },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="text-secondary">Welcome to the Norrath Idle Admin Panel</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Statistics */}
        <section className="dashboard-section card">
          <h2 className="section-title">📊 Content Statistics</h2>
          <div className="stats-grid">
            <StatCard label="Races" value={stats.races} />
            <StatCard label="Classes" value={stats.classes} />
            <StatCard label="Monsters" value={stats.monsters} />
            <StatCard label="Items" value={stats.items} />
            <StatCard label="Zones" value={stats.zones} />
            <StatCard label="Camps" value={stats.camps} />
            <StatCard label="Skills" value={stats.skills} />
            <StatCard label="Spawns" value={stats.spawns} />
            <StatCard label="Loot Tables" value={stats.lootTables} />
            <StatCard label="Merchants" value={stats.merchants} />
            <StatCard label="Quests" value={stats.quests} />
            <StatCard label="Recipes" value={stats.recipes} />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="dashboard-section card">
          <h2 className="section-title">⚡ Quick Actions</h2>
          <div className="quick-actions">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.path} className="quick-action-btn">
                <span className="action-icon">{action.icon}</span>
                <span className="action-label">{action.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Data Health */}
        <section className="dashboard-section card">
          <h2 className="section-title">🩺 Data Health</h2>
          {dataHealth.length === 0 ? (
            <div className="health-empty">
              <span className="health-icon">✅</span>
              <p>All systems healthy!</p>
            </div>
          ) : (
            <div className="health-list">
              {dataHealth.map((issue, index) => (
                <div key={index} className={`health-item health-${issue.type}`}>
                  <div className="health-indicator">
                    {issue.type === 'error' && '❌'}
                    {issue.type === 'warning' && '⚠️'}
                    {issue.type === 'info' && 'ℹ️'}
                  </div>
                  <div className="health-content">
                    <span className="health-message">{issue.message}</span>
                    <span className="health-count">{issue.count} issues</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Changes */}
        <section className="dashboard-section card">
          <h2 className="section-title">📝 Recent Activity</h2>
          <div className="activity-list">
            <ActivityItem
              type="create"
              message="Added new monster: Gnoll Chieftain"
              time="2 minutes ago"
            />
            <ActivityItem
              type="update"
              message="Updated Bronze Sword stats"
              time="15 minutes ago"
            />
            <ActivityItem
              type="create"
              message="Generated 10 level 5 quests"
              time="1 hour ago"
            />
            <ActivityItem
              type="delete"
              message="Removed duplicate item: Rusty Dagger"
              time="2 hours ago"
            />
          </div>
        </section>
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

function ActivityItem({ type, message, time }) {
  const icons = {
    create: '✨',
    update: '✏️',
    delete: '🗑️',
  }

  return (
    <div className="activity-item">
      <span className={`activity-icon activity-${type}`}>{icons[type]}</span>
      <div className="activity-content">
        <p className="activity-message">{message}</p>
        <p className="activity-time">{time}</p>
      </div>
    </div>
  )
}

export default Dashboard
