// Sample.js

import React from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

function SamplePage () {
  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Welcome to the Sample Page</h1>
        <p>This is your sample page content.</p>
        <Link to='/' className='App-link'>
          Back to Home Page
        </Link>
      </header>
    </div>
  )
}

export default SamplePage
