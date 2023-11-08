import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/header';
import SideNav from '../../components/side-nav';
import Footer from '../../components/footer';
import { toast } from 'react-toastify';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Modal from 'react-bootstrap/Modal';
import { Button, Table } from 'react-bootstrap';

export default function UploadAstrologyData() {
    const [loader, setLoader] = useState(false);
    const [excelFile, setExcelFile] = useState(null);
    const [typeError, setTypeError] = useState(null);
    const [excelData, setExcelData] = useState(null);
    const [selectedPandit, setSelectedPandit] = useState(null);
    const [pandits, setPandits] = useState([])
    const fileInputRef = useRef(null);
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
            setLoader(true);
            const params = {
                pandit_id: selectedPandit ? selectedPandit : null,
                astrology_data: excelData ? excelData : null
            }
            await axios.post(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/uploadAstrology` : `${process.env.REACT_APP_LOCAL_API_URL}/uploadAstrology`, params, apiConfig)
            .then((response) => {
                setLoader(false);
                if(response.data.status){
                    closeFile();
                    toast.success(response.data.message);
                } else {
                    closeFile();
                    setLoader(false);
                    toast.error(response.data.error);
                }
            }).catch((error) => {
                closeFile();
                setLoader(false);
                toast.error(error);
            });
        } catch (error) {
            closeFile();
            setLoader(false);
            toast.error(error);
        }
    }

    const handleFileSubmit = (e) => {
        e.preventDefault();
        if (excelFile !== null) {
            const workbook = XLSX.read(excelFile, { type: 'binary' });
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            setExcelData(data);
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
    
    useEffect(() => {
        fetchPanditsData();
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
                    <h1>Upload Astrology Data</h1>
                </div>
                <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
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
                        <a href="/templates/Excel-Template.xlsx" className="download-template-btn" role="button">
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
                                                onClick={() => openModal(rowIndex, columnIndex, individualExcelData[key])}
                                            >
                                                {individualExcelData[key].length > 5 ? (
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
                                    No File is Uploaded Yet!
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
