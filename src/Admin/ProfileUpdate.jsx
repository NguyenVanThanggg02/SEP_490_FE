import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TaskIcon from '@mui/icons-material/Task';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CampaignIcon from '@mui/icons-material/Campaign';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import "../style/AdminUpdate.css";
const ProfileUpdate = () => {
  return (
    <div className="d-flex">
      <div className="sidebar">
        <a className="active" href="#">
          <HomeIcon /> Trang chủ
        </a>
        <a href="#">
          <DashboardIcon /> Dashboard
        </a>
        <a href="#">
          <TaskIcon /> Quản lí bài đăng
        </a>
        <a href="#">
          <GroupIcon /> Quản lí người dùng
        </a>
        <a href="#">
          <SettingsIcon /> Cài đặt
        </a>
        {/* <div className="user-info">
          <img
            alt="User profile"
            height="50"
            src="https://storage.googleapis.com/a1aa/image/KNSF2wTSxMYnLVPhuWKwIb1EYPd7qoMmNrAb9kNYfon25XzJA.jpg"
            width="50"
          />
          <p>Oliver Dani</p>
        </div> */}
      </div>

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
    </div>
  );
};

export default ProfileUpdate;
