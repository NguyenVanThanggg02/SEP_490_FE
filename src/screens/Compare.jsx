import React from 'react';
import "../style/Compare.css";

const Compare = () => {
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
        </div>
        <div id="container" className="zui-scroller">
          <table className="zui-table">
            <thead>
              <tr>
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
    );
};

export default Compare;