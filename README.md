# Interactive Chart/Table for fcr822's 2017 Annual Report

This is a refactor of an interactive map/table created for a client website. The refactor upgrades include:

1. React hooks
1. Webpack 5 (from Webpack 4)
1. Mapbox (from AMCharts' mapping library )
1. Material UI (from Bootstrap)

## Client Specification

Client supplied data in the form of a [spreadsheet](https://github.com/synchronopeia/fcr822-map-2017-data/client-files/data.csv).

The data includes multiple fields related to _forest cover_ as well as _finance_ listed by country.

The finished product is an interactive map of countries to be embedded in the client's WordPress site.

The map will include:

1. a choropleth (heatmap) representing a _forest cover_ field
1. a marker (circle) located at the country centroid representing a _finance_ field
1. a legend
1. a panel for selecting between available _forest cover_ and _finance_ fields and producing live updates to the map and legend

## TODO

- [x] set up app directory structure
- [x] set up Webpack 5
- [x] fetch JSON data
- [x] configure MapBox
- [x] display choropleth
- [x] display centroid circles
- [ ] deal with missing values
- [x] incorporate buttons to select forest & finance data fields
- [ ] incorporate slider to select finance data range
- [ ] expand README
- [ ] properly set up Webpack for production build
- [ ] include legend
- [ ] refine styling

## Versions

- 0.1.0 - basic map with choropleth and centroid circles
- 0.2.0 - incorporate buttons to select forest & finance data fields
