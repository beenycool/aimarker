// Constants for AIMarker application
export const HISTORY_LIMIT = 10;

export const SUBJECTS = [ 
  { value: "english", label: "English" }, 
  { value: "maths", label: "Maths", hasTiers: true }, 
  { value: "science", label: "Science", hasTiers: true }, 
  { value: "history", label: "History" }, 
  { value: "geography", label: "Geography" }, 
  { value: "computerScience", label: "Computer Science" }, 
  { value: "businessStudies", label: "Business Studies" },
  { value: "psychology", label: "Psychology" },
  { value: "sociology", label: "Sociology" },
  { value: "economics", label: "Economics" },
  { value: "politics", label: "Politics" },
  { value: "philosophy", label: "Philosophy" },
  { value: "artAndDesign", label: "Art & Design" },
  { value: "music", label: "Music" },
  { value: "drama", label: "Drama" },
  { value: "physicalEducation", label: "Physical Education" },
  { value: "religiousStudies", label: "Religious Studies" },
  { value: "mediaStudies", label: "Media Studies" },
  { value: "designTechnology", label: "Design & Technology" },
  { value: "foodTechnology", label: "Food Technology" }
];

// Function to add custom subjects (for future use with user accounts)
export const addCustomSubject = (value, label, hasTiers = false) => {
  const newSubject = { value, label, hasTiers };
  // In a real app, this would save to user's account/database
  return newSubject;
};

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
    category: "Free Models",
    models: [
      { value: "gemini-2.5-flash-preview-05-20", label: "Gemini 2.5 Flash Preview", badge: "Google", supportsThinking: true },
      { value: "deepseek/deepseek-r1-0528:free", label: "DeepSeek R1", badge: "Reasoning" },
      { value: "deepseek/deepseek-chat-v3-0324:free", label: "DeepSeek V3", badge: "Balanced" },
      { value: "google/gemini-2.0-flash-exp:free", label: "Gemini 2.0 Flash", badge: "OCR" }
    ]
  },
  {
    category: "Premium Models",
    models: [
      { value: "o3", label: "O3", badge: "Premium", tier: "premium" },
      { value: "o4-mini", label: "O4 Mini", badge: "Fast", tier: "premium" },
      { value: "xai/grok-3", label: "Grok-3", badge: "X AI", tier: "premium" }
    ]
  }
];

export const FALLBACK_MODELS = {
  "gemini-2.5-flash-preview-05-20": "deepseek/deepseek-r1-0528:free",
  "deepseek/deepseek-chat-v3-0324:free": "deepseek/deepseek-r1-0528:free",
  // "deepseek/deepseek-r1-0528:free": "gemini-2.5-flash-preview-05-20", // Removed to break the cycle
  "o3": "gemini-2.5-flash-preview-05-20",
  "o4-mini": "deepseek/deepseek-r1-0528:free",
  "xai/grok-3": "deepseek/deepseek-r1-0528:free",
  "google/gemini-2.0-flash-exp:free": "deepseek/deepseek-chat-v3-0324:free"
};

export const MODEL_RATE_LIMITS = {
  "gemini-2.5-flash-preview-05-20": 60000,
  "deepseek/deepseek-chat-v3-0324:free": 10000,
  "deepseek/deepseek-r1-0528:free": 10000,
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

// Exam Presets for quick setup
export const EXAM_PRESETS = {
  'english-aqa-lang-p1-q2': {
    name: 'English AQA Language Paper 1 Q2',
    subject: 'english',
    examBoard: 'aqa',
    questionType: 'language_analysis',
    totalMarks: '8',
    tier: 'higher',
    description: 'Language analysis question (8 marks)',
    markScheme: `AO2: Explain, comment on and analyse how writers use language and structure to achieve effects and influence readers, using relevant subject terminology to support their views.

Level 4 (7-8 marks): Perceptive, detailed analysis
• Shows perceptive understanding of language/structure
• Analyses the effects of the writer's choices of language/structure
• Selects a range of judicious textual detail
• Uses sophisticated subject terminology

Level 3 (5-6 marks): Clear, relevant analysis  
• Shows clear understanding of language/structure
• Explains clearly the effects of the writer's choices
• Selects a range of relevant textual detail
• Uses subject terminology clearly

Level 2 (3-4 marks): Some understanding and comment
• Shows some understanding of language/structure
• Attempts to comment on the effect of language/structure
• Selects some appropriate textual detail
• Uses some subject terminology

Level 1 (1-2 marks): Simple awareness
• Shows simple awareness of language/structure
• Offers simple comment on language/structure
• Simple textual references
• Simple awareness of appropriate terminology`
  },
  'english-aqa-lang-p1-q3': {
    name: 'English AQA Language Paper 1 Q3',
    subject: 'english',
    examBoard: 'aqa',
    questionType: 'structure_analysis',
    totalMarks: '8',
    tier: 'higher',
    description: 'Structure analysis question (8 marks)',
    markScheme: `AO2: Explain, comment on and analyse how writers use language and structure to achieve effects and influence readers.

Focus on structural features such as:
• Focus shifts
• Perspective changes
• Narrative voice
• Beginning/ending
• Paragraph structure
• Sentence structure for effect`
  },
  'english-aqa-lang-p1-q4': {
    name: 'English AQA Language Paper 1 Q4',
    subject: 'english',
    examBoard: 'aqa',
    questionType: 'evaluation',
    totalMarks: '20',
    tier: 'higher',
    description: 'Evaluation question (20 marks)',
    markScheme: `AO4: Evaluate texts critically and support this with appropriate textual references.

Level 4 (16-20 marks): Perceptive, detailed evaluation
• Shows perceptive understanding of text
• Evaluates critically and in detail
• Shows perceptive understanding of writer's methods
• Selects a range of judicious textual detail

Level 3 (11-15 marks): Clear, relevant evaluation
• Shows clear understanding of text
• Evaluates clearly and with relevant detail
• Shows clear understanding of writer's methods
• Selects a range of relevant textual detail`
  },
  'english-aqa-lang-p2-q5': {
    name: 'English AQA Language Paper 2 Q5',
    subject: 'english',
    examBoard: 'aqa',
    questionType: 'creative_writing',
    totalMarks: '40',
    tier: 'higher',
    description: 'Creative writing (40 marks)',
    markScheme: `AO5: Communicate clearly, effectively and imaginatively (24 marks)
AO6: Use a range of vocabulary and sentence structures, accurate spelling, punctuation and grammar (16 marks)

Content and Organisation (AO5):
Level 5 (20-24 marks): Compelling, convincing communication
Level 4 (16-19 marks): Consistent, convincing communication
Level 3 (11-15 marks): Clear, connected communication
Level 2 (6-10 marks): Some sustained communication
Level 1 (1-5 marks): Simple, limited communication

Technical Accuracy (AO6):
Level 4 (13-16 marks): Consistently accurate
Level 3 (9-12 marks): Generally accurate
Level 2 (5-8 marks): Some accuracy
Level 1 (1-4 marks): Occasional accuracy`
  },
  'maths-aqa-higher-algebra': {
    name: 'Maths AQA Higher Algebra',
    subject: 'mathematics',
    examBoard: 'aqa',
    questionType: 'algebra',
    totalMarks: '6',
    tier: 'higher',
    description: 'Higher tier algebra question (6 marks)'
  },
  'science-aqa-biology-6mark': {
    name: 'Science AQA Biology 6-mark',
    subject: 'biology',
    examBoard: 'aqa',
    questionType: 'extended_response',
    totalMarks: '6',
    tier: 'higher',
    description: 'Extended response biology question (6 marks)',
    markScheme: `Level 3 (5-6 marks): Detailed scientific explanation
• Detailed scientific knowledge and understanding
• Clear, logical sequence
• Uses appropriate scientific terminology throughout

Level 2 (3-4 marks): Some scientific explanation
• Some scientific knowledge and understanding
• Logical sequence in places
• Uses some scientific terminology

Level 1 (1-2 marks): Basic scientific explanation
• Basic scientific knowledge
• Limited logical sequence
• Limited use of scientific terminology`
  },
  'history-aqa-gcse-explain': {
    name: 'History AQA GCSE Explain Question',
    subject: 'history',
    examBoard: 'aqa',
    questionType: 'explain',
    totalMarks: '12',
    tier: 'higher',
    description: 'Explain question (12 marks)',
    markScheme: `Level 4 (10-12 marks): Complex explanation
• Demonstrates a range of accurate and detailed knowledge
• Shows a sophisticated understanding of the key features
• Uses a range of evidence to support explanation

Level 3 (7-9 marks): Developed explanation
• Demonstrates accurate knowledge and understanding
• Shows understanding of the key features
• Uses evidence to support explanation

Level 2 (4-6 marks): Simple explanation
• Demonstrates some knowledge and understanding
• Shows some understanding of key features
• Limited use of evidence

Level 1 (1-3 marks): Basic explanation
• Demonstrates basic knowledge
• Shows limited understanding
• Little or no evidence`
  }
};

// Performance optimization: Memoized subject keywords for faster lookup
export const SUBJECT_KEYWORDS_OPTIMIZED = new Map([
  ['english', new Set(['literature', 'language', 'poetry', 'shakespeare', 'novel', 'essay', 'writing', 'analysis', 'metaphor', 'simile', 'alliteration'])],
  ['mathematics', new Set(['algebra', 'geometry', 'calculus', 'equation', 'graph', 'function', 'derivative', 'integral', 'trigonometry', 'statistics'])],
  ['science', new Set(['physics', 'chemistry', 'biology', 'experiment', 'hypothesis', 'molecule', 'atom', 'cell', 'energy', 'force'])],
  ['history', new Set(['war', 'revolution', 'empire', 'democracy', 'treaty', 'battle', 'century', 'medieval', 'ancient', 'modern'])],
  ['geography', new Set(['climate', 'population', 'urban', 'rural', 'ecosystem', 'erosion', 'tectonic', 'river', 'mountain', 'coast'])],
  ['psychology', new Set(['behaviour', 'cognitive', 'memory', 'learning', 'development', 'social', 'brain', 'mind', 'therapy', 'research'])],
  ['sociology', new Set(['society', 'culture', 'class', 'inequality', 'family', 'education', 'crime', 'deviance', 'social', 'community'])],
  ['business', new Set(['marketing', 'finance', 'management', 'profit', 'revenue', 'strategy', 'competition', 'market', 'customer', 'brand'])],
  ['economics', new Set(['supply', 'demand', 'inflation', 'gdp', 'market', 'economy', 'trade', 'fiscal', 'monetary', 'unemployment'])],
  ['computer_science', new Set(['algorithm', 'programming', 'data', 'software', 'hardware', 'network', 'database', 'code', 'binary', 'logic'])]
]); 