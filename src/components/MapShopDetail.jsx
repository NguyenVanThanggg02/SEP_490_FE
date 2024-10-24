import React, {useRef } from "react";
import Map, { FullscreenControl, Marker, NavigationControl } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css'

export const MapShopDetail = ({ lat, lng}) => {
    const MAPBOX_TOKEN = "pk.eyJ1Ijoic21hbGxtb25rZXkyMDIzIiwiYSI6ImNsdGpxeWc2YjBweWoybXA2OHZ4Zmt0NjAifQ.bRMFGPTFKgsW8XkmAqX84Q";
    const mapRef = useRef(null);

    return (
        <div style={{ width: "150%", display: "flex", justifyContent: 'center'}}>
            <Map
                latitude={lat || 21.027448753456103}
                longitude={lng || 105.8336955905755}
                ref={mapRef}
                mapboxAccessToken={MAPBOX_TOKEN}
                initialViewState={{
                    longitude: lng,
                    latitude: lat,
                    zoom: 12
                }}
                style={{ width: "100%", height: "500px" }} // Đảm bảo bản đồ đủ lớn
                mapStyle="mapbox://styles/mapbox/streets-v9"
            >
                {/* Hiển thị marker nếu tồn tại */}
                    {lng && lat &&  <Marker
                        longitude={lng}
                        latitude={lat}
                        color="red"
                        anchor="bottom"  // Điều chỉnh vị trí để cải thiện căn chỉnh
                        draggable={false} 
                    />}
                <NavigationControl />
                <FullscreenControl />
            </Map>
        </div>
    );
};
