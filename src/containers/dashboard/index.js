import React from 'react'
import Header from '../../components/header'
import SideNav from '../../components/side-nav'
import Footer from '../../components/footer'

export default function Dashboard() {
  return (
    <>
        <Header/>
        <div>
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-md-12">
                                <h1 className="m-0">Dashboard</h1>
                            </div>
                        </div>
                    </div>
                </div>
                
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-3 col-6">
                                {/* small box */}
                                <div className="small-box bg-info">
                                    <div className="inner">
                                        <h3>$150</h3>
                                        <p>Total Income</p>
                                    </div>
                                    <div className="icon">
                                        <i className="ion ion-pie-graph" />
                                    </div>
                                </div>
                            </div>
                            {/* ./col */}
                            <div className="col-lg-3 col-6">
                            {/* small box */}
                            <div className="small-box bg-success">
                                <div className="inner">
                                    <h3>2</h3>
                                    <p>Live Matches</p>
                                </div>
                                <div className="icon">
                                    <i className="ion ion-stats-bars" />
                                </div>
                            </div>
                            </div>
                            {/* ./col */}
                            <div className="col-lg-3 col-6">
                            {/* small box */}
                            <div className="small-box bg-warning">
                                <div className="inner">
                                    <h3>44</h3>
                                    <p>Upcomming Matches</p>
                                </div>
                                <div className="icon">
                                    <i className="ion ion-stats-bars" />
                                </div>
                            </div>
                            </div>
                            {/* ./col */}
                            <div className="col-lg-3 col-6">
                            {/* small box */}
                            <div className="small-box bg-danger">
                                <div className="inner">
                                    <h3>65</h3>
                                    <p>Reccent Matches</p>
                                </div>
                                <div className="icon">
                                    <i className="ion ion-stats-bars" />
                                </div>
                            </div>
                            </div>
                            {/* ./col */}
                        </div>
                    </div>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-3 col-6">
                                <div className="small-box bg-danger">
                                    <div className="inner">
                                        <h3>$65</h3>
                                        <p>Avg Monthly Income</p>
                                    </div>
                                    <div className="icon">
                                        <i className="ion ion-pie-graph" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-6">
                                <div className="small-box bg-warning">
                                    <div className="inner">
                                        <h3>$44</h3>
                                        <p>Total Ad Revenue</p>
                                    </div>
                                    <div className="icon">
                                        <i className="ion ion-pie-graph" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-6">
                                <div className="small-box bg-success">
                                    <div className="inner">
                                        <h3>$15</h3>
                                        <p>Monthly Ad Revenue</p>
                                    </div>
                                    <div className="icon">
                                        <i className="ion ion-pie-graph" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-6">
                                <div className="small-box bg-info">
                                    <div className="inner">
                                        <h3>150</h3>
                                        <p>Total Visitors</p>
                                    </div>
                                    <div className="icon">
                                        <i className="ion ion-person" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <SideNav/>
        <Footer/>
    </>
  )
}
