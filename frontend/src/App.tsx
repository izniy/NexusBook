import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-blue-500 text-white text-3xl font-bold">
              Tailwind is working!
            </div>
          }
        />
      </Routes>
    </div>
  )
}

export default App
