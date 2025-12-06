import { useState, useRef } from 'react';

const QuestionInput = ({ onSubmit, isLoading }) => {
  const [question, setQuestion] = useState('');
  const [image, setImage] = useState(null); // { base64, preview }
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((question.trim() || image) && !isLoading) {
      onSubmit(question.trim(), image?.base64);
      setImage(null); // Clear image after submit
    }
  };

  const handleImageCapture = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image too large. Please use an image under 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setImage({
          base64,
          preview: base64,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle keyboard shortcut (Ctrl/Cmd + Enter to submit)
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
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
        {/* Hidden file input for camera/gallery */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageCapture}
          className="hidden"
          id="camera-input"
        />

        {/* Image Preview */}
        {image && (
          <div className="mb-3 p-3 bg-white dark:bg-gray-800 rounded-xl border-2 border-primary-200 dark:border-gray-600 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="relative flex-shrink-0">
                <img
                  src={image.preview}
                  alt="Captured question"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Photo attached</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Add a question or tap "Ask AI" to analyze the image
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={image ? "Add a question about this image (optional)..." : "Ask any question..."}
            className="w-full px-4 py-3 sm:px-6 sm:py-4 pr-14 text-base sm:text-lg border-2 border-primary-200 dark:border-gray-600 rounded-xl sm:rounded-2xl
                       focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 sm:focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/50
                       outline-none transition-all duration-200 resize-none
                       bg-white dark:bg-gray-800 shadow-lg
                       text-gray-800 dark:text-gray-200
                       placeholder:text-gray-400 dark:placeholder:text-gray-500"
            rows={2}
            disabled={isLoading}
          />
          {/* Camera Button - positioned inside textarea */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="absolute right-3 top-3 p-2 min-w-[40px] min-h-[40px]
                       bg-primary-100 dark:bg-primary-900/50 hover:bg-primary-200 dark:hover:bg-primary-800
                       text-primary-600 dark:text-primary-400
                       rounded-lg transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center"
            title="Take photo or upload image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* Submit Button - Full width on mobile */}
        <button
          type="submit"
          disabled={(!question.trim() && !image) || isLoading}
          className="w-full mt-3 px-6 py-3 sm:py-3.5 min-h-[48px]
                     bg-gradient-to-r from-primary-600 to-primary-700
                     text-white font-semibold rounded-xl
                     hover:from-primary-700 hover:to-primary-800
                     active:from-primary-800 active:to-primary-900
                     disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-700 disabled:cursor-not-allowed
                     transition-all duration-200 shadow-md hover:shadow-lg active:shadow-sm
                     flex items-center justify-center gap-2 text-base"
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
              <span>Ask AI</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>

        {/* Keyboard hint - Hidden on mobile */}
        <p className="hidden sm:block mt-2 text-xs text-gray-400 dark:text-gray-500 text-right">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400 font-mono">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400 font-mono">Enter</kbd> to submit
        </p>
      </form>

      {/* Example Questions - Horizontal scroll on mobile */}
      <div className="mt-4 -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="flex sm:flex-wrap gap-2 overflow-x-auto pb-2 sm:pb-0 sm:justify-center scrollbar-hide">
          <span className="flex-shrink-0 text-xs sm:text-sm text-gray-500 dark:text-gray-400 self-center">Try:</span>
          {exampleQuestions.map((eq, index) => (
            <button
              key={index}
              onClick={() => setQuestion(eq)}
              className="flex-shrink-0 text-xs sm:text-sm px-3 py-2 sm:py-1.5 min-h-[36px] sm:min-h-0 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700
                         border border-primary-200 dark:border-gray-600 rounded-full
                         text-primary-700 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-200
                         transition-all duration-200 hover:shadow-md active:bg-primary-50 dark:active:bg-gray-600"
            >
              {eq.length > 30 ? eq.substring(0, 30) + '...' : eq}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionInput;
