import './App.css'

function App() {
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

      {/* Hero Section */}
      <main className="hero-section">

        <div className="hero-content">
          <p className="tagline">🇮🇳 Kisan ke liye • Bharat ke liye</p>

          <h1>
            Apni Fasal Ka
            <br />
            <span>Sahi Daam Janiye</span>
          </h1>

          <p className="hero-text">
            Verified mandi prices compare karein,
            better mandi choose karein aur transport cost bachayein.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">
              📊 Mandi Radar
            </button>

            <button className="secondary-btn">
              🚜 Sajha Gadi
            </button>
          </div>
        </div>

      </main>

    </div>
  )
}

export default App