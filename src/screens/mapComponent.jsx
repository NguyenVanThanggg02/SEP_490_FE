// MapComponent.js
import React, { useState, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 10.8231, // Vị trí mặc định
  lng: 106.6297,
};

const libraries = ["places"]; // Nơi bạn cần để sử dụng Autocomplete

const MapComponent = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",
    libraries,
  });

  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(center);
  const autocompleteRef = useRef(null);

  if (!isLoaded) return <div>Loading...</div>;

  const handleMapClick = (event) => {
    setMarkerPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const { location } = place.geometry;
      setMarkerPosition({
        lat: location.lat(),
        lng: location.lng(),
      });
      map.panTo(location);
    }
  };

  return (
    <div>
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceSelect}
      >
        <input
          type="text"
          placeholder="Search for places"
          style={{ width: "100%", padding: "10px" }}
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={markerPosition}
        zoom={10}
        onClick={handleMapClick}
        onLoad={(map) => setMap(map)}
      >
        <Marker position={markerPosition} />
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
