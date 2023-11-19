import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../../components/header';
import SideNav from '../../components/side-nav';
import Footer from '../../components/footer';

export default function SeriesList() {
    const [seriesData, setSeriesData] = useState([]);
    useEffect(() => {
        var accessToken = localStorage.getItem('auth_token');
        const apiConfig = {
            headers: {
                Authorization: "Bearer " + accessToken,
                'Content-Type': 'application/json',
            }
        };
        axios.get(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/seriesList` : `${process.env.REACT_APP_LOCAL_API_URL}/seriesList`, apiConfig)
        .then((response) => {
            if(response.data.success){
                setSeriesData(response.data.data);
            }
        }).catch((error) => {
            toast.error(error.code);
        });
    },[]);

    return (
        <>
            <Header/>
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                        <h1>Series List</h1>
                        </div>
                        <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right">
                            <li className="breadcrumb-item"><a href={`${process.env.REACT_APP_PUBLIC_URL}/`}>Dashboard</a></li>
                            <li className="breadcrumb-item active">Series List</li>
                        </ol>
                        </div>
                    </div>
                    </div>{/* /.container-fluid */}
                </section>
                {/* Main content */}
                <section className="content">
                    <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                        {/* /.card */}
                        <div className="card">
                            <div className="card-header">
                            <h3 className="card-title">Series List</h3>
                            </div>
                            {/* /.card-header */}
                            <div className="card-body">
                                <table id="example6" className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Sr. No.</th>
                                            <th>Series</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {(seriesData && seriesData.length > 0) ? seriesData.map((series, index) => (
                                        <tr>
                                            <td> {index+1} </td>
                                            <td> {series.series_name ? series.series_name : 'N/A'} </td>
                                        </tr>
                                    )) : 
                                        <tr>
                                            <td colSpan={3}>
                                                No Series Yet
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Series</th>
                                    </tr>
                                </tfoot>
                            </table>
                            </div>
                            {/* /.card-body */}
                        </div>
                        {/* /.card */}
                        </div>
                        {/* /.col */}
                    </div>
                    {/* /.row */}
                    </div>
                    {/* /.container-fluid */}
                </section>
                {/* /.content */}
            </div>
            <SideNav/>
            <Footer/>
        </>
    )
}
