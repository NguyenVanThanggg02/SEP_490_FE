import axios from 'axios'; // Nhập axios để gọi API
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useEffect, useRef, useState } from 'react';
import Map, {
  FullscreenControl,
  Marker,
  NavigationControl,
} from 'react-map-gl';

const defaultLatLng = {
  latitude: 21.027448753456103,
  longitude: 105.8336955905755,
};

export const MapSearch = ({
  textSearch,
  setTextSearch,
  setLocationSuggests,
  locationSuggests,
  location,
  setLocation,
  spaceInfo,
  setSpaceInfo,
}) => {
  const MAPBOX_TOKEN =
    'pk.eyJ1Ijoic21hbGxtb25rZXkyMDIzIiwiYSI6ImNsdGpxeWc2YjBweWoybXA2OHZ4Zmt0NjAifQ.bRMFGPTFKgsW8XkmAqX84Q';
  const mapRef = useRef(null);

  // State để lưu vị trí marker và địa chỉ
  const [marker, setMarker] = useState(null);

  const fetchAutoCompleteSuggests = async (textSearch) => {
    // Lấy gợi ý địa chỉ từ Mapbox Geocoding API
    if (textSearch && textSearch.length > 0) {
      try {
        const response = await axios.get(
          `https://api.mapbox.com/search/geocode/v6/forward`,
          {
            params: {
              access_token: MAPBOX_TOKEN,
              q: textSearch,
              country: 'vn',
              language: 'vi',
            },
          }
        );
        console.log('response when text search change', response);

        const suggestList = response.data.features?.map((i) => {
          const fullAddress = i.properties.full_address;
          const lng = i.geometry.coordinates[0];
          const lat = i.geometry.coordinates[1];
          const latLngString = `${lat},${lng}`;
          const label = fullAddress
            .replace(/, \d+,/, ',')
            .replace(/, việt nam/i, '');
          return {
            value: `${label}_${latLngString}`,
            label: label,
          };
        });

        setLocationSuggests(suggestList); // Đặt gợi ý
      } catch (error) {
        console.error('Lỗi khi lấy gợi ý địa chỉ:', error);
      }
    } else {
      setLocationSuggests([]); // Xóa gợi ý nếu đầu vào trống
    }
  };

  // Hàm lấy địa chỉ từ tọa độ
  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/search/geocode/v6/reverse`,
        {
          params: {
            access_token: MAPBOX_TOKEN,
            longitude: longitude,
            latitude: latitude,
            country: 'vn',
            language: 'vi',
            types: 'neighborhood,locality,place,district',
          },
        }
      );
      console.log('response', response);
      const addressComponents =
        response.data.features[0]?.properties.full_address
          .replace(/, \d+,/, ',')
          .replace(/, việt nam/i, ''); // Lấy địa chỉ từ phản hồi

      return { full_address: addressComponents, latitude, longitude };
    } catch (error) {
      console.error('Lỗi khi lấy địa chỉ:', error);
    }
  };

  // Hàm xử lý khi nhấp vào bản đồ
  const onMapClick = async (event) => {
    const { lngLat } = event;

    // Gọi API geocoding ngược để lấy địa chỉ
    const ret = await fetchAddress(lngLat.lat, lngLat.lng);
    const { full_address } = ret;
    console.log('ret after fetch address', full_address);

    setLocation(full_address);
    setTextSearch(full_address);
    setSpaceInfo((prev) => ({ ...prev, latLng: [lngLat.lat, lngLat.lng] }));
  };

  // Hàm xử lý sự kiện kéo thả marker
  const onMarkerDragEnd = async (event) => {
    const { lngLat } = event;

    // Gọi API geocoding ngược để lấy địa chỉ
    const ret = await fetchAddress(lngLat.lat, lngLat.lng);
    const { full_address } = ret;
    console.log('ret after fetch address,lngLat', full_address, lngLat);

    setLocation(full_address);
    setTextSearch(full_address);
    setSpaceInfo((prev) => ({ ...prev, latLng: [lngLat.lat, lngLat.lng] }));
  };

  useEffect(() => {
    // to prevent call api too much, make it call api after change textSearch 500ms
    const timeId = setTimeout(function () {
      fetchAutoCompleteSuggests(textSearch);
    }, 400);

    return () => {
      clearTimeout(timeId);
    };
  }, [textSearch]);

  useEffect(() => {
    const lat = spaceInfo?.latLng?.[0];
    const lng = spaceInfo?.latLng?.[1];
    console.log('useE', lat, lng);
    if (!Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng))) {
      setMarker({
        latitude: lat,
        longitude: lng,
      });
    }
  }, [JSON.stringify(spaceInfo.latLng)]);

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Map
        latitude={marker?.latitude || 21.027448753456103}
        longitude={marker?.longitude || 105.8336955905755}
        // zoom={marker ? 20: null}
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          latitude: 21.027448753456103,
          longitude: 105.8336955905755,
          zoom: 12,
        }}
        style={{ width: '80%', height: '500px' }} // Đảm bảo bản đồ đủ lớn
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onClick={onMapClick} // Thêm sự kiện onClick
      >
        {/* Hiển thị marker nếu tồn tại */}
        {marker ? (
          <Marker
            latitude={marker?.latitude}
            longitude={marker?.longitude}
            color="red"
            anchor="bottom" // Điều chỉnh vị trí để cải thiện căn chỉnh
            draggable={true}
            onDragEnd={onMarkerDragEnd}
          />
        ) : null}
        <NavigationControl />
        <FullscreenControl />
      </Map>
    </div>
  );
};
