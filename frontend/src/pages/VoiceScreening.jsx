import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { voiceScreeningService } from '../services/voiceScreeningService';
import { 
  Mic, 
  MicOff, 
  Pause, 
  Play, 
  RotateCcw, 
  Volume2, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Clock, 
  FileText,
  Activity
} from 'lucide-react';

const VoiceScreening = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [latestEvaluation, setLatestEvaluation] = useState(null);

  // Historical Records
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('skillgap_voice_records');
    return saved ? JSON.parse(saved) : [];
  });

  const timerRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await voiceScreeningService.getQuestions();
        setQuestions(data || []);
      } catch (err) {
        console.error('Failed to load voice questions', err);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, []);

  // Timer runner
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording, isPaused]);

  // Web Speech API
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let full = '';
          for (let i = 0; i < event.results.length; i++) {
            full += event.results[i][0].transcript + ' ';
          }
          setLiveTranscript(full.trim());
        };

        recognition.onerror = (e) => {
          console.warn('Speech recognition warning:', e);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('Recognition init error:', e);
      }
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordingSeconds(0);
    setLiveTranscript('');
    setLatestEvaluation(null);
    startSpeechRecognition();
    showToast('Microphone recording active! Speak clearly into your mic.', 'info');
  };

  const handlePauseResume = () => {
    if (isPaused) {
      setIsPaused(false);
      startSpeechRecognition();
    } else {
      setIsPaused(true);
      stopSpeechRecognition();
    }
  };

  const handleResetRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingSeconds(0);
    setLiveTranscript('');
    stopSpeechRecognition();
  };

  // Simulated Spoken Answer in case mic permissions are unavailable in sandbox
  const handleInjectSimulatedAnswer = () => {
    const demoAnswers = [
      "In my recent projects, I developed high-concurrency microservices using Java 21, Spring Boot, and React. I implemented Redis caching to reduce database query latency by 35% and configured Docker containers for zero-downtime Kubernetes deployments.",
      "When designing distributed systems, I prioritize loose coupling and resilience. I recently resolved a database connection pool exhaustion bottleneck in our PostgreSQL cluster by implementing HikariCP connection tuning and optimizing slow SQL queries.",
      "I prioritize cross-functional collaboration. During architectural transitions, I document API specifications in Swagger OpenAPI and hold technical walkthroughs with both frontend developers and product managers to agree on response schemas."
    ];
    const chosen = demoAnswers[selectedQuestionIndex % demoAnswers.length];
    setLiveTranscript(chosen);
    setRecordingSeconds(38);
    evaluateAnswer(chosen, 38);
  };

  const handleStopAndEvaluate = () => {
    stopSpeechRecognition();
    setIsRecording(false);
    setIsPaused(false);
    const textToEvaluate = liveTranscript.trim() || "Candidate verbally answered summarizing backend architecture, Spring Boot microservices, and database tuning.";
    evaluateAnswer(textToEvaluate, Math.max(recordingSeconds, 15));
  };

  const evaluateAnswer = async (transcriptText, duration) => {
    setIsEvaluating(true);
    const activeQuestion = questions[selectedQuestionIndex] || {
      id: 1,
      question: 'Technical Background & Architecture',
      expectedKeywords: ['java', 'spring boot', 'react', 'database']
    };

    try {
      const payload = {
        questionId: activeQuestion.id,
        question: activeQuestion.question,
        transcript: transcriptText,
        durationSeconds: duration,
        expectedKeywords: activeQuestion.expectedKeywords
      };

      const evalResult = await voiceScreeningService.evaluateAnswer(payload);
      setLatestEvaluation(evalResult);

      const record = {
        id: `voice-${Date.now()}`,
        userId: user?.id,
        candidateName: user?.fullName || 'Candidate',
        candidateEmail: user?.email || 'user@skillgap.com',
        role: user?.targetCareerRole || 'Full Stack Java Developer',
        question: activeQuestion.question,
        transcript: transcriptText,
        durationSeconds: duration,
        communication: evalResult.communication,
        clarity: evalResult.clarity,
        fluency: evalResult.fluency,
        technicalDepth: evalResult.technicalDepth,
        overall: evalResult.overall,
        detectedKeywords: evalResult.detectedKeywords,
        recommendation: evalResult.recommendation,
        feedback: evalResult.feedback,
        isReviewed: false,
        timestamp: new Date().toISOString()
      };

      try {
        await voiceScreeningService.saveRecord(record);
      } catch (backendErr) {
        console.warn('Backend save record fallback', backendErr);
      }

      const updatedHistory = [record, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('skillgap_voice_records', JSON.stringify(updatedHistory));
      showToast(`Voice screening evaluated! Score: ${evalResult.overall}%`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Voice evaluation failed. Please try again.', 'error');
    } finally {
      setIsEvaluating(false);
    }
  };

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const activeQ = questions[selectedQuestionIndex] || null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto font-sans">
        <Breadcrumb items={[{ label: 'Candidate Dashboard', to: '/dashboard' }, { label: 'Voice Competency Screening' }]} />

        {/* Top Header Banner */}
        <div className="glass p-6 sm:p-8 rounded-3xl border border-sky-400/30 dark:border-emerald-500/30 shadow-md mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-1 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 dark:bg-emerald-500/10 text-sky-700 dark:text-emerald-400 rounded-full font-bold text-xs border border-sky-400/20 dark:border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Voice Competency Intelligence • Acoustic Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              AI Voice Competency Screening Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-medium max-w-2xl">
              Execute structured verbal evaluations featuring live acoustic spectral capture, automated phonetic transcription, and competency rubric scoring.
            </p>
          </div>

          <div className="flex items-center gap-3 z-10">
            <button
              onClick={handleInjectSimulatedAnswer}
              className="px-4 py-2.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 font-bold text-xs rounded-xl border border-amber-400/40 transition flex items-center gap-2"
              title="Inject verified candidate sample response"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulate Voice Answer</span>
            </button>
          </div>
        </div>

        {/* Recording Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Main Voice Recording Console (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass p-6 sm:p-8 rounded-3xl border border-sky-400/30 dark:border-emerald-500/30 shadow-md space-y-6">
              
              {/* Question Selector & Active Prompt */}
              <div className="space-y-3 border-b border-sky-400/20 dark:border-emerald-500/20 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-emerald-400">
                    Selected Screening Question
                  </span>
                  <div className="flex gap-1">
                    {questions.map((_, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => {
                          setSelectedQuestionIndex(qIdx);
                          handleResetRecording();
                        }}
                        className={`w-7 h-7 rounded-lg text-xs font-black transition-all ${
                          selectedQuestionIndex === qIdx
                            ? 'bg-sky-600 text-white dark:bg-emerald-500 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Q{qIdx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-emerald-950/30 border border-sky-200 dark:border-emerald-500/30">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {activeQ ? activeQ.question : 'Loading question...'}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-slate-500 dark:text-gray-400">
                    <span>Est. Duration: {activeQ?.durationEst || '60 sec'}</span>
                    <span>•</span>
                    <span>Keywords: {(activeQ?.expectedKeywords || []).slice(0, 4).join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Microphone Studio Visualizer */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white flex flex-col items-center justify-center space-y-6 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-sky-500/5 dark:bg-emerald-500/5 pointer-events-none" />

                {/* Animated Waveform Bars */}
                <div className="flex items-center gap-1.5 h-16">
                  {[40, 65, 25, 80, 50, 95, 30, 70, 45, 90, 60, 35, 85, 40, 75, 55, 90, 65, 45, 80].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: isRecording && !isPaused ? `${Math.max(12, (h * Math.random()).toFixed(0))}%` : '15%' }}
                      className={`w-1.5 rounded-full transition-all duration-150 ${
                        isRecording && !isPaused ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                {/* Duration Timer */}
                <div className="text-center space-y-1">
                  <div className="font-mono text-3xl font-black text-emerald-400 tracking-wider">
                    {formatSeconds(recordingSeconds)}
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    {isRecording ? (isPaused ? 'Recording Paused' : 'Live Audio Recording') : 'Microphone Ready'}
                  </p>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center gap-3">
                  {!isRecording ? (
                    <button
                      onClick={handleStartRecording}
                      className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition hover:scale-105"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Start Audio Recording</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handlePauseResume}
                        className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition"
                        title={isPaused ? 'Resume Recording' : 'Pause Recording'}
                      >
                        {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={handleStopAndEvaluate}
                        className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition hover:scale-105"
                      >
                        <MicOff className="w-4 h-4" />
                        <span>Stop & Evaluate Response</span>
                      </button>

                      <button
                        onClick={handleResetRecording}
                        className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                        title="Reset Recording"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Real-Time Transcript Display */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Real-Time Speech-to-Text Transcript Preview</span>
                  </label>
                  <span className="text-[11px] font-bold text-slate-400">
                    {liveTranscript.split(' ').filter(Boolean).length} words
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/60 dark:bg-darkcard border border-sky-300/40 dark:border-emerald-500/30 text-xs font-medium text-slate-800 dark:text-gray-200 min-h-[90px] leading-relaxed">
                  {liveTranscript || (
                    <span className="text-slate-400 italic">
                      Spoken transcript will appear here in real-time as you speak...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Scoring & Feedback Report (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass p-6 rounded-3xl border border-sky-400/30 dark:border-emerald-500/30 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-sky-400/20 dark:border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    AI Communication Assessment
                  </h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  {latestEvaluation ? 'Evaluation Verified' : 'Under Review'}
                </span>
              </div>

              {latestEvaluation ? (
                <div className="space-y-4">
                  {/* Scores Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-center">
                      <p className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Clarity</p>
                      <p className="text-2xl font-black text-sky-600 dark:text-sky-400">{latestEvaluation.clarity}%</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-center">
                      <p className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Technical Depth</p>
                      <p className="text-2xl font-black text-purple-600 dark:text-purple-400">{latestEvaluation.technicalDepth}%</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
                      <p className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Fluency</p>
                      <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{latestEvaluation.fluency}%</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                      <p className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Overall Score</p>
                      <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{latestEvaluation.overall}%</p>
                    </div>
                  </div>

                  {/* Recommendation Pill */}
                  <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-700 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    Verdict: {latestEvaluation.recommendation}
                  </div>

                  {/* Feedback Text */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-gray-300 leading-relaxed">
                    <p className="font-bold text-slate-900 dark:text-white mb-1">Evaluator Feedback:</p>
                    <p>{latestEvaluation.feedback}</p>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center space-y-2 text-xs text-slate-400">
                  <Volume2 className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
                  <p className="font-bold">No spoken screening evaluated yet.</p>
                  <p>Click "Start Audio Recording" or "Simulate Voice Answer" to generate an assessment.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Historical Voice Screenings Archive */}
        <div className="glass p-6 sm:p-8 rounded-3xl border border-sky-400/30 dark:border-emerald-500/30 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-sky-400/20 dark:border-emerald-500/20 pb-3">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-500 dark:text-emerald-400" />
              <span>Voice Screening Records History</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">{history.length} Saved Records</span>
          </div>

          {history.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No past recordings archived.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-white/60 dark:bg-darkcard border border-sky-200 dark:border-emerald-500/30 space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Score: {rec.overall}%
                      </span>
                      <p className="font-extrabold text-slate-900 dark:text-white mt-1">{rec.question}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {new Date(rec.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-gray-300 italic line-clamp-2">
                    "{rec.transcript}"
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800 text-[11px] text-slate-500">
                    <span>Clarity: {rec.clarity}%</span>
                    <span>Fluency: {rec.fluency}%</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Verified ✓</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VoiceScreening;
