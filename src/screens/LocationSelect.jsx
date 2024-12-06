import { Stack } from '@mui/material';
import { Select as SearchSelect } from 'antd';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { debounce } from '../utils/debounce';

export default function LocationSelect({
  spaceInfo,
  setSpaceInfo,
  location,
  setLocation,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [detailAddressSuggests, setDetailAddressSuggests] = useState([]);
  const [detailAddressSearch, setDetailAddressSearch] = useState([]);
  const [selectedData, setSelectedData] = useState({
    provinceObj: { id: '', value: '' },
    districtObj: { id: '', value: '' },
    wardObj: { id: '', value: '' },
    detailAddress: '',
  });

  const fetchLatLng = async (newLocation) => {
    const MAPBOX_TOKEN =
      'pk.eyJ1Ijoic21hbGxtb25rZXkyMDIzIiwiYSI6ImNsdGpxeWc2YjBweWoybXA2OHZ4Zmt0NjAifQ.bRMFGPTFKgsW8XkmAqX84Q';
    const response = await axios.get(
      `https://api.mapbox.com/search/geocode/v6/forward`,
      {
        params: {
          access_token: MAPBOX_TOKEN,
          q: newLocation,
          country: 'vn',
          language: 'vi',
        },
      }
    );
    console.log('response when text search change', response);
    const coordinates = response.data.features[0].geometry.coordinates;
    return {
      lng: coordinates[0],
      lat: coordinates[1],
    };
  };

  const handleChange = async (type, obj) => {
    console.log('handleChange', type, obj);
    if (type === 'province') {
      setSelectedData({
        [`${type}Obj`]: { ...obj, id: obj.title },
        districtObj: { id: '', value: '' },
        wardObj: { id: '', value: '' },
      });
      setDetailAddressSearch('');
    } else if (type === 'district') {
      setSelectedData((prev) => ({
        ...prev,
        [`${type}Obj`]: { ...obj, id: obj.title },
        wardObj: { id: '', value: '' },
      }));
      setDetailAddressSearch('');
    } else if (type === 'ward') {
      setSelectedData((prev) => ({
        ...prev,
        [`${type}Obj`]: { ...obj, id: obj.title },
      }));
      setDetailAddressSearch('');
    } else {
      setSelectedData((prev) => ({
        ...prev,
        detailAddress: { ...obj, id: obj.value },
      }));
      setDetailAddressSearch(obj.value);
    }

    let newLocation;
    if (type === 'province') {
      newLocation = obj.value;
    } else if (type === 'district') {
      newLocation = `${obj.value}, ${selectedData.provinceObj.value}`;
    } else if (type === 'ward') {
      newLocation = `${obj.value}, ${selectedData.districtObj.value}, ${selectedData.provinceObj.value}`;
    } else {
      newLocation = `${obj.value}, ${selectedData.wardObj.value}, ${selectedData.districtObj.value}, ${selectedData.provinceObj.value}`;
    }
    setLocation(newLocation);

    // set latLng
    const { lat, lng } = await fetchLatLng(newLocation);
    setSpaceInfo((prev) => ({ ...prev, latLng: [lat, lng] }));
  };

  const fetchAutoCompleteSuggests = async (textSearch) => {
    // Lấy gợi ý địa chỉ từ Mapbox Geocoding API
    if (textSearch && textSearch.length > 0) {
      setIsLoading(true);
      try {
        // const key = '';
        const key = '4cdf56df4094717d5b3dc0fa3e5219e81740f632e578b641';
        const response = await axios.get(
          `https://maps.vietmap.vn/api/autocomplete/v3`,
          {
            params: {
              apikey: key,
              text: `${textSearch} ${location}`,
            },
          }
        );
        console.log('response when text search change', response);

        const suggestList = response.data.map((i) => {
          const detailAddress = i.name;

          return {
            value: `${detailAddress}`,
            label: detailAddress,
          };
        });

        setDetailAddressSuggests(suggestList); // Đặt gợi ý
      } catch (error) {
        console.error('Lỗi khi lấy gợi ý địa chỉ:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setDetailAddressSuggests([]); // Xóa gợi ý nếu đầu vào trống
    }
  };

  const onDetailTextSearchChange = (value) => {
    setDetailAddressSearch(value);
  };

  //   title of object of select option is id
  // lấy thành phố
  useEffect(() => {
    const fetchprovinces = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(
          'https://esgoo.net/api-tinhthanh/1/0.htm'
        );
        // https://provinces.open-api.vn/api/
        const formattedProvinces = response.data.data.map((province) => ({
          value: province.name,
          label: province.full_name,
          title: province.id,
        }));
        setProvinces(formattedProvinces);

        if (location) {
          const parts = location.split(', ');
          const province = parts[parts.length - 1];
          const district = parts[parts.length - 2];
          const ward = parts[parts.length - 3];
          const detailAddress = parts[parts.length - 4];
          const foundProvince = formattedProvinces.find(
            (prov) => prov.value === province
          );

          if (foundProvince) {
            setSelectedData({
              provinceObj: { id: foundProvince.title, value: province },
              districtObj: { id: '', value: district },
              wardObj: { id: '', value: ward },
              detailAddress: detailAddress ? detailAddress : '',
            });

            setDetailAddressSearch(detailAddress);
          }
        }
      } catch (error) {
        console.error('Error fetching provinces:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchprovinces();
  }, []);
  // lấy quận huyện
  useEffect(() => {
    const fetchprovinces = async () => {
      setIsLoading(true);

      try {
        console.log('selectedData.provinceObj', selectedData.provinceObj);

        const response = await axios.get(
          `https://esgoo.net/api-tinhthanh/2/${selectedData.provinceObj.id}.htm`
        );
        // https://provinces.open-api.vn/api/
        const formattedDistricts = response.data.data.map((district) => ({
          value: district.name,
          label: district.full_name,
          title: district.id,
        }));
        setDistricts(formattedDistricts);

        if (location) {
          const parts = location.split(', ');
          const district = parts[parts.length - 2];
          const foundDistrict = formattedDistricts.find(
            (prov) => prov.value === district
          );
          console.log('foundDistrict', foundDistrict);
          if (foundDistrict) {
            setSelectedData((prev) => ({
              ...prev,
              districtObj: { id: foundDistrict.title, value: district },
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching provinces:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchprovinces();
  }, [selectedData.provinceObj.id]);
  // lấy xã
  useEffect(() => {
    const fetchWards = async () => {
      setIsLoading(true);

      try {
        console.log('selectedData.districtObj', selectedData.districtObj);

        const response = await axios.get(
          `https://esgoo.net/api-tinhthanh/3/${selectedData.districtObj.id}.htm`
        );
        const formattedWards = response.data.data.map((ward) => ({
          value: ward.name,
          label: ward.full_name,
          title: ward.id,
        }));
        setWards(formattedWards);

        if (location) {
          const parts = location.split(', ');
          const ward = parts[parts.length - 3];

          const foundWard = formattedWards.find((prov) => prov.value === ward);
          console.log('foundWard', foundWard, parts, ward, formattedWards);
          if (foundWard) {
            setSelectedData((prev) => ({
              ...prev,
              wardObj: { id: foundWard.title, value: ward },
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching wards:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWards();
  }, [selectedData.districtObj.id]);

  const [debouncedInputValue, setDebouncedInputValue] = useState('');

  const memoizedDebounce = useMemo(
    () =>
      debounce((value) => {
        setDebouncedInputValue(value);
      }, 300),
    []
  );

  useEffect(() => {
    // to prevent call api too much, make it call api after change textSearch 500ms
    if (detailAddressSearch) {
    }
    memoizedDebounce(detailAddressSearch);
  }, [detailAddressSearch]);

  useEffect(() => {
    // to prevent call api too much, make it call api after change textSearch 500ms
    if (debouncedInputValue) {
      fetchAutoCompleteSuggests(debouncedInputValue);
    }
  }, [debouncedInputValue]);

  return (
    <section>
      {isLoading ? <p>Loading...</p> : null}
      <Stack direction="row" spacing={2}>
        <div className="filter-section" style={{ border: 'none' }}>
          <div
            className="filter-section-title"
            style={{ marginRight: '10px', color: 'gray' }}
          >
            Tỉnh thành:
          </div>

          <SearchSelect
            size="medium"
            showSearch
            placeholder="Nhập tỉnh thành"
            filterOption={(input, option) =>
              (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
            }
            style={{ width: '200px' }}
            labelInValue
            value={selectedData.provinceObj.value}
            onChange={(value) => handleChange('province', value)}
            options={provinces}
          />
        </div>
        <div className="filter-section" style={{ border: 'none' }}>
          <div
            className="filter-section-title"
            style={{ marginRight: '10px', color: 'gray' }}
          >
            Quận huyện:
          </div>

          <SearchSelect
            size="medium"
            showSearch
            placeholder="Nhập Quận huyện"
            filterOption={(input, option) =>
              (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
            }
            style={{ width: '200px' }}
            labelInValue
            value={selectedData.districtObj.value}
            onChange={(value) => handleChange('district', value)}
            options={districts}
          />
        </div>
        <div className="filter-section" style={{ border: 'none' }}>
          <div
            className="filter-section-title"
            style={{ marginRight: '10px', color: 'gray' }}
          >
            Phường Xã:
          </div>

          <SearchSelect
            size="medium"
            showSearch
            placeholder="Nhập Phường xã"
            filterOption={(input, option) =>
              (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
            }
            style={{ width: '200px' }}
            labelInValue
            value={selectedData.wardObj.value}
            onChange={(value) => handleChange('ward', value)}
            options={wards}
          />
        </div>
      </Stack>
      {selectedData.provinceObj.id &&
      selectedData.districtObj.id &&
      selectedData.wardObj.id ? (
        <div className="filter-section" style={{ border: 'none' }}>
          <div
            className="filter-section-title"
            style={{ marginRight: '10px', color: 'gray' }}
          >
            Số nhà:
          </div>

          <SearchSelect
            size="medium"
            showSearch
            placeholder="Nhập địa chỉ chi tiết"
            filterOption={(input, option) =>
              (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
            }
            onSearch={onDetailTextSearchChange}
            style={{ width: '200px' }}
            value={detailAddressSearch}
            labelInValue
            onChange={(value) => handleChange('detailAddress', value)}
            options={detailAddressSuggests}
          />
        </div>
      ) : null}
    </section>
  );
}
