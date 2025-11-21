import { Routes, Route } from 'react-router-dom'
import Startup from './pages/Startup'
import Score from './pages/Score'
import Makers from './pages/Makers'
import Models from './pages/Models'
import ExperienceForm from './pages/ExperienceForm'
import ExperienceList from './pages/ExperienceList'
import ExperienceDetail from './pages/ExperienceDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Startup />} />
      <Route path="/score" element={<Score />} />
      <Route path="/makers" element={<Makers />} />
      <Route path="/models/:makerId" element={<Models />} />
      <Route path="/experience/:carId" element={<ExperienceForm />} />
      <Route path="/experiences" element={<ExperienceList />} />
      <Route path="/experience-detail/:id" element={<ExperienceDetail />} />
    </Routes>
  )
}

export default App
