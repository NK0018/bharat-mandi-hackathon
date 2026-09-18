const API_BASE_URL = 'http://localhost:5000/api/mandi'

export async function fetchMandiPrices({
  state,
  district,
  commodity,
} = {}) {
  const params = new URLSearchParams()

  if (state) {
    params.append('state', state)
  }

  if (district) {
    params.append('district', district)
  }

  if (commodity) {
    params.append('commodity', commodity)
  }

  const response = await fetch(
    `${API_BASE_URL}?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error(
      `Backend Mandi API failed: ${response.status}`
    )
  }

  const data = await response.json()

  if (!data.success) {
    throw new Error(
      data.error || 'Failed to fetch mandi data'
    )
  }

  return data.records || []
}
// =====================================
// Mandi Comparison API
// =====================================

export async function fetchMandiComparison({
  state,
  commodity,
} = {}) {
  const params = new URLSearchParams()

  if (state) {
    params.append('state', state)
  }

  if (commodity) {
    params.append('commodity', commodity)
  }

  const response = await fetch(
    `http://localhost:5000/api/mandi/compare?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error(
      `Mandi comparison API failed: ${response.status}`
    )
  }

  const data = await response.json()

  if (!data.success) {
    throw new Error(
      data.error || 'Failed to fetch mandi comparison'
    )
  }

  return data.records || []
}