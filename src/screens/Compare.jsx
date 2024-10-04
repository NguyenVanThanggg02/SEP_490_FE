<<<<<<< HEAD
import React from 'react';
import "../style/Compare.css";

const ComparisonTableV2 = () => {
  const products = [
    {
      name: 'Maxwell® RSC',
      imgSrc: 'https://scv10mr-cdnpre-p-cus-00.azureedge.net/-/media/images/promega-worldwide/global/templates/product-comparison-page/maxwell-rscinstrument.jpg?rev=f5c81f5d6b0e4ad08583aaa2e42b9ce3&sc_lang=en',
      application: 'For Research Use',
      catalogNumber: 'AS4500',
      throughput: 'up to 16 samples',
      flurometer: 'Included',
      barcodeReader: 'Optional',
      tabletPC: 'Included',
      uvLight: 'Included',
      visionSystem: 'Not Available',
      liquidHandler: 'Included',
    },
    {
      name: 'Maxwell® RSC 48',
      imgSrc: 'https://scv10mr-cdnpre-p-cus-00.azureedge.net/-/media/images/promega-worldwide/europe/promega-germany/lp/1908-maxwell-demo/de-1908-maxwell-rsc48-blank.jpg?rev=11270ae5b13f4aca82c1a22a0fa43d34&sc_lang=en',
      application: 'For Research Use (higher throughput)',
      catalogNumber: 'AS8500',
      throughput: 'up to 48 samples',
      flurometer: 'Optional',
      barcodeReader: 'Included',
      tabletPC: 'Included',
      uvLight: 'Included',
      visionSystem: 'Included',
      liquidHandler: 'Included',
    }
  ];

  return (
    <div className="comparison-table-v2">
      <h2>Product Comparison Table V2</h2>
      <div className="zui-wrapper">
        <div className="instruction">
          <em>
            <i className="fas fa-arrows-alt-h"></i> Swipe for more products
          </em>
=======
import React, { useEffect, useState } from 'react';
import "../style/Compare.css";
import { useLocation } from 'react-router-dom';

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

  return (
    <div className="comparison-table-v2">
      <h2 className="comparison-title">So Sánh Địa Điểm</h2>
      <div className="zui-wrapper">
        <div className="instruction">
>>>>>>> 4cda24f2dc64366032a1761b37c7d64a4dad4bc3
        </div>
        <div id="container" className="zui-scroller">
          <table className="zui-table">
            <thead>
              <tr>
<<<<<<< HEAD
                <th className="zui-sticky-col">&nbsp;</th>
                {products.map((product, index) => (
                  <th key={index} className="table-col">
                    <img className="product-img" src={product.imgSrc} alt={product.name} />
                    <h5>
                      <a href="#" className="product-link">
                        {product.name}
                        <span>&#187;</span>
                      </a>
                    </h5>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="zui-sticky-col">Application</td>
                {products.map((product, index) => (
                  <td key={index}>
                    <strong>{product.application}</strong>
                  </td>
                ))}
              </tr>
              <tr className="zui-stripe-row">
                <td className="zui-sticky-col">Catalog Number</td>
                {products.map((product, index) => (
                  <td key={index}>{product.catalogNumber}</td>
                ))}
              </tr>
              <tr>
                <td className="zui-sticky-col">Throughput</td>
                {products.map((product, index) => (
                  <td key={index}>{product.throughput}</td>
                ))}
              </tr>
              <tr className="zui-stripe-row">
                <td className="zui-sticky-col">
                  <a href="#" className="product-link">
                    Quantus™ Flurometer
                  </a>
                  (for quantification)
                </td>
                {products.map((product, index) => (
                  <td key={index}>
                    <i className={`far fa-${product.flurometer === 'Included' ? 'check' : product.flurometer === 'Optional' ? 'plus' : 'times'}-circle`}></i>
                    {product.flurometer}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="zui-sticky-col">Bar Code Reader</td>
                {products.map((product, index) => (
                  <td key={index}>
                    <i className={`far fa-${product.barcodeReader === 'Included' ? 'check' : 'plus'}-circle`}></i>
                    {product.barcodeReader}
                  </td>
                ))}
              </tr>
              <tr className="zui-stripe-row">
                <td className="zui-sticky-col">Tablet PC</td>
                {products.map((product, index) => (
                  <td key={index}>
                    <i className="far fa-check-circle"></i>
                    {product.tabletPC}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="zui-sticky-col">UV-Light (for decontamination)</td>
                {products.map((product, index) => (
                  <td key={index}>
                    <i className="far fa-check-circle"></i>
                    {product.uvLight}
                  </td>
                ))}
              </tr>
              <tr className="zui-stripe-row">
                <td className="zui-sticky-col">
                  Vision System (reduces the possibility of user errors)
                </td>
                {products.map((product, index) => (
                  <td key={index}>
                    <i className={`far fa-${product.visionSystem === 'Included' ? 'check' : 'times'}-circle`}></i>
                    {product.visionSystem}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="zui-sticky-col">Compatible with MaxPrep™ Liquid Handler</td>
                {products.map((product, index) => (
                  <td key={index}>
                    <i className="far fa-check-circle"></i>
                    {product.liquidHandler}
                  </td>
                ))}
              </tr>
=======
                <th>
                  <input 
                    type='checkbox' 
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>Không có điểm khác biệt</td>
                  </tr>
                )
              ) : (
                hasData ? (
                  Object.keys(data.space1 || {}).map((key) => (
                    <tr key={key}>
                      <td className="zui-sticky-col">{key}</td>
                      {key === 'images' ? (
                        <>
                          <td>
                            {data.space1.images ? (
                              <img src={data.space1.images} alt="Space 1" style={{ width: '200px', height: '200px' }} />
                            ) : 'Không có ảnh'}
                          </td>
                          <td>
                            {data.space2.images ? (
                              <img src={data.space2.images} alt="Space 2" style={{ width: '200px', height: '200px' }} />
                            ) : 'Không có ảnh'}
                          </td>
                        </>
                      ) : (
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
                  </tr>
                )
              )}
>>>>>>> 4cda24f2dc64366032a1761b37c7d64a4dad4bc3
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default ComparisonTableV2;
=======
export default Compare;
>>>>>>> 4cda24f2dc64366032a1761b37c7d64a4dad4bc3
