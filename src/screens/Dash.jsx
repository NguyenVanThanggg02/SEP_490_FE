import React from 'react';
import './Dash.css';

const Dash = () => {
    return (
        <div className="d-flex">
            <div className="sidebar">
                <div className="d-flex align-items-center mb-4">
                    <img
                        alt="Profile picture"
                        className="rounded-circle me-2"
                        height="50"
                        src="https://storage.googleapis.com/a1aa/image/2RSxtb4VmlrQPh7Qyl4tbB3abRXqEnFkXbtEfsDelkTm2AqTA.jpg"
                        width="50"
                    />
                    <div>
                        <h5 className="mb-0">Charles Hall</h5>
                        <small>Designer</small>
                    </div>
                </div>
                <nav className="nav flex-column">
                    <a className="nav-link active" href="#">Dashboards</a>
                    <a className="nav-link" href="#">Analytics</a>
                    <a className="nav-link" href="#">E-Commerce</a>
                    <a className="nav-link" href="#">Crypto</a>
                    <a className="nav-link" href="#">Pages</a>
                    <a className="nav-link" href="#">Profile</a>
                    <a className="nav-link" href="#">Invoice</a>
                    <a className="nav-link" href="#">Tasks</a>
                    <a className="nav-link" href="#">Calendar</a>
                    <a className="nav-link" href="#">Auth</a>
                    <a className="nav-link" href="#">UI Elements</a>
                    <a className="nav-link" href="#">Icons</a>
                    <a className="nav-link" href="#">Forms</a>
                    <a className="nav-link" href="#">Tables</a>
                    <a className="nav-link" href="#">Form Plugins</a>
                    <a className="nav-link" href="#">DataTables</a>
                    <a className="nav-link" href="#">Charts</a>
                    <a className="nav-link" href="#">Notifications</a>
                </nav>
            </div>
            <div className="content flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3">Analytics Dashboard</h1>
                    <div>
                        <button className="btn btn-outline-secondary me-2">Invite a Friend</button>
                        <button className="btn btn-primary">New Project</button>
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Sales</h5>
                                <h2 className="card-text">2,382</h2>
                                <p className="text-success">+3.65% Since last week</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Earnings</h5>
                                <h2 className="card-text">$21,300</h2>
                                <p className="text-success">+6.65% Since last week</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Visitors</h5>
                                <h2 className="card-text">14,212</h2>
                                <p className="text-success">+5.25% Since last week</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Orders</h5>
                                <h2 className="card-text">64</h2>
                                <p className="text-danger">-2.25% Since last week</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Recent Movement</h5>
                                <div className="chart">
                                    <img
                                        alt="Line chart showing recent movement"
                                        height="200"
                                        src="https://storage.googleapis.com/a1aa/image/d2w41KfNOPU0Oq4bUIQOFeFOqf8Lr7GjZhqez1PyRqDGaDoOB.jpg"
                                        width="600"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Calendar</h5>
                                <div className="calendar">
                                    <img
                                        alt="Calendar for May 2021"
                                        height="300"
                                        src="https://storage.googleapis.com/a1aa/image/FKPnbrdsqPamI9bignv6ob3TdcMATxPZC9WJ7T1ZSAMoNg6E.jpg"
                                        width="300"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Real-Time</h5>
                                <div className="real-time">
                                    <img
                                        alt="World map showing real-time data points"
                                        height="300"
                                        src="https://storage.googleapis.com/a1aa/image/UtEDbzaNDcotA5VeQZWIYe90YrMPLKa03V42fphpik0JtBUnA.jpg"
                                        width="600"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Browser Usage</h5>
                                <div className="browser-usage">
                                    <img
                                        alt="Pie chart showing browser usage"
                                        height="300"
                                        src="https://storage.googleapis.com/a1aa/image/xoZewv0IkaVTaCzkTH9Mq6nKeORr8aPivmXdBauiHnPj2AqTA.jpg"
                                        width="300"
                                    />
                                </div>
                                <ul className="list-unstyled mt-3">
                                    <li>
                                        Chrome <span className="text-success">+12%</span> 4306
                                    </li>
                                    <li>
                                        Firefox <span className="text-danger">-3%</span> 3801
                                    </li>
                                    <li>
                                        Edge <span className="text-warning">+5%</span> 1689
                                    </li>
                                    <li>
                                        Other <span className="text-muted">+1%</span> 3251
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dash;
