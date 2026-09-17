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
  const [quantity, setQuantity] = useState(100)
  const [freight, setFreight] = useState(500)
  const [profit, setProfit] = useState(null)
  
// =========================================
// SAJHA GADI STATES
// =========================================

const [pickup, setPickup] = useState('Purnia')
const [destination, setDestination] = useState('Gulabbagh')
const [loadCrop, setLoadCrop] = useState('Wheat')
const [loadQuantity, setLoadQuantity] = useState(20)

const [vehicles, setVehicles] = useState([
  {
    id: 1,
    driver: 'Local Transport',
    route: 'Purnia → Gulabbagh',
    capacity: 40,
    available: 20,
    freight: 800,
    status: 'Available',
    pickup: 'Purnia',
    destination: 'Gulabbagh',
  },
  {
    id: 2,
    driver: 'Kisan Transport',
    route: 'Purnia → Araria',
    capacity: 50,
    available: 30,
    freight: 1000,
    status: 'Available',
    pickup: 'Purnia',
    destination: 'Araria',
  },
  {
    id: 3,
    driver: 'Bihar Agro Transport',
    route: 'Purnia → Katihar',
    capacity: 60,
    available: 35,
    freight: 1200,
    status: 'Available',
    pickup: 'Purnia',
    destination: 'Katihar',
  },
])

const [requestedVehicle, setRequestedVehicle] = useState(null)
const matchedVehicles = vehicles.filter(
  (vehicle) => {
    const routeMatches =
      vehicle.pickup === pickup &&
      vehicle.destination === destination

    const quantityMatches =
      vehicle.available >= Number(loadQuantity)

    const cropMatches =
      !vehicle.crop || vehicle.crop === loadCrop

    return (
      routeMatches &&
      quantityMatches &&
      cropMatches
    )
  }
)

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

const calculateProfit = () => {
  if (!selectedMandi) {
    alert('Pehle ek mandi select karein.')
    return
  }
  const totalSaleValue =
    selectedMandi.modal * Number(quantity)

  const netProfit =
    totalSaleValue - Number(freight)

  setProfit({
    saleValue: totalSaleValue,
    freightCost: Number(freight),
    netProfit: netProfit,
  })
}
// =========================================
// SAJHA GADI - POST LOAD
// =========================================

const postLoad = () => {
  if (!pickup || !destination || !loadQuantity) {
    alert('Please load details complete karein.')
    return
  }

  if (pickup === destination) {
    alert('Pickup aur destination alag hona chahiye.')
    return
  }

  const newVehicle = {
    id: Date.now(),
    driver: 'Your Shared Load',
    route: `${pickup} → ${destination}`,
    capacity: Number(loadQuantity),
    available: Number(loadQuantity),
    freight: 700,
    status: 'Looking for Partners',
    crop: loadCrop,
  }

  setVehicles((previousVehicles) => [
    newVehicle,
    ...previousVehicles,
  ])

  alert('Your load successfully post ho gaya!')

}

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
           <div
              className={`mandi-card ${
                selectedMandi?.name === mandi.name ? 'selected' : ''
              }`}
              key={`${mandi.name}-${mandi.crop}`}
            >

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

{/* Profit Calculator */}
{selectedMandi && (
  <div className="profit-section">

    {/* Selected Mandi */}
    <div className="selected-mandi">

      <div>
        <span className="section-label">
          SELECTED MANDI
        </span>

        <h3>
          📍 {selectedMandi.name}
        </h3>

        <p>
          {selectedMandi.location}
        </p>
      </div>

      <div className="selected-price">
        <small>Modal Price</small>

        <strong>
          ₹{selectedMandi.modal}
        </strong>

        <span>
          per quintal
        </span>
      </div>

    </div>


    {/* Calculator */}
    <div className="profit-calculator">

      <div className="calculator-heading">

        <span>💰</span>

        <div>
          <h2>
            Net Profit Estimator
          </h2>

          <p>
            Apni quantity aur transport cost enter karke
            estimated earning calculate karein.
          </p>
        </div>

      </div>


      {/* Inputs */}
      <div className="calculator-inputs">

        <div className="input-group">

          <label>
            🌾 Quantity (Quintal)
          </label>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value)
            }
          />

        </div>


        <div className="input-group">

          <label>
            🚚 Freight Cost (₹)
          </label>

          <input
            type="number"
            min="0"
            value={freight}
            onChange={(e) =>
              setFreight(e.target.value)
            }
          />

        </div>


        <button
          className="calculate-btn"
          onClick={calculateProfit}
        >
          💰 Calculate Profit
        </button>

      </div>


      {/* Result */}
      {profit && (
        <div className="profit-result">

          <div className="result-box">

            <span>
              Total Sale Value
            </span>

            <strong>
              ₹{profit.saleValue}
            </strong>

          </div>


          <div className="result-box">

            <span>
              Transport Cost
            </span>

            <strong>
              ₹{profit.freightCost}
            </strong>

          </div>


          <div className="result-box highlight">

            <span>
              Estimated Net Profit
            </span>

            <strong>
              ₹{profit.netProfit}
            </strong>

          </div>

        </div>
      )}

    </div>

  </div>
)}
{/* =========================================
    SAJHA GADI
========================================= */}

<section className="sajha-section">

  <div className="sajha-heading">

    <div>
      <p className="tagline">🚚 SAJHA GADI</p>

      <h1>
        Transport Share Karo,
        <br />
        <span>Freight Cost Bachao</span>
      </h1>

      <p>
        Apna agricultural load post karein aur
        nearby farmers ke saath vehicle share karein.
      </p>
    </div>

  </div>


  {/* Post Load Card */}

  <div className="load-post-card">

    <div className="load-post-heading">
      <div className="load-icon">
        🚜
      </div>

      <div>
        <h2>Post Your Load</h2>

        <p>
          Apne transport requirement ki details enter karein.
        </p>
      </div>
    </div>


    <div className="load-form">

      {/* Pickup */}

      <div className="input-group">

        <label>
          📍 Pickup Location
        </label>

        <select
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
        >
          <option>Purnia</option>
          <option>Araria</option>
          <option>Katihar</option>
          <option>Bhagalpur</option>
        </select>

      </div>


      {/* Destination */}

      <div className="input-group">

        <label>
          🏁 Destination
        </label>

        <select
          value={destination}
          onChange={(e) =>
            setDestination(e.target.value)
          }
        >
          <option>Gulabbagh</option>
          <option>Purnia</option>
          <option>Araria</option>
          <option>Katihar</option>
          <option>Bhagalpur</option>
        </select>

      </div>


      {/* Crop */}

      <div className="input-group">

        <label>
          🌾 Crop
        </label>

        <select
          value={loadCrop}
          onChange={(e) =>
            setLoadCrop(e.target.value)
          }
        >
          <option>Wheat</option>
          <option>Rice</option>
          <option>Maize</option>
          <option>Potato</option>
        </select>

      </div>


      {/* Quantity */}

      <div className="input-group">

        <label>
          📦 Quantity (Quintal)
        </label>

        <input
          type="number"
          min="1"
          value={loadQuantity}
          onChange={(e) =>
            setLoadQuantity(e.target.value)
          }
        />

      </div>

    </div>


    <button
      className="post-load-btn"
      onClick={postLoad}
    >
      🚚 Post My Load
    </button>

  </div>


  {/* Available Vehicles */}

  <div className="vehicle-area">

    <div className="vehicle-heading">

      <div>
        <p className="tagline">
          AVAILABLE TRANSPORT
        </p>

        <h2>
          Nearby Shared Vehicles
        </h2>
      </div>

      <span className="vehicle-count">
        {matchedVehicles.length}{' '}
        {matchedVehicles.length === 1 ? 'Vehicle' : 'Vehicles'} Found
      </span>

    </div>


    <div className="vehicle-grid">
  {matchedVehicles.length === 0 ? (
    <div className="no-vehicle-message">
      <div className="no-vehicle-icon">🚫</div>
      <h3>No Matching Vehicle Found</h3>
      <p>
        Is route aur quantity ke liye abhi koi suitable shared vehicle available nahi hai.
      </p>
    </div>
  ) : (
    matchedVehicles.map((vehicle) => (

      <div
        className="vehicle-card"
        key={vehicle.id}
      >

          <div className="vehicle-card-top">

            <div className="vehicle-icon">
              🚚
            </div>

            <span className="available-badge">
              ● {vehicle.status}
            </span>

          </div>


          <h3>
            {vehicle.driver}
          </h3>

          <p className="vehicle-route">
            📍 {vehicle.route}
          </p>


          {vehicle.crop && (
            <p className="vehicle-crop">
              🌾 Crop: {vehicle.crop}
            </p>
          )}


          <div className="vehicle-details">

            <div>
              <small>Vehicle Capacity</small>
              <strong>
                {vehicle.capacity} Q
              </strong>
            </div>

            <div>
              <small>Available Space</small>
              <strong>
                {vehicle.available} Q
              </strong>
            </div>

            <div>
              <small>Estimated Freight</small>
              <strong>
                ₹{vehicle.freight}
              </strong>
            </div>

          </div>


          <button
            className={`request-btn ${
              requestedVehicle === vehicle.id
                ? 'requested'
                : ''
            }`}
            onClick={() =>
              setRequestedVehicle(vehicle.id)
            }
          >
            {requestedVehicle === vehicle.id
              ? '✓ Request Sent'
              : '🤝 Request to Join'}
          </button>

        </div>

      ))
    )}

    </div>

  </div>

</section>

      </main>

    </div>
  )
}

export default App