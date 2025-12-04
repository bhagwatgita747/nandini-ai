import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3006;

app.use(cors());
app.use(express.json());

// System prompt for structured step-by-step responses
const SYSTEM_PROMPT = `You are Nandini AI, an educational assistant that helps students learn through guided discovery. When a student asks a question, you must break down the solution into logical steps using the Socratic method.

CRITICAL: You must respond ONLY with valid JSON in this exact format, no other text:

{
  "topic": "Subject - Specific Topic",
  "difficulty": "beginner" | "intermediate" | "advanced",
  "steps": [
    {
      "step_number": 1,
      "thinking_prompt": "A guiding question that nudges the student to think about this step",
      "answer": "The concise answer with $LaTeX$ for any math",
      "explanation": "A brief explanation with $LaTeX$ notation for formulas"
    }
  ],
  "final_answer": "The complete answer with $LaTeX$ for all math"
}

EXAMPLE for "What is the area of a circle with radius 3?":
{
  "topic": "Mathematics - Geometry",
  "difficulty": "beginner",
  "steps": [
    {
      "step_number": 1,
      "thinking_prompt": "What is the formula for the area of a circle?",
      "answer": "The formula is $A = \\pi r^2$",
      "explanation": "This formula calculates the area by squaring the radius and multiplying by $\\pi$ (approximately 3.14159)."
    },
    {
      "step_number": 2,
      "thinking_prompt": "How do we substitute the given radius into the formula?",
      "answer": "$A = \\pi \\times 3^2 = \\pi \\times 9 = 9\\pi$",
      "explanation": "We substitute $r = 3$ into the formula $A = \\pi r^2$."
    }
  ],
  "final_answer": "The area of a circle with radius 3 is $A = 9\\pi \\approx 28.27$ square units."
}

Guidelines:
1. Break complex problems into 3-7 logical steps
2. Each thinking_prompt should be a question that guides the student's thinking
3. Keep answers concise but complete
4. Explanations should clarify the reasoning
5. The final_answer should be a clear, complete statement
6. Adjust difficulty based on the question complexity
7. Be encouraging and educational in tone within the content

MATH FORMATTING (MANDATORY):
- ALL mathematical expressions MUST use LaTeX notation
- Wrap inline math with single dollar signs: $F = ma$
- Use $\\frac{a}{b}$ for fractions, $x^2$ for exponents, $\\sqrt{x}$ for roots
- Greek letters: $\\alpha$, $\\beta$, $\\theta$, $\\pi$
- NEVER write plain math like "F = ma" - ALWAYS use "$F = ma$"

IMPORTANT: Output ONLY the JSON object. No markdown, no code blocks, no explanations outside the JSON.`;

// API endpoint for asking questions
app.post('/api/ask', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string' || question.trim() === '') {
      return res.status(400).json({ error: 'Question is required' });
    }

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'grok-3-fast',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('XAI API Error:', response.status, errorData);
      return res.status(response.status).json({
        error: 'Failed to get response from AI',
        details: errorData
      });
    }

    const data = await response.json();
    const aiContent = data.choices[0]?.message?.content;

    if (!aiContent) {
      return res.status(500).json({ error: 'Empty response from AI' });
    }

    // Parse the JSON response
    let parsedResponse;
    try {
      // Clean the response in case there's any extra whitespace or markdown
      let cleanContent = aiContent.trim();

      // Remove markdown code blocks if present
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();

      // Fix unescaped backslashes in LaTeX expressions
      // The AI outputs \frac, \sqrt, etc. but JSON needs \\frac, \\sqrt
      // We need to escape backslashes that are followed by LaTeX commands
      cleanContent = cleanContent.replace(/\\([a-zA-Z]+)/g, '\\\\$1');

      parsedResponse = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiContent);
      return res.status(500).json({
        error: 'Failed to parse AI response',
        rawResponse: aiContent
      });
    }

    // Validate the response structure
    if (!parsedResponse.steps || !Array.isArray(parsedResponse.steps)) {
      return res.status(500).json({
        error: 'Invalid response structure',
        rawResponse: parsedResponse
      });
    }

    res.json(parsedResponse);

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/ask`);
});
