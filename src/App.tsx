import './index.css'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './views/dashboard'
import Insights from './views/insights'

function App() {
  return (

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/insights/:brandName" element={<Insights />} />
      </Routes>
  )
}

export default App