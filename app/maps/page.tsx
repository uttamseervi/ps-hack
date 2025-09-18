import React from 'react'
import GoogleMapView from '../../components/MapView'
function page() {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>🏥 Refugee Health Map (Google Maps)</h1>
      <GoogleMapView />
    </div>
  )
}

export default page
