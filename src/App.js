import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SamplePage from './pages/SamplePage'

function App () {
  return (
    <BrowserRouter>
      <div className='App'>
        <Routes>
          <Route exact path='/' element={<HomePage />} />
          <Route exact path='/sample' element={<SamplePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
