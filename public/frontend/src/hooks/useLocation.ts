import { useEffect, useState } from 'react'
import { Coordinates, getLocation } from '../utils/location'

export const displayLocationAlert = (params: {
  location: Coordinates | undefined
}) => {
  if (!params.location) {
    window.alert(
      'Please allow location services and refresh the page. If location permissions are already granted, wait for 5 seconds, the location is being determined.'
    )
    return true
  }
  return false
}

export const useLocation = () => {
  const [locationCoordinates, setLocation] = useState<Coordinates>()
  useEffect(() => {
    if (!navigator.geolocation) {
      return
    }
    getLocation().then(setLocation)
  }, [setLocation])
  return { location: locationCoordinates }
}
