// Constants for AIMarker application
export const HISTORY_LIMIT = 10;

export const SUBJECTS = [ 
  { value: "english", label: "English" }, 
  { value: "maths", label: "Maths", hasTiers: true }, 
  { value: "science", label: "Science", hasTiers: true }, 
  { value: "history", label: "History" }, 
  { value: "geography", label: "Geography" }, 
  { value: "computerScience", label: "Computer Science" }, 
  { value: "businessStudies", label: "Business Studies" }
];

export const EXAM_BOARDS = [
  { value: "aqa", label: "AQA" },
  { value: "edexcel", label: "Edexcel" },
  { value: "ocr", label: "OCR" },
  { value: "wjec", label: "WJEC" }
];

export const USER_TYPES = [
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher" }
];

export const AI_MODELS = [
  {
    category: "Premium Models",
    models: [
      { value: "o3", label: "O3", badge: "Premium" },
      { value: "o4-mini", label: "O4 Mini", badge: "Fast" },
      { value: "xai/grok-3", label: "Grok-3", badge: "X AI" },
      { value: "gemini-2.5-flash-preview-05-20", label: "Gemini 2.5 Flash Preview", badge: "Google" }
    ]
  },
  {
    category: "Free Models",
    models: [
      { value: "deepseek/deepseek-r1-0528:free", label: "DeepSeek R1", badge: "Reasoning" },
      { value: "deepseek/deepseek-chat-v3-0324:free", label: "DeepSeek V3", badge: "Balanced" },
      { value: "xai/grok-3-mini", label: "Grok-3 Mini", badge: "Fast" },
      { value: "google/gemini-2.0-flash-exp:free", label: "Gemini 2.0 Flash", badge: "OCR" }
    ]
  }
];

export const FALLBACK_MODELS = {
  "gemini-2.5-flash-preview-05-20": "deepseek/deepseek-chat-v3-0324:free",
  "deepseek/deepseek-chat-v3-0324:free": "microsoft/mai-ds-r1:free",
  "deepseek/deepseek-r1-0528:free": "gemini-2.5-flash-preview-05-20",
  "o3": "o4-mini",
  "o4-mini": "deepseek/deepseek-chat-v3-0324:free",
  "xai/grok-3": "deepseek/deepseek-chat-v3-0324:free",
  "google/gemini-2.0-flash-exp:free": "deepseek/deepseek-chat-v3-0324:free"
};

export const MODEL_RATE_LIMITS = {
  "gemini-2.5-flash-preview-05-20": 60000,
  "deepseek/deepseek-chat-v3-0324:free": 10000,
  "microsoft/mai-ds-r1:free": 60000,
  "openrouter/masr1": 30000,
  "o3": 60000,
  "o4-mini": 30000,
  "o4": 60000,
  "xai/grok-3": 60000,
  "google/gemini-2.0-flash-exp:free": 60000
};

export const TASK_SPECIFIC_MODELS = {
  "image_processing": {
    "default": "gemini-2.5-flash-preview-05-20",
    "ocr": "google/gemini-2.0-flash-exp:free"
  },
  "subject_assessment": "gemini-2.5-flash-preview-05-20"
};

export const DEFAULT_THINKING_BUDGETS = {
  "gemini-2.5-flash-preview-05-20": 1024,
  "microsoft/mai-ds-r1:free": 0,
  "o3": 4000,
  "o4-mini": 4000,
  "xai/grok-3": 2048,
  "google/gemini-2.0-flash-exp:free": 1024
};

export const subjectKeywords = {
  english: ['shakespeare', 'poem', 'poetry', 'novel', 'character', 'theme', 'literature'],
  maths: ['equation', 'solve', 'calculate', 'algebra', 'geometry', 'trigonometry', 'formula'],
  science: ['experiment', 'hypothesis', 'cell', 'atom', 'energy', 'physics', 'chemistry', 'biology'],
  history: ['war', 'battle', 'king', 'queen', 'century', 'revolution', 'empire', 'historical'],
  geography: ['map', 'climate', 'population', 'country', 'city', 'river', 'mountain', 'ecosystem'],
  computerScience: ['programming', 'algorithm', 'code', 'computer', 'software', 'hardware'],
  businessStudies: ['business', 'market', 'finance', 'profit', 'enterprise', 'economy']
};

export const QUESTION_TYPES = {
  english: {
    aqa: [
      { value: "general", label: "General Assessment" },
      { value: "paper1q3", label: "Paper 1, Question 3 (Structure)" },
      { value: "paper1q4", label: "Paper 1, Question 4 (Evaluation)" },
      { value: "paper2q2", label: "Paper 2, Question 2 (Summary)" },
      { value: "paper2q5", label: "Paper 2, Question 5 (Writing)" }
    ],
    edexcel: [
      { value: "general", label: "General Assessment" }
    ],
    ocr: [
      { value: "general", label: "General Assessment" }
    ],
    wjec: [
      { value: "general", label: "General Assessment" }
    ]
  },
  maths: {
    aqa: [
      { value: "general", label: "General Assessment" }
    ],
    edexcel: [
      { value: "general", label: "General Assessment" }
    ],
    ocr: [
      { value: "general", label: "General Assessment" }
    ],
    wjec: [
      { value: "general", label: "General Assessment" }
    ]
  },
  science: {
    aqa: [
      { value: "general", label: "General Assessment" }
    ],
    edexcel: [
      { value: "general", label: "General Assessment" }
    ],
    ocr: [
      { value: "general", label: "General Assessment" }
    ],
    wjec: [
      { value: "general", label: "General Assessment" }
    ]
  },
  history: {
    aqa: [
      { value: "general", label: "General Assessment" }
    ],
    edexcel: [
      { value: "general", label: "General Assessment" }
    ],
    ocr: [
      { value: "general", label: "General Assessment" }
    ],
    wjec: [
      { value: "general", label: "General Assessment" }
    ]
  },
  geography: {
    aqa: [
      { value: "general", label: "General Assessment" }
    ],
    edexcel: [
      { value: "general", label: "General Assessment" }
    ],
    ocr: [
      { value: "general", label: "General Assessment" }
    ],
    wjec: [
      { value: "general", label: "General Assessment" }
    ]
  },
  computerScience: {
    aqa: [
      { value: "general", label: "General Assessment" }
    ],
    edexcel: [
      { value: "general", label: "General Assessment" }
    ],
    ocr: [
      { value: "general", label: "General Assessment" }
    ],
    wjec: [
      { value: "general", label: "General Assessment" }
    ]
  },
  businessStudies: {
    aqa: [
      { value: "general", label: "General Assessment" }
    ],
    edexcel: [
      { value: "general", label: "General Assessment" }
    ],
    ocr: [
      { value: "general", label: "General Assessment" }
    ],
    wjec: [
      { value: "general", label: "General Assessment" }
    ]
  }
};

export const LOCALSTORAGE_KEYS = {
  QUESTION: 'aimarker_question',
  ANSWER: 'aimarker_answer',
  SUBJECT: 'aimarker_subject',
  EXAM_BOARD: 'aimarker_examBoard',
  MODEL: 'aimarker_model',
  TIER: 'aimarker_tier',
  ENABLE_GRADE_BOUNDARIES: 'aimarker_enableGradeBoundaries',
  GRADE_BOUNDARIES: 'aimarker_gradeBoundaries',
  BOUNDARIES_SOURCE: 'aimarker_boundariesSource',
}; 