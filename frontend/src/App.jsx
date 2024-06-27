import { useState } from 'react'
import './App.css'
import React from 'react';
import RegistrationForm from './components/Registration.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>Echo Homes with Vite + React + NodeJS + PostgreSQL</h1>
        <div className="App">
          <header className="App-header">
            <RegistrationForm />
          </header>
        </div>
      </div>
    </>
  )
}

export default App
