var lucknow = ee.Geometry.Point([80.9462, 26.8467]);

Map.centerObject(lucknow, 10);


// 2017 Sentinel-2 imagery
var image2017 = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
  .filterBounds(lucknow)
  .filterDate('2017-01-01', '2017-03-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .median();


// True-color visualization
var visualization = {
  bands: ['B4', 'B3', 'B2'],
  min: 0,
  max: 3000
};

Map.addLayer(image2017, visualization, 'Lucknow 2017');

// Calculate NDVI for 2017
var ndvi2017 = image2017.normalizedDifference(['B8', 'B4'])
  .rename('NDVI');


// NDVI visualization
var ndviVisualization = {
  min: -1,
  max: 1,
  palette: ['blue', 'white', 'green']
};


// Display NDVI
Map.addLayer(ndvi2017, ndviVisualization, 'NDVI 2017');

//2026


Map.centerObject(lucknow, 10);


// 2026 Sentinel-2 imagery
var image2026 = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
  .filterBounds(lucknow)
  .filterDate('2026-01-01', '2026-03-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .median();


// True-color visualization
var visualization = {
  bands: ['B4', 'B3', 'B2'],
  min: 0,
  max: 3000
};

Map.addLayer(image2026, visualization, 'Lucknow 2026');

// Calculate NDVI for 2026
var ndvi2026 = image2026.normalizedDifference(['B8', 'B4'])
  .rename('NDVI');


// NDVI visualization
var ndviVisualization = {
  min: -1,
  max: 1,
  palette: ['blue', 'white', 'green']
};


// Display NDVI
Map.addLayer(ndvi2026, ndviVisualization, 'NDVI 2026');


// Calculate NDVI change
var ndviChange = ndvi2026.subtract(ndvi2017)
  .rename('NDVI_Change');

// Visualize the change
var changeVisualization = {
  min: -0.5,
  max: 0.5,
  palette: ['red', 'white', 'green']
};

// Display NDVI change
Map.addLayer(ndviChange, changeVisualization, 'NDVI Change 2017-2026');

// Calculate average NDVI for 2017
var meanNDVI2017 = ndvi2017.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: lucknow.buffer(20000),
  scale: 10,
  maxPixels: 1e13
});

print('Mean NDVI 2017:', meanNDVI2017);


// Calculate average NDVI for 2026
var meanNDVI2026 = ndvi2026.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: lucknow.buffer(20000),
  scale: 10,
  maxPixels: 1e13
});

print('Mean NDVI 2026:', meanNDVI2026);


// Export 2017 Red (B4) and NIR (B8)
Export.image.toDrive({
  image: image2017.select(['B4', 'B8']),
  description: 'Lucknow_2017_B4_B8',
  folder: 'Lucknow_Project',
  region: lucknow.buffer(20000).bounds(),
  scale: 10,
  maxPixels: 1e13
});


// Export 2026 Red (B4) and NIR (B8)
Export.image.toDrive({
  image: image2026.select(['B4', 'B8']),
  description: 'Lucknow_2026_B4_B8',
  folder: 'Lucknow_Project',
  region: lucknow.buffer(20000).bounds(),
  scale: 10,
  maxPixels: 1e13
});
