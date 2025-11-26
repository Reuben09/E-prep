export interface AlocQuestionOption {
  id: string; // e.g., "option_a"
  value: string; // The actual option text
}

export interface AlocQuestion {
  id: string;
  question: string; // The question text
  type: string; // e.g., "utme"
  image: string | null; // URL to an image if available
  options: AlocQuestionOption[]; // Array of options
  answer: string; // The ID of the correct option (e.g., "option_c")
  solution: string; // Explanation of the solution
  // The API response might have other fields like 'subject', 'year', 'exam_type', etc.
  // Add them here if you find them in the actual API response.
  subject?: string;
  year?: string;
  exam_type?: string;
}

export interface AlocApiResponse {
  status: string; // e.g., "success"
  message: string; // e.g., "Questions retrieved successfully"
  data: AlocQuestion[]; // Array of questions
}

interface FetchQuestionsParams {
  subject: string;
  year: number; // Assuming year is a number
  type: string; // e.g., "utme", "waec"
  // Add other parameters if the API supports them, like 'limit', 'page', etc.
}

export async function fetchAlocQuestions({ 
  subject, 
  year, 
  type 
}: FetchQuestionsParams): Promise<AlocQuestion[]> {
  const url = `https://past-questions-api.onrender.com/api/questions?examYear=${year}&examType=${type}&subject=${subject}`
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response) {
      throw new Error(`Network response was not ok: ${response}`);
    }

    const result: AlocApiResponse = await response.json();
    console.log(result)
    if (result) {
      return result;
    } else {
      throw new Error(`API returned an error: ${result.message}`);
    }
  } catch (error) {
    console.error('Error fetching Aloc questions:', error);
    // You might want to throw a more specific error or return an empty array
    throw error;
  }
}