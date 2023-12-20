import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
    const logout = () => { 
        localStorage.removeItem('auth_token'); 
        localStorage.removeItem('fb_token'); 
        navigate('/login');
    }
    return (
        <div>
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                {/* Left navbar links */}
                <ul className="navbar-nav">
                    <li className="nav-item">
                    <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></a>
                    </li>
                </ul>
                {/* Right navbar links */}
                <ul className="navbar-nav ml-auto">
                    {/* Navbar Search */}
                    <li className="nav-item">
                    </li>
                    {/* Notifications Dropdown Menu */}
                    <li className="nav-item">
                        <a className="nav-link" data-widget="fullscreen" href="#" role="button">
                            <i className="fas fa-expand-arrows-alt" />
                        </a>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link" data-toggle="dropdown" href="#">
                            <i className="fas fa-user-circle" />
                        </a>
                        <div className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                            <span className="dropdown-item cursor-pointer" onClick={logout}>
                                <i className="fa fa-power-off mr-2" /> Logout
                            </span>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
