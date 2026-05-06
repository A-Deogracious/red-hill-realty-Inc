"use strict";

function openNav() {
  document.getElementById("navigationContainer").classList.add("nav-open");
}

function closeNav() {
  document.getElementById("navigationContainer").classList.remove("nav-open");
}

function checkClickLocation(ev, node) {
  var { target } = ev;

  do {
    if (target === node) {
      return true;
    }
    target = target.parentNode;
  } while (target);

  return false;
}

document.addEventListener("click", function (ev) {
  var navigationContainer = document.getElementById("navigationContainer");
  var openNavIcon = document.getElementById("openNavIcon");

  if (
    !checkClickLocation(ev, navigationContainer) &&
    !checkClickLocation(ev, openNavIcon)
  ) {
    closeNav();
  }
});

// Initialize Leaflet map on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  // Mock property data
  const properties = [
    { id: 1, type: 'Residential', price: 850000, status: 'Active', lat: 0.3360, lng: 32.5900, name: 'Kololo Heights Villa' },
    { id: 2, type: 'Commercial', price: 2500000, status: 'Active', lat: 0.3310, lng: 32.5850, name: 'City Center Plaza' },
    { id: 3, type: 'Land', price: 450000, status: 'Pending', lat: 0.3400, lng: 32.5950, name: 'Nakawa Plot' },
    { id: 4, type: 'Rent', price: 1200, status: 'Active', lat: 0.3250, lng: 32.5800, name: 'Bugolobi Apartment Monthly' },
    { id: 5, type: 'Residential', price: 650000, status: 'Active', lat: 0.3380, lng: 32.5880, name: 'Kampala Heights' },
    { id: 6, type: 'Commercial', price: 1800000, status: 'Sold', lat: 0.3350, lng: 32.5920, name: 'Office Block' },
    // Add 10+ more for demo
    { id: 7, type: 'Land', price: 320000, status: 'Active', lat: 0.3300, lng: 32.5820, name: 'Entebbe Road Land' },
    { id: 8, type: 'Residential', price: 950000, status: 'Pending', lat: 0.3420, lng: 32.5970, name: 'Luxury Villa' },
    { id: 9, type: 'Rent', price: 800, status: 'Active', lat: 0.3280, lng: 32.5840, name: 'Studio Rent' },
    { id: 10, type: 'Commercial', price: 1200000, status: 'Active', lat: 0.3370, lng: 32.5890, name: 'Shop Space' },
    { id: 11, type: 'Land', price: 280000, status: 'Active', lat: 0.3410, lng: 32.5940, name: 'Development Land' },
    { id: 12, type: 'Residential', price: 720000, status: 'Sold', lat: 0.3290, lng: 32.5810, name: 'Family Home' },
    { id: 13, type: 'Rent', price: 1500, status: 'Pending', lat: 0.3340, lng: 32.5870, name: '2BR Rent' },
    { id: 14, type: 'Commercial', price: 3400000, status: 'Active', lat: 0.3390, lng: 32.5930, name: 'Retail Complex' },
    { id: 15, type: 'Land', price: 510000, status: 'Active', lat: 0.3430, lng: 32.5980, name: 'Prime Land' }
  ];

  let currentMarkers = L.layerGroup();
  let allMarkersLayer = L.layerGroup();

  // Base layers
  const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  });

  const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');

  const hybrid = L.layerGroup([satellite, L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    opacity: 0.5,
    attribution: ''
  })]);

  const map = L.map('map', {
    layers: [osm],
    center: [0.3276, 32.5825],
    zoom: 13
  });

  const baseLayers = {
    "Map": osm,
    "Satellite": satellite,
    "Hybrid": hybrid
  };

  L.control.layers(baseLayers).addTo(map);
  map.addLayer(currentMarkers);

  // Add all markers initially
  properties.forEach(property => {
    const marker = L.marker([property.lat, property.lng])
      .bindPopup(`<b>${property.name}</b><br>$${property.price.toLocaleString()} • ${property.type} • ${property.status}`);
    allMarkersLayer.addLayer(marker);
  });

  function updateMarkers(filteredProperties) {
    currentMarkers.clearLayers();
    filteredProperties.forEach(property => {
      const marker = L.marker([property.lat, property.lng])
        .bindPopup(`<b>${property.name}</b><br>$${property.price.toLocaleString()} • ${property.type} • ${property.status}`);
      currentMarkers.addLayer(marker);
    });
    document.getElementById('searchCount').textContent = `Found ${filteredProperties.length} of ${properties.length}`;
  }

  // Search function
  function applyFilters() {
    const type = document.getElementById('propertyType').value;
    const minPrice = parseInt(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseInt(document.getElementById('maxPrice').value) || Infinity;
    const status = document.getElementById('status').value;

    const filtered = properties.filter(property => {
      return (!type || property.type === type) &&
             property.price >= minPrice &&
             property.price <= maxPrice &&
             (!status || property.status === status);
    });

    updateMarkers(filtered);
  }

  // Event listeners
  document.getElementById('propertyType').addEventListener('change', applyFilters);
  document.getElementById('minPrice').addEventListener('input', applyFilters);
  document.getElementById('maxPrice').addEventListener('input', applyFilters);
  document.getElementById('status').addEventListener('change', applyFilters);

  document.getElementById('refreshMap').addEventListener('click', function() {
    document.getElementById('propertyType').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('status').value = '';
    updateMarkers(properties);
  });

  // Initial load
  updateMarkers(properties);
});
