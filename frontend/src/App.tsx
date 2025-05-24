import { Routes, Route } from 'react-router-dom'
import { ContactsPage } from './pages/ContactsPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<ContactsPage />} />
      </Routes>
    </div>
  )
}

export default App
