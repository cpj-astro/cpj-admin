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
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/users-list`} className="nav-link">
                            <i className="fas fa-users nav-icon text-secondary" />
                            <p>Users</p>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/players-list`} className="nav-link">
                            <i className="fas fa-users nav-icon text-secondary" />
                            <p>Players</p>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/pandits-list`} className="nav-link">
                            <i className="fas fa-users nav-icon text-secondary" />
                            <p>Pandits</p>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/series-list`} className="nav-link">
                            <i className="fas fa-trophy nav-icon text-secondary" />
                            <p>Series</p>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/view-astrology-data`} className="nav-link">
                            <i className="fas fa-star nav-icon text-secondary" />
                            <p>Astrology</p>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/manage-ads`} className="nav-link">
                            <i className="fas fa-file-video nav-icon text-secondary" />
                            <p>Ads</p>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/manage-reviews`} className="nav-link">
                            <i className="fas fa-comments nav-icon text-secondary" />
                            <p>Reviews</p>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/cup-rates`} className="nav-link">
                            <i className="fas fa-signal nav-icon text-secondary" />
                            <p>Cuprates</p>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/manage-gamejob`} className="nav-link">
                            <i className="fas fa-gamepad nav-icon text-secondary" />
                            <p>Game Job</p>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href={`${process.env.REACT_APP_PUBLIC_URL}/manage-visitors`} className="nav-link">
                            <i className="fas fa-gamepad nav-icon text-secondary" />
                            <p>Manage Visitors</p>
                        </a>
                    </li>
                </ul>
                </nav>
            </div>
        </aside>
    </div>
  )
}
