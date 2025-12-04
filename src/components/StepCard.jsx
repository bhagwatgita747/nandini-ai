import { useState, useRef } from 'react';
import MathText from './MathText';

const StepCard = ({ step, totalSteps, isLast }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenRevealed, setHasBeenRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const buttonRef = useRef(null);
  const [ripples, setRipples] = useState([]);

  const handleReveal = (e) => {
    if (!isOpen) {
      // Create ripple effect
      const button = buttonRef.current;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newRipple = {
        id: Date.now(),
        x,
        y,
        size: Math.max(rect.width, rect.height)
      };

      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);

      // Show confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);

      // Mark as revealed for badge animation
      setHasBeenRevealed(true);
    }

    setIsOpen(!isOpen);
  };

  // Generate confetti positions
  const confettiPieces = [
    { left: '20%', top: '-5px', delay: '0s' },
    { left: '40%', top: '-8px', delay: '0.05s' },
    { left: '60%', top: '-3px', delay: '0.1s' },
    { left: '80%', top: '-6px', delay: '0.08s' },
    { left: '30%', top: '-4px', delay: '0.12s' },
  ];

  return (
    <div className="relative">
      {/* Connection line to next step */}
      {!isLast && (
        <div className={`absolute left-8 top-full w-0.5 h-6 transition-colors duration-500 ${
          isOpen ? 'bg-gradient-to-b from-green-400 to-green-300' : 'bg-gradient-to-b from-primary-300 dark:from-primary-700 to-primary-200 dark:to-primary-800'
        }`} />
      )}

      <div className={`
        bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg
        border-2 transition-all duration-300
        ${isOpen ? 'card-revealed shadow-xl' : 'border-gray-100 dark:border-gray-700'}
      `}>
        {/* Step Header */}
        <div className="flex items-start gap-4 p-5">
          {/* Step Number Badge */}
          <div className="relative">
            <div className={`
              flex-shrink-0 w-12 h-12 rounded-xl
              flex items-center justify-center
              font-bold text-lg transition-all duration-300
              ${isOpen
                ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white badge-celebrate'
                : hasBeenRevealed
                  ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                  : 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'}
            `}>
              {isOpen || hasBeenRevealed ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    className={isOpen ? "checkmark-icon" : ""}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                step.step_number
              )}
            </div>

            {/* Success ring pulse */}
            {isOpen && !hasBeenRevealed && (
              <div className="success-ring" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Thinking Prompt */}
            <div className="thinking-prompt">
              <p className="text-gray-800 dark:text-gray-200 font-medium text-lg leading-relaxed">
                <MathText text={step.thinking_prompt} />
              </p>
              <p className={`text-sm mt-1 transition-colors duration-300 ${
                isOpen ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {isOpen
                  ? `Step ${step.step_number} of ${totalSteps} — Revealed!`
                  : `Step ${step.step_number} of ${totalSteps} — Think about this, then reveal`
                }
              </p>
            </div>

            {/* Reveal Button */}
            <button
              ref={buttonRef}
              onClick={handleReveal}
              className={`
                reveal-btn relative overflow-hidden
                mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl
                font-semibold text-sm transition-all duration-200
                ${isOpen
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hide-btn-animate'
                  : 'bg-gradient-to-r from-primary-600 via-primary-600 to-indigo-600 text-white hover:from-primary-700 hover:via-primary-700 hover:to-indigo-700 shadow-lg hover:shadow-xl hover:scale-[1.02]'}
              `}
            >
              {/* Ripple effects */}
              {ripples.map(ripple => (
                <span
                  key={ripple.id}
                  className="ripple-effect"
                  style={{
                    left: ripple.x - ripple.size / 2,
                    top: ripple.y - ripple.size / 2,
                    width: ripple.size,
                    height: ripple.size,
                  }}
                />
              ))}

              {isOpen ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  <span>Hide Answer</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Reveal Answer</span>
                </>
              )}
            </button>

            {/* Answer Section (Accordion) */}
            <div
              className={`
                accordion-content mt-4 rounded-xl
                ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
              `}
            >
              {isOpen && (
                <div className="answer-reveal answer-glow answer-shimmer bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl p-5 relative">
                  {/* Confetti burst */}
                  {showConfetti && confettiPieces.map((piece, i) => (
                    <div
                      key={i}
                      className={`confetti confetti-${i + 1}`}
                      style={{ left: piece.left, top: piece.top }}
                    />
                  ))}

                  {/* Answer */}
                  <div className="flex items-start gap-4">
                    <div className="checkmark-circle flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          className="checkmark-icon"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="answer-text font-bold text-green-800 dark:text-green-200 text-xl">
                        <MathText text={step.answer} />
                      </p>
                      {step.explanation && (
                        <p className="explanation-text mt-3 text-green-700 dark:text-green-300 leading-relaxed bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 border border-green-200 dark:border-green-800">
                          <MathText text={step.explanation} />
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepCard;
