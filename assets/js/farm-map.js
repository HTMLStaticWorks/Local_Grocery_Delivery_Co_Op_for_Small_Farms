// Farms page: interactive partner farm map (Leaflet + OpenStreetMap)
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('farmMap');
  if (!el || typeof L === 'undefined') return;

  // Placeholder coordinates around the co-op hub; replace with real farm locations.
  const farms = [
    { name: 'Green Valley Acres', place: 'Springfield', tag: 'Root vegetables', icon: 'ph-carrot', lat: 39.905, lng: -89.785 },
    { name: 'Sunrise Orchard', place: 'Westbridge', tag: 'Orchard fruit', icon: 'ph-tree', lat: 39.725, lng: -89.945 },
    { name: 'Urban Roots Co.', place: 'City Center', tag: 'Microgreens', icon: 'ph-plant', lat: 39.801, lng: -89.644 },
    { name: 'Riverbend Creamery', place: 'Easton', tag: 'Dairy', icon: 'ph-cow', lat: 39.625, lng: -89.405 }
  ];

  const map = L.map(el, { scrollWheelZoom: false });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  const markers = farms.map(f => {
    const icon = L.divIcon({
      className: 'farm-pin',
      html: `<span class="farm-pin-dot"><i class="ph-fill ${f.icon}"></i></span>`,
      iconSize: [40, 48],
      iconAnchor: [20, 46],
      popupAnchor: [0, -44]
    });
    return L.marker([f.lat, f.lng], { icon, title: f.name, alt: f.name })
      .addTo(map)
      .bindPopup(`<strong>${f.name}</strong><span>${f.tag} • ${f.place}</span>`);
  });

  map.fitBounds(L.featureGroup(markers).getBounds(), { padding: [48, 48] });
  // Enable wheel zoom only after the user interacts, so page scroll isn't hijacked
  map.on('click focus', () => map.scrollWheelZoom.enable());
});
