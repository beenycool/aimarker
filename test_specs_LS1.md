# Test Specifications LS1 - Architectural Improvements

## Overview
This document outlines comprehensive test specifications for the architectural improvements to the AI Marker and Football Tracker application. Tests are structured using Test-Driven Development (TDD) principles with the Red-Green-Refactor cycle.

## Test Categories

### 1. Database Persistence Tests

#### 1.1 User Model CRUD Operations

**Test: Create User with Valid Data**
```javascript
// Arrange
const userData = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'hashedPassword123',
  createdAt: new Date()
};

// Act
const user = await User.create(userData);

// Assert
expect(user).toBeDefined();
expect(user.username).toBe('testuser');
expect(user.email).toBe('test@example.com');
expect(user._id).toBeDefined();
```

**Test: Create User with Invalid Email**
```javascript
// Arrange
const invalidUserData = {
  username: 'testuser',
  email: 'invalid-email',
  password: 'hashedPassword123'
};

// Act & Assert
await expect(User.create(invalidUserData)).rejects.toThrow('Invalid email format');
```

**Test: Read User by ID**
```javascript
// Arrange
const user = await User.create(validUserData);
const userId = user._id;

// Act
const foundUser = await User.findById(userId);

// Assert
expect(foundUser).toBeDefined();
expect(foundUser.username).toBe(user.username);
expect(foundUser.email).toBe(user.email);
```

**Test: Update User Password**
```javascript
// Arrange
const user = await User.create(validUserData);
const newPassword = 'newHashedPassword456';

// Act
const updatedUser = await User.findByIdAndUpdate(
  user._id, 
  { password: newPassword }, 
  { new: true }
);

// Assert
expect(updatedUser.password).toBe(newPassword);
expect(updatedUser.updatedAt).toBeInstanceOf(Date);
```

**Test: Delete User**
```javascript
// Arrange
const user = await User.create(validUserData);

// Act
await User.findByIdAndDelete(user._id);

// Assert
const deletedUser = await User.findById(user._id);
expect(deletedUser).toBeNull();
```

#### 1.2 ActivityLog Model CRUD Operations

**Test: Create Activity Log Entry**
```javascript
// Arrange
const logData = {
  userId: new ObjectId(),
  action: 'SUBMIT_QUESTION',
  details: {
    question: 'Test question',
    subject: 'Mathematics'
  },
  timestamp: new Date()
};

// Act
const log = await ActivityLog.create(logData);

// Assert
expect(log).toBeDefined();
expect(log.action).toBe('SUBMIT_QUESTION');
expect(log.details.question).toBe('Test question');
```

**Test: Query Activity Logs by User ID**
```javascript
// Arrange
const userId = new ObjectId();
await ActivityLog.create({ userId, action: 'LOGIN', timestamp: new Date() });
await ActivityLog.create({ userId, action: 'SUBMIT_QUESTION', timestamp: new Date() });

// Act
const userLogs = await ActivityLog.find({ userId }).sort({ timestamp: -1 });

// Assert
expect(userLogs).toHaveLength(2);
expect(userLogs[0].action).toBe('SUBMIT_QUESTION');
expect(userLogs[1].action).toBe('LOGIN');
```

#### 1.3 FootballTracker Data Model Tests

**Test: Create Team with Players**
```javascript
// Arrange
const teamData = {
  name: 'Test FC',
  formation: '4-4-2',
  players: [
    { name: 'Player 1', position: 'GK', overall: 85 },
    { name: 'Player 2', position: 'CB', overall: 78 }
  ],
  createdBy: new ObjectId()
};

// Act
const team = await FootballTeam.create(teamData);

// Assert
expect(team.name).toBe('Test FC');
expect(team.players).toHaveLength(2);
expect(team.players[0].overall).toBe(85);
```

**Test: Update Team Formation**
```javascript
// Arrange
const team = await FootballTeam.create(teamData);

// Act
const updatedTeam = await FootballTeam.findByIdAndUpdate(
  team._id,
  { formation: '3-5-2' },
  { new: true }
);

// Assert
expect(updatedTeam.formation).toBe('3-5-2');
```

#### 1.4 Database Connection and Schema Validation

**Test: Database Connection Establishment**
```javascript
// Arrange
const connectionString = process.env.MONGODB_TEST_URI;

// Act
const connection = await mongoose.connect(connectionString);

// Assert
expect(connection.connection.readyState).toBe(1); // Connected
```

**Test: Schema Validation Enforcement**
```javascript
// Arrange
const invalidUserData = {
  username: '', // Required field empty
  email: 'test@example.com'
  // Missing required password field
};

// Act & Assert
await expect(User.create(invalidUserData)).rejects.toThrow('Path `username` is required');
```

### 2. API Route Tests

#### 2.1 Authentication Routes

**Test: POST /api/auth/signup - Valid Registration**
```javascript
// Arrange
const signupData = {
  username: 'newuser',
  email: 'newuser@example.com',
  password: 'securePassword123'
};

// Act
const response = await request(app)
  .post('/api/auth/signup')
  .send(signupData);

// Assert
expect(response.status).toBe(201);
expect(response.body.user.username).toBe('newuser');
expect(response.body.token).toBeDefined();
expect(response.body.user.password).toBeUndefined(); // Password should not be returned
```

**Test: POST /api/auth/signup - Duplicate Email**
```javascript
// Arrange
await User.create({ username: 'existing', email: 'existing@example.com', password: 'hash' });
const duplicateData = {
  username: 'newuser',
  email: 'existing@example.com',
  password: 'password123'
};

// Act
const response = await request(app)
  .post('/api/auth/signup')
  .send(duplicateData);

// Assert
expect(response.status).toBe(409);
expect(response.body.error).toBe('Email already registered');
```

**Test: POST /api/auth/login - Valid Credentials**
```javascript
// Arrange
const user = await User.create({
  username: 'testuser',
  email: 'test@example.com',
  password: await bcrypt.hash('password123', 10)
});

// Act
const response = await request(app)
  .post('/api/auth/login')
  .send({
    email: 'test@example.com',
    password: 'password123'
  });

// Assert
expect(response.status).toBe(200);
expect(response.body.token).toBeDefined();
expect(response.body.user.email).toBe('test@example.com');
```

**Test: POST /api/auth/login - Invalid Credentials**
```javascript
// Arrange
const loginData = {
  email: 'nonexistent@example.com',
  password: 'wrongpassword'
};

// Act
const response = await request(app)
  .post('/api/auth/login')
  .send(loginData);

// Assert
expect(response.status).toBe(401);
expect(response.body.error).toBe('Invalid credentials');
```

**Test: POST /api/auth/refresh - Valid Refresh Token**
```javascript
// Arrange
const user = await User.create(validUserData);
const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET);

// Act
const response = await request(app)
  .post('/api/auth/refresh')
  .send({ refreshToken });

// Assert
expect(response.status).toBe(200);
expect(response.body.accessToken).toBeDefined();
```

**Test: GET /api/protected - Unauthorized Access**
```javascript
// Act
const response = await request(app)
  .get('/api/protected')
  .set('Authorization', 'Bearer invalid-token');

// Assert
expect(response.status).toBe(401);
expect(response.body.error).toBe('Invalid token');
```

#### 2.2 AI Marker Routes

**Test: POST /api/aimarker/submit - Valid Question Submission**
```javascript
// Arrange
const user = await User.create(validUserData);
const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
const questionData = {
  question: 'Explain quantum mechanics',
  subject: 'Physics',
  level: 'Advanced'
};

// Act
const response = await request(app)
  .post('/api/aimarker/submit')
  .set('Authorization', `Bearer ${token}`)
  .send(questionData);

// Assert
expect(response.status).toBe(200);
expect(response.body.submissionId).toBeDefined();
expect(response.body.status).toBe('processing');
```

**Test: GET /api/aimarker/stream/:submissionId - Stream Feedback**
```javascript
// Arrange
const submissionId = 'test-submission-id';
const user = await User.create(validUserData);
const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

// Act
const response = await request(app)
  .get(`/api/aimarker/stream/${submissionId}`)
  .set('Authorization', `Bearer ${token}`)
  .set('Accept', 'text/event-stream');

// Assert
expect(response.status).toBe(200);
expect(response.headers['content-type']).toContain('text/event-stream');
```

**Test: GET /api/aimarker/history - Fetch User History**
```javascript
// Arrange
const user = await User.create(validUserData);
const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
await ActivityLog.create({
  userId: user._id,
  action: 'SUBMIT_QUESTION',
  details: { question: 'Test question' }
});

// Act
const response = await request(app)
  .get('/api/aimarker/history')
  .set('Authorization', `Bearer ${token}`);

// Assert
expect(response.status).toBe(200);
expect(response.body.history).toHaveLength(1);
expect(response.body.history[0].details.question).toBe('Test question');
```

#### 2.3 Football Tracker Routes

**Test: POST /api/football/import-csv - Valid CSV Import**
```javascript
// Arrange
const user = await User.create(validUserData);
const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
const csvContent = 'name,position,overall\nPlayer 1,GK,85\nPlayer 2,CB,78';

// Act
const response = await request(app)
  .post('/api/football/import-csv')
  .set('Authorization', `Bearer ${token}`)
  .attach('csvFile', Buffer.from(csvContent), 'players.csv');

// Assert
expect(response.status).toBe(200);
expect(response.body.players).toHaveLength(2);
expect(response.body.players[0].name).toBe('Player 1');
```

**Test: POST /api/football/save-team - Save Team Data**
```javascript
// Arrange
const user = await User.create(validUserData);
const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
const teamData = {
  name: 'My Team',
  formation: '4-3-3',
  players: [{ name: 'Player 1', position: 'GK', overall: 85 }]
};

// Act
const response = await request(app)
  .post('/api/football/save-team')
  .set('Authorization', `Bearer ${token}`)
  .send(teamData);

// Assert
expect(response.status).toBe(201);
expect(response.body.team.name).toBe('My Team');
expect(response.body.team.createdBy.toString()).toBe(user._id.toString());
```

**Test: GET /api/football/export-team/:teamId - Export Team Data**
```javascript
// Arrange
const user = await User.create(validUserData);
const team = await FootballTeam.create({ ...teamData, createdBy: user._id });
const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

// Act
const response = await request(app)
  .get(`/api/football/export-team/${team._id}`)
  .set('Authorization', `Bearer ${token}`);

// Assert
expect(response.status).toBe(200);
expect(response.headers['content-type']).toContain('application/json');
expect(response.body.team.name).toBe(team.name);
```

### 3. Frontend Component Tests

#### 3.1 QuestionForm Component Tests

**Test: QuestionForm Renders with Default State**
```javascript
// Arrange & Act
render(<QuestionForm onSubmit={jest.fn()} />);

// Assert
expect(screen.getByPlaceholderText('Enter your question...')).toBeInTheDocument();
expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
```

**Test: QuestionForm Input Validation - Empty Question**
```javascript
// Arrange
const mockSubmit = jest.fn();
render(<QuestionForm onSubmit={mockSubmit} />);

// Act
fireEvent.click(screen.getByRole('button', { name: /submit/i }));

// Assert
expect(screen.getByText('Question is required')).toBeInTheDocument();
expect(mockSubmit).not.toHaveBeenCalled();
```

**Test: QuestionForm Input Validation - Question Too Short**
```javascript
// Arrange
const mockSubmit = jest.fn();
render(<QuestionForm onSubmit={mockSubmit} />);
const textarea = screen.getByPlaceholderText('Enter your question...');

// Act
fireEvent.change(textarea, { target: { value: 'Hi' } });
fireEvent.click(screen.getByRole('button', { name: /submit/i }));

// Assert
expect(screen.getByText('Question must be at least 10 characters')).toBeInTheDocument();
expect(mockSubmit).not.toHaveBeenCalled();
```

**Test: QuestionForm Successful Submission**
```javascript
// Arrange
const mockSubmit = jest.fn();
render(<QuestionForm onSubmit={mockSubmit} />);
const textarea = screen.getByPlaceholderText('Enter your question...');

// Act
fireEvent.change(textarea, { target: { value: 'This is a valid question for testing' } });
fireEvent.click(screen.getByRole('button', { name: /submit/i }));

// Assert
expect(mockSubmit).toHaveBeenCalledWith({
  question: 'This is a valid question for testing',
  subject: 'General',
  level: 'Intermediate'
});
```

**Test: QuestionForm Error State Display**
```javascript
// Arrange
const mockSubmit = jest.fn();
render(<QuestionForm onSubmit={mockSubmit} error="Submission failed" />);

// Act & Assert
expect(screen.getByText('Submission failed')).toBeInTheDocument();
expect(screen.getByRole('alert')).toHaveClass('error');
```

#### 3.2 AdvancedOptions Component Tests

**Test: AdvancedOptions Toggle Behavior**
```javascript
// Arrange
render(<AdvancedOptions onOptionsChange={jest.fn()} />);

// Act
const toggleButton = screen.getByRole('button', { name: /advanced options/i });
fireEvent.click(toggleButton);

// Assert
expect(screen.getByLabelText('Subject')).toBeVisible();
expect(screen.getByLabelText('Difficulty Level')).toBeVisible();
```

**Test: AdvancedOptions Default Values**
```javascript
// Arrange
const mockOnChange = jest.fn();
render(<AdvancedOptions onOptionsChange={mockOnChange} />);

// Act
fireEvent.click(screen.getByRole('button', { name: /advanced options/i }));

// Assert
expect(screen.getByDisplayValue('General')).toBeInTheDocument();
expect(screen.getByDisplayValue('Intermediate')).toBeInTheDocument();
```

**Test: AdvancedOptions Value Changes**
```javascript
// Arrange
const mockOnChange = jest.fn();
render(<AdvancedOptions onOptionsChange={mockOnChange} />);
fireEvent.click(screen.getByRole('button', { name: /advanced options/i }));

// Act
fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'Mathematics' } });

// Assert
expect(mockOnChange).toHaveBeenCalledWith({
  subject: 'Mathematics',
  level: 'Intermediate'
});
```

#### 3.3 FeedbackPanel Component Tests

**Test: FeedbackPanel Renders Streamed Markdown Sections**
```javascript
// Arrange
const feedbackData = {
  sections: [
    { id: 1, title: 'Analysis', content: '**Strong points:** Good structure', completed: true },
    { id: 2, title: 'Suggestions', content: 'Consider adding more *examples*', completed: false }
  ]
};

// Act
render(<FeedbackPanel feedback={feedbackData} />);

// Assert
expect(screen.getByText('Strong points:')).toBeInTheDocument();
expect(screen.getByText('Good structure')).toBeInTheDocument();
expect(screen.getByText('examples')).toHaveStyle('font-style: italic');
```

**Test: FeedbackPanel Loading State**
```javascript
// Arrange
const loadingFeedback = {
  sections: [
    { id: 1, title: 'Analysis', content: '', completed: false }
  ]
};

// Act
render(<FeedbackPanel feedback={loadingFeedback} isLoading={true} />);

// Assert
expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
expect(screen.getByText('Generating feedback...')).toBeInTheDocument();
```

**Test: FeedbackPanel Progressive Section Updates**
```javascript
// Arrange
const { rerender } = render(<FeedbackPanel feedback={{ sections: [] }} />);

// Act - First update
rerender(<FeedbackPanel feedback={{
  sections: [{ id: 1, title: 'Analysis', content: 'Initial content', completed: false }]
}} />);

// Assert
expect(screen.getByText('Initial content')).toBeInTheDocument();

// Act - Second update
rerender(<FeedbackPanel feedback={{
  sections: [
    { id: 1, title: 'Analysis', content: 'Initial content', completed: true },
    { id: 2, title: 'Suggestions', content: 'New suggestions', completed: false }
  ]
}} />);

// Assert
expect(screen.getByText('Initial content')).toBeInTheDocument();
expect(screen.getByText('New suggestions')).toBeInTheDocument();
```

#### 3.4 HistoryTab Component Tests

**Test: HistoryTab Displays Persisted Submissions**
```javascript
// Arrange
const mockHistory = [
  {
    id: '1',
    question: 'Test question 1',
    subject: 'Mathematics',
    submittedAt: '2024-01-01T10:00:00Z',
    status: 'completed'
  },
  {
    id: '2',
    question: 'Test question 2',
    subject: 'Physics',
    submittedAt: '2024-01-02T11:00:00Z',
    status: 'processing'
  }
];

// Act
render(<HistoryTab history={mockHistory} />);

// Assert
expect(screen.getByText('Test question 1')).toBeInTheDocument();
expect(screen.getByText('Mathematics')).toBeInTheDocument();
expect(screen.getByText('completed')).toBeInTheDocument();
expect(screen.getByText('Test question 2')).toBeInTheDocument();
expect(screen.getByText('processing')).toBeInTheDocument();
```

**Test: HistoryTab Empty State**
```javascript
// Arrange & Act
render(<HistoryTab history={[]} />);

// Assert
expect(screen.getByText('No previous submissions found')).toBeInTheDocument();
expect(screen.getByText('Submit your first question to see history here')).toBeInTheDocument();
```

**Test: HistoryTab Item Click Navigation**
```javascript
// Arrange
const mockHistory = [
  { id: '1', question: 'Test question', subject: 'Math', submittedAt: '2024-01-01T10:00:00Z', status: 'completed' }
];
const mockOnItemClick = jest.fn();

// Act
render(<HistoryTab history={mockHistory} onItemClick={mockOnItemClick} />);
fireEvent.click(screen.getByText('Test question'));

// Assert
expect(mockOnItemClick).toHaveBeenCalledWith('1');
```

### 4. State Management Tests

#### 4.1 useAIMarker Hook Tests

**Test: useAIMarker Hook - Initial State**
```javascript
// Arrange & Act
const { result } = renderHook(() => useAIMarker());

// Assert
expect(result.current.isLoading).toBe(false);
expect(result.current.feedback).toBeNull();
expect(result.current.error).toBeNull();
expect(result.current.history).toEqual([]);
```

**Test: useAIMarker Hook - Submit Question Loading Flow**
```javascript
// Arrange
const mockAPI = {
  submitQuestion: jest.fn().mockResolvedValue({ submissionId: 'test-id' })
};
const { result } = renderHook(() => useAIMarker(mockAPI));

// Act
act(() => {
  result.current.submitQuestion({ question: 'Test question', subject: 'Math' });
});

// Assert
expect(result.current.isLoading).toBe(true);
expect(mockAPI.submitQuestion).toHaveBeenCalledWith({
  question: 'Test question',
  subject: 'Math'
});
```

**Test: useAIMarker Hook - Submit Question Success Flow**
```javascript
// Arrange
const mockAPI = {
  submitQuestion: jest.fn().mockResolvedValue({ submissionId: 'test-id' }),
  streamFeedback: jest.fn().mockResolvedValue({ sections: [] })
};
const { result } = renderHook(() => useAIMarker(mockAPI));

// Act
await act(async () => {
  await result.current.submitQuestion({ question: 'Test question' });
});

// Assert
expect(result.current.isLoading).toBe(false);
expect(result.current.feedback).toBeDefined();
expect(result.current.error).toBeNull();
```

**Test: useAIMarker Hook - Submit Question Error Flow**
```javascript
// Arrange
const mockAPI = {
  submitQuestion: jest.fn().mockRejectedValue(new Error('API Error'))
};
const { result } = renderHook(() => useAIMarker(mockAPI));

// Act
await act(async () => {
  await result.current.submitQuestion({ question: 'Test question' });
});

// Assert
expect(result.current.isLoading).toBe(false);
expect(result.current.error).toBe('API Error');
expect(result.current.feedback).toBeNull();
```

**Test: useAIMarker Hook - Mocked API Integration**
```javascript
// Arrange
const mockAPI = {
  submitQuestion: jest.fn().mockResolvedValue({ submissionId: 'mock-id' }),
  streamFeedback: jest.fn().mockImplementation((id, callback) => {
    callback({ id: 1, title: 'Mock Section', content: 'Mock content', completed: true });
    return Promise.resolve();
  }),
  fetchHistory: jest.fn().mockResolvedValue([
    { id: '1', question: 'Previous question', status: 'completed' }
  ])
};

const { result } = renderHook(() => useAIMarker(mockAPI));

// Act
await act(async () => {
  await result.current.fetchHistory();
});

// Assert
expect(result.current.history).toHaveLength(1);
expect(result.current.history[0].question).toBe('Previous question');
```

#### 4.2 React Query Integration Tests

**Test: React Query Cache Invalidation for History Data**
```javascript
// Arrange
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

// Act
const { result } = renderHook(() => useQuery(['history'], fetchHistory), { wrapper });

// Simulate data update
await act(async () => {
  queryClient.setQueryData(['history'], [
    { id: '1', question: 'Updated question' }
  ]);
});

// Assert
expect(result.current.data).toEqual([
  { id: '1', question: 'Updated question' }
]);
```

**Test: React Query Refetch Behavior**
```javascript
// Arrange
const mockFetchHistory = jest.fn()
  .mockResolvedValueOnce([{ id: '1', question: 'First fetch' }])
  .mockResolvedValueOnce([{ id: '1', question: 'Second fetch' }]);

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const { result } = renderHook(
  () => useQuery(['history'], mockFetchHistory),
  { wrapper }
);

// Act - First fetch
await waitFor(() => expect(result.current.isSuccess).toBe(true));

// Act - Refetch
await act(async () => {
  await result.current.refetch();
});

// Assert
expect(mockFetchHistory).toHaveBeenCalledTimes(2);
expect(result.current.data[0].question).toBe('Second fetch');
```

**Test: React Query Error Handling**
```javascript
// Arrange
const mockFetchHistory = jest.fn().mockRejectedValue(new Error('Network error'));
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } }
});
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

// Act
const { result } = renderHook(
  () => useQuery(['history'], mockFetchHistory),
  { wrapper }
);

// Assert
await waitFor(() => expect(result.current.isError).toBe(true));
expect(result.current.error.message).toBe('Network error');
```

### 5. Type Safety and Conversion Tests

#### 5.1 TypeScript Interface Conformance Tests

**Test: API Response Interface Conformance**
```typescript
// Arrange
interface APIResponse {
  submissionId: string;
  status: 'processing' | 'completed' | 'error';
  timestamp: string;
}

const mockResponse = {
  submissionId: 'test-123',
  status: 'processing' as const,
  timestamp: '2024-01-01T10:00:00Z'
};

// Act
const validateResponse = (response: unknown): response is APIResponse => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'submissionId' in response &&
    'status' in response &&
    'timestamp' in response
  );
};

// Assert
expect(validateResponse(mockResponse)).toBe(true);
```

**Test: Component Props Type Safety**
```typescript
// Arrange
interface QuestionFormProps {
  onSubmit: (data: { question: string; subject: string; level: string }) => void;
  error?: string;
  isLoading?: boolean;
}

const validProps: QuestionFormProps = {
  onSubmit: (data) => console.log(data),
  error: 'Test error',
  isLoading: false
};

// Act & Assert - This should compile without errors
const component = <QuestionForm {...validProps} />;
expect(component).toBeDefined();
```

#### 5.2 Compile-time Checks for Refactored Components

**Test: Strict Type Checking for Hook Return Types**
```typescript
// Arrange
interface UseAIMarkerReturn {
  isLoading: boolean;
  feedback: FeedbackData | null;
  error: string | null;
  submitQuestion: (data: QuestionData) => Promise<void>;
  fetchHistory: () => Promise<void>;
  history: HistoryItem[];
}

// Act - This test ensures the hook returns the correct type structure
const hookReturn = useAIMarker();

// Assert - TypeScript compile-time verification
const isLoadingType: boolean = hookReturn.isLoading;
const feedbackType: FeedbackData | null = hookReturn.feedback;
const errorType: string | null = hookReturn.error;

expect(typeof isLoadingType).toBe('boolean');
```

**Test: Generic Type Safety for API Functions**
```typescript
// Arrange
interface APIFunction<T, R> {
  (input: T): Promise<R>;
}

interface SubmissionInput {
  question: string;
  subject: string;
}

interface SubmissionOutput {
  submissionId: string;
  status: string;
}

const submitQuestion: APIFunction<SubmissionInput, SubmissionOutput> = async (input) => {
  return { submissionId: 'test', status: 'processing' };
};

// Act
const result = await submitQuestion({
  question: 'Test question',
  subject: 'Mathematics'
});

// Assert
expect(result.submissionId).toBe('test');
expect(result.status).toBe('processing');
```

### 6. Feature Enhancement Tests

#### 6.1 Streaming UI Incremental Rendering Tests

**Test: Streaming UI Progressive Content Updates**
```javascript
// Arrange
const StreamingComponent = ({ streamData }) => {
  const [content, setContent] = useState([]);
  
  useEffect(() => {
    streamData.forEach((chunk, index) => {
      setTimeout(() => {
        setContent(prev => [...prev, chunk]);
      }, index * 100);
    });
  }, [streamData]);

  return (
    <div data-testid="streaming-content">
      {content.map((chunk, index) => (
        <div key={index}>{chunk}</div>
      ))}
    </div>
  );
};

const mockStreamData = ['Chunk 1', 'Chunk 2', 'Chunk 3'];

// Act
render(<StreamingComponent streamData={mockStreamData} />);

// Assert - Check initial state
expect(screen.getByTestId('streaming-content')).toBeEmptyDOMElement();

// Assert - Check progressive updates
await waitFor(() => expect(screen.getByText('Chunk 1')).toBeInTheDocument());
await waitFor(() => expect(screen.getByText('Chunk 2')).toBeInTheDocument());
await waitFor(() => expect(screen.getByText('Chunk 3')).toBeInTheDocument());
```

**Test: Markdown Section Streaming Behavior**
```javascript
// Arrange
const mockMarkdownSections = [
  { id: 1, title: 'Introduction', content: '## Introduction\nThis is the *introduction*' },
  { id: 2, title: 'Analysis', content: '## Analysis\n**Key points:**\n- Point 1\n- Point 2' }
];

// Act
render(<FeedbackPanel sections={mockMarkdownSections} isStreaming={true} />);

// Assert
expect(screen.getByText('Introduction')).toBeInTheDocument();
expect(screen.getByText('introduction')).toHaveStyle('font-style: italic');
expect(screen.getByText('Key points:')).toHaveStyle('font-weight: bold');
```

**Test: Stream Error Handling**
```javascript
// Arrange
const StreamingComponent = ({ onStreamError }) => {
  const [error, setError] = useState(null);

  const simulateStreamError = () => {
    setError('Stream connection lost');
    onStreamError('Stream connection lost');
  };

  return (
    <div>
      <button onClick={simulateStreamError}>Simulate Error</button>
      {error && <div role="alert">{error}</div>}
    </div>
  );
};

const mockErrorHandler = jest.fn();

// Act
render(<StreamingComponent onStreamError={mockErrorHandler} />);
fireEvent.click(screen.getByText('Simulate Error'));

// Assert
expect(screen.getByRole('alert')).toHaveTextContent('Stream connection lost');
expect(mockErrorHandler).toHaveBeenCalledWith('Stream connection lost');
```

#### 6.2 Football Tracker Data Persistence and Export Tests

**Test: Football Tracker CSV Import Validation**
```javascript
// Arrange
const mockCSVContent = `name,position,overall,pace,shooting
Messi,RW,93,85,92
Ronaldo,ST,91,89,93
Neymar,LW,89,91,83`;

const parseCSV = (content) => {
  const lines = content.split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index];
      return obj;
    }, {});
  });
};

// Act
const players = parseCSV(mockCSVContent);

// Assert
expect(players).toHaveLength(3);
expect(players[0].name).toBe('Messi');
expect(players[0].overall).toBe('93');
expect(players[1].position).toBe('ST');
```

**Test: Team Data Export Functionality**
```javascript
// Arrange
const teamData = {
  name: 'Barcelona',
  formation: '4-3-3',
  players: [
    { name: 'Ter Stegen', position: 'GK', overall: 87 },
    { name: 'Messi', position: 'RW', overall: 93 }
  ]
};

const exportTeamToJSON = (team) => {
  return JSON.stringify(team, null, 2);
};

// Act
const exportedData = exportTeamToJSON(teamData);
const parsedData = JSON.parse(exportedData);

// Assert
expect(parsedData.name).toBe('Barcelona');
expect(parsedData.players).toHaveLength(2);
expect(parsedData.players[0].name).toBe('Ter Stegen');
```

**Test: Team Formation Validation**
```javascript
// Arrange
const validFormations = ['4-4-2', '4-3-3', '3-5-2', '5-3-2', '4-2-3-1'];

const validateFormation = (formation) => {
  return validFormations.includes(formation);
};

// Act & Assert
expect(validateFormation('4-3-3')).toBe(true);
expect(validateFormation('invalid-formation')).toBe(false);
expect(validateFormation('10-0-0')).toBe(false);
```

**Test: Player Statistics Persistence**
```javascript
// Arrange
const playerStats = {
  playerId: 'player-123',
  matchesPlayed: 15,
  goals: 8,
  assists: 5,
  yellowCards: 2,
  redCards: 0
};

const updatePlayerStats = (playerId, newStats) => {
  // Simulate database update
  return { ...playerStats, ...newStats, playerId };
};

// Act
const updatedStats = updatePlayerStats('player-123', { goals: 10, assists: 7 });

// Assert
expect(updatedStats.goals).toBe(10);
expect(updatedStats.assists).toBe(7);
expect(updatedStats.matchesPlayed).toBe(15); // Unchanged
expect(updatedStats.playerId).toBe('player-123');
```

## Test Execution Guidelines

### Setup and Teardown

**Before Each Test Suite:**
- Initialize test database with clean schema
- Set up mock API endpoints
- Configure test environment variables
- Create test user accounts and authentication tokens

**After Each Test:**
- Clean up database collections
- Reset mock function calls
- Clear React component state
- Dispose of test resources

**After All Tests:**
- Close database connections
- Stop test servers
- Clean up temporary files

### Edge Cases and Negative Scenarios

#### Database Edge Cases
- Connection timeout scenarios
- Schema validation failures
- Concurrent access conflicts
- Transaction rollback testing

#### API Edge Cases
- Rate limit exceeded responses
- Malformed request payloads
- Network timeout scenarios
- Authentication token expiration

#### Frontend Edge Cases
- Component unmounting during async operations
- Rapid user interactions
- Browser storage limitations
- Network connectivity issues

### Integration Flow Testing

**End-to-End User Journey Tests:**

1. **User Registration and Login Flow**
   - Register new user → Verify email → Login → Access protected routes

2. **AI Marker Complete Flow**
   - Login → Submit question → Stream feedback → View history → Export results

3. **Football Tracker Complete Flow**
   - Login → Import CSV → Create team → Save team → Export team data

## Coverage Requirements

- **Unit Tests**: 90% line coverage minimum
- **Integration Tests**: 80% feature coverage minimum
- **E2E Tests**: 100% critical user journey coverage
- **Type Safety**: 100% interface conformance validation

## Test Data Management

### Test Fixtures
```javascript
// User test data
export const testUsers = {
  validUser: {
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword123'
  },
  adminUser: {
    username: 'admin',
    email: 'admin@example.com',
    password: 'adminPassword123',
    role: 'admin'
  }
};

// Football team test data
export const testTeams = {
  basicTeam: {
    name: 'Test FC',
    formation: '4-4-2',
    players: [
      { name: 'Player 1', position: 'GK', overall: 85 }
    ]
  }
};
```

### Mock Data Generators
```javascript
export const generateRandomUser = () => ({
  username: `user_${Math.random().toString(36).substr(2, 9)}`,
  email: `${Math.random().toString(36).substr(2, 9)}@test.com`,
  password: 'testPassword123'
});

export const generateRandomTeam = () => ({
  name: `Team ${Math.random().toString(36).substr(2, 9)}`,
  formation: ['4-4-2', '4-3-3', '3-5-2'][Math.floor(Math.random() * 3)],
  players: Array.from({ length: 11 }, (_, i) => ({
    name: `Player ${i + 1}`,
    position: ['GK', 'CB', 'LB', 'RB', 'CM', 'LW', 'RW', 'ST'][Math.floor(Math.random() * 8)],
    overall: Math.floor(Math.random() * 40) + 60
  }))
});
```

This comprehensive test specification follows TDD principles and provides complete coverage for the architectural improvements, ensuring robust testing of database operations, API endpoints, frontend components, state management, type safety, and feature enhancements.