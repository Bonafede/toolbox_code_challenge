import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Alert, Spinner } from 'react-bootstrap';
import { fetchFilesData } from '../store/filesSlice';
import './FilesTable.css';

const FilesTable = () => {
  const dispatch = useDispatch();
  const { data, loading, error, selectedFile } = useSelector(state => state.files);

  // Initial load only (when no file is selected)
  useEffect(() => {
    if (!selectedFile) {
      dispatch(fetchFilesData());
    }
  }, [dispatch, selectedFile]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
        <p className="mt-2">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">Network error: {error}</Alert>;
  }

  const allLines = [];
  data.forEach(fileData => {
    fileData.lines.forEach(line => {
      allLines.push({
        fileName: fileData.file,
        text: line.text,
        number: line.number,
        hex: line.hex,
      });
    });
  });
  
  if (allLines.length === 0) {
    return (
      <Alert variant="info" className="text-center">
        {selectedFile 
          ? `No data available for file: ${selectedFile}` 
          : 'No data available'
        }
      </Alert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">
          {selectedFile 
            ? `Data from: ${selectedFile}` 
            : `All Files Data (${data.length} files)`
          }
        </h5>
        <small className="text-muted">
          {allLines.length} records
        </small>
      </div>
      
      <Table striped bordered hover className="table-fixed">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Text</th>
            <th>Number</th>
            <th>Hex</th>
          </tr>
        </thead>
        <tbody>
          {allLines.map((line, index) => (
            <tr key={index}>
              <td>{line.fileName}</td>
              <td>{line.text}</td>
              <td>{line.number}</td>
              <td>{line.hex}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default FilesTable;
