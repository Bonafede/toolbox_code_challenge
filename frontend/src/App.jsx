import React from 'react';
import { Card } from 'react-bootstrap';
import FilesTable from './components/FilesTable';
import FileSelector from './components/FileSelector';
import './App.css';

const App = () => {
  return (
    <Card>
      <Card.Header className="text-white py-2" style={{ backgroundColor: '#f56565' }}>
        <h2 className="mb-0">React Test App</h2>
      </Card.Header>
      <Card.Body>
        <FileSelector />
        <FilesTable />
      </Card.Body>
    </Card>
  );
};

export default App;
