import { useState } from 'react'
import './App.css'

function App() {
  const [crop, setCrop] = useState('Wheat')
  const [state, setState] = useState('Bihar')
  const [district, setDistrict] = useState('Purnia')
  const [searched, setSearched] = useState(false)
  const [selectedMandi, setSelectedMandi] = useState(null)
  const [searchCrop, setSearchCrop] = useState('Wheat')
  const [searchState, setSearchState] = useState('Bihar')
  const [searchDistrict, setSearchDistrict] = useState('Purnia')

  const mandiData = [
    {
      name: 'Purnia Mandi',
      location: 'Purnia, Bihar',
      crop: 'Wheat',
      min: 2200,
      max: 2450,
      modal: 2350,
    },
    {
      name: 'Purnia Mandi',
      location: 'Purnia, Bihar',
      crop: 'Rice',
      min: 1900,
      max: 2200,
      modal: 2050,
    },
    {
      name: 'Gulabbagh Mandi',
      location: 'Purnia, Bihar',
      crop: 'Wheat',
      min: 2250,
      max: 2500,
      modal: 2400,
    },
    {
      name: 'Gulabbagh Mandi',
      location: 'Purnia, Bihar',
      crop: 'Rice',
      min: 1950,
      max: 2250,
      modal: 2100,
    },
    {
      name: 'Araria Mandi',
      location: 'Araria, Bihar',
      crop: 'Wheat',
      min: 2150,
      max: 2380,
      modal: 2300,
    },
  ]
  const filteredMandiData = mandiData.filter(
    (mandi) =>
      mandi.crop === searchCrop &&
      mandi.location.includes(searchState) &&
      mandi.location.includes(searchDistrict)
  )
  const highestPrice = Math.max(
    ...filteredMandiData.map((mandi) => mandi.modal)
  )

const lowestPrice = Math.min(
  ...filteredMandiData.map((mandi) => mandi.modal)
)

const priceDifference = highestPrice - lowestPrice

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
          <button
          className="search-btn"
         onClick={() => {
          setSearchCrop(crop)
          setSearchState(state)
          setSearchDistrict(district)
          setSearched(true)
        }}
          >
          🔍 Search Mandi
        </button>
        {searched && (
            <div className="search-result-message">
            🔎 Searching mandi for {searchCrop} in {searchDistrict}, {searchState}...
          </div>
        )}

        </div>

        {/* Selected Location */}
        <div className="selection-info">
          Showing prices for{' '}
          <strong>{searchCrop}</strong> in{' '}
          <strong>{searchDistrict}, {searchState}</strong>
        </div>
        {searched && filteredMandiData.length > 1 && (
          <div className="price-difference">
            💰 Price Difference: ₹{priceDifference}
          </div>
        )}
        {selectedMandi && (
          <div className="selected-mandi">
            📊 You selected: <strong>{selectedMandi.name}</strong>
            <br />
            💰 Modal Price: <strong>₹{selectedMandi.modal}</strong>
          </div>
        )}
        {/* Mandi Cards */}
        <div className="mandi-grid">
           {searched && filteredMandiData.length === 0 && (
              <p className="no-result">
                No mandi found for this location.
              </p>
            )}

          {filteredMandiData.map((mandi) => (
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
                {mandi.modal === highestPrice && (
                  <small className="best-price">
                    ⭐ Best Modal Price
                  </small>
                )}

                <div>
                  <small>Max Price</small>
                  <strong>₹{mandi.max}</strong>
                </div>

              </div>

              <button
                className="compare-btn"
                onClick={() => setSelectedMandi(mandi)}
              >
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