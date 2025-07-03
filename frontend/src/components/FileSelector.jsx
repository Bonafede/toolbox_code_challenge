import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { fetchFilesList, fetchFilesData, setSelectedFile, clearError } from '../store/filesSlice';
import './FileSelector.css';

const FileSelector = () => {
  const dispatch = useDispatch();
  const { 
    availableFiles, 
    selectedFile, 
    filesListLoading, 
    filesListError 
  } = useSelector(state => state.files);

  useEffect(() => {
    dispatch(fetchFilesList());
  }, [dispatch]);

  const handleFileChange = (event) => {
    const fileName = event.target.value;
    dispatch(setSelectedFile(fileName));
    
    // Fetch data for the selected file (or all files if empty)
    dispatch(fetchFilesData(fileName || null));
  };

  const handleRefresh = () => {
    dispatch(clearError());
    dispatch(fetchFilesList());
    // Re-fetch current selection
    dispatch(fetchFilesData(selectedFile || null));
  };

  if (filesListError) {
    return (
      <Alert variant="danger" className="d-flex justify-content-between align-items-center">
        <span>Error loading files list: {filesListError}</span>
        <Button variant="outline-danger" size="sm" onClick={handleRefresh}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <div className="file-selector">
      <Form.Group className="d-flex align-items-center gap-3">
        <Form.Label className="mb-0 fw-bold">Filter by file:</Form.Label>
        <Form.Select 
          value={selectedFile} 
          onChange={handleFileChange}
          disabled={filesListLoading}
          style={{ maxWidth: '300px' }}
        >
          <option value="">All files</option>
          {availableFiles.map((fileName) => (
            <option key={fileName} value={fileName}>
              {fileName}
            </option>
          ))}
        </Form.Select>
        
        {filesListLoading && (
          <Spinner animation="border" size="sm" role="status" aria-label="Loading files" />
        )}
        
        <Button 
          variant="outline-secondary" 
          size="sm" 
          onClick={handleRefresh}
          disabled={filesListLoading}
        >
          Refresh
        </Button>
      </Form.Group>
    </div>
  );
};

export default FileSelector; 