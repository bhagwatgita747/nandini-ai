// Vercel Serverless Function for /api/ask

// Configuration
const CONFIG = {
  maxRetries: 3,
  initialRetryDelay: 1000, // 1 second
  maxRetryDelay: 10000,    // 10 seconds
  requestTimeout: 30000,   // 30 seconds
};

// Helper: Sleep function for delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Fetch with timeout
const fetchWithTimeout = async (url, options, timeout) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  }
};

// Helper: Exponential backoff retry
const fetchWithRetry = async (url, options, maxRetries = CONFIG.maxRetries) => {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options, CONFIG.requestTimeout);

      // Don't retry on client errors (4xx), only on server errors (5xx) or rate limits
      if (response.ok || (response.status >= 400 && response.status < 500 && response.status !== 429)) {
        return response;
      }

      // For rate limits (429) or server errors (5xx), we'll retry
      if (attempt < maxRetries - 1) {
        const delay = Math.min(
          CONFIG.initialRetryDelay * Math.pow(2, attempt),
          CONFIG.maxRetryDelay
        );
        console.log(`Attempt ${attempt + 1} failed with status ${response.status}, retrying in ${delay}ms...`);
        await sleep(delay);
      } else {
        return response; // Return the failed response on last attempt
      }
    } catch (error) {
      lastError = error;

      // Don't retry on timeouts (user should retry manually)
      if (error.message.includes('timed out')) {
        throw error;
      }

      if (attempt < maxRetries - 1) {
        const delay = Math.min(
          CONFIG.initialRetryDelay * Math.pow(2, attempt),
          CONFIG.maxRetryDelay
        );
        console.log(`Attempt ${attempt + 1} failed with error: ${error.message}, retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  throw lastError || new Error('All retry attempts failed');
};

// Helper: Categorize errors for better user messages
const categorizeError = (error, statusCode) => {
  if (error?.message?.includes('timed out')) {
    return {
      code: 'TIMEOUT',
      message: 'The request took too long. The AI might be busy - please try again.',
      retryable: true
    };
  }

  if (statusCode === 429) {
    return {
      code: 'RATE_LIMIT',
      message: 'Too many requests. Please wait a moment before trying again.',
      retryable: true
    };
  }

  if (statusCode === 401 || statusCode === 403) {
    return {
      code: 'AUTH_ERROR',
      message: 'Authentication error. Please contact support.',
      retryable: false
    };
  }

  if (statusCode >= 500) {
    return {
      code: 'SERVER_ERROR',
      message: 'The AI service is temporarily unavailable. Please try again in a moment.',
      retryable: true
    };
  }

  if (error?.message?.includes('fetch') || error?.message?.includes('network')) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Network error. Please check your internet connection.',
      retryable: true
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'Something went wrong. Please try again.',
    retryable: true
  };
};

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

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question, image } = req.body;

    if (!question && !image) {
      return res.status(400).json({
        error: 'Question or image is required',
        code: 'VALIDATION_ERROR',
        retryable: false
      });
    }

    // Determine which model to use based on whether an image is present
    const hasImage = !!image;
    const model = hasImage ? 'grok-2-vision-1212' : 'grok-4-fast-non-reasoning';

    // Build the user message content
    let userContent;
    if (hasImage) {
      // Vision model requires content as an array
      userContent = [
        {
          type: 'text',
          text: question || 'Analyze this image and solve any problems shown. Explain step by step.'
        },
        {
          type: 'image_url',
          image_url: {
            url: image // Base64 data URL (e.g., "data:image/jpeg;base64,...")
          }
        }
      ];
    } else {
      userContent = question;
    }

    let response;
    try {
      response = await fetchWithRetry('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.XAI_API_KEY}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT
            },
            {
              role: 'user',
              content: userContent
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });
    } catch (fetchError) {
      const errorInfo = categorizeError(fetchError, null);
      console.error('Fetch error after retries:', fetchError.message);
      return res.status(503).json({
        error: errorInfo.message,
        code: errorInfo.code,
        retryable: errorInfo.retryable
      });
    }

    if (!response.ok) {
      const errorData = await response.text();
      const errorInfo = categorizeError(null, response.status);
      console.error('XAI API Error:', response.status, errorData);
      return res.status(response.status).json({
        error: errorInfo.message,
        code: errorInfo.code,
        retryable: errorInfo.retryable,
        details: errorData
      });
    }

    const data = await response.json();
    const aiContent = data.choices[0]?.message?.content;

    if (!aiContent) {
      return res.status(500).json({
        error: 'The AI returned an empty response. Please try again.',
        code: 'EMPTY_RESPONSE',
        retryable: true
      });
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

      // Try to parse as-is first (AI might have properly escaped)
      try {
        parsedResponse = JSON.parse(cleanContent);
      } catch (firstParseError) {
        // If parsing fails, fix unescaped backslashes in LaTeX expressions
        const fixedContent = cleanContent
          .replace(/\\/g, '\\\\')  // Escape ALL backslashes
          .replace(/\\\\"/g, '\\"');  // Restore \" (which became \\")

        parsedResponse = JSON.parse(fixedContent);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiContent);
      return res.status(500).json({
        error: 'The AI response was not in the expected format. Please try asking again.',
        code: 'PARSE_ERROR',
        retryable: true
      });
    }

    // Validate the response structure
    if (!parsedResponse.steps || !Array.isArray(parsedResponse.steps)) {
      return res.status(500).json({
        error: 'The AI response was incomplete. Please try asking again.',
        code: 'INVALID_STRUCTURE',
        retryable: true
      });
    }

    res.json(parsedResponse);

  } catch (error) {
    console.error('Server error:', error);
    const errorInfo = categorizeError(error, null);
    res.status(500).json({
      error: errorInfo.message,
      code: errorInfo.code,
      retryable: errorInfo.retryable
    });
  }
}
