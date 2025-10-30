'use client';

import { useState } from 'react';
import HistoryTable from '../components/HistoryTable';
import { triggerImport } from '../utils/api';

export default function Home() {
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState('');

  const handleImport = async () => {
    try {
      setImporting(true);
      setImportMessage('');
      await triggerImport();
      setImportMessage('Import triggered successfully! Check history for updates.');
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setImportMessage(`Error: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <main className="container">
      <h1>Job Import History Tracking</h1>
      <button onClick={handleImport} disabled={importing}>
        {importing ? 'Importing...' : 'Trigger Job Import'}
      </button>
      {importMessage && <p>{importMessage}</p>}
      <HistoryTable />
    </main>
  );
}