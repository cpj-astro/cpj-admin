import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/header';
import SideNav from '../../components/side-nav';
import Footer from '../../components/footer';
import { toast } from 'react-toastify';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import { Button, Table, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export default function AddMatchAstrology() {
  const {id, matchName} = useParams();
  const [loader, setLoader] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [selectedPandit, setSelectedPandit] = useState(null);
  const [pandits, setPandits] = useState([])
  const fileInputRef = useRef(null);
  const [isAstroModalOpen, setIsAstroModalOpen] = useState('');
  const [editedAstroCellValue, setEditedAstroCellValue] = useState('');
  const [astroSelectedCell, setAstroSelectedCell] = useState({
    rowIndex: null,
    columnIndex: null,
    value: null,
  });
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

  const handleFile = (e) => {
      let fileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
      let selectedFile = e.target.files[0];
      if (selectedFile) {
          if (selectedFile && fileTypes.includes(selectedFile.type)) {
              setTypeError(null);
              let reader = new FileReader();
              reader.readAsArrayBuffer(selectedFile);
              reader.onload = (e) => {
              setExcelFile(e.target.result);
              };
          } else {
              setTypeError('Please select only Excel file types');
              setExcelFile(null);
              setExcelData(null);
          }
      } else {
          toast.error('Please select your file');
      }
  };

  const selectPandit = (e) => {
      setSelectedPandit(e.target.value)
  }

  const closeFile = () => {
      if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset the input value
      }
      setExcelFile(null);
      setTypeError(null);
      setExcelData(null);
  }

  const uploadExcel = async () => {
    try {
      console.log('Uploading', JSON.stringify(excelData));
      if(!selectedPandit) {
        return toast.error('Please select pandit')
      }
      setLoader(true);
      if (excelData && excelData.length > 0) {
        const params = {
          pandit_id: selectedPandit ? selectedPandit : null,
          match_id: id ? id : null,
          astrology_data: JSON.stringify(excelData) // Send only the first record
        };
  
        await axios.post(
          process.env.REACT_APP_DEV === 'true'
            ? `${process.env.REACT_APP_DEV_API_URL}/uploadMatchAstrology`
            : `${process.env.REACT_APP_LOCAL_API_URL}/uploadMatchAstrology`,
          params,
          apiConfig
        )
          .then((response) => {
            setLoader(false);
            if (response.data.status) {
              closeFile();
              fetchPanditsData();
              toast.success(response.data.message);
            } else {
              closeFile();
              setLoader(false);
              fetchPanditsData();
              toast.error(response.data.error);
            }
          })
          .catch((error) => {
            closeFile();
            setLoader(false);
            fetchPanditsData();
            toast.error(error);
          });
      } else {
        // Handle the case when excelData is empty
        toast.warning('No data to upload.');
        setLoader(false);
      }
    } catch (error) {
      closeFile();
      setLoader(false);
      toast.error(error);
    }
  };  

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: 'binary' });
      let allExcelData = [];
  
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        allExcelData.push({ sheetName, data });
      });
  
      // Parse the JSON string before setting it in the state
      setExcelData(allExcelData);
    }
  };
  
  const openModal = (rowIndex, columnIndex, value) => {
    setSelectedCell({ rowIndex, columnIndex, value });
    setEditedCellValue(value);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeAstroModal = () => {
    setIsAstroModalOpen(false);
  };

  const openPanditModal = (rowIndex, columnIndex, value) => {
    setAstroSelectedCell({ rowIndex, columnIndex, value });
    setEditedAstroCellValue(value);
    setIsAstroModalOpen(true);
  };

  const saveEditedValue = () => {
    if (selectedCell.rowIndex !== null && selectedCell.columnIndex !== null) {
    const updatedData = [...excelData];
    updatedData[selectedCell.rowIndex][Object.keys(excelData[0])[selectedCell.columnIndex]] = editedCellValue;
    setExcelData(updatedData);
    closeModal();
    }
  };

  const fetchPanditsData = async () => {
    try {
      const panditsResponse = await axios.get(
        process.env.REACT_APP_DEV === 'true'
          ? `${process.env.REACT_APP_DEV_API_URL}/pandits/getAllPandits`
          : `${process.env.REACT_APP_LOCAL_API_URL}/pandits/getAllPandits`,
        apiConfig
      );
      
      if (panditsResponse.data.success) {
        const updatedPandits = await Promise.all(
          panditsResponse.data.pandits.map(async (pandit) => {
            const astrologyDataResponse = await axios.get(
              process.env.REACT_APP_DEV === 'true'
                ? `${process.env.REACT_APP_DEV_API_URL}/fetchByPanditAndMatch`
                : `${process.env.REACT_APP_LOCAL_API_URL}/fetchByPanditAndMatch`,
              {
                ...apiConfig,
                params: {
                  pandit_id: pandit.id,
                  match_id: id,
                },
              }
            );
  
            if (astrologyDataResponse.data.status) {
              return {
                ...pandit,
                astrology_data: astrologyDataResponse.data.astrology_data,
              };
            } else {
              toast.error(astrologyDataResponse.data.error);
              return pandit;
            }
          })
        );
        console.log('updatedPandits', updatedPandits);
        setPandits(updatedPandits);
      }
    } catch (error) {
      toast.error(error);
    }
  };  

  const handleCellValueChange = (newValue, rowIndex, columnIndex, sheetIndex) => {
    setExcelData(prevData => {
      const updatedData = [...prevData]; // Copy the array of sheets
      const cellData = updatedData[sheetIndex].data[rowIndex];
      if (columnIndex === 0) {
        cellData.key = newValue;
      } else if (columnIndex === 1) {
        cellData.value = newValue;
      }
  
      return updatedData; 
    });
  };  

  const removeRow = (sheetIndex, rowIndex) => {
    setExcelData(prevData => {
      const updatedData = prevData.map((sheet, index) => {
        if (index === sheetIndex) {
          return {
            ...sheet,
            data: sheet.data.filter((item, idx) => idx !== rowIndex)
          };
        }
        return sheet;
      });
      return updatedData;
    });
  };

  // Function to add a new row to a specific sheet
  const addRow = (sheetIndex) => {
    if (excelData && excelData[sheetIndex] && excelData[sheetIndex].data) {
      const updatedData = [...excelData];
      updatedData[sheetIndex].data.push({ key: '', value: '' }); // Add a new row with empty key-value fields to the specific sheet
      setExcelData(updatedData);
    }
  };

  useEffect(() => {
    console.log(excelData);
  }, [excelData])
  
  useEffect(() => {
    fetchPanditsData();
  },[]);
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
          <Modal size="lg" show={isAstroModalOpen} onHide={closeAstroModal}>
              <Modal.Header>
                <Modal.Title>View Selected Value</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <textarea
                  rows={8}
                  className='form-control'
                  value={editedAstroCellValue}
                  disabled
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={closeAstroModal}>Close</Button>
              </Modal.Footer>
          </Modal>
          
          <section className="content-header">
            <div className="container-fluid">
                <div className="row mb-2">
                  <div className="col-sm-6">
                      <h5>Upload Astrology for match: <u>{matchName ? matchName : 'N/A'}</u></h5>
                  </div>
                  <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-right">
                      <li className="breadcrumb-item"><a href={`${process.env.REACT_APP_PUBLIC_URL}/`}>Dashboard</a></li>
                      <li className="breadcrumb-item active">Upload Astrology Data</li>
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
                            <h3 className="card-title">Manage Astrology Data</h3>
                            <a href={`${process.env.REACT_APP_PUBLIC_URL}/templates/Excel-Template.xlsx`} className="download-template-btn" role="button">
                                <i className='fa fa-download'></i>&nbsp;&nbsp;Download Excel Template
                            </a>
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
                                            <div className='col-md-8'>
                                                <input type="file" className="form-control" required onChange={handleFile} ref={fileInputRef} />
                                            </div>
                                            <div className='col-md-2'>
                                                <select className="form-control" required onChange={(e)=>{selectPandit(e)}}>
                                                <option value={null}>--- Select Pandit ---</option>
                                                {(pandits && pandits.length > 0) ? pandits.map((pandit, index) => (
                                                    <option value={pandit.id}>{pandit.name ? pandit.name : 'N/A'}</option>
                                                )) : 
                                                    <option value={null}>No Astrologers</option>
                                                }   
                                                </select>
                                            </div>
                                            <div className='col-md-2 set-btns'>
                                                {excelData ? (<>
                                                    <button type="button" className="btn btn-primary w-100" style={{marginRight: '10px'}} onClick={uploadExcel}>Submit</button>
                                                    <button type="button" className="btn btn-danger w-100" onClick={closeFile}>Clear</button>
                                                </>)
                                                : <button type="submit" className="btn btn-primary w-100"><i className='fa fa-file-excel'></i>&nbsp;Load Excel</button>}
                                            </div>
                                        </div>
                                        {typeError && (
                                            <div className="alert alert-danger mt-10" role="alert">{typeError}</div>
                                        )}
                                    </form>
                                    {excelData && excelData.length > 0 && (
                                      <div className="accordion-container">
                                        <Accordion> 
                                          {excelData.map((sheetData, sheetIndex) => (
                                            <div key={sheetIndex}>
                                              <Accordion.Item eventKey={sheetIndex.toString()}>
                                                <Accordion.Header className='w-100'>
                                                  <h7 className='text-capitalize text-bold'>{sheetData.sheetName}</h7>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                  <Table responsive className='table table-bordered table-striped'>
                                                    <thead>
                                                      <tr>
                                                        <th>Keys</th>
                                                        <th>Values</th>
                                                        <th>Action</th>
                                                      </tr>
                                                    </thead>
                                                    <tbody>
                                                      {sheetData.data.map((item, rowIndex) => (
                                                        <tr key={rowIndex}>
                                                          <td>
                                                            <input
                                                              type="text"
                                                              className='form-control'
                                                              value={item.key}
                                                              onChange={(e) => handleCellValueChange(e.target.value, rowIndex, 0, sheetIndex)}
                                                            />
                                                          </td>
                                                          <td>
                                                            <input
                                                              type="text"
                                                              className='form-control'
                                                              value={item.value}
                                                              onChange={(e) => handleCellValueChange(e.target.value, rowIndex, 1, sheetIndex)}
                                                            />
                                                          </td>
                                                          <td>
                                                            <button className='btn btn-danger' onClick={() => removeRow(sheetIndex, rowIndex)}>Remove</button>
                                                          </td>
                                                        </tr>
                                                      ))}
                                                    </tbody>
                                                  </Table>
                                                  <button className='btn btn-success' onClick={() => addRow(sheetIndex)}>Add Row</button>
                                                </Accordion.Body>
                                              </Accordion.Item>
                                            </div>
                                          ))}
                                        </Accordion>
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
          
          {pandits && pandits.length > 0 && pandits.map((pandit, index) => (
            <section className="content" key={index}>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className='card card-secondary'>
                                <div className="card-header">
                                    <h3 className="card-title">{pandit.name}</h3>
                                </div>
                                <div className='card-body'>
                                    {pandit.astrology_data && Array.isArray(pandit.astrology_data) && pandit.astrology_data.length > 0 ? (
                                        <Table responsive className='table table-bordered table-striped'>
                                            <thead>
                                                <tr>
                                                    <th>Aries</th>
                                                    <th>Taurus</th>
                                                    <th>Gemini</th>
                                                    <th>Cancer</th>
                                                    <th>Leo</th>
                                                    <th>Virgo</th>
                                                    <th>Libra</th>
                                                    <th>Scorpio</th>
                                                    <th>Sagittarius</th>
                                                    <th>Capricorn</th>
                                                    <th>Aquarius</th>
                                                    <th>Pisces</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pandit.astrology_data.map((individualAstroData, rowIndex) => (
                                                    <tr key={rowIndex}>
                                                      <td>
                                                        <span
                                                          title={individualAstroData.aries}
                                                          style={{ cursor: 'pointer' }}
                                                          onClick={() => openPanditModal(rowIndex, 0, individualAstroData.aries)}
                                                        >
                                                          {individualAstroData && individualAstroData.aries && individualAstroData.aries.length > 50 ? (
                                                          individualAstroData.aries.substring(0, 50) + '...'
                                                          ) : (
                                                            individualAstroData.aries
                                                          )}
                                                        </span>
                                                      </td>
                                                      <td>
                                                        <span
                                                          title={individualAstroData.taurus}
                                                          style={{ cursor: 'pointer' }}
                                                          onClick={() => openPanditModal(rowIndex, 0, individualAstroData.taurus)}
                                                        >
                                                          {individualAstroData && individualAstroData.taurus && individualAstroData.taurus.length > 50 ? (
                                                          individualAstroData.taurus.substring(0, 50) + '...'
                                                          ) : (
                                                            individualAstroData.taurus
                                                          )}
                                                        </span>
                                                      </td>
                                                      <td>
                                                        <span
                                                          title={individualAstroData.gemini}
                                                          style={{ cursor: 'pointer' }}
                                                          onClick={() => openPanditModal(rowIndex, 0, individualAstroData.gemini)}
                                                        >
                                                          {individualAstroData && individualAstroData.gemini && individualAstroData.gemini.length > 50 ? (
                                                          individualAstroData.gemini.substring(0, 50) + '...'
                                                          ) : (
                                                            individualAstroData.gemini
                                                          )}
                                                        </span>
                                                      </td>
                                                      <td>
                                                        <span
                                                          title={individualAstroData.cancer}
                                                          style={{ cursor: 'pointer' }}
                                                          onClick={() => openPanditModal(rowIndex, 0, individualAstroData.cancer)}
                                                        >
                                                          {individualAstroData && individualAstroData.cancer && individualAstroData.cancer.length > 50 ? (
                                                          individualAstroData.cancer.substring(0, 50) + '...'
                                                          ) : (
                                                            individualAstroData.cancer
                                                          )}
                                                        </span>
                                                      </td>
                                                      <td>
                                                        <span
                                                          title={individualAstroData.leo}
                                                          style={{ cursor: 'pointer' }}
                                                          onClick={() => openPanditModal(rowIndex, 0, individualAstroData.leo)}
                                                        >
                                                          {individualAstroData && individualAstroData.leo && individualAstroData.leo.length > 50 ? (
                                                          individualAstroData.leo.substring(0, 50) + '...'
                                                          ) : (
                                                            individualAstroData.leo
                                                          )}
                                                        </span>  
                                                      </td>
                                                      <td>
                                                        <span
                                                          title={individualAstroData.virgo}
                                                          style={{ cursor: 'pointer' }}
                                                          onClick={() => openPanditModal(rowIndex, 0, individualAstroData.virgo)}
                                                        >
                                                          {individualAstroData && individualAstroData.virgo && individualAstroData.virgo.length > 50 ? (
                                                          individualAstroData.virgo.substring(0, 50) + '...'
                                                          ) : (
                                                            individualAstroData.virgo
                                                          )}
                                                        </span>
                                                      </td>
                                                      <td>
                                                        <span
                                                          title={individualAstroData.libra}
                                                          style={{ cursor: 'pointer' }}
                                                          onClick={() => openPanditModal(rowIndex, 0, individualAstroData.libra)}
                                                        >
                                                          {individualAstroData && individualAstroData.libra && individualAstroData.libra.length > 50 ? (
                                                          individualAstroData.libra.substring(0, 50) + '...'
                                                          ) : (
                                                            individualAstroData.libra
                                                          )}
                                                        </span>
                                                      </td>
                                                      <td>
                                                        <span
                                                          title={individualAstroData.scorpio}
                                                          style={{ cursor: 'pointer' }}
                                                          onClick={() => openPanditModal(rowIndex, 0, individualAstroData.scorpio)}
                                                        >
                                                          {individualAstroData && individualAstroData.scorpio && individualAstroData.scorpio.length > 50 ? (
                                                          individualAstroData.scorpio.substring(0, 50) + '...'
                                                          ) : (
                                                            individualAstroData.scorpio
                                                          )}
                                                        </span>
                                                      </td>
                                                      <td>
                                                        <span
                                                          title={individualAstroData.sagittarius}
                                                          style={{ cursor: 'pointer' }}
                                                          onClick={() => openPanditModal(rowIndex, 0, individualAstroData.sagittarius)}
                                                        >
                                                          {individualAstroData && individualAstroData.sagittarius && individualAstroData.sagittarius.length > 50 ? (
                                                          individualAstroData.sagittarius.substring(0, 50) + '...'
                                                          ) : (
                                                            individualAstroData.sagittarius
                                                          )}
                                                        </span>
                                                      </td>
                                                      <td>
                                                        <span
                                                          title={individualAstroData.capricorn}
                                                          style={{ cursor: 'pointer' }}
                                                          onClick={() => openPanditModal(rowIndex, 0, individualAstroData.capricorn)}
                                                        >
                                                          {individualAstroData && individualAstroData.capricorn && individualAstroData.capricorn.length > 50 ? (
                                                          individualAstroData.capricorn.substring(0, 50) + '...'
                                                          ) : (
                                                            individualAstroData.capricorn
                                                          )}
                                                        </span>
                                                      </td>
                                                      <td>
                                                        <span
                                                          title={individualAstroData.aquarius}
                                                          style={{ cursor: 'pointer' }}
                                                          onClick={() => openPanditModal(rowIndex, 0, individualAstroData.aquarius)}
                                                        >
                                                          {individualAstroData && individualAstroData.aquarius && individualAstroData.aquarius.length > 50 ? (
                                                          individualAstroData.aquarius.substring(0, 50) + '...'
                                                          ) : (
                                                            individualAstroData.aquarius
                                                          )}
                                                        </span>
                                                      </td>
                                                      <td>
                                                        <span
                                                          title={individualAstroData.pisces}
                                                          style={{ cursor: 'pointer' }}
                                                          onClick={() => openPanditModal(rowIndex, 0, individualAstroData.pisces)}
                                                        >
                                                          {individualAstroData && individualAstroData.pisces && individualAstroData.pisces.length > 50 ? (
                                                          individualAstroData.pisces.substring(0, 50) + '...'
                                                          ) : (
                                                            individualAstroData.pisces
                                                          )}
                                                        </span>
                                                      </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <p>No astrology data available for {pandit.name}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
          ))}
      </div>
      <SideNav />
      <Footer />
    </>
  )
}
