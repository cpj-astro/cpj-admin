import React from 'react'

export default function SideNav() {
  return (
    <div>
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
            {/* Brand Logo */}
            <a href={`${process.env.REACT_APP_PUBLIC_URL}/`} className="brand-link">
                <img src={`${process.env.REACT_APP_PUBLIC_URL}/dist/img/AdminLTELogo.png`} alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{opacity: '.8'}} />
                <span className="brand-text font-weight-light">CPJ - Admin</span>
            </a>
            {/* Sidebar */}
            <div className="sidebar">
                {/* Sidebar Menu */}
                <nav className="mt-2">
                <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                    {/* Add icons to the links using the .nav-icon class
                    with font-awesome or any other icon font library */}
                    <li className="nav-header">MATCHES</li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/add-match`} className="nav-link">
                            <i className="nav-icon far fa-circle text-info" />
                            <p>Add Match</p>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/live-matches`} className="nav-link">
                            <i className="nav-icon far fa-circle text-success" />
                            <p>Live Matches</p>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/upcoming-matches`} className="nav-link">
                            <i className="nav-icon far fa-circle text-warning" />
                            <p>Upcoming Matches</p>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/recent-matches`} className="nav-link">
                            <i className="nav-icon far fa-circle text-primary" />
                            <p>Recent Matches</p>
                        </a>
                    </li>
                    <li className="nav-header">SERIES</li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/series-list`} className="nav-link">
                            <i className="fas fa-circle nav-icon text-secondary" />
                            <p>Series List</p>
                        </a>
                    </li>
                    <li className="nav-header">USERS</li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/users-list`} className="nav-link">
                            <i className="fas fa-circle nav-icon text-secondary" />
                            <p>Users List</p>
                        </a>
                    </li>
                    <li className="nav-header">Astrology</li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/upload-astrology-data`} className="nav-link">
                            <i className="fas fa-circle nav-icon text-secondary" />
                            <p>Upload Astrology Data</p>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/view-astrology-data`} className="nav-link">
                            <i className="fas fa-circle nav-icon text-secondary" />
                            <p>View Astrology Data</p>
                        </a>
                    </li>
                    <li className="nav-header">PLAYERS</li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/add-player`} className="nav-link">
                            <i className="fas fa-circle nav-icon text-secondary" />
                            <p>Add Player</p>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/players-list`} className="nav-link">
                            <i className="fas fa-circle nav-icon text-secondary" />
                            <p>Players List</p>
                        </a>
                    </li>
                    <li className="nav-header">PANDITS</li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/add-pandit`} className="nav-link">
                            <i className="fas fa-circle nav-icon text-secondary" />
                            <p>Add Pandit</p>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/pandits-list`} className="nav-link">
                            <i className="fas fa-circle nav-icon text-secondary" />
                            <p>Pandits List</p>
                        </a>
                    </li>
                    <li className="nav-header">KUNDLI</li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/create-kundli`} className="nav-link">
                            <i className="fas fa-circle nav-icon text-secondary" />
                            <p>Create Kundli</p>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/kundlis-list`} className="nav-link">
                            <i className="fas fa-circle nav-icon text-secondary" />
                            <p>Kundlis List</p>
                        </a>
                    </li>
                    <li className="nav-header">ADS</li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/create-ad`} className="nav-link">
                            <i className="fas fa-circle nav-icon text-secondary" />
                            <p>Create Ad</p>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/ads-list`} className="nav-link">
                            <i className="fas fa-circle nav-icon text-secondary" />
                            <p>Ads List</p>
                        </a>
                    </li>
                    <li className="nav-header">CUPRATES</li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/cup-rates`} className="nav-link">
                            <i className="fas fa-circle nav-icon text-secondary" />
                            <p>Create Cuprates</p>
                        </a>
                    </li>
                </ul>
                </nav>
                {/* /.sidebar-menu */}
            </div>
            {/* /.sidebar */}
        </aside>
    </div>
  )
}
