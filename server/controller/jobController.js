import fetchJobs from '../services/jobFetcher.js';
import ImportLog from '../model/ImportLogs.js';

export const importJobs = async (req, res) => {
  try {
    await fetchJobs();

    return res.status(200).json({
      success: true,
      message: 'Job import process started successfully',
    });
  } catch (error) {
    console.error('Error importing jobs:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to import jobs',
      error: error.message,
    });
  }
};

export const getImportHistory = async (req, res) => {
  try {
    const logs = await ImportLog.find().sort({ timestamp: -1 });
    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error('Error fetching import history:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch import history',
      error: error.message,
    });
  }
};

