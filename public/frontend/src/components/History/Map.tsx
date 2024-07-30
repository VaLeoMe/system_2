import { Coordinates } from '../../utils/location'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import './map.css'
import { useState } from 'react'
import { useEffect } from 'react'

type GoogleCoordinates = {
  lat: number
  lng: number
}

export const StepMap = ({ coordinates }: { coordinates: Coordinates }) => {
  const parsedCoordinates: GoogleCoordinates = {
    lng: parseFloat(coordinates.longitude),
    lat: parseFloat(coordinates.latitude)
  }

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY!
  })

  if (!isLoaded) {
    return <div>Google maps is loading</div>
  }
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Map coordinates={parsedCoordinates} />
    </div>
  )
}

const Map = ({ coordinates }: { coordinates: GoogleCoordinates }) => {
  const [markerHack, setMarkerHack] = useState<number>(0)

  useEffect(() => {
    setMarkerHack((s) => s + 1)
  }, [])
  return (
    <GoogleMap
      zoom={10}
      center={coordinates}
      mapContainerClassName={'map-container'}
    >
      <Marker
        key={markerHack}
        position={coordinates}
        title={'The marker`s title will appear as a tooltip.'}
      />
    </GoogleMap>
  )
}
