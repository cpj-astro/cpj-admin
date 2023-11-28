import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/header';
import SideNav from '../../components/side-nav';
import Footer from '../../components/footer';
import { toast } from 'react-toastify';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { Button, Table } from 'react-bootstrap';

export default function ViewAstrologyData() {
  const [loader, setLoader] = useState(false);
  const [excelData, setExcelData] = useState(null);
  const [selectedPandit, setSelectedPandit] = useState(null);
  const [selectedPanditName, setSelectedPanditName] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [pandits, setPandits] = useState([])
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedCellValue, setEditedCellValue] = useState('');
  const [selectedCell, setSelectedCell] = useState({
      rowIndex: null,
      columnIndex: null,
      value: null,
  });

  var accessToken = localStorage.getItem('auth_token');
  const apiConfig = {
      headers: {
          Authorization: "Bearer " + accessToken,
          'Content-Type': 'application/json',
      }
  };

  const selectPandit = (e) => {
    setSelectedPandit(e.target.value)
  }

  const selectMonth = (e) => {
    setSelectedMonth(e.target.value)
  }

  const selectYear = (e) => {
    setSelectedYear(e.target.value)
  }

  const clearData = () => {
    setSelectedPanditName(null);
    setExcelData(null);
  }

  const uploadExcel = async () => {
    try {
        setLoader(true);
        const params = {
            pandit_id: selectedPandit ? selectedPandit : null,
            astrology_data: excelData ? excelData : null
        }
        await axios.post(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/uploadEditedAstrology` : `${process.env.REACT_APP_LOCAL_API_URL}/uploadEditedAstrology`, params, apiConfig)
        .then((response) => {
            setLoader(false);
            if(response.data.status){
                clearData();
                toast.success(response.data.message);
            } else {
                clearData();
                setLoader(false);
                toast.error(response.data.error);
            }
        }).catch((error) => {
            clearData();
            setLoader(false);
            toast.error(error);
        });
    } catch (error) {
        clearData();
        setLoader(false);
        toast.error(error);
    }
  }

  const fetchExcelData = async () => {
      try {
          setLoader(true);
          const params = {
            pandit_id: selectedPandit ? selectedPandit : null,
            year: selectedYear ? selectedYear : null,
            month: selectedMonth ? selectedMonth : null
          }
          await axios.post(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/fetchDataByYearMonthAndPanditId` : `${process.env.REACT_APP_LOCAL_API_URL}/fetchDataByYearMonthAndPanditId`, params, apiConfig)
          .then((response) => {
              setLoader(false);
              if(response.data.status){
                  setExcelData(response.data.data)
                  setSelectedPanditName(response.data.pandit)
              } else {
                  clearData();
                  setLoader(false);
                  toast.error('Please Select Proper Data');
              }
          }).catch((error) => {
              clearData();
              setLoader(false);
              toast.error(error);
          });
      } catch (error) {
          clearData();
          setLoader(false);
          toast.error(error);
      }
  }

  const handleFileSubmit = (e) => {
      e.preventDefault();
      clearData();
      fetchExcelData();
  };

  const openModal = (rowIndex, columnIndex, value) => {
      setSelectedCell({ rowIndex, columnIndex, value });
      setEditedCellValue(value);
      setIsModalOpen(true);
  };

  const closeModal = () => {
      setIsModalOpen(false);
  };

  const saveEditedValue = () => {
    if (selectedCell.rowIndex !== null && selectedCell.columnIndex !== null) {
      const updatedData = [...excelData];
      updatedData[selectedCell.rowIndex][Object.keys(excelData[0])[selectedCell.columnIndex]] = editedCellValue;
      setExcelData(updatedData);
      closeModal();
    }
  };

  const fetchPanditsData = () => {
      try {
          axios.get(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/pandits/getAllPandits` : `${process.env.REACT_APP_LOCAL_API_URL}/pandits/getAllPandits`, apiConfig)
          .then((response) => {
              console.log('response', response);
              if(response.data.success){
                  setPandits(response.data.pandits);
              }
          }).catch((error) => {
              toast.error(error.code);
          });
      } catch (error) {
          toast.error(error);
      }
  }
  
  const fetchYearsAndMonthsData = () => {
    try {
      axios.get(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/fetchUniqueYearsAndMonths` : `${process.env.REACT_APP_LOCAL_API_URL}/fetchUniqueYearsAndMonths`, apiConfig)
      .then((response) => {
        console.log('response', response);
        if(response.data.status){
          setYears(response.data.years);
          setMonths(response.data.months);
        } else {
          toast.error(response.data.error);
        }
      }).catch((error) => {
        toast.error(error.code);
      });
    } catch (error) {
      toast.error(error);
    }
  }
  
  useEffect(() => {
      fetchPanditsData();
      fetchYearsAndMonthsData();
  },[]) 
  return (
      <>
      <Header />
      <div className="content-wrapper">
          <Modal size="lg" show={isModalOpen} onHide={closeModal}>
              <Modal.Header>
                  <Modal.Title>Edit Selected Value</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <textarea
                      rows={10}
                      className='form-control'
                      value={editedCellValue}
                      onChange={(e) => setEditedCellValue(e.target.value)}
                  />
              </Modal.Body>
              <Modal.Footer>
                  <Button variant="primary" onClick={saveEditedValue}>Save</Button>
                  <Button variant="secondary" onClick={closeModal}>Close</Button>
              </Modal.Footer>
          </Modal>
          <section className="content-header">
          <div className="container-fluid">
              <div className="row mb-2">
              <div className="col-sm-6">
                  <h1>View Astrology Data</h1>
              </div>
              <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href={`${process.env.REACT_APP_PUBLIC_URL}/`}>Dashboard</a></li>
                  <li className="breadcrumb-item active">View Astrology Data</li>
                  </ol>
              </div>
              </div>
          </div>
          </section>
          <section className="content">
          <div className="container-fluid">
              <div className="row">
              <div className="col-md-12">
                  <div className='card card-secondary'>
                  <div className="card-header">
                      <h3 className="card-title">View Astrology Data</h3>
                      <span className="download-template-btn" role="button">
                          Selected Pandit : {selectedPanditName}
                      </span>
                  </div>
                  <div className='card-body'>
                      <div className='row'>
                          {loader ?
                          <div className='w-100 text-center'>
                              <i className='fa fa-spinner fa-spin'></i>
                          </div> :
                          <div className='col-md-12'>
                              <form className="form-group" onSubmit={handleFileSubmit}>
                                  <div className='row'>
                                      <div className='col-md-3'>
                                          <select className="form-control" required onChange={(e)=>{selectPandit(e)}}>
                                            <option value={null}>--- Select Pandit ---</option>
                                            {(pandits && pandits.length > 0) ? pandits.map((pandit, index) => (
                                            <option value={pandit.id}>{pandit.name ? pandit.name : 'N/A'}</option>
                                            )) : 
                                            <option value={null}>No Astrologers</option>
                                            }   
                                          </select>
                                      </div>
                                      <div className='col-md-3'>
                                        <select className='form-control' required onChange={(e)=>{selectMonth(e)}}>
                                          <option value={null}>--- Select Month ---</option>
                                          {(months && months.length > 0) ? months.map((month, index) => (
                                          <option value={month}>{month ? month: 'N/A'}</option>
                                          )) : 
                                          <option value={null}>No Months</option>
                                          }   
                                        </select>
                                      </div>
                                      <div className='col-md-3'>
                                        <select className='form-control' required onChange={(e)=>{selectYear(e)}}>
                                          <option value={null}>--- Select Year ---</option>
                                          {(years && years.length > 0) ? years.map((year, index) => (
                                          <option value={year}>{year ? year: 'N/A'}</option>
                                          )) : 
                                          <option value={null}>No Years</option>
                                          }   
                                        </select>
                                      </div>
                                      <div className='col-md-3 set-btns'>
                                          {excelData ? (<>
                                            <button type="button" className="btn btn-primary w-100" style={{marginRight: '10px'}} onClick={uploadExcel}>Submit</button>
                                            <span className="btn btn-danger w-100" onClick={clearData}>Clear</span>
                                          </>)
                                          : <button type="submit" className="btn btn-primary w-100"><i className='fa fa-file-excel'></i>&nbsp;Load Data</button>}
                                      </div>
                                  </div>
                              </form>
                              {excelData ? (
                              <Table responsive className='table table-bordered table-striped'>
                                  <thead>
                                  <tr>
                                      {Object.keys(excelData[0]).map((key) => (
                                      <th key={key}>{key}</th>
                                      ))}
                                  </tr>
                                  </thead>
                                  <tbody>
                                  {excelData.map((individualExcelData, rowIndex) => (
                                      <tr key={rowIndex}>
                                      {Object.keys(individualExcelData).map((key, columnIndex) => (
                                          <td key={key}>
                                          <span
                                            title={individualExcelData[key]}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                              if (columnIndex !== 0) {
                                                  openModal(rowIndex, columnIndex, individualExcelData[key]);
                                              }
                                            }}
                                          >
                                              {individualExcelData[key].length > 20 ? (
                                              individualExcelData[key].substring(0, 20) + '...'
                                              ) : (
                                                  individualExcelData[key]
                                              )}
                                          </span>
                                          </td>
                                      ))}
                                      </tr>
                                  ))}
                                  </tbody>
                              </Table>
                              ) : (
                              <div className="viewer">
                                  No Records to show!
                              </div>
                              )}
                          </div>}
                      </div>
                  </div>
                  </div>
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
