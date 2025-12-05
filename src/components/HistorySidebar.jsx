import { useState } from 'react';

const HistorySidebar = ({ history, onSelectItem, onDeleteItem, onClearHistory, isOpen, onToggle }) => {
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // Less than 1 minute
    if (diff < 60000) return 'Just now';
    // Less than 1 hour
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    // Less than 24 hours
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    // Less than 7 days
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    // Otherwise show date
    return date.toLocaleDateString();
  };

  const truncateQuestion = (question, maxLength = 50) => {
    if (question.length <= maxLength) return question;
    return question.substring(0, maxLength) + '...';
  };

  return (
    <>
      {/* Toggle Button - Fixed position with safe area */}
      <button
        onClick={onToggle}
        className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50 p-2.5 sm:p-3 min-w-[44px] min-h-[44px] bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl active:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 group mt-safe"
        title={isOpen ? 'Close History' : 'Open History'}
      >
        <svg
          className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          )}
        </svg>
        {history.length > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {history.length > 9 ? '9+' : history.length}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onToggle}
        />
      )}

      {/* Sidebar - Full width on mobile */}
      <div className={`
        fixed top-0 left-0 h-full w-full sm:w-80 bg-white dark:bg-gray-900 shadow-2xl z-50
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header with safe area */}
        <div className="p-4 sm:p-5 pt-safe border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-primary-50 dark:from-gray-800 to-white dark:to-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-gray-800 dark:text-gray-200">History</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{history.length} question{history.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="p-2.5 min-w-[44px] min-h-[44px] hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 rounded-lg transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto h-[calc(100%-140px)]">
          {history.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No history yet</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Your questions will appear here</p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {history.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <button
                    onClick={() => onSelectItem(item)}
                    className="w-full text-left p-4 min-h-[60px] rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-gray-700 active:bg-primary-100 dark:active:bg-gray-600 border border-transparent hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-xs font-bold text-primary-600 dark:text-primary-400">
                        {item.response?.topic?.charAt(0) || 'Q'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                          {truncateQuestion(item.question)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {formatTime(item.timestamp)}
                          </span>
                          {item.response?.topic && (
                            <span className="text-xs px-2 py-0.5 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full truncate max-w-[120px]">
                              {item.response.topic}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteItem(item.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                    title="Delete"
                  >
                    <svg className="w-4 h-4 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Clear History */}
        {history.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            {showConfirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex-1">Clear all history?</span>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onClearHistory();
                    setShowConfirmClear(false);
                  }}
                  className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Clear
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear History
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default HistorySidebar;
