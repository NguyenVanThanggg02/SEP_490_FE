import React, { useEffect, useState } from 'react';
import "../style/Compare.css";
import { useLocation } from 'react-router-dom';
<<<<<<< HEAD
import axios from 'axios';
=======
import { priceFormatter } from '../utils/numberFormatter';
>>>>>>> d4ce1f1 (update compare)

const Compare = () => {
  const location = useLocation();
  const { id, valueFromChild } = location.state || {};
  const [data, setData] = useState(null);
  const [differences, setDifferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);
  const [distances, setDistances] = useState(null);

  const fetchData = async (isDifference) => {
    const endpoint = isDifference
      ? `http://localhost:9999/spaces/compare-spaces-differences?id1=${id}&id2=${valueFromChild}`
      : `http://localhost:9999/spaces/compare-spaces?id1=${id}&id2=${valueFromChild}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Đã xảy ra lỗi khi gọi API');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      setError(error.message);
      return null;
    }
  };
  const MAPBOX_TOKEN = "pk.eyJ1Ijoic21hbGxtb25rZXkyMDIzIiwiYSI6ImNsdGpxeWc2YjBweWoybXA2OHZ4Zmt0NjAifQ.bRMFGPTFKgsW8XkmAqX84Q";

  const getRoute = async (start, end) => {     // tính distance 2 location [lng, lat]
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[1]},${start[0]};${end[1]},${end[0]}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
    try {
      const response = await axios.get(url);
      const data = response.data;
      const route = data.routes[0];
      return (route.distance / 1000).toFixed(2)
    } catch (error) {
      console.error("Error getting route:", error);
    }
  };
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const loadedData = await fetchData(showDifferencesOnly);
      if (loadedData) {
        if (navigator?.geolocation) {   // check có được cấp quyền truy cập vị trí user hay không
          navigator.geolocation.getCurrentPosition(async(position) => {
            const distanceSpace1 = await getRoute([position.coords.latitude, position.coords.longitude], loadedData.space1.latLng)  // tính khoảng cách user hiện tại tới space
            const distanceSpace2 = await getRoute([position.coords.latitude, position.coords.longitude], loadedData.space2.latLng)

            setDistances([distanceSpace1, distanceSpace2]);
          }, (error) => {
            console.error("Lỗi khi lấy vị trí hiện tại:", error);
          })
            
          
        } else {
          return;
        }

        setData(loadedData);
        setDifferences(showDifferencesOnly ? loadedData : null);
      }
      setLoading(false);
    };
    loadData();
  }, [id, valueFromChild, showDifferencesOnly, navigator]);

  const handleCheckboxChange = () => {
    setShowDifferencesOnly(prev => !prev);
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }




  const hasDifferences = differences && Object.keys(differences).length > 0;
  const hasData = data && Object.keys(data).length > 0;

  const isPriceField = (key) => {
    const priceKeys = ['pricePerHour', 'pricePerDay', 'pricePerWeek', 'pricePerMonth'];
    return priceKeys.includes(key);
  };
  const fieldLabels = {
    name: "Tên địa điểm",
    location: "Vị trí",
    area: "Diện tích (m²)",
    pricePerHour: "Giá theo giờ",
    pricePerDay: "Giá theo ngày",
    pricePerWeek: "Giá theo tuần",
    pricePerMonth: "Giá theo tháng",
    status: "Trạng thái",
    images: "Hình ảnh",
  };
  
  return (
    <div className="comparison-table-v2">
      <h2 className="comparison-title">So Sánh Địa Điểm</h2>
      <div className="zui-wrapper">
        <div className="instruction"></div>
        <div id="container" className="zui-scroller">
          <table className="zui-table">
            <thead>
              <tr>
                <th>
                  <input
<<<<<<< HEAD
                    type='checkbox'
=======
                    type="checkbox"
>>>>>>> d4ce1f1 (update compare)
                    checked={showDifferencesOnly}
                    onChange={handleCheckboxChange}
                  />
                  Chỉ xem điểm khác biệt
                </th>
              </tr>
            </thead>
            <tbody>
              {showDifferencesOnly ? (
                hasDifferences ? (
                  Object.entries(differences).map(([key, value]) => (
                    <tr key={key}>
                      <td className="zui-sticky-col">{fieldLabels[key] || key}</td>
                      {key === "images" ? (
                        <>
                          <td>
                            {value.space1 ? (
                              <img
                                src={value.space1.url}
                                alt="Space 1"
                                style={{ width: "200px", height: "200px" }}
                              />
                            ) : (
                              "Không có ảnh"
                            )}
                          </td>
                          <td>
                            {value.space2 ? (
                              <img
                                src={value.space2.url}
                                alt="Space 2"
                                style={{ width: "200px", height: "200px" }}
                              />
                            ) : (
                              "Không có ảnh"
                            )}
                          </td>
                        </>
                      ) : (
                        <>
                            <td>
                              {isPriceField(key)
                                ? priceFormatter(value.space1)
                                : value.space1}
                            </td>
                            <td>
                              {isPriceField(key)
                                ? priceFormatter(value.space2)
                                : value.space2}
                            </td>
                        </>
                      )}

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>Không có điểm khác biệt</td>
                  </tr>
                )
<<<<<<< HEAD
              ) : (
                hasData ? (
                  Object.keys(data.space1 || {}).map((key) => (
                    <tr key={key}>
                      {
                        key !== 'latLng' && <td className="zui-sticky-col">{key}</td>
                      }
                      
                      {key === 'images' ? (
                        <>
                          <td>
                            {data.space1.images ? (
                              <img src={data.space1.images.url} alt="Space 1" style={{ width: '200px', height: '200px' }} />
                            ) : 'Không có ảnh'}
                          </td>
                          <td>
                            {data.space2.images ? (
                              <img src={data.space2.images.url} alt="Space 2" style={{ width: '200px', height: '200px' }} />
                            ) : 'Không có ảnh'}
                          </td>
                        </>
                      ) : key === 'latLng' ?"":(
                        <>
                          <td>{data.space1[key]}</td>
                          <td>{data.space2[key]}</td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>Không có dữ liệu để hiển thị</td>
=======
              ) : hasData ? (
                Object.keys(data.space1 || {}).map((key) => (
                  <tr key={key}>
                    <td className="zui-sticky-col">{fieldLabels[key] || key}</td>
                    {key === "images" ? (
                      <>
                        <td>
                          {data.space1.images ? (
                            <img
                              src={data.space1.images.url}
                              alt="Space 1"
                              style={{ width: "200px", height: "200px" }}
                            />
                          ) : (
                            "Không có ảnh"
                          )}
                        </td>
                        <td>
                          {data.space2.images ? (
                            <img
                              src={data.space2.images.url}
                              alt="Space 2"
                              style={{ width: "200px", height: "200px" }}
                            />
                          ) : (
                            "Không có ảnh"
                          )}
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          {isPriceField(key)
                            ? priceFormatter(data.space1[key])
                            : data.space1[key]}
                        </td>
                        <td>
                          {isPriceField(key)
                            ? priceFormatter(data.space2[key])
                            : data.space2[key]}
                        </td>
                      </>
                    )}
>>>>>>> d4ce1f1 (update compare)
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>Không có dữ liệu để hiển thị</td>
                </tr>
              )}
              <tr>
                <td className="zui-sticky-col">
                  Khoảng cách shop với bạn
                </td>
                <td>
                  {distances?.[0]}
                </td>
                <td>
                  {distances?.[1]}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Compare;
