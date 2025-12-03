import { useState } from 'react';
import QuestionInput from './components/QuestionInput';
import ResponseDisplay from './components/ResponseDisplay';
import { mockResponses, getDefaultMockResponse } from './mockData';

function App() {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuestionSubmit = async (question) => {
    setIsLoading(true);
    setCurrentQuestion(question);
    setResponse(null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check for matching mock responses based on keywords
    const lowerQuestion = question.toLowerCase();
    let mockResponse;

    if (lowerQuestion.includes('force') || lowerQuestion.includes('newton') || lowerQuestion.includes('accelerat')) {
      mockResponse = mockResponses['physics-force'];
    } else if (lowerQuestion.includes('quadratic') || lowerQuestion.includes('x²') || lowerQuestion.includes('x^2') || lowerQuestion.includes('equation')) {
      mockResponse = mockResponses['math-quadratic'];
    } else if (lowerQuestion.includes('mole') || lowerQuestion.includes('water') || lowerQuestion.includes('h2o') || lowerQuestion.includes('chemistry')) {
      mockResponse = mockResponses['chemistry-moles'];
    } else {
      mockResponse = getDefaultMockResponse(question);
    }

    setResponse(mockResponse);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">
            Nandini AI
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Learn step by step. Ask any question and discover the solution through guided thinking.
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        <QuestionInput onSubmit={handleQuestionSubmit} isLoading={isLoading} />

        {/* Loading State */}
        {isLoading && (
          <div className="mt-12 text-center">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary-100 rounded-full animate-pulse" />
                </div>
              </div>
              <p className="text-gray-600 font-medium">Breaking down your question into steps...</p>
            </div>
          </div>
        )}

        {/* Response */}
        {!isLoading && response && (
          <ResponseDisplay response={response} question={currentQuestion} />
        )}

        {/* Empty State */}
        {!isLoading && !response && (
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col items-center gap-4 p-8 bg-white/40 rounded-2xl border border-gray-200">
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to Help You Learn</h3>
                <p className="text-gray-600 max-w-md">
                  Ask any question and I'll break it down into bite-sized steps.
                  Each step guides your thinking before revealing the answer.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 justify-center text-sm">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full">Physics</span>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full">Mathematics</span>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full">Chemistry</span>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full">And more...</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>Powered by AI — Learn at your own pace</p>
      </footer>
    </div>
  );
}

export default App;
