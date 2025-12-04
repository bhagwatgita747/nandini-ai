import StepCard from './StepCard';
import MathText from './MathText';

const ResponseDisplay = ({ response, question }) => {
  if (!response) return null;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 animate-fade-in">
      {/* Question Echo */}
      <div className="mb-6 p-4 bg-white/60 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-500 mb-1">Your Question:</p>
        <p className="text-gray-800 font-medium">{question}</p>
      </div>

      {/* Topic & Difficulty Badge */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium border border-primary-200">
          {response.topic}
        </span>
        {response.difficulty && (
          <span className={`px-4 py-1.5 rounded-full text-sm font-medium border capitalize ${getDifficultyColor(response.difficulty)}`}>
            {response.difficulty}
          </span>
        )}
        <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm border border-gray-200">
          {response.steps.length} steps
        </span>
      </div>

      {/* Steps */}
      <div className="space-y-6">
        {response.steps.map((step, index) => (
          <StepCard
            key={step.step_number}
            step={step}
            totalSteps={response.steps.length}
            isLast={index === response.steps.length - 1}
          />
        ))}
      </div>

      {/* Final Answer Card */}
      {response.final_answer && (
        <div className="mt-8 p-6 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-xl">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-primary-100 text-sm font-medium mb-1">Final Answer</p>
              <p className="text-white text-lg font-semibold leading-relaxed">
                <MathText text={response.final_answer} />
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Ask Another Question */}
      <div className="mt-8 text-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Ask Another Question
        </button>
      </div>
    </div>
  );
};

export default ResponseDisplay;
