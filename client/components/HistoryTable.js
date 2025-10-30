"use client";
import { useState, useEffect } from "react";
import { fetchHistory, triggerImport } from "../utils/api";

export default function HistoryTable() {
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [importing, setImporting] = useState(false);
  const itemsPerPage = 10;

  // retry logic + exponential backoff
  const fetchWithRetry = async (retries = 3, delay = 1000) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchHistory();
      setHistory(response.data || response);
    } catch (err) {
      if (retries > 0) {
        setTimeout(() => fetchWithRetry(retries - 1, delay * 2), delay);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithRetry();

    // polling every 15s for real-time updates
    const interval = setInterval(() => fetchWithRetry(1, 1000), 15000);
    return () => clearInterval(interval);
  }, []);

  // pagination
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const currentData = history.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => setCurrentPage(page);

  const formatTimestamp = (ts) =>
    ts ? new Date(ts).toLocaleString() : "N/A";

  const truncateUrl = (url, max = 60) =>
    !url || url.length <= max ? url : url.substring(0, max) + "...";

  const handleImport = async () => {
    try {
      setImporting(true);
      const res = await triggerImport();
      alert(`✅ Import triggered successfully!\nImported: ${res.totalFetched || 0} jobs`);
      fetchWithRetry();
    } catch (err) {
      alert(`Failed to trigger import: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading import history...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );

  return (
    <div className="container">
      {/* Header with Import button on the right */}
     

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>FileName (URL)</th>
            <th>Import DateTime</th>
            <th>Total</th>
            <th>New</th>
            <th>Updated</th>
            <th>Failed</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((log, i) => (
            <tr key={i}>
              <td className="filename" title={log.fileName || "N/A"}>
                {truncateUrl(log.fileName || "N/A")}
              </td>
              <td className="timestamp">{formatTimestamp(log.timestamp)}</td>
              <td className="stats total">{log.totalFetched || 0}</td>
              <td className="stats new">{log.newJobs || 0}</td>
              <td className="stats updated">{log.updatedJobs || 0}</td>
              <td className="stats failed">{log.failedJobs || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty state */}
      {history.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No import history available yet. Trigger an import to get started!
        </div>
      )}

      {/* Pagination (centered below the table) */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
