import React from "react";
import "../style/AdmUI.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faBriefcase, faTasks, faUsers, faBullseye } from '@fortawesome/free-solid-svg-icons';

const AdmUI = () => {
  return (
    <div className="container-fluid">
      <div className="row align-items-center p-3 bg-white shadow-sm">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-white border-0">
              <FontAwesomeIcon icon={faBars} />
            </span>
            <input className="form-control border-0" placeholder="Search" type="text" />
          </div>
        </div>
        <div className="col-md-6 text-end">
          <FontAwesomeIcon icon={faBell} className="me-3" />
          <img
            alt="User avatar"
            className="rounded-circle"
            height="40"
            src="https://storage.googleapis.com/a1aa/image/xjfSQo5P0JwSOid0NchKVmTF42nIzxH6DeM0GibVcjBkrAqTA.jpg"
            width="40"
          />
        </div>
      </div>
      <div className="header text-center">
        <h1>Projects</h1>
      </div>
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2>18</h2>
                <p>Projects</p>
                <small>2 Completed</small>
              </div>
              <div className="card-icon">
                <FontAwesomeIcon icon={faBriefcase} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2>132</h2>
                <p>Active Task</p>
                <small>28 Completed</small>
              </div>
              <div className="card-icon">
                <FontAwesomeIcon icon={faTasks} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2>12</h2>
                <p>Teams</p>
                <small>1 Completed</small>
              </div>
              <div className="card-icon">
                <FontAwesomeIcon icon={faUsers} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2>76%</h2>
                <p>Productivity</p>
                <small>5% Completed</small>
              </div>
              <div className="card-icon">
                <FontAwesomeIcon icon={faBullseye} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end mt-4">
        <button className="btn btn-primary">Create New Project</button>
      </div>
      <div className="card mt-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Active Projects</h5>
          <table className="table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Hours</th>
                <th>Priority</th>
                <th>Members</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {/* Here is an example project row */}
              <tr>
                <td>
                  <img
                    alt="Dropbox logo"
                    className="me-2"
                    height="30"
                    src="https://storage.googleapis.com/a1aa/image/CQgDCTsPGoKwEhbRfegqP7PYwr3zLBENQjbZXWx6zHHbrAqTA.jpg"
                    width="30"
                  />
                  Dropbox Design System
                </td>
                <td>34</td>
                <td></td>
                <td>
                  <div className="avatar-group">
                    <img
                      alt="Member 1"
                      height="30"
                      src="https://storage.googleapis.com/a1aa/image/YgDBs43bpYbHC55xVm70dr9nEtGjlwMBBRfuggklW7BvVA1JA.jpg"
                      width="30"
                    />
                    <img
                      alt="Member 2"
                      height="30"
                      src="https://storage.googleapis.com/a1aa/image/CQBgiprarfybSi40N5lGuJMfYQNUr9vawdMah1ZH790arAqTA.jpg"
                      width="30"
                    />
                    <div className="more">+5</div>
                  </div>
                </td>
                <td>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: "15%" }}
                      aria-valuenow="15"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      15%
                    </div>
                  </div>
                </td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdmUI;
