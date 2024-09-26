import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import "../style/Favorites.css";

const Favorites = () => {
  // Hardcoded list
  const [listFavorites, setListFavorites] = useState([
    {
      _id: "1",
      productId: {
        _id: "101",
        name: "Product 1",
        image: [
          "https://via.placeholder.com/100", // Placeholder image
        ],
      },
      categoryId: {
        name: "Category 1",
      },
    },
    {
      _id: "2",
      productId: {
        _id: "102",
        name: "Product 2",
        image: [
          "https://via.placeholder.com/100", // Placeholder image
        ],
      },
      categoryId: {
        name: "Category 2",
      },
    },
  ]);

  // Mock delete handler
  const handleDeleteFavorite = (id) => {
    setListFavorites(listFavorites.filter((f) => f.productId._id !== id));
  };

  return (
    <div>
      <Dialog
        visible={true} // Set visible to true for testing
        onHide={() => {}} // Empty function to close the dialog
        className="bg-light dialogForm"
        style={{ width: "70vw" }}
        modal
        header={
          <div
            className="custom-dialog-header"
            style={{ textAlign: "center", marginTop: "20px" }}
          >
            <h4> Favorite Products</h4>
          </div>
        }
      >
        {listFavorites.length === 0 ? (
          <div className="text-center mt-3">No favorite products.</div>
        ) : (
          <div className="bg-light p-1" style={{ margin: "25px" }}>
            <div style={{ margin: "40px" }}>
              <Row>
                <Col className="text-center ">
                  <div className="table-responsive">
                    <table className="table table-condensed">
                      <thead>
                        <tr>
                          <th style={{ width: "15%" }}>Image</th>
                          <th style={{ width: "35%" }}>Product</th>
                          <th style={{ width: "20%" }}>Category</th>
                          <th style={{ width: "15%" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listFavorites.map((f, index) => (
                          <tr key={f._id}>
                            <td
                              style={{ display: "flex", textAlign: "center" }}
                            >
                              <img
                                src={f.productId.image[0]}
                                alt="image"
                                style={{
                                  width: "100px",
                                  height: "auto",
                                  verticalAlign: "middle",
                                }}
                              />
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              {f.productId.name}
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              {f.categoryId.name}
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              <Trash
                                style={{
                                  color: "red",
                                  fontSize: "25px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleDeleteFavorite(f.productId._id)
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default Favorites;
