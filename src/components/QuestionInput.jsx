import { useState } from 'react';

const QuestionInput = ({ onSubmit, isLoading }) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() && !isLoading) {
      onSubmit(question.trim());
    }
  };

  const exampleQuestions = [
    "Calculate the force on a 5kg object accelerating at 10 m/s²",
    "Solve the quadratic equation x² + 5x + 6 = 0",
    "How many moles are in 18 grams of water?"
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask any question... e.g., 'How do I solve x² + 5x + 6 = 0?'"
            className="w-full px-6 py-4 pr-32 text-lg border-2 border-primary-200 rounded-2xl
                       focus:border-primary-500 focus:ring-4 focus:ring-primary-100
                       outline-none transition-all duration-200 resize-none
                       bg-white/80 backdrop-blur-sm shadow-lg
                       placeholder:text-gray-400"
            rows={3}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!question.trim() || isLoading}
            className="absolute right-3 bottom-3 px-6 py-2.5
                       bg-gradient-to-r from-primary-600 to-primary-700
                       text-white font-semibold rounded-xl
                       hover:from-primary-700 hover:to-primary-800
                       disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed
                       transition-all duration-200 shadow-md hover:shadow-lg
                       flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <span>Ask</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Example Questions */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <span className="text-sm text-gray-500">Try:</span>
        {exampleQuestions.map((eq, index) => (
          <button
            key={index}
            onClick={() => setQuestion(eq)}
            className="text-sm px-3 py-1.5 bg-white/60 hover:bg-white
                       border border-primary-200 rounded-full
                       text-primary-700 hover:text-primary-800
                       transition-all duration-200 hover:shadow-md"
          >
            {eq.length > 40 ? eq.substring(0, 40) + '...' : eq}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionInput;
