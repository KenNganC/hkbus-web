# HK Bus
An application for show bus stop list / bus ETA using React.js.\
\
[Demo](https://hkbus.netlify.app/)

## Installation and execution steps
Package install:

### `npm install`

Runs the app in the development mode:

### `npm start`

## Assumptions

For the simplicity, only using 荃景圍天橋 / 荃灣柴灣角街 for bus list. Configured in src/config.ts

Only Support Traditional Chinese 

## Choice of solutions

### Material UI
Open-source React component library that implements Google's Material Design.

### React-Query
Asynchronous State Management

More efficient and simple for fetching/ caching data. (comparing to Redux/Mobx...)

### Luxon

For time / date handling

More light-weight than moment.js (235K (66K gzipped) vs. 66K (20 gzipped))

### React-Leaflet

For using OpenStreetMap

## TBC

i18n, destination search, GPS for identify current stop

## Data Sources

All ETA data is from DATA.GOV.HK and respective providers




