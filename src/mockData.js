// Mock data to demonstrate the step-by-step learning flow
export const mockResponses = {
  "physics-force": {
    topic: "Physics - Newton's Laws",
    difficulty: "intermediate",
    steps: [
      {
        step_number: 1,
        thinking_prompt: "What fundamental law relates force, mass, and acceleration?",
        answer: "Newton's Second Law of Motion",
        explanation: "Newton's Second Law states that the force acting on an object is equal to the mass of that object times its acceleration (F = ma)."
      },
      {
        step_number: 2,
        thinking_prompt: "What is the mathematical formula that expresses this relationship?",
        answer: "F = m × a",
        explanation: "Where F is force (measured in Newtons), m is mass (in kilograms), and a is acceleration (in meters per second squared)."
      },
      {
        step_number: 3,
        thinking_prompt: "If an object has a mass of 5 kg and accelerates at 10 m/s², what values do we substitute?",
        answer: "F = 5 kg × 10 m/s²",
        explanation: "We substitute m = 5 kg and a = 10 m/s² into our formula F = ma."
      },
      {
        step_number: 4,
        thinking_prompt: "Now, can you calculate the final answer by multiplying these values?",
        answer: "F = 50 N (Newtons)",
        explanation: "5 × 10 = 50, and the unit becomes kg·m/s² which is equivalent to Newtons (N)."
      }
    ],
    final_answer: "The force acting on a 5 kg object accelerating at 10 m/s² is 50 Newtons."
  },

  "math-quadratic": {
    topic: "Mathematics - Algebra",
    difficulty: "intermediate",
    steps: [
      {
        step_number: 1,
        thinking_prompt: "What type of equation is x² + 5x + 6 = 0?",
        answer: "A quadratic equation",
        explanation: "Quadratic equations have the form ax² + bx + c = 0, where the highest power of x is 2."
      },
      {
        step_number: 2,
        thinking_prompt: "What method can we use to solve this quadratic equation?",
        answer: "Factoring (or the quadratic formula)",
        explanation: "Since 6 can be factored into numbers that add up to 5, factoring is the simplest approach here."
      },
      {
        step_number: 3,
        thinking_prompt: "What two numbers multiply to give 6 and add up to 5?",
        answer: "2 and 3",
        explanation: "We need factors of 6 (which are: 1×6, 2×3) that sum to 5. Since 2 + 3 = 5, we use 2 and 3."
      },
      {
        step_number: 4,
        thinking_prompt: "How do we write the factored form of the equation?",
        answer: "(x + 2)(x + 3) = 0",
        explanation: "We rewrite x² + 5x + 6 as (x + 2)(x + 3) because when expanded, it gives us back the original equation."
      },
      {
        step_number: 5,
        thinking_prompt: "Using the zero product property, what are the solutions for x?",
        answer: "x = -2 or x = -3",
        explanation: "If (x + 2)(x + 3) = 0, then either (x + 2) = 0 giving x = -2, or (x + 3) = 0 giving x = -3."
      }
    ],
    final_answer: "The solutions to x² + 5x + 6 = 0 are x = -2 and x = -3."
  },

  "chemistry-moles": {
    topic: "Chemistry - Stoichiometry",
    difficulty: "beginner",
    steps: [
      {
        step_number: 1,
        thinking_prompt: "What is Avogadro's number and what does it represent?",
        answer: "6.022 × 10²³ particles per mole",
        explanation: "Avogadro's number tells us how many atoms, molecules, or particles are in exactly one mole of a substance."
      },
      {
        step_number: 2,
        thinking_prompt: "What formula relates moles, mass, and molar mass?",
        answer: "n = m / M",
        explanation: "Where n is the number of moles, m is the mass in grams, and M is the molar mass in g/mol."
      },
      {
        step_number: 3,
        thinking_prompt: "If we have 18 grams of water (H₂O), what is its molar mass?",
        answer: "18 g/mol",
        explanation: "H₂O has 2 hydrogen atoms (2 × 1 = 2) + 1 oxygen atom (16), so molar mass = 2 + 16 = 18 g/mol."
      },
      {
        step_number: 4,
        thinking_prompt: "Now calculate: how many moles are in 18 grams of water?",
        answer: "1 mole",
        explanation: "Using n = m/M: n = 18g ÷ 18 g/mol = 1 mole. This means 18g of water contains exactly 6.022 × 10²³ molecules!"
      }
    ],
    final_answer: "18 grams of water (H₂O) equals exactly 1 mole, which contains 6.022 × 10²³ water molecules."
  }
};

// Default mock response for any question
export const getDefaultMockResponse = (question) => ({
  topic: "General Question",
  difficulty: "intermediate",
  steps: [
    {
      step_number: 1,
      thinking_prompt: "What is the key concept or formula needed to approach this problem?",
      answer: "Identify the fundamental principle",
      explanation: "Every problem requires understanding the core concept first before attempting to solve it."
    },
    {
      step_number: 2,
      thinking_prompt: "What information has been given to us in the question?",
      answer: "List all known values and conditions",
      explanation: "Write down all the given data clearly to organize your approach."
    },
    {
      step_number: 3,
      thinking_prompt: "How do we apply the concept to the given information?",
      answer: "Substitute values into the relevant formula or method",
      explanation: "This is where we connect theory to practice by applying what we know."
    },
    {
      step_number: 4,
      thinking_prompt: "What is the final calculation or conclusion?",
      answer: "Compute the result and verify it makes sense",
      explanation: "Always double-check your answer to ensure it's reasonable."
    }
  ],
  final_answer: "This is a placeholder answer. In the full version, Grok AI will provide a detailed, step-by-step solution to your specific question!"
});
