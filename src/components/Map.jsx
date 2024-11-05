import axios from 'axios'; // Nhập axios để gọi API
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Map, {
  FullscreenControl,
  Marker,
  NavigationControl,
} from 'react-map-gl';
import { SpaceContext } from '../Context/SpaceContext ';

export const MapSearch = ({
  textSearch,
  setLocationSuggest,
  location,
  setLocation,
  setLocation2,
  defaultMarker = null,
}) => {
  console.log('defaultMarker', defaultMarker);
  const MAPBOX_TOKEN =
    'pk.eyJ1Ijoic21hbGxtb25rZXkyMDIzIiwiYSI6ImNsdGpxeWc2YjBweWoybXA2OHZ4Zmt0NjAifQ.bRMFGPTFKgsW8XkmAqX84Q';
  const mapRef = useRef(null);

  // State để lưu vị trí marker và địa chỉ
  const [marker, setMarker] = useState(defaultMarker);
  const [address, setAddress] = useState(''); // State để lưu địa chỉ
  const { setSpaceInfo, spaceInfo } = useContext(SpaceContext);

  const handleAddressChange = async (input) => {
    setAddress(input);

    // Lấy gợi ý địa chỉ từ Mapbox Geocoding API
    if (input && input.length > 0) {
      try {
        const response = await axios.get(
          `https://api.mapbox.com/search/geocode/v6/forward`,
          {
            params: {
              access_token: MAPBOX_TOKEN,
              q: input,
              country: 'vn',
              language: 'vi',
            },
          }
        );

        setLocationSuggest(
          response.data.features?.map((i) => ({
            value: i.geometry.coordinates.toString(),
            label: i.properties.full_address
              .replace(/, \d+,/, ',')
              .replace(/, việt nam/i, ''),
          }))
        ); // Đặt gợi ý
      } catch (error) {
        console.error('Lỗi khi lấy gợi ý địa chỉ:', error);
      }
    } else {
      setLocationSuggest([]); // Xóa gợi ý nếu đầu vào trống
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      handleAddressChange(textSearch);
    }, 500);

    return () => clearTimeout(handler);
  }, [textSearch]);

  useEffect(() => {
    if (location) {
      console.log('location', location);
      const lngLatSlipt = String(location).split(',');
      //   if (!Number.isNaN(lngLatSlipt[0] && !Number.isNaN(lngLatSlipt[1]))) {
      //     setMarker({
      //       longitude: lngLatSlipt[0],
      //       latitude: lngLatSlipt[1],
      //     });
      //   }
    }
  }, [location]);

  // Hàm xử lý khi nhấp vào bản đồ
  const handleMapClick = async (event) => {
    const { lngLat } = event;
    setMarker({
      longitude: lngLat.lng,
      latitude: lngLat.lat,
    });

    // Gọi API geocoding ngược để lấy địa chỉ
    await fetchAddress(lngLat.lat, lngLat.lng);
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
      const addressComponents =
        response.data.features[0]?.properties.full_address
          .replace(/, \d+,/, ',')
          .replace(/, việt nam/i, ''); // Lấy địa chỉ từ phản hồi
      setAddress(addressComponents || ''); // Cập nhật state địa chỉ
      const valueSelect = [longitude, latitude].toString();
      setLocation2(valueSelect);
      setLocationSuggest([{ value: valueSelect, label: addressComponents }]);
      setSpaceInfo((prev) => ({
        ...prev,
        location: addressComponents,
        latLng: [latitude, longitude],
      }));
      setLocation('');
    } catch (error) {
      console.error('Lỗi khi lấy địa chỉ:', error);
    }
  };

  // Hàm xử lý sự kiện kéo thả marker
  const handleMarkerDragEnd = async (event) => {
    const { lngLat } = event;
    setMarker({
      longitude: lngLat.lng,
      latitude: lngLat.lat,
    });
    await fetchAddress(lngLat.lat, lngLat.lng); // Lấy địa chỉ cho vị trí marker mới
  };

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Map
        latitude={marker?.latitude || 21.027448753456103}
        longitude={marker?.longitude || 105.8336955905755}
        // zoom={marker ? 20: null}
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: 105.8336955905755,
          latitude: 21.027448753456103,
          zoom: 12,
        }}
        style={{ width: '80%', height: '500px' }} // Đảm bảo bản đồ đủ lớn
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onClick={handleMapClick} // Thêm sự kiện onClick
      >
        {/* Hiển thị marker nếu tồn tại */}
        {marker ? (
          <Marker
            longitude={marker?.longitude}
            latitude={marker?.latitude}
            color="red"
            anchor="bottom" // Điều chỉnh vị trí để cải thiện căn chỉnh
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
          />
        ) : null}
        <NavigationControl />
        <FullscreenControl />
      </Map>
    </div>
  );
};
