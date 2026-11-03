import React, { useState } from 'react';
import { X, Download, Upload, Copy, Check, RefreshCw, Sparkles, ShieldCheck, Database, Laptop, Globe } from 'lucide-react';
import { syncEnterpriseMasterData } from '../utils/enterpriseSync';

export const SyncDataModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [pasteString, setPasteString] = useState('');
  const [importStatus, setImportStatus] = useState(null);
  const [statusType, setStatusType] = useState('info'); // info, success, error
  const [isSyncingMaster, setIsSyncingMaster] = useState(false);

  if (!isOpen) return null;

  // Extract all platform-related keys from localStorage
  const getExportData = () => {
    const exportPayload = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith('skillgap_') ||
          key.startsWith('rc_') ||
          key.startsWith('copilot_') ||
          key === 'user' ||
          key === 'token' ||
          key === 'theme' ||
          key === 'sidebar_collapsed' ||
          key === 'sidebar_position')
      ) {
        const val = localStorage.getItem(key);
        if (val) exportPayload[key] = val;
      }
    }
    return exportPayload;
  };

  // Download Backup JSON
  const handleDownloadJson = () => {
    try {
      const data = getExportData();
      const count = Object.keys(data).length;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smart_job_market_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusType('success');
      setImportStatus(`Downloaded backup (${count} keys)! Now open your Vercel deployment link and import this file.`);
    } catch (err) {
      setStatusType('error');
      setImportStatus('Failed to download backup file. Please try the "Copy Sync Code" option.');
    }
  };

  // Copy stringified sync data to clipboard
  const handleCopySyncString = () => {
    try {
      const data = getExportData();
      const count = Object.keys(data).length;
      const str = JSON.stringify(data);
      navigator.clipboard.writeText(str).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        setStatusType('success');
        setImportStatus(`Sync code copied (${count} keys)! Paste it on your Vercel deployment to restore everything.`);
      }).catch(() => {
        setStatusType('error');
        setImportStatus('Clipboard blocked. Please use the "Download Backup" option instead.');
      });
    } catch (err) {
      setStatusType('error');
      setImportStatus('Error preparing sync data.');
    }
  };

  // Apply parsed data into browser localStorage
  const applyData = (data) => {
    let count = 0;
    Object.entries(data).forEach(([k, v]) => {
      if (typeof v === 'string') {
        localStorage.setItem(k, v);
        count++;
      } else if (typeof v === 'object' && v !== null) {
        localStorage.setItem(k, JSON.stringify(v));
        count++;
      }
    });

    try {
      window.dispatchEvent(new CustomEvent('skillgap_data_synced', { detail: { timestamp: Date.now() } }));
    } catch (_) {}

    setStatusType('success');
    setImportStatus(`Success! Restored ${count} data records into this browser. Refreshing in 1 second...`);
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  // File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        if (typeof parsed === 'object' && parsed !== null) {
          applyData(parsed);
        } else {
          setStatusType('error');
          setImportStatus('Invalid JSON format in the uploaded backup file.');
        }
      } catch (err) {
        setStatusType('error');
        setImportStatus('Error reading file. Please ensure it is a valid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Paste string apply handler
  const handleApplyPasteString = () => {
    if (!pasteString.trim()) {
      setStatusType('error');
      setImportStatus('Please paste your sync code first.');
      return;
    }
    try {
      const parsed = JSON.parse(pasteString.trim());
      if (typeof parsed === 'object' && parsed !== null) {
        applyData(parsed);
      } else {
        setStatusType('error');
        setImportStatus('Invalid sync string format.');
      }
    } catch (e) {
      setStatusType('error');
      setImportStatus('Could not parse sync string. Please check the text and try again.');
    }
  };

  // Instant 1-Click Master Data Recovery
  const handleInstantMasterRecovery = () => {
    setIsSyncingMaster(true);
    try {
      const res = syncEnterpriseMasterData({ force: true });
      try {
        window.dispatchEvent(new CustomEvent('skillgap_data_synced', { detail: { timestamp: Date.now() } }));
      } catch (_) {}
      setStatusType('success');
      setImportStatus(
        `Instant Master Data Loaded! Recovered ${res.accountsCount} user accounts, ${res.candidatesCount} candidate dossiers (Omkar Kakumanu, Devansh Verma, Sarah Johnson, Priya Sharma, etc.), ${res.resumesCount} resumes, ${res.certRequestsCount} certificates, and ${res.jobsCount} job requisitions. Refreshing in 1s...`
      );
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err) {
      setStatusType('error');
      setImportStatus('Failed to load master dataset: ' + err.message);
      setIsSyncingMaster(false);
    }
  };

  const isVercelHost = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-y-auto max-h-[92vh] font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/20">
              <RefreshCw className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Enterprise Data Sync</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-bold uppercase tracking-wider">
                  {isVercelHost ? 'Vercel Deployment' : 'Localhost Device'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sync candidates, resumes, test scores & accounts between Localhost and Vercel
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-5 space-y-5">
          {importStatus && (
            <div className={`p-3.5 rounded-2xl text-xs font-semibold flex items-start gap-2 border ${
              statusType === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : statusType === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                : 'bg-sky-50 dark:bg-sky-950/50 border-sky-300 dark:border-sky-800 text-sky-900 dark:text-sky-200'
            }`}>
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
              <div className="leading-relaxed">{importStatus}</div>
            </div>
          )}

          {/* Option A: 1-Click Instant Master Data Restore (Especially for Vercel) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-400/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-4 h-4 text-amber-500" />
                <span>1-Click Restore All Local Device Data</span>
              </span>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full">
                Recommended for Vercel
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Instantly seed all accounts, candidates (including Omkar Kakumanu, Devansh Verma, Sarah Johnson, Priya Sharma), PDF resumes, 10/10 technical interviews, voice screenings, cert requests, and enterprise job postings into this browser.
            </p>
            <button
              type="button"
              onClick={handleInstantMasterRecovery}
              disabled={isSyncingMaster}
              className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 active:scale-[0.99] text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingMaster ? 'animate-spin' : ''}`} />
              <span>{isSyncingMaster ? 'Restoring All Master Data...' : '⚡ Restore All Local Device Data into Vercel'}</span>
            </button>
          </div>

          {/* Step 1: Export from Localhost */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Laptop className="w-4 h-4 text-sky-500" />
                <span>Step 1: Export From Localhost</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">(Run on your local browser)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Export custom candidates, interview recordings, and new job requisitions from your local terminal session:
            </p>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleDownloadJson}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Backup (.json)</span>
              </button>
              <button
                type="button"
                onClick={handleCopySyncString}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied Code!' : 'Copy Sync Code'}</span>
              </button>
            </div>
          </div>

          {/* Step 2: Import into Vercel */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-500" />
                <span>Step 2: Import Into Vercel</span>
              </span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">(Run on your Vercel link)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Upload the downloaded backup file or paste your sync code to restore everything immediately:
            </p>
            <div className="space-y-2.5 pt-1">
              <label className="flex items-center justify-center gap-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Upload Backup File (.json)</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={pasteString}
                  onChange={(e) => setPasteString(e.target.value)}
                  placeholder="Or paste sync code here..."
                  className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleApplyPasteString}
                  className="py-2 px-4 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0 border border-slate-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Zero server setup required. 100% private in-browser synchronization.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SyncDataModal;
