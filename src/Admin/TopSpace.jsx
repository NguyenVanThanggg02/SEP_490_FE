// import React from "react";
// import { Container, Table } from "react-bootstrap";
// import "../style/topSpace.css";
import React from 'react';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CampaignIcon from '@mui/icons-material/Campaign';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import "../style/AdminUpdate.css";
const TopSpace = () => {
  return (
    // <Container className="topSpace">
    //   <Table className="table-no-border">
    //     <thead>
    //       <div style={{ padding: "10px", fontWeight: "bold", color: "gray" }}>
    //         Top Spaces
    //       </div>
    //       <tr className="text-center">
    //         <th>Tên</th>
    //         <th>hình ảnh</th>
    //         <th>Địa chỉ</th>
    //         <th>Số lượt book</th>
    //         <th>Trạng thái</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       <tr className="text-center">
    //         <td>abc</td>
    //         <td>abc</td>
    //         <td>Hà Nội</td>
    //         <td>10</td>
    //         <td>Đang sử dụng</td>
    //       </tr>
    //       <tr className="text-center">
    //         <td>abc</td>
    //         <td>abc</td>
    //         <td>Hà Nội</td>
    //         <td>10</td>
    //         <td>Đang sử dụng</td>
    //       </tr>
    //     </tbody>
    //   </Table>
    // </Container>
      <div className="content flex-grow-1">
        <div className="row">
          <div className="col-md-3">
            <div className="card card-pink text-center">
              <div className="card-body">
                <EmojiEventsIcon style={{ fontSize: 40 }} />
                <h5 className="card-title">My Awards</h5>
                <h2>26</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card card-blue text-center">
              <div className="card-body">
                <FlightTakeoffIcon style={{ fontSize: 40 }} />
                <h5 className="card-title">Management Leave</h5>
                <h2>26</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card card-green text-center">
              <div className="card-body">
                <PersonAddIcon style={{ fontSize: 40 }} />
                <h5 className="card-title">Total Requests</h5>
                <h2>26</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card card-purple text-center">
              <div className="card-body">
                <CampaignIcon style={{ fontSize: 40 }} />
                <h5 className="card-title">New Announcement</h5>
                <h2>26</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h4>My Task</h4>
          <table className="table table-borderless task-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Markdesign</td>
                <td>06 July, 2021</td>
                <td>
                  <span className="badge bg-warning text-dark">Running</span>
                </td>
                <td>
                  <div className="progress">
                    <div
                      className="progress-bar progress-bar-orange"
                      role="progressbar"
                      style={{ width: '65%' }}
                      aria-valuenow="65"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      65%
                    </div>
                  </div>
                </td>
                <td>
                  <button className="btn btn-light btn-sm">
                    <VisibilityIcon />
                  </button>
                  <button className="btn btn-light btn-sm">
                    <EditIcon />
                  </button>
                  <button className="btn btn-light btn-sm">
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
              <tr>
                <td>Oriano Land</td>
                <td>14 Sep, 2021</td>
                <td>
                  <span className="badge bg-info text-dark">Pending</span>
                </td>
                <td>
                  <div className="progress">
                    <div
                      className="progress-bar progress-bar-blue"
                      role="progressbar"
                      style={{ width: '0%' }}
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      0%
                    </div>
                  </div>
                </td>
                <td>
                  <button className="btn btn-light btn-sm">
                    <VisibilityIcon />
                  </button>
                  <button className="btn btn-light btn-sm">
                    <EditIcon />
                  </button>
                  <button className="btn btn-light btn-sm">
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
              <tr>
                <td>QuickLeave</td>
                <td>28 July, 2021</td>
                <td>
                  <span className="badge bg-warning text-dark">Running</span>
                </td>
                <td>
                  <div className="progress">
                    <div
                      className="progress-bar progress-bar-orange"
                      role="progressbar"
                      style={{ width: '30%' }}
                      aria-valuenow="30"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      30%
                    </div>
                  </div>
                </td>
                <td>
                  <button className="btn btn-light btn-sm">
                    <VisibilityIcon />
                  </button>
                  <button className="btn btn-light btn-sm">
                    <EditIcon />
                  </button>
                  <button className="btn btn-light btn-sm">
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
              <tr>
                <td>Travel Znk</td>
                <td>08 Jun, 2021</td>
                <td>
                  <span className="badge bg-success text-dark">Completed</span>
                </td>
                <td>
                  <div className="progress">
                    <div
                      className="progress-bar progress-bar-green"
                      role="progressbar"
                      style={{ width: '100%' }}
                      aria-valuenow="100"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      100%
                    </div>
                  </div>
                </td>
                <td>
                  <button className="btn btn-light btn-sm">
                    <VisibilityIcon />
                  </button>
                  <button className="btn btn-light btn-sm">
                    <EditIcon />
                  </button>
                  <button className="btn btn-light btn-sm">
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default TopSpace;
