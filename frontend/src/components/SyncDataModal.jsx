import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles, 
  ShieldCheck, 
  Database, 
  Laptop, 
  Globe,
  FileText,
  ClipboardPaste,
  Code2,
  Zap
} from 'lucide-react';
import { syncEnterpriseMasterData } from '../utils/enterpriseSync';

export const SyncDataModal = ({ isOpen, onClose, initialTab = 'copy' }) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'copy' | 'paste' | 'master'
  const [copied, setCopied] = useState(false);
  const [pasteString, setPasteString] = useState('');
  const [importStatus, setImportStatus] = useState(null);
  const [statusType, setStatusType] = useState('info'); // info, success, error
  const [isSyncingMaster, setIsSyncingMaster] = useState(false);
  const [currentExportJson, setCurrentExportJson] = useState('');
  const [exportKeyCount, setExportKeyCount] = useState(0);

  // Extract all platform-related keys from localStorage (Infosys Standard)
  const getExportData = () => {
    const exportPayload = {};
    if (typeof localStorage === 'undefined') return exportPayload;

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

  // Pre-generate export JSON when modal opens or on focus
  useEffect(() => {
    if (isOpen) {
      try {
        const data = getExportData();
        const str = JSON.stringify(data, null, 2);
        setCurrentExportJson(str);
        setExportKeyCount(Object.keys(data).length);
        setImportStatus(null);
        setPasteString('');
      } catch (err) {
        console.warn('Error reading localStorage for export:', err);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Copy stringified sync data to clipboard
  const handleCopySyncString = () => {
    try {
      const data = getExportData();
      const count = Object.keys(data).length;
      const str = JSON.stringify(data, null, 2);
      navigator.clipboard.writeText(str).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
        setStatusType('success');
        setImportStatus(`Copied full JSON (${count} records) to clipboard! Now open your Vercel deployment and paste it under "Paste JSON".`);
      }).catch(() => {
        // Fallback: select textarea
        const textarea = document.getElementById('export-json-textarea');
        if (textarea) {
          textarea.select();
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
          setStatusType('success');
          setImportStatus('Copied to clipboard via selection! Paste into Vercel.');
        } else {
          setStatusType('error');
          setImportStatus('Clipboard blocked. Please click "Select All" below and copy manually.');
        }
      });
    } catch (err) {
      setStatusType('error');
      setImportStatus('Error preparing sync data.');
    }
  };

  // Download Backup JSON file
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
      setImportStatus(`Downloaded backup (${count} keys)! Now open your Vercel deployment link and upload/paste this file.`);
    } catch (err) {
      setStatusType('error');
      setImportStatus('Failed to download backup file. Please use the "Copy JSON" option.');
    }
  };

  // Apply parsed data into browser localStorage
  const applyData = (data) => {
    let count = 0;
    try {
      Object.entries(data).forEach(([k, v]) => {
        if (typeof v === 'string') {
          localStorage.setItem(k, v);
          count++;
        } else if (typeof v === 'object' && v !== null) {
          localStorage.setItem(k, JSON.stringify(v));
          count++;
        }
      });

      // Dispatch global sync notification event
      try {
        window.dispatchEvent(new CustomEvent('skillgap_data_synced', { detail: { timestamp: Date.now() } }));
      } catch (_) {}

      setStatusType('success');
      setImportStatus(`Success! Restored ${count} data records into this browser. Refreshing in 1 second...`);
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err) {
      setStatusType('error');
      setImportStatus('Error restoring data into storage: ' + err.message);
    }
  };

  // Paste JSON apply handler
  const handleApplyPasteJson = () => {
    const raw = pasteString.trim();
    if (!raw) {
      setStatusType('error');
      setImportStatus('Please paste the copied JSON text first.');
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        applyData(parsed);
      } else {
        setStatusType('error');
        setImportStatus('Invalid JSON data format. Expected an object containing key-value pairs.');
      }
    } catch (e) {
      setStatusType('error');
      setImportStatus('Could not parse JSON. Please verify that the entire text was copied and try again.');
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-y-auto max-h-[92vh] font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/20">
              <RefreshCw className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Enterprise Data Sync</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  isVercelHost 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                    : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                }`}>
                  {isVercelHost ? 'Vercel Deployment' : 'Localhost Terminal'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Copy JSON from your local project admin and paste into Vercel to recover all data
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

        {/* Tab Selector: Copy JSON vs Paste JSON vs Instant */}
        <div className="mt-4 grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold font-tech">
          <button
            type="button"
            onClick={() => setActiveTab('copy')}
            className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'copy'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>1. Copy JSON</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'paste'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span>2. Paste JSON</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('master')}
            className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'master'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>3. 1-Click Master</span>
          </button>
        </div>

        {/* Status Notification Banner */}
        {importStatus && (
          <div className={`mt-4 p-3.5 rounded-2xl text-xs font-semibold flex items-start gap-2 border ${
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

        {/* Tab 1: COPY JSON (FROM LOCALHOST) */}
        {activeTab === 'copy' && (
          <div className="mt-4 space-y-3">
            <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-950 dark:text-sky-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Laptop className="w-4 h-4 text-sky-500" />
                  <span>Step 1: Copy JSON From Local Project</span>
                </span>
                <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-900 px-2 py-0.5 rounded-full">
                  {exportKeyCount} Records Ready
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Click <strong>"Copy JSON to Clipboard"</strong> below. Then open your Vercel link, switch to <strong>"2. Paste JSON"</strong>, and click Apply.
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleCopySyncString}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'JSON Copied to Clipboard!' : 'Copy JSON to Clipboard'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .json File</span>
                </button>
              </div>
            </div>

            {/* Readonly Textarea for manual copy */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>Exported JSON Payload ({exportKeyCount} keys):</span>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('export-json-textarea');
                    if (el) {
                      el.select();
                      document.execCommand('copy');
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2500);
                    }
                  }}
                  className="text-sky-600 hover:text-sky-700 font-bold text-[11px] cursor-pointer"
                >
                  Select All & Copy
                </button>
              </div>
              <textarea
                id="export-json-textarea"
                readOnly
                value={currentExportJson}
                className="w-full h-40 p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-[11px] font-mono text-slate-700 dark:text-slate-300 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Tab 2: PASTE JSON (INTO VERCEL) */}
        {activeTab === 'paste' && (
          <div className="mt-4 space-y-3">
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-indigo-500" />
                  <span>Step 2: Paste JSON Into Vercel</span>
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-300 font-medium">
                  (Run on Vercel deployment)
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Paste the JSON string copied from your local project admin into the box below and click <strong>"Apply & Restore All Data"</strong>:
              </p>

              {/* Paste Textarea */}
              <div className="space-y-2">
                <textarea
                  value={pasteString}
                  onChange={(e) => setPasteString(e.target.value)}
                  placeholder='Paste your copied JSON code here... e.g. { "skillgap_profiles_db": "..." }'
                  className="w-full h-44 p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
                  <button
                    type="button"
                    onClick={handleApplyPasteJson}
                    className="w-full sm:w-auto flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Apply & Restore All Data</span>
                  </button>

                  <label className="w-full sm:w-auto py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700">
                    <Upload className="w-4 h-4" />
                    <span>Or Upload .json File</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 1-CLICK MASTER RECOVERY */}
        {activeTab === 'master' && (
          <div className="mt-4 space-y-3">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-400/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-amber-500" />
                  <span>Instant Master Data Recovery (No File Needed)</span>
                </span>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full">
                  Built-in Local Dataset
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Directly restore all candidate dossiers (including <strong>Omkar Kakumanu</strong>, <strong>Devansh Verma</strong>, <strong>Sarah Johnson</strong>, <strong>Priya Sharma</strong>), accounts, passwords, PDF resumes, 10/10 technical interviews, and cert requests into this browser session immediately.
              </p>
              <button
                type="button"
                onClick={handleInstantMasterRecovery}
                disabled={isSyncingMaster}
                className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 active:scale-[0.99] text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingMaster ? 'animate-spin' : ''}`} />
                <span>{isSyncingMaster ? 'Restoring All Master Data...' : '⚡ Restore All Local Device Data into Vercel'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>100% private in-browser sync. Works offline & across domains.</span>
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
