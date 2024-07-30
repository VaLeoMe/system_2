import { createContext, ReactNode } from 'react'
import { useLocation } from '../hooks/useLocation'
import { Coordinates } from '../utils/location'

export const LocationContext = createContext<Coordinates | undefined>(undefined)
LocationContext.displayName = 'LocationContext'

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const { location } = useLocation()

  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  )
}
