import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useStopList } from '../../model/hook/bus'

const Map = (props: {
  lat: number
  long: number
  stopList: ReturnType<typeof useStopList>['data']
}) => {
  const { lat, long, stopList } = props
  return (
    <MapContainer center={[lat, long]} zoom={18}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stopList?.map((stop: any) => (
        <Marker key={stop.seq} position={[stop.lat, stop.long]}>
          <Popup>{stop.name_tc}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default Map
