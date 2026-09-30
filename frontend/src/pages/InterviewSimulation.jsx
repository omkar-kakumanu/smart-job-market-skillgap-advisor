import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import SkeletonLoader from '../components/SkeletonLoader';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { interviewService } from '../services/interviewService';
import { 
  Bot, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Award, 
  BookOpen, 
  HelpCircle,
  Clock,
  Check
} from 'lucide-react';

const InterviewSimulation = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [role, setRole] = useState(user?.targetCareerRole || 'Full Stack Java Developer');
  const [questions, setQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  
  // Interactive Answering
  const [answerInput, setAnswerInput] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  // Multi-Attempt History Management
  const [attempts, setAttempts] = useState(() => {
    const saved = localStorage.getItem('skillgap_interview_attempts');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentAttemptNumber, setCurrentAttemptNumber] = useState(1);
  const [currentAttemptResponses, setCurrentAttemptResponses] = useState([]);
  const [expandedAttempts, setExpandedAttempts] = useState({ 1: true });

  const availableRoles = [
    'Full Stack Java Developer',
    'Senior Machine Learning Engineer',
    'Frontend React & UI Engineer',
    'Cloud Native DevOps Engineer'
  ];

  // Fetch Questions from Java Backend
  useEffect(() => {
    const loadQuestions = async () => {
      setLoadingQuestions(true);
      try {
        const data = await interviewService.getQuestions({ role, category: 'ALL' });
        setQuestions(data || []);
      } catch (err) {
        console.error('Failed to load questions from backend', err);
      } finally {
        setLoadingQuestions(false);
      }
    };
    loadQuestions();
  }, [role]);

  // Determine current attempt counter
  useEffect(() => {
    if (attempts.length > 0) {
      const maxAtt = Math.max(...attempts.map(a => a.attemptNumber || 1));
      setCurrentAttemptNumber(maxAtt + 1);
    } else {
      setCurrentAttemptNumber(1);
    }
  }, [attempts]);

  const activeQuestion = questions[activeQuestionIndex] || null;

  // Toggle attempt collapse
  const toggleAttemptExpand = (attemptNum) => {
    setExpandedAttempts(prev => ({ ...prev, [attemptNum]: !prev[attemptNum] }));
  };

  // Submit Answer & Evaluate via Java Backend
  const handleAnswerSubmit = async () => {
    if (!activeQuestion) return;
    if (activeQuestion.type === 'objective' && selectedOption === null) {
      showToast('Please select one of the multiple-choice options (A, B, C, or D).', 'warning');
      return;
    }
    if (activeQuestion.type === 'descriptive' && !answerInput.trim()) {
      showToast('Please provide an answer before submitting for AI grading.', 'warning');
      return;
    }

    setIsEvaluating(true);
    try {
      const payload = {
        questionId: activeQuestion.id,
        questionText: activeQuestion.question,
        questionType: activeQuestion.type,
        candidateAnswer: activeQuestion.type === 'objective' 
          ? (activeQuestion.options ? activeQuestion.options[selectedOption] : `Option ${selectedOption}`) 
          : answerInput,
        selectedOptionIndex: selectedOption,
        correctOptionIndex: activeQuestion.correctOptionIndex,
        correctExplanation: activeQuestion.correctExplanation,
        category: activeQuestion.category
      };

      const evalResult = await interviewService.evaluateResponse(payload);

      const responseDetail = {
        questionIndex: activeQuestionIndex + 1,
        question: activeQuestion.question,
        questionType: activeQuestion.type,
        answer: payload.candidateAnswer,
        selectedOptionIndex: selectedOption,
        isCorrect: evalResult.isCorrect,
        clarity: evalResult.clarity,
        relevance: evalResult.relevance,
        overall: evalResult.overall,
        feedback: evalResult.feedback
      };

      const updatedCurrentResponses = [...currentAttemptResponses, responseDetail];
      setCurrentAttemptResponses(updatedCurrentResponses);

      // If finished all 10 questions, persist attempt session
      if (updatedCurrentResponses.length >= 10 || activeQuestionIndex >= questions.length - 1) {
        const avgClarity = Math.round(updatedCurrentResponses.reduce((sum, r) => sum + r.clarity, 0) / updatedCurrentResponses.length);
        const avgRelevance = Math.round(updatedCurrentResponses.reduce((sum, r) => sum + r.relevance, 0) / updatedCurrentResponses.length);
        const overallScore = Math.round((avgClarity + avgRelevance) / 2);

        const attemptSession = {
          id: `att-${Date.now()}`,
          userId: user?.id,
          candidateName: user?.fullName || 'Candidate',
          role: role,
          attemptNumber: currentAttemptNumber,
          completedQuestions: updatedCurrentResponses.length,
          totalQuestions: 10,
          avgClarity,
          avgRelevance,
          overallScore,
          status: 'COMPLETED',
          responses: updatedCurrentResponses,
          timestamp: new Date().toISOString()
        };

        try {
          await interviewService.saveAttempt(attemptSession);
        } catch (backendErr) {
          console.warn('Backend attempt save fallback to local storage', backendErr);
        }

        const newAttemptsList = [attemptSession, ...attempts];
        setAttempts(newAttemptsList);
        localStorage.setItem('skillgap_interview_attempts', JSON.stringify(newAttemptsList));
        setExpandedAttempts(prev => ({ ...prev, [currentAttemptNumber]: true }));
        showToast(`Attempt #${currentAttemptNumber} Completed! Score: ${overallScore}%`, 'success');
      } else {
        // Advance to next question
        setActiveQuestionIndex(prev => prev + 1);
        showToast('Question evaluated! Advancing to next question...', 'info');
      }

      // Reset input fields
      setAnswerInput('');
      setSelectedOption(null);
    } catch (err) {
      console.error(err);
      showToast('Evaluation failed. Please try again.', 'error');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Start fresh attempt
  const handleStartNewAttempt = () => {
    setCurrentAttemptResponses([]);
    setActiveQuestionIndex(0);
    setAnswerInput('');
    setSelectedOption(null);
    const nextNum = attempts.length > 0 ? Math.max(...attempts.map(a => a.attemptNumber || 1)) + 1 : 1;
    setCurrentAttemptNumber(nextNum);
    showToast(`Started fresh Attempt #${nextNum}. Ready for Question 1!`, 'info');
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto font-sans">
        <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'AI Interview Simulation' }]} />

        {/* Top Header Banner */}
        <div className="glass p-6 sm:p-8 rounded-3xl border border-sky-400/30 dark:border-emerald-500/30 shadow-md mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-1 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 dark:bg-emerald-500/10 text-sky-700 dark:text-emerald-400 rounded-full font-bold text-xs border border-sky-400/20 dark:border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-emerald-400 animate-pulse" />
              <span>Neural AI Interview Simulator • Java Spring Boot Backend</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              AI Interview Simulation & Multi-Attempt Practice
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-medium max-w-2xl">
              10 role-tailored questions (5 descriptive + 5 objective MCQs) with interactive answering, automatic score evaluation, and attempt-by-attempt history tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 z-10">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1">
                Target Role
              </label>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setActiveQuestionIndex(0);
                  setCurrentAttemptResponses([]);
                }}
                className="px-4 py-2.5 rounded-xl border border-sky-400/40 dark:border-emerald-500/30 bg-white/80 dark:bg-darkcard text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {availableRoles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleStartNewAttempt}
              className="mt-4 px-4 py-2.5 text-xs font-extrabold text-white gradient-btn rounded-xl shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start New Attempt</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Left Active Question & Simulation Console (7 cols) + Right Question Bank & Attempts (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Active Question & Interactive Chat Simulator (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass p-6 sm:p-8 rounded-3xl border border-sky-400/30 dark:border-emerald-500/30 shadow-md space-y-6">
              
              <div className="flex items-center justify-between border-b border-sky-400/20 dark:border-emerald-500/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500/10 dark:bg-emerald-500/10 text-sky-600 dark:text-emerald-400 flex items-center justify-center font-black">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      Live Simulation Console • Attempt #{currentAttemptNumber}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                      Question {activeQuestionIndex + 1} of {questions.length || 10}
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 bg-sky-100 dark:bg-emerald-950/60 text-sky-700 dark:text-emerald-300 rounded-full font-extrabold text-xs border border-sky-300 dark:border-emerald-500/40">
                  {currentAttemptResponses.length}/10 Completed
                </span>
              </div>

              {loadingQuestions ? (
                <div className="py-12 text-center space-y-3">
                  <SkeletonLoader height="h-24" />
                  <p className="text-xs font-bold text-slate-400">Loading 10 role questions from Spring Boot engine...</p>
                </div>
              ) : activeQuestion ? (
                <div className="space-y-6">
                  {/* Question Card */}
                  <div className="p-5 rounded-2xl bg-sky-50/70 dark:bg-emerald-950/30 border border-sky-200 dark:border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        activeQuestion.type === 'objective'
                          ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700'
                          : 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                      }`}>
                        {activeQuestion.type === 'objective' ? 'Objective MCQ' : 'Descriptive Question'}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-gray-400">
                        Category: {activeQuestion.category}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-relaxed">
                      {activeQuestion.question}
                    </h4>

                    {activeQuestion.tags && (
                      <p className="text-xs font-semibold text-sky-600 dark:text-emerald-400">
                        Tags: {activeQuestion.tags}
                      </p>
                    )}
                  </div>

                  {/* Interactive Input Form */}
                  {activeQuestion.type === 'objective' ? (
                    <div className="space-y-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                        Select Correct Option (1-Click Grading):
                      </p>
                      <div className="grid grid-cols-1 gap-2.5">
                        {(activeQuestion.options || []).map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => setSelectedOption(oIdx)}
                            className={`p-3.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                              selectedOption === oIdx
                                ? 'bg-sky-500/15 dark:bg-emerald-500/20 border-sky-500 dark:border-emerald-400 text-sky-900 dark:text-emerald-200 shadow-sm'
                                : 'bg-white/60 dark:bg-darkcard border-gray-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 hover:border-sky-400'
                            }`}
                          >
                            <span>{opt}</span>
                            {selectedOption === oIdx && (
                              <Check className="w-4 h-4 text-sky-600 dark:text-emerald-400 shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                        Your Detailed Technical Response:
                      </label>
                      <textarea
                        rows={5}
                        value={answerInput}
                        onChange={(e) => setAnswerInput(e.target.value)}
                        placeholder="Explain technical tradeoffs, code architecture, error handling, and concrete production approaches..."
                        className="w-full p-4 rounded-2xl border border-sky-400/40 dark:border-emerald-500/30 bg-white/70 dark:bg-darkcard text-xs font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400"
                      />
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-500 dark:text-gray-400 font-medium">
                      Automated NLP & Objective Evaluator • Real-Time Scoring
                    </span>

                    <button
                      type="button"
                      disabled={isEvaluating}
                      onClick={handleAnswerSubmit}
                      className="px-6 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 dark:from-emerald-500 dark:to-teal-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isEvaluating ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>AI Evaluating...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit & Grade Answer</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">All 10 Questions Completed!</h4>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Your full attempt has been evaluated and recorded below.
                  </p>
                  <button
                    onClick={handleStartNewAttempt}
                    className="px-6 py-2.5 text-xs font-bold text-white gradient-btn rounded-xl shadow-md hover:scale-105 transition"
                  >
                    Start Next Attempt
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Question Bank Navigator & Quick Overview (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass p-6 rounded-3xl border border-sky-400/30 dark:border-emerald-500/30 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-sky-400/20 dark:border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-sky-500 dark:text-emerald-400" />
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    10-Question Bank Overview
                  </h4>
                </div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-gray-400">
                  {questions.length} Items
                </span>
              </div>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {questions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    onClick={() => setActiveQuestionIndex(idx)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                      activeQuestionIndex === idx
                        ? 'bg-sky-500/15 dark:bg-emerald-500/20 border-sky-500 dark:border-emerald-400 shadow-sm'
                        : 'bg-white/40 dark:bg-darkcard/50 border-gray-200 dark:border-gray-800 hover:border-sky-300'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-slate-700 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="flex-1 truncate">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                          q.type === 'objective'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}>
                          {q.type === 'objective' ? 'MCQ' : 'Descriptive'}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-gray-400 truncate">{q.category}</span>
                      </div>
                      <p className="font-bold text-slate-800 dark:text-gray-200 truncate">{q.question}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Partitioned Attempts History Section (Attempt 1, Attempt 2, ...) */}
        <div className="glass p-6 sm:p-8 rounded-3xl border border-sky-400/30 dark:border-emerald-500/30 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-400/20 dark:border-emerald-500/20 pb-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-sky-500 dark:text-emerald-400" />
                <span>Simulation Attempt History (Separate Attempt Sections)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                Each simulation session is stored distinctly with 10 questions, attempt breakdown, and scores.
              </p>
            </div>

            <button
              onClick={handleStartNewAttempt}
              className="px-4 py-2 bg-sky-500/10 dark:bg-emerald-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-emerald-300 font-extrabold text-xs rounded-xl border border-sky-400/30 dark:border-emerald-500/30 transition-all flex items-center gap-1.5"
            >
              <span>+ Take Again (Start Attempt #{currentAttemptNumber})</span>
            </button>
          </div>

          {attempts.length === 0 ? (
            <div className="py-12 text-center space-y-2 bg-slate-50/50 dark:bg-darkcard/30 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
              <Sparkles className="w-8 h-8 text-amber-500 mx-auto" />
              <h5 className="font-black text-slate-800 dark:text-white text-sm">No Completed Attempts Recorded Yet</h5>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Answer the 10 questions above to generate and archive your first official Attempt #1 report.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {attempts.map((att) => {
                const isExpanded = !!expandedAttempts[att.attemptNumber];
                return (
                  <div
                    key={att.id || att.attemptNumber}
                    className="p-5 rounded-2xl bg-white/70 dark:bg-darkcard/60 border border-sky-300/40 dark:border-emerald-500/30 shadow-sm space-y-4"
                  >
                    {/* Attempt Header Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-emerald-500 dark:to-teal-600 text-white font-black text-xs rounded-xl shadow-sm">
                          Attempt #{att.attemptNumber}
                        </span>
                        <div>
                          <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                            {att.role}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-gray-400">
                            {new Date(att.timestamp).toLocaleString()} • {att.completedQuestions || 10}/10 Answered
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                            Score: {att.overallScore}%
                          </span>
                          <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                            Clarity: {att.avgClarity}%
                          </span>
                        </div>

                        <button
                          onClick={() => toggleAttemptExpand(att.attemptNumber)}
                          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Question by Question Breakdown */}
                    {isExpanded && (
                      <div className="space-y-3 pt-2">
                        <p className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400">
                          10-Question Score & AI Evaluator Feedback Breakdown:
                        </p>

                        <div className="grid grid-cols-1 gap-3">
                          {(att.responses || []).map((resp, rIdx) => (
                            <div
                              key={rIdx}
                              className="p-4 rounded-xl bg-slate-50/80 dark:bg-darkbg/70 border border-gray-200 dark:border-gray-800 space-y-2 text-xs"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-black text-[10px] flex items-center justify-center">
                                    Q{resp.questionIndex || rIdx + 1}
                                  </span>
                                  <span className="font-bold text-slate-900 dark:text-white truncate">
                                    {resp.question}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  {resp.isCorrect !== null && resp.isCorrect !== undefined && (
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                                      resp.isCorrect
                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                    }`}>
                                      {resp.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                    </span>
                                  )}
                                  <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold text-[10px]">
                                    {resp.overall}%
                                  </span>
                                </div>
                              </div>

                              <div className="p-2.5 rounded-lg bg-white/70 dark:bg-darkcard/70 border border-gray-200/60 dark:border-gray-800 text-[11px]">
                                <span className="font-bold text-slate-600 dark:text-gray-300">Answer: </span>
                                <span className="text-slate-800 dark:text-gray-100 font-medium">{resp.answer}</span>
                              </div>

                              {resp.feedback && (
                                <p className="text-[11px] text-sky-700 dark:text-emerald-400 font-medium">
                                  💡 <strong>Feedback:</strong> {resp.feedback}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InterviewSimulation;
