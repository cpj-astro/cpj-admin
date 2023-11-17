import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div>
      <footer className="main-footer">
        <strong>Copyright © {currentYear}-{currentYear+1} <a href="#">CricketPanditJi</a> - </strong>
        All rights reserved.
        <div className="float-right d-none d-sm-inline-block">
          <b>Version</b> 3.2.0
        </div>
      </footer>
      {/* Control Sidebar */}
      <aside className="control-sidebar control-sidebar-dark">
        {/* Control sidebar content goes here */}
      </aside>
      {/* /.control-sidebar */}
    </div>
  );
}
