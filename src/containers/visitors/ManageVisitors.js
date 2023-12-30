import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../../components/header';
import SideNav from '../../components/side-nav';
import Footer from '../../components/footer';

export default function ManageVisitor() {
  var accessToken = localStorage.getItem('auth_token');
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState,
    formState: { isSubmitSuccessful },
  } = useForm();
  const [visitors, setVisitor] = useState([]);

  const fetchVisitorList = () => {
    var accessToken = localStorage.getItem('auth_token');
    const apiConfig = {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
    };
    axios
      .get(
        process.env.REACT_APP_DEV === 'true'
          ? `${process.env.REACT_APP_DEV_API_URL}/getVisitor`
          : `${process.env.REACT_APP_LOCAL_API_URL}/getVisitor`,
        apiConfig
      )
      .then((response) => {
        if (response.data.success) {
          setVisitor(response.data.data);
        }
      })
      .catch((error) => {
        toast.error('Oh Snap!' + error.code);
      });
  };

  const onSubmit = async (data) => {
    // Adjust the API endpoint and fields based on your requirements
    const apiConfig = {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
    };

    // Adjust the API endpoint and fields based on your requirements
    axios
      .put(
        process.env.REACT_APP_DEV === 'true'
          ? `${process.env.REACT_APP_DEV_API_URL}/visitor${data.id ? '/' + data.id : ''}`
          : `${process.env.REACT_APP_LOCAL_API_URL}/visitor${data.id ? '/' + data.id : ''}`,
        data,
        apiConfig
      )
      .then((response) => {
        if (response.data.success) {
          fetchVisitorList();
          toast.success(response.data.msg);
        } else {
          fetchVisitorList();
          toast.error(response.data.msg);
        }
      })
      .catch((error) => {
        toast.error(error.code);
      });
  };

  const editVisitor = (v_id) => {
    const apiConfig = {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
    };

    axios
      .get(
        process.env.REACT_APP_DEV === 'true'
          ? `${process.env.REACT_APP_DEV_API_URL}/visitor/${v_id}`
          : `${process.env.REACT_APP_LOCAL_API_URL}/visitor/${v_id}`,
        apiConfig
      )
      .then((response) => {
        if (response.data.success) {
          let visitorData = response.data.data;
          if (visitorData.id) {
            setValue('id', visitorData.id);
          }
          // Adjust the fields based on your requirements
          setValue('visitor_name', visitorData.visitor_name);
          setValue('min', visitorData.min);
          setValue('max', visitorData.max);
          setValue('fake_users', visitorData.fake_users);
          setValue('status', visitorData.status);
          fetchVisitorList();
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => {
        toast.error(error.code);
      });
  };

  useEffect(() => {
    fetchVisitorList();
  }, []);

  useEffect(() => {
    console.log("visitorList", visitors);
  }, [visitors]);
  
  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  return (
    <>
      <Header />
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Manage Visitors</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href={`${process.env.REACT_APP_PUBLIC_URL}/`}>Dashboard</a>
                  </li>
                  <li className="breadcrumb-item active">Upcoming Matches</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="container-fluid">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Adjust the form fields based on your requirements */}
              <input type="hidden" {...register('id')} value={null} />
              <div className="row">
                <div className="col-md-3">
                  <label className="form-label fw-bold">Min:</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter Min"
                    {...register('min')}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold">Max:</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter Max"
                    {...register('max')}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold">Fake Users:</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter Fake Users"
                    {...register('fake_users')}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold">Status:</label>
                  <select className="form-control" {...register('status')} required>
                    <option value={1} key="1">
                      Active
                    </option>
                    <option value={0} key="0">
                      Inactive
                    </option>
                  </select>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-3">
                  <div className="row">
                    <div className="col-md-6">
                      <input type="reset" value="CLEAR" className="btn btn-secondary w-100" />
                    </div>
                    <div className="col-md-6">
                      <input type="submit" value="SUBMIT" className="btn btn-primary w-100" />
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <div className="row">
              <div className="col-md-12">
                <hr />
                <h2>Visitors List</h2>
                <hr />
                <Table className="table-responsive" striped bordered hover>
                  <thead>
                    <tr>
                      <th>Min</th>
                      <th>Max</th>
                      <th>Fake Users</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                      {/* {visitors && visitors.length > 0 && visitors.map((visitor, index) => ( */}
                        <tr key={visitors.id}>
                          <td>{visitors.min ?? 'N/A'}</td>
                          <td>{visitors.max ?? 'N/A'}</td>
                          <td>{visitors.fake_users ?? 'N/A'}</td>
                          <td>{visitors.status ?? 'N/A'}</td>
                          <td width="100">
                            <button
                              className="btn btn-info btn-sm ms-2 text-white"
                              title="Edit"
                              type="button"
                              onClick={() => {
                                editVisitor(visitors.id);
                              }}
                            >
                              <FiEdit2 />
                            </button>
                          </td>
                        </tr>
                      {/* ))} */}

                      {/* <tr>
                        <td colSpan={5} className="text-center">
                          No Visitors
                        </td>
                      </tr> */}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </section>
      </div>
      <SideNav />
      <Footer />
    </>
  );
}