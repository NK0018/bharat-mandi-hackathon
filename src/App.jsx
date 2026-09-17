import { useState } from 'react'
import './App.css'

function App() {
  const [crop, setCrop] = useState('Wheat')
  const [state, setState] = useState('Bihar')
  const [district, setDistrict] = useState('Purnia')

  const mandiData = [
    {
      name: 'Purnia Mandi',
      location: 'Purnia, Bihar',
      min: 2200,
      max: 2450,
      modal: 2350,
    },
    {
      name: 'Gulabbagh Mandi',
      location: 'Purnia, Bihar',
      min: 2250,
      max: 2500,
      modal: 2400,
    },
    {
      name: 'Araria Mandi',
      location: 'Araria, Bihar',
      min: 2150,
      max: 2380,
      modal: 2300,
    },
  ]

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <h2>🌾 Bharat Mandi</h2>

        <div className="nav-links">
          <button>Home</button>
          <button>Mandi Radar</button>
          <button>Sajha Gadi</button>
        </div>
      </nav>

      {/* Mandi Radar */}
      <main className="radar-section">

        <div className="radar-heading">
          <p className="tagline">📊 MANDI RADAR</p>

          <h1>
            Apni Fasal Ke Liye
            <br />
            <span>Best Mandi Rate</span> Dekhiye
          </h1>

          <p>
            Crop aur location select karke nearby mandi prices compare karein.
          </p>
        </div>

        {/* Filters */}
        <div className="filter-card">

          <div className="filter-group">
            <label>🌾 Crop</label>

            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
            >
              <option>Wheat</option>
              <option>Rice</option>
              <option>Maize</option>
              <option>Potato</option>
            </select>
          </div>

          <div className="filter-group">
            <label>📍 State</label>

            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option>Bihar</option>
              <option>Uttar Pradesh</option>
              <option>West Bengal</option>
              <option>Punjab</option>
            </select>
          </div>

          <div className="filter-group">
            <label>🏘️ District</label>

            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              <option>Purnia</option>
              <option>Araria</option>
              <option>Katihar</option>
              <option>Bhagalpur</option>
            </select>
          </div>

          <button className="search-btn">
            🔍 Search Mandi
          </button>

        </div>

        {/* Selected Location */}
        <div className="selection-info">
          Showing prices for{' '}
          <strong>{crop}</strong> in{' '}
          <strong>{district}, {state}</strong>
        </div>

        {/* Mandi Cards */}
        <div className="mandi-grid">

          {mandiData.map((mandi) => (
            <div className="mandi-card" key={mandi.name}>

              <div className="mandi-card-header">
                <div>
                  <h3>{mandi.name}</h3>
                  <p>{mandi.location}</p>
                </div>

                <span className="verified">
                  ✓ Verified
                </span>
              </div>

              <div className="price-row">

                <div>
                  <small>Min Price</small>
                  <strong>₹{mandi.min}</strong>
                </div>

                <div>
                  <small>Modal Price</small>
                  <strong className="modal-price">
                    ₹{mandi.modal}
                  </strong>
                </div>

                <div>
                  <small>Max Price</small>
                  <strong>₹{mandi.max}</strong>
                </div>

              </div>

              <button className="compare-btn">
                Compare Mandi
              </button>

            </div>
          ))}

        </div>

      </main>

    </div>
  )
}

export default App