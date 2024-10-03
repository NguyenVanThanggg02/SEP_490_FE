import React, { useEffect, useState } from 'react';
import "../style/Compare.css";
import { useLocation } from 'react-router-dom';

const Compare = () => {
  const location = useLocation();
  const { id, valueFromChild } = location.state || {};
  const [differences, setDifferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        const response = await fetch(`http://localhost:9999/spaces/compare-spaces?id1=${id}&id2=${valueFromChild}`);
        if (!response.ok) {
          throw new Error('Đã xảy ra lỗi khi gọi API');
        }
        const data = await response.json();
        setDifferences(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [id, valueFromChild]);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Nếu không có sự khác biệt nào
  if (!differences || Object.keys(differences).length === 0) {
    return <div>Hai sản phẩm giống nhau</div>;
  }

  return (
    <div className="comparison-table-v2">
      <h2 className="comparison-title">Bảng So Sánh Địa Điểm</h2>
      <div className="zui-wrapper">
        <div className="instruction">
        </div>
        <div id="container" className="zui-scroller">
          <table className="zui-table">
            <thead>
              <tr>
              </tr>
            </thead>
            <tbody>
              {Object.entries(differences).map(([key, value]) => (
                <tr key={key}>
                  <td className="zui-sticky-col">{key}</td>
                  {key === 'images' ? (
                    <>
                      <td>
                        {value.space1 ? <img src={value.space1} alt="Space 1" style={{ width: '200px', height: '200px' }} /> : 'Không có ảnh'}
                      </td>
                      <td>
                        {value.space2 ? <img src={value.space2} alt="Space 2" style={{ width: '200px', height: '200px' }} /> : 'Không có ảnh'}
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{value.space1}</td>
                      <td>{value.space2}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Compare;
