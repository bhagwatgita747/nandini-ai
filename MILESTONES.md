# Nandini AI - Project Milestones

## Project Overview

**Nandini AI** is an educational chatbot that helps students learn through the Socratic method. When a student asks a question, the AI breaks down the solution into logical steps, presenting each step as a "thinking prompt" (micro-question) that encourages the student to think before revealing the answer.

### Core Concept
- Student inputs a question
- AI returns a structured, step-by-step breakdown
- Each step shows a guiding question (e.g., "What is the formula for force?")
- Student thinks about it, then clicks to reveal the answer
- All answers are pre-fetched (no additional API calls on reveal)
- Beautiful, engaging UI with gratifying animations

### Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Express.js
- **AI**: XAI API (Grok model)
- **Ports**: Frontend on 3005, Backend on 3006

---

## Completed Milestones

### Milestone 1: Basic Frontend with Mock Data
**Status**: Completed

- Set up React + Vite project structure
- Configured Tailwind CSS with custom primary colors
- Created main components:
  - `QuestionInput` - Text input with submit button
  - `StepCard` - Accordion-style step reveal with animations
  - `ResponseDisplay` - Renders topic, difficulty, steps, and final answer
- Implemented step-by-step accordion reveal with gratifying animations:
  - Ripple effect on button click
  - Confetti burst on reveal
  - Spring physics slide animation
  - Checkmark draw animation
  - Glow pulse and shimmer effects
  - Badge celebration animation
- Added mock question sets for testing (Physics, Math, Chemistry)

### Milestone 2: Backend + XAI (Grok) Integration
**Status**: Completed

- Added Express server with CORS support
- Integrated XAI API (grok-3-fast model) for AI responses
- Crafted system prompt for structured JSON output with:
  - Topic and difficulty classification
  - Step-by-step breakdown (3-7 steps)
  - Thinking prompts, answers, and explanations
  - Final answer summary
- Created `/api/ask` endpoint that returns step-by-step solutions
- Updated frontend to call backend API instead of mock data
- Added error handling with retry functionality
- Added loading state with "Grok is thinking..." message

### Milestone 3: Project Roadmap Established
**Status**: Completed

- Documented PRD and project requirements
- Created MILESTONES.md for tracking progress
- Established upcoming feature roadmap

### Milestone 4: Math & LaTeX Support
**Status**: Completed

- Added KaTeX package for rendering mathematical expressions
- Created `MathText` component that parses `$...$` (inline) and `$$...$$` (block) LaTeX
- Updated `StepCard` and `ResponseDisplay` to use MathText for all text fields
- Updated system prompt with LaTeX formatting instructions and examples
- Added JSON parsing fix to handle unescaped backslashes from AI responses
- Added CSS styling for math blocks and inline expressions
- Tested with physics and math questions (quadratic formula, kinetic energy, etc.)

---

## Upcoming Milestones

### Milestone 5: Conversation History
**Priority**: Medium

- [ ] Add sidebar or dropdown for question history
- [ ] Store questions/answers in localStorage
- [ ] Allow users to revisit previous questions
- [ ] Add "Clear History" option

### Milestone 6: UI/UX Polish
**Priority**: Medium

- [ ] Improve mobile responsiveness
- [ ] Add dark mode toggle
- [ ] Add subject category chips for quick topic selection
- [ ] Improve loading skeleton animations
- [ ] Add keyboard shortcuts (Enter to submit, etc.)

### Milestone 7: Enhanced Error Handling & Retry Logic
**Priority**: Low

- [ ] Add exponential backoff for API failures
- [ ] Show more helpful error messages
- [ ] Add offline detection and messaging
- [ ] Implement request timeout handling

### Milestone 8: Deployment
**Priority**: Low

- [ ] Set up production build configuration
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Deploy backend to Railway/Render
- [ ] Configure environment variables for production
- [ ] Set up custom domain (optional)

---

## API Response Structure

The XAI API returns responses in this format (with LaTeX notation for math):

```json
{
  "topic": "Mathematics - Algebra",
  "difficulty": "beginner",
  "steps": [
    {
      "step_number": 1,
      "thinking_prompt": "What is the general form of a quadratic equation?",
      "answer": "The general form is $ax^2 + bx + c = 0$",
      "explanation": "A quadratic equation is a second-degree polynomial where $a$, $b$, and $c$ are constants."
    },
    {
      "step_number": 2,
      "thinking_prompt": "Can you recall the quadratic formula?",
      "answer": "The quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$",
      "explanation": "This formula calculates the solutions for $x$ using the discriminant $b^2 - 4ac$."
    }
  ],
  "final_answer": "The quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$."
}
```

---

## Running the Project

```bash
# Install dependencies
npm install

# Start frontend (port 3005)
npm run dev

# Start backend (port 3006)
npm run server
```

---

## Notes

- The `.env` file contains the XAI API key and is excluded from git
- All step answers are pre-fetched in a single API call for seamless UX
- Animations are designed to make learning feel rewarding and engaging
