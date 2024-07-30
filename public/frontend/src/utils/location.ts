export type Coordinates = {
  latitude: string
  longitude: string
}

export const getLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not found in navigaor'))
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates: Coordinates = {
            longitude: position.coords.longitude.toString(),
            latitude: position.coords.latitude.toString()
          }
          resolve(coordinates)
        },
        (e) => reject(new Error(`Getting position failed with ${e}`))
      )
    }
  })
}
