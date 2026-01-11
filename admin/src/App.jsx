import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DataProvider } from './contexts/DataContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Races from './pages/Races'
import Classes from './pages/Classes'
import Monsters from './pages/Monsters'
import Items from './pages/Items'
import Zones from './pages/Zones'
import Camps from './pages/Camps'
import Skills from './pages/Skills'
import Spawns from './pages/Spawns'
import LootTables from './pages/LootTables'
import Merchants from './pages/Merchants'
import Quests from './pages/Quests'
import Recipes from './pages/Recipes'
import Tradeskills from './pages/Tradeskills'
import AIGeneration from './pages/AIGeneration'
import Assets from './pages/Assets'
import Validation from './pages/Validation'
import Settings from './pages/Settings'

function App() {
  return (
    <DataProvider>
      <BrowserRouter basename="/idle/admin">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="races" element={<Races />} />
            <Route path="classes" element={<Classes />} />
            <Route path="monsters" element={<Monsters />} />
            <Route path="items" element={<Items />} />
            <Route path="zones" element={<Zones />} />
            <Route path="camps" element={<Camps />} />
            <Route path="skills" element={<Skills />} />
            <Route path="spawns" element={<Spawns />} />
            <Route path="loot-tables" element={<LootTables />} />
            <Route path="merchants" element={<Merchants />} />
            <Route path="quests" element={<Quests />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="tradeskills" element={<Tradeskills />} />
            <Route path="ai" element={<AIGeneration />} />
            <Route path="assets" element={<Assets />} />
            <Route path="validation" element={<Validation />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  )
}

export default App
