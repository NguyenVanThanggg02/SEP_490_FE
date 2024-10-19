import React from 'react';
import { Dialog } from "primereact/dialog";
import { Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const Calendar = (props) => {
    const { visible, setVisible } = props;

    const onHide = () => {
        setVisible(false);
    };

    const dialogFooter = (
      <div style={{ display: "flex", justifyContent: "end", gap: "10px" }}>
        <Button className="btn btn-dark r-4">Lưu</Button>
        <Button className="btn btn-dark" onClick={onHide}>
          Đóng
        </Button>
      </div>
    );

    return (
      <div>
        <Dialog
          visible={visible}
          onHide={onHide}
          footer={dialogFooter}
          className="bg-light"
          style={{ width: "50vw" }}
          modal
        >
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h4">5 đêm</h1>
                <div className="text-muted small">3 giường · 2 phòng tắm</div>
              </div>
              <div className="d-flex">
                <div className="border p-2 ml-2 align-items-center rounded">
                  <div style={{fontWeight:'bold'}}>NHẬN PHÒNG</div>
                  <div className="ml-3">26/11/2024</div>
                </div>
                <div className="border p-2 ml-2 align-items-center rounded">
                  <div style={{fontWeight:'bold'}}>TRẢ PHÒNG</div>
                  <div className="ml-3">26/11/2024</div>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-6">
                <h5 className="text-center">Tháng 11 năm 2024</h5>
                <table className="table table-bordered text-center">
                  <thead>
                    <tr>
                      <th>T2</th>
                      <th>T3</th>
                      <th>T4</th>
                      <th>T5</th>
                      <th>T6</th>
                      <th>T7</th>
                      <th>CN</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                      <td></td>
                      <td>1</td>
                      <td>2</td>
                      <td>3</td>
                      <td className="bg-light">4</td>
                      <td>5</td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td>7</td>
                      <td>8</td>
                      <td>9</td>
                      <td>10</td>
                      <td>11</td>
                      <td>12</td>
                    </tr>
                    <tr>
                      <td>13</td>
                      <td>14</td>
                      <td>15</td>
                      <td>16</td>
                      <td>17</td>
                      <td>18</td>
                      <td>19</td>
                    </tr>
                    <tr>
                      <td>20</td>
                      <td>21</td>
                      <td>22</td>
                      <td>23</td>
                      <td>24</td>
                      <td>25</td>
                      <td className="bg-dark text-white rounded-circle">26</td>
                    </tr>
                    <tr>
                      <td>27</td>
                      <td>28</td>
                      <td>29</td>
                      <td>30</td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-6">
                <h5 className="text-center">Tháng 12 năm 2024</h5>
                <table className="table table-bordered text-center">
                  <thead>
                    <tr>
                      <th>T2</th>
                      <th>T3</th>
                      <th>T4</th>
                      <th>T5</th>
                      <th>T6</th>
                      <th>T7</th>
                      <th>CN</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>1</td>
                      <td>2</td>
                      <td>3</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>5</td>
                      <td>6</td>
                      <td>7</td>
                      <td>8</td>
                      <td>9</td>
                      <td>10</td>
                    </tr>
                    <tr>
                      <td>11</td>
                      <td>12</td>
                      <td>13</td>
                      <td>14</td>
                      <td>15</td>
                      <td>16</td>
                      <td>17</td>
                    </tr>
                    <tr>
                      <td>18</td>
                      <td>19</td>
                      <td>20</td>
                      <td>21</td>
                      <td>22</td>
                      <td>23</td>
                      <td>24</td>
                    </tr>
                    <tr>
                      <td>25</td>
                      <td>26</td>
                      <td>27</td>
                      <td>28</td>
                      <td>29</td>
                      <td>30</td>
                      <td className="bg-dark text-white rounded-circle">1</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>3</td>
                      <td>4</td>
                      <td>5</td>
                      <td>6</td>
                      <td>7</td>
                      <td>8</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Dialog>
        <ToastContainer />
      </div>
    );
};

export default Calendar;
