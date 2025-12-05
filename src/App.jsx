import { useState, useEffect } from 'react';
import QuestionInput from './components/QuestionInput';
import ResponseDisplay from './components/ResponseDisplay';
import HistorySidebar from './components/HistorySidebar';
import ThemeToggle from './components/ThemeToggle';
import useHistory from './hooks/useHistory';
import useTheme from './hooks/useTheme';

// In production (Vercel), use relative URL. In development, use local server.
const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3006';

function App() {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null); // { code, retryable }
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const { history, addToHistory, removeFromHistory, clearHistory } = useHistory();
  const { isDark, toggleTheme } = useTheme();

  // Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleQuestionSubmit = async (question) => {
    // Check if offline
    if (isOffline) {
      setError('You are offline. Please check your internet connection.');
      setErrorInfo({ code: 'OFFLINE', retryable: true });
      return;
    }

    setIsLoading(true);
    setCurrentQuestion(question);
    setResponse(null);
    setError(null);
    setErrorInfo(null);

    try {
      const res = await fetch(`${API_URL}/api/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to get response');
        setErrorInfo({ code: data.code, retryable: data.retryable });
        return;
      }

      setResponse(data);

      // Add to history on successful response
      addToHistory(question, data);
    } catch (err) {
      console.error('Error:', err);
      // Check if it's a network error
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Cannot connect to the server. Please make sure the server is running.');
        setErrorInfo({ code: 'CONNECTION_ERROR', retryable: true });
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
        setErrorInfo({ code: 'UNKNOWN_ERROR', retryable: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryItem = (item) => {
    setCurrentQuestion(item.question);
    setResponse(item.response);
    setError(null);
    setIsSidebarOpen(false);
    // Scroll to top to see the response
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen min-h-[100dvh] py-4 px-3 sm:py-8 sm:px-4 pb-safe bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* History Sidebar */}
      <HistorySidebar
        history={history}
        onSelectItem={handleSelectHistoryItem}
        onDeleteItem={removeFromHistory}
        onClearHistory={clearHistory}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Theme Toggle */}
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

      {/* Offline Banner */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-yellow-500 text-yellow-900 px-3 py-2 text-center font-medium shadow-md pt-safe">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
            </svg>
            <span className="text-sm sm:text-base">You are offline</span>
          </div>
        </div>
      )}

      {/* Header - More compact on mobile */}
      <header className="text-center mb-6 sm:mb-12 pt-12 sm:pt-0">
        <div className="inline-flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg sm:text-xl">N</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-primary-700 to-primary-600 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent">
            Nandini AI
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto px-2">
          Ask any question. Learn step by step.
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        <QuestionInput onSubmit={handleQuestionSubmit} isLoading={isLoading} />

        {/* Loading State */}
        {isLoading && (
          <div className="mt-8 sm:mt-12 text-center">
            <div className="inline-flex flex-col items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary-200 dark:border-primary-800 rounded-full animate-spin border-t-primary-600" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-100 dark:bg-primary-900 rounded-full animate-pulse" />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium text-sm sm:text-base">Breaking down your question...</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">Grok is thinking...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className={`mt-6 sm:mt-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl mx-auto border-2 ${
            errorInfo?.code === 'OFFLINE' || errorInfo?.code === 'CONNECTION_ERROR'
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-start gap-3 sm:gap-4">
              <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                errorInfo?.code === 'OFFLINE' || errorInfo?.code === 'CONNECTION_ERROR'
                  ? 'bg-yellow-100 dark:bg-yellow-900/50'
                  : 'bg-red-100 dark:bg-red-900/50'
              }`}>
                {errorInfo?.code === 'OFFLINE' || errorInfo?.code === 'CONNECTION_ERROR' ? (
                  <svg className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-sm sm:text-base ${
                  errorInfo?.code === 'OFFLINE' || errorInfo?.code === 'CONNECTION_ERROR'
                    ? 'text-yellow-800 dark:text-yellow-300'
                    : 'text-red-800 dark:text-red-300'
                }`}>
                  {errorInfo?.code === 'TIMEOUT' ? 'Request Timed Out' :
                   errorInfo?.code === 'OFFLINE' ? 'You\'re Offline' :
                   errorInfo?.code === 'CONNECTION_ERROR' ? 'Connection Error' :
                   errorInfo?.code === 'RATE_LIMIT' ? 'Too Many Requests' :
                   'Something went wrong'}
                </h3>
                <p className={`mt-1 text-xs sm:text-sm ${
                  errorInfo?.code === 'OFFLINE' || errorInfo?.code === 'CONNECTION_ERROR'
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>{error}</p>
                {errorInfo?.retryable && currentQuestion && (
                  <button
                    onClick={() => handleQuestionSubmit(currentQuestion)}
                    disabled={isOffline}
                    className={`mt-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium min-h-[44px] ${
                      isOffline
                        ? 'bg-gray-400 cursor-not-allowed'
                        : errorInfo?.code === 'OFFLINE' || errorInfo?.code === 'CONNECTION_ERROR'
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700 active:bg-yellow-800'
                          : 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800'
                    }`}
                  >
                    {isOffline ? 'Waiting...' : 'Try Again'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Response */}
        {!isLoading && !error && response && (
          <ResponseDisplay response={response} question={currentQuestion} />
        )}

        {/* Empty State */}
        {!isLoading && !error && !response && (
          <div className="mt-8 sm:mt-16 text-center">
            <div className="inline-flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-8 bg-white/40 dark:bg-gray-800/40 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                <svg className="w-7 h-7 sm:w-10 sm:h-10 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2">Ready to Help You Learn</h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-base max-w-md px-2">
                  Ask any question and get step-by-step guidance.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-4 justify-center text-xs sm:text-sm">
                <span className="px-2.5 py-1 sm:px-3 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-full">Physics</span>
                <span className="px-2.5 py-1 sm:px-3 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-full">Math</span>
                <span className="px-2.5 py-1 sm:px-3 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-full">Chemistry</span>
                <span className="px-2.5 py-1 sm:px-3 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-full">& more</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-8 sm:mt-16 text-center text-gray-500 dark:text-gray-500 text-xs sm:text-sm pb-4">
        <p>Powered by Grok AI</p>
      </footer>
    </div>
  );
}

export default App;
