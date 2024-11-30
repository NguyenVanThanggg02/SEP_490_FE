import "@goongmaps/goong-js/dist/goong-js.css";
import ReactMapGL, {
  FullscreenControl,
  Marker,
  NavigationControl,
} from "@goongmaps/goong-map-react";
import PlaceIcon from "@mui/icons-material/Place";
import axios from "axios"; // Nhập axios để gọi API
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const defaultGeo = {
  latitude: 21.027448753456103,
  longitude: 105.8336955905755,
};
const fullscreenControlStyle = {
  right: 10,
  top: 10,
};
const navControlStyle = {
  right: 10,
  bottom: 10,
};

export const GooMap = ({
  textSearch,
  setTextSearch,
  setLocationSuggests,
  locationSuggests,
  location,
  setLocation,
  spaceInfo,
  setSpaceInfo,
}) => {
  const GOONG_MAPTILES_KEY = "9aheLWUVrgOBvBLrFb39hiMhfK150rqHg6HSqYWk";
  const GOO_KEY = "fxMWOQAGy0KR2fAJND6Gi360iGmqZvaOZWr49ePC";

  const [viewport, setViewport] = useState({
    latitude: spaceInfo?.latLng?.[0] ?? defaultGeo.latitude,
    longitude: spaceInfo?.latLng?.[1] ?? defaultGeo.longitude,
    zoom: 14,
  });

  // State để lưu vị trí marker và địa chỉ
  const [marker, setMarker] = useState(null);

  const fetchAutoCompleteSuggests = async (textSearch) => {
    if (textSearch && textSearch.length > 0) {
      try {
        const response = await axios.get(
          `https://rsapi.goong.io/place/autocomplete`,
          {
            params: {
              input: textSearch,
              api_key: GOO_KEY,
            },
          }
        );

        console.log("response when text search change", response);

        const suggestList = response.data.predictions?.map((i) => {
          const fullAddress = i.description;
          const placeId = i.place_id;

          const label = fullAddress;

          return {
            value: `${label}***${placeId}`,
            label: label,
          };
        });

        setLocationSuggests(suggestList); // Đặt gợi ý
      } catch (error) {
        console.error("Lỗi khi lấy gợi ý địa chỉ:", error);
      }
    } else {
      setLocationSuggests([]); // Xóa gợi ý nếu đầu vào trống
    }
  };

  // Hàm lấy địa chỉ từ tọa độ
  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://rsapi.goong.io/geocode?latlng=${latitude}%2C${longitude}&api_key=${GOO_KEY}`
      );
      console.log("response", response);
      if (response.data.results[0]?.formatted_address) {
        const addressComponents = response.data.results[0]?.formatted_address;

        return {
          full_address: addressComponents,
          latitude,
          longitude,
        };
      } else {
        console.error("Lỗi khi lấy địa chỉ:");
      }
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ:", error);
    }
  };

  // Hàm xử lý khi nhấp vào bản đồ
  const onMapClick = async (event) => {
    const { lngLat } = event;
    console.log("onMapClick", lngLat);

    const lng = lngLat[0];
    const lat = lngLat[1];

    if (lat && lng) {
      // Gọi API geocoding ngược để lấy địa chỉ
      const ret = await fetchAddress(lat, lng);
      if (ret) {
        const { full_address } = ret;
        console.log("onMapClick ret after fetch address", full_address);

        setLocation(full_address);
        setTextSearch(full_address);
        setSpaceInfo((prev) => ({ ...prev, latLng: [lat, lng] }));
      } else {
        toast.error("Get address failed");
      }
    }
  };

  // Hàm xử lý sự kiện kéo thả marker
  const onMarkerDragEnd = async (event) => {
    const { lngLat } = event;

    const lng = lngLat[0];
    const lat = lngLat[1];

    if (lat && lng) {
      // Gọi API geocoding ngược để lấy địa chỉ

      const ret = await fetchAddress(lat, lng);
      const { full_address } = ret;
      console.log("ret after fetch address,lngLat", full_address, lngLat);

      setLocation(full_address);
      setTextSearch(full_address);
      setSpaceInfo((prev) => ({ ...prev, latLng: [lat, lng] }));
    }
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
    console.log("useE", lat, lng);
    if (!Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng))) {
      setMarker({
        latitude: lat,
        longitude: lng,
      });
      console.log("run set viewport");
      setViewport((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
    }
  }, [JSON.stringify(spaceInfo.latLng)]);

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <ReactMapGL
        {...viewport}
        width="80%"
        height={500}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        onClick={onMapClick} // Thêm sự kiện onClick
        // mapStyle="https://tiles.goong.io/assets/goong_map_dark.json"
        goongApiAccessToken={GOONG_MAPTILES_KEY}
      >
        {/* Hiển thị marker nếu tồn tại */}
        {marker ? (
          <Marker
            latitude={marker?.latitude}
            longitude={marker?.longitude}
            anchor="bottom" // Điều chỉnh vị trí để cải thiện căn chỉnh
            draggable={true}
            onDragEnd={onMarkerDragEnd}
          >
            <PlaceIcon
              sx={{
                color: "red",
              }}
            />
          </Marker>
        ) : null}
        <NavigationControl style={navControlStyle} />
        <FullscreenControl style={fullscreenControlStyle} />
      </ReactMapGL>
    </div>
  );
};
