import React, { useEffect, useState } from 'react';
import "../style/Compare.css";
import { useLocation } from 'react-router-dom';
import { priceFormatter } from '../utils/numberFormatter';

const Compare = () => {
  const location = useLocation();
  const { id, valueFromChild } = location.state || {};
  const [data, setData] = useState(null);
  const [differences, setDifferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);

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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const loadedData = await fetchData(showDifferencesOnly);
      if (loadedData) {
        setData(loadedData);
        setDifferences(showDifferencesOnly ? loadedData : null);
      }
      setLoading(false);
    };
    loadData();
  }, [id, valueFromChild, showDifferencesOnly]);

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
                    type="checkbox"
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>Không có dữ liệu để hiển thị</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Compare;
