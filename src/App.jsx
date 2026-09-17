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
const [joinedVehicle, setJoinedVehicle] = useState(null)
const [sharedFreight, setSharedFreight] = useState(null)
const [dashboardQuantity, setDashboardQuantity] = useState(100)
const [dashboardFreight, setDashboardFreight] = useState(500)
const [dashboardCrop, setDashboardCrop] = useState('Wheat')

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
// Sajha Gadi - request to join
const requestToJoin = (vehicle) => {
  const requiredQuantity = Number(loadQuantity)

  if (!requiredQuantity || requiredQuantity <= 0) {
    alert('Please valid quantity enter karein.')
    return
  }

  if (requiredQuantity > vehicle.available) {
    alert(
      `Is vehicle me sirf ${vehicle.available} Q space available hai.`
    )
    return
  }

  // Farmer ke load ke according estimated freight share
  const freightShare = Math.round(
    (vehicle.freight * requiredQuantity) / vehicle.capacity
  )

  // Vehicle ki available space update karo
  setVehicles((previousVehicles) =>
    previousVehicles.map((item) =>
      item.id === vehicle.id
        ? {
            ...item,
            available: item.available - requiredQuantity,
          }
        : item
    )
  )

  setRequestedVehicle(vehicle.id)
  setJoinedVehicle(vehicle.id)

  setSharedFreight({
    vehicleId: vehicle.id,
    quantity: requiredQuantity,
    totalFreight: vehicle.freight,
    farmerShare: freightShare,
    remainingSpace: vehicle.available - requiredQuantity,
  })

  alert(
    `Request sent! Estimated shared freight: ₹${freightShare}`
  )
}
// =========================================
// Mandi Decision Dashboard
// =========================================

const dashboardMandis = mandiData.filter(
  (mandi) => mandi.crop === dashboardCrop
)

const dashboardResults = dashboardMandis.map((mandi) => {
  const quantity = Number(dashboardQuantity)
  const baseFreight = Number(dashboardFreight)

  // Nearby mandi ke liye simple estimated freight
  const estimatedFreight =
    mandi.name === 'Gulabbagh Mandi'
      ? baseFreight + 200
      : mandi.name === 'Araria Mandi'
        ? baseFreight + 100
        : baseFreight

  const grossSale =
    mandi.modal * quantity

  const netEarning =
    grossSale - estimatedFreight

  return {
    ...mandi,
    quantity,
    estimatedFreight,
    grossSale,
    netEarning,
  }
})

const highestNetEarning =
  dashboardResults.length > 0
    ? Math.max(
        ...dashboardResults.map(
          (mandi) => mandi.netEarning
        )
      )
    : 0
// =========================================
// SMART MANDI RECOMMENDATION
// =========================================

const recommendedMandi =
  dashboardResults.length > 0
    ? dashboardResults.reduce(
        (bestMandi, currentMandi) =>
          currentMandi.netEarning > bestMandi.netEarning
            ? currentMandi
            : bestMandi
      )
    : null

const recommendationMessage = recommendedMandi
  ? `Aapke ${dashboardQuantity} Q ${dashboardCrop} ke liye ${recommendedMandi.name} me estimated net earning ₹${recommendedMandi.netEarning.toLocaleString('en-IN')} hai.`
  : 'Abhi recommendation ke liye mandi data available nahi hai.'
  // =========================================
// SMART TRANSPORT MATCHING
// =========================================

const recommendedRoute =
  recommendedMandi?.name === 'Gulabbagh Mandi'
    ? 'Gulabbagh'
    : recommendedMandi?.name === 'Araria Mandi'
      ? 'Araria'
      : recommendedMandi?.name === 'Purnia Mandi'
        ? 'Purnia'
        : null

// =========================================
// PARTIAL SMART TRANSPORT MATCHING
// =========================================

const smartTransportMatches = recommendedRoute
  ? vehicles
      .filter((vehicle) => {

        const routeMatches =
          vehicle.destination === recommendedRoute

        const cropMatches =
          !vehicle.crop ||
          vehicle.crop === dashboardCrop

        const spaceAvailable =
          Number(vehicle.available) > 0

        return (
          routeMatches &&
          cropMatches &&
          spaceAvailable
        )
      })
      .map((vehicle) => {

        const requiredQuantity =
          Number(dashboardQuantity)

        const availableQuantity =
          Number(vehicle.available)

        const coveredQuantity =
          Math.min(
            requiredQuantity,
            availableQuantity
          )

        const remainingQuantity =
          Math.max(
            requiredQuantity -
            coveredQuantity,
            0
          )

        const isFullMatch =
          availableQuantity >= requiredQuantity

        const estimatedShare =
          Math.round(
            (
              Number(vehicle.freight) *
              coveredQuantity
            ) /
            Number(vehicle.capacity)
          )

        return {
          ...vehicle,

          requiredQuantity,
          coveredQuantity,
          remainingQuantity,
          isFullMatch,
          estimatedShare,
        }
      })
      .sort(
        (a, b) =>
          Number(b.isFullMatch) -
          Number(a.isFullMatch)
      )
  : []
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
    MANDI DECISION DASHBOARD
    ========================================= */}

<section className="decision-section">

  <div className="decision-heading">
    <p className="tagline">
      💰 MANDI DECISION DASHBOARD
    </p>

    <h1>
      Price Nahi,
      <br />
      <span>Net Earning</span> Compare Karo
    </h1>

    <p>
      Mandi price, quantity aur estimated freight ke
      basis par apni expected earning compare karein.
    </p>
  </div>


  {/* Dashboard Controls */}

  <div className="decision-controls">

    <div className="input-group">
      <label>🌾 Crop</label>

      <select
        value={dashboardCrop}
        onChange={(e) =>
          setDashboardCrop(e.target.value)
        }
      >
        <option>Wheat</option>
        <option>Rice</option>
        <option>Maize</option>
        <option>Potato</option>
      </select>
    </div>


    <div className="input-group">
      <label>📦 Quantity (Quintal)</label>

      <input
        type="number"
        min="1"
        value={dashboardQuantity}
        onChange={(e) =>
          setDashboardQuantity(e.target.value)
        }
      />
    </div>


    <div className="input-group">
      <label>🚚 Base Freight (₹)</label>

      <input
        type="number"
        min="0"
        value={dashboardFreight}
        onChange={(e) =>
          setDashboardFreight(e.target.value)
        }
      />
    </div>

  </div>


  {/* Mandi Comparison Cards */}

 <div className="decision-grid">

  {dashboardResults.map((mandi) => {

    const isHighest =
      mandi.netEarning === highestNetEarning

    return (
      <div
        className={`decision-card ${
          isHighest ? 'best-net-card' : ''
        }`}
        key={`${mandi.name}-${mandi.crop}`}
      >

        {isHighest && (
          <div className="best-badge">
            ⭐ Highest Net Earning
          </div>
        )}

        <div className="decision-card-header">

          <div>
            <h2>{mandi.name}</h2>

            <p>
              📍 {mandi.location}
            </p>
          </div>

          <span className="crop-badge">
            🌾 {mandi.crop}
          </span>

        </div>

        <div className="decision-price">

          <small>Modal Mandi Price</small>

          <strong>
            ₹{mandi.modal}
            <span>/Q</span>
          </strong>

        </div>

        <div className="decision-breakdown">

          <div>
            <small>Quantity</small>
            <strong>
              {mandi.quantity} Q
            </strong>
          </div>

          <div>
            <small>Gross Sale</small>
            <strong>
              ₹{mandi.grossSale.toLocaleString('en-IN')}
            </strong>
          </div>

          <div>
            <small>Estimated Freight</small>
            <strong>
              ₹{mandi.estimatedFreight}
            </strong>
          </div>

        </div>

        <div className="net-earning-box">

          <small>Expected Net Earning</small>

          <strong>
            ₹{mandi.netEarning.toLocaleString('en-IN')}
          </strong>

        </div>

      </div>
    )
  })}

</div>


{/* =========================================
    SMART MANDI RECOMMENDATION
    ========================================= */}

{recommendedMandi && (

  <div className="smart-recommendation">

    <div className="recommendation-icon">
      🧠
    </div>

    <div className="recommendation-content">

      <p className="tagline">
        SMART RECOMMENDATION
      </p>

      <h2>
        Suggested Mandi: {recommendedMandi.name}
      </h2>

      <p className="recommendation-message">
        {recommendationMessage}
      </p>

      <div className="recommendation-stats">

        <div>
          <small>Crop</small>
          <strong>
            🌾 {recommendedMandi.crop}
          </strong>
        </div>

        <div>
          <small>Modal Price</small>
          <strong>
            ₹{recommendedMandi.modal}/Q
          </strong>
        </div>

        <div>
          <small>Estimated Freight</small>
          <strong>
            ₹{recommendedMandi.estimatedFreight}
          </strong>
        </div>

        <div>
          <small>Expected Net Earning</small>
          <strong>
            ₹{recommendedMandi.netEarning.toLocaleString('en-IN')}
          </strong>
        </div>

      </div>

      <p className="recommendation-note">
        💡 Recommendation mandi price, quantity aur estimated
        freight ke calculated values par based hai.
      </p>

    </div>

  </div>

)}


</section>
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
              joinedVehicle === vehicle.id ? 'requested' : ''
            }`}
            onClick={() => requestToJoin(vehicle)}
            disabled={joinedVehicle === vehicle.id}
          >
            {joinedVehicle === vehicle.id
              ? '✓ Joined Successfully'
              : '🤝 Request to Join'}
          </button>

        </div>

      ))
    )}

    </div>

  </div>
   {/* Shared Freight Result */}
    {sharedFreight && (
      <div className="shared-freight-result">
        <div className="shared-freight-icon">
          💰
        </div>

        <div className="shared-freight-content">
          <p className="tagline">
            SHARED FREIGHT ESTIMATE
          </p>

          <h3>
            Your Estimated Freight Share
          </h3>

          <div className="freight-summary">
            <div>
              <small>Your Load</small>
              <strong>
                {sharedFreight.quantity} Q
              </strong>
            </div>

            <div>
              <small>Total Vehicle Freight</small>
              <strong>
                ₹{sharedFreight.totalFreight}
              </strong>
            </div>

            <div>
              <small>Your Estimated Share</small>
              <strong>
                ₹{sharedFreight.farmerShare}
              </strong>
            </div>
          </div>

          <p className="freight-note">
            Vehicle me ab approximately{' '}
            <strong>
              {sharedFreight.remainingSpace} Q
            </strong>{' '}
            space available hai.
          </p>
        </div>
      </div>
    )}
{/* =========================================
    SMART TRANSPORT MATCH
    ========================================= */}

{recommendedMandi && (
  <div className="smart-transport">

    <div className="smart-transport-header">

      <div>
        <p className="tagline">
          🚚 SMART TRANSPORT MATCH
        </p>

        <h2>
          Shared Transport for {recommendedMandi.name}
        </h2>

        <p>
          Recommended mandi ke route par available
          shared vehicles check karein.
        </p>
      </div>

      <span className="transport-route-badge">
        📍 Purnia → {recommendedRoute}
      </span>

    </div>


    {smartTransportMatches.length === 0 ? (

      <div className="no-smart-transport">
        <div className="no-smart-transport-icon">
          🚫
        </div>

        <div>
          <h3>
            No Suitable Shared Vehicle Found
          </h3>

          <p>
            Is mandi ke liye abhi required quantity ke
            according suitable shared vehicle available nahi hai.
          </p>
        </div>
      </div>

    ) : (

      <div className="smart-transport-grid">

        {smartTransportMatches.map((vehicle) => (
  <div
    className={`smart-transport-card ${
      vehicle.isFullMatch
        ? 'full-transport-match'
        : 'partial-transport-match'
    }`}
    key={vehicle.id}
  >

    {/* VEHICLE HEADER */}
    <div className="smart-transport-card-header">

      <div>
        <h3>{vehicle.driver}</h3>

        <p>
          🚚 {vehicle.route}
        </p>
      </div>

      <span
        className={`transport-status ${
          vehicle.isFullMatch ? 'full' : 'partial'
        }`}
      >
        {vehicle.isFullMatch
          ? '✓ Full Match'
          : '⚠ Partial Match'}
      </span>

    </div>


    {/* MATCH DETAILS */}
    <div className="smart-transport-details">

      <div>
        <small>Required Quantity</small>

        <strong>
          {vehicle.requiredQuantity} Q
        </strong>
      </div>


      <div>
        <small>Covered Quantity</small>

        <strong>
          {vehicle.coveredQuantity} Q
        </strong>
      </div>


      <div>
        <small>Available Space</small>

        <strong>
          {vehicle.available} Q
        </strong>
      </div>


      <div>
        <small>Vehicle Freight</small>

        <strong>
          ₹{vehicle.freight}
        </strong>
      </div>

    </div>


    {/* FULL / PARTIAL RESULT */}
    <div
      className={`transport-match-result ${
        vehicle.isFullMatch
          ? 'full-result'
          : 'partial-result'
      }`}
    >

      <div>
        <small>Covered</small>

        <strong>
          {vehicle.coveredQuantity} Q
        </strong>
      </div>


      <div>
        <small>Remaining</small>

        <strong>
          {vehicle.remainingQuantity} Q
        </strong>
      </div>


      <div>
        <small>Estimated Freight Share</small>

        <strong>
          ₹{vehicle.estimatedShare}
        </strong>
      </div>

    </div>


    {/* PARTIAL WARNING */}
    {!vehicle.isFullMatch && (
      <div className="partial-warning">

        <span>⚠️ Partial Transport Match</span>

        <p>
          Is vehicle me abhi{' '}
          <strong>
            {vehicle.coveredQuantity} Q
          </strong>{' '}
          space available hai.
          Aapki{' '}
          <strong>
            {vehicle.remainingQuantity} Q
          </strong>{' '}
          quantity ke liye additional transport
          arrange karna hoga.
        </p>

      </div>
    )}


    {/* ROUTE + CROP MATCH */}
    <div className="smart-transport-match">

      <span>✓ Route Match</span>

      <span>✓ Crop Match</span>

      {vehicle.isFullMatch ? (
        <span>✓ Capacity Match</span>
      ) : (
        <span>⚠ Partial Capacity</span>
      )}

    </div>


    {/* ACTION BUTTON */}
    <button
      className="smart-join-btn"
      onClick={() => {

        setPickup(vehicle.pickup)

        setDestination(
          vehicle.destination
        )

        setLoadCrop(
          dashboardCrop
        )

        setLoadQuantity(
          vehicle.coveredQuantity
        )


        const freightShare =
          vehicle.estimatedShare


        setSharedFreight({
          vehicleId: vehicle.id,

          quantity:
            vehicle.coveredQuantity,

          totalFreight:
            vehicle.freight,

          farmerShare:
            freightShare,

          remainingSpace:
            vehicle.available -
            vehicle.coveredQuantity,
        })


        setJoinedVehicle(
          vehicle.id
        )


        alert(
          vehicle.isFullMatch
            ? `Full match! ${vehicle.coveredQuantity} Q ke liye estimated shared freight ₹${freightShare}`
            : `Partial match! ${vehicle.coveredQuantity} Q cover hoga aur ${vehicle.remainingQuantity} Q ke liye additional transport chahiye.`
        )

      }}
    >
      🤝 Use Available Space
    </button>


  </div>
))}

      </div>

    )}

  </div>
)}

</section>

      </main>

    </div>
  )
}

export default App