import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Brain,
  Code,
  FileText,
  Upload,
  Zap,
  Clock,
  Star,
  TrendingUp,
  Award,
  Target,
  Lightbulb,
  Sparkles,
  Search,
  Filter,
  Settings,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  Download,
  Share2,
  Copy,
  Eye,
  Edit,
  Trash2,
  Plus,
  Bookmark,
  History,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Users,
  Globe,
  Rocket,
  Shield,
  CheckCircle,
  AlertCircle,
  Info,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

// Import enhanced components
import { EnhancedDocumentUpload } from './EnhancedDocumentUpload';
import { EnhancedQuickActions } from './EnhancedQuickActions';

interface DashboardProps {
  onAnalyzeCode: (code: string, config: any) => void;
  onApplyPreset: (preset: any) => void;
  currentConfig: any;
  isAnalyzing: boolean;
  analysisProgress?: number;
  recentAnalyses?: any[];
  userStats?: {
    totalAnalyses: number;
    averageScore: number;
    timeSpent: string;
    streak: number;
    favoriteLanguages: string[];
    improvementAreas: string[];
  };
}

const LANGUAGE_ICONS = {
  javascript: '🟨',
  typescript: '🔷',
  python: '🐍',
  java: '☕',
  cpp: '⚡',
  csharp: '🔷',
  go: '🐹',
  rust: '🦀',
  php: '🐘',
  ruby: '💎',
  swift: '🍎',
  kotlin: '🎯'
};

const ANALYSIS_TYPES = [
  { id: 'code-review', name: 'Code Review', icon: Eye, description: 'Comprehensive code analysis' },
  { id: 'bug-detection', name: 'Bug Detection', icon: Shield, description: 'Find potential issues' },
  { id: 'performance', name: 'Performance', icon: Rocket, description: 'Optimize performance' },
  { id: 'security', name: 'Security', icon: Shield, description: 'Security vulnerability scan' },
  { id: 'best-practices', name: 'Best Practices', icon: Star, description: 'Code quality assessment' },
  { id: 'documentation', name: 'Documentation', icon: FileText, description: 'Generate documentation' }
];

const QUICK_TEMPLATES = [
  {
    id: 'react-component',
    name: 'React Component',
    language: 'typescript',
    code: `import React, { useState } from 'react';

interface Props {
  title: string;
  onSubmit: (value: string) => void;
}

export const MyComponent: React.FC<Props> = ({ title, onSubmit }) => {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value);
      setValue('');
    }
  };

  return (
    <div className="p-4">
      <h2>{title}</h2>
      <input 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter value..."
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};`
  },
  {
    id: 'python-function',
    name: 'Python Function',
    language: 'python',
    code: `def calculate_fibonacci(n):
    """
    Calculate the nth Fibonacci number using dynamic programming.
    
    Args:
        n (int): The position in the Fibonacci sequence
        
    Returns:
        int: The nth Fibonacci number
    """
    if n <= 1:
        return n
    
    dp = [0] * (n + 1)
    dp[1] = 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]

# Example usage
result = calculate_fibonacci(10)
print(f"The 10th Fibonacci number is: {result}")`
  },
  {
    id: 'api-endpoint',
    name: 'API Endpoint',
    language: 'javascript',
    code: `const express = require('express');
const router = express.Router();

// GET /api/users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    const users = await User.find(
      search ? { name: { $regex: search, $options: 'i' } } : {}
    )
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });
    
    const total = await User.countDocuments();
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;`
  }
];

export const Dashboard: React.FC<DashboardProps> = ({
  onAnalyzeCode,
  onApplyPreset,
  currentConfig,
  isAnalyzing,
  analysisProgress = 0,
  recentAnalyses = [],
  userStats = {
    totalAnalyses: 0,
    averageScore: 0,
    timeSpent: '0h',
    streak: 0,
    favoriteLanguages: [],
    improvementAreas: []
  }
}) => {
  const [activeTab, setActiveTab] = useState('analyze');
  const [codeInput, setCodeInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [analysisType, setAnalysisType] = useState('code-review');
  const [showTemplates, setShowTemplates] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTemplateSelect = (template: typeof QUICK_TEMPLATES[0]) => {
    setCodeInput(template.code);
    setSelectedLanguage(template.language);
    setShowTemplates(false);
    toast.success(`Applied ${template.name} template`);
  };

  const handleAnalyze = () => {
    if (!codeInput.trim()) {
      toast.error('Please enter some code to analyze');
      return;
    }

    onAnalyzeCode(codeInput, {
      language: selectedLanguage,
      analysisType,
      ...currentConfig
    });
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="card-interactive">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold">{value}</p>
              {trend && (
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">+{trend}%</span>
                  <span className="text-muted-foreground">vs last week</span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl">
              <Brain className="h-8 w-8" />
            </div>
            <div>
              <h1 className="heading-primary text-gradient-rainbow">AI Code Mentor</h1>
              <p className="text-body text-muted-foreground">
                Intelligent code analysis, feedback, and improvement suggestions
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Analyses"
              value={userStats.totalAnalyses}
              icon={FileText}
              color="from-blue-500 to-blue-600"
              trend={12}
            />
            <StatCard
              title="Average Score"
              value={`${userStats.averageScore}/10`}
              icon={Award}
              color="from-green-500 to-green-600"
              trend={8}
            />
            <StatCard
              title="Time Spent"
              value={userStats.timeSpent}
              icon={Clock}
              color="from-purple-500 to-purple-600"
              trend={15}
            />
            <StatCard
              title="Current Streak"
              value={`${userStats.streak} days`}
              icon={TrendingUp}
              color="from-orange-500 to-orange-600"
              trend={5}
            />
          </div>
        </motion.div>

        {/* Main Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 bg-muted/50 p-1 h-12">
              <TabsTrigger value="analyze" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span className="hidden sm:inline">Analyze</span>
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Upload</span>
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Templates</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Insights</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Code Analysis Tab */}
            <TabsContent value="analyze" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Code Input */}
                <div className="lg:col-span-2 space-y-4">
                  <Card className="card-elevated">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Code className="h-5 w-5 text-primary" />
                          Code Input
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowTemplates(!showTemplates)}
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Templates
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCodeInput('')}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Language and Analysis Type Selection */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Programming Language</Label>
                          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(LANGUAGE_ICONS).map(([lang, icon]) => (
                                <SelectItem key={lang} value={lang}>
                                  <div className="flex items-center gap-2">
                                    <span>{icon}</span>
                                    <span className="capitalize">{lang}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Analysis Type</Label>
                          <Select value={analysisType} onValueChange={setAnalysisType}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ANALYSIS_TYPES.map((type) => {
                                const Icon = type.icon;
                                return (
                                  <SelectItem key={type.id} value={type.id}>
                                    <div className="flex items-center gap-2">
                                      <Icon className="h-4 w-4" />
                                      <span>{type.name}</span>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Code Textarea */}
                      <div className="space-y-2">
                        <Label>Your Code</Label>
                        <Textarea
                          value={codeInput}
                          onChange={(e) => setCodeInput(e.target.value)}
                          placeholder="Paste your code here for analysis..."
                          className="min-h-[400px] font-mono text-sm resize-none"
                        />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{codeInput.length} characters</span>
                          <span>{codeInput.split('\n').length} lines</span>
                        </div>
                      </div>

                      {/* Analysis Progress */}
                      <AnimatePresence>
                        {isAnalyzing && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2"
                          >
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin text-primary" />
                              <span className="text-sm font-medium">Analyzing code...</span>
                            </div>
                            <Progress value={analysisProgress} className="h-2" />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button
                          onClick={handleAnalyze}
                          disabled={isAnalyzing || !codeInput.trim()}
                          className="btn-apple-primary flex-1"
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Brain className="h-4 w-4 mr-2" />
                              Analyze Code
                            </>
                          )}
                        </Button>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy code</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Download code</TooltipContent>
                        </Tooltip>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Templates */}
                  <AnimatePresence>
                    {showTemplates && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Card className="card-elevated">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Zap className="h-5 w-5 text-primary" />
                              Quick Templates
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {QUICK_TEMPLATES.map((template) => (
                                <Button
                                  key={template.id}
                                  variant="outline"
                                  className="h-auto p-4 text-left justify-start"
                                  onClick={() => handleTemplateSelect(template)}
                                >
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span>{LANGUAGE_ICONS[template.language as keyof typeof LANGUAGE_ICONS]}</span>
                                      <span className="font-medium">{template.name}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground capitalize">
                                      {template.language}
                                    </p>
                                  </div>
                                </Button>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  <EnhancedQuickActions
                    onApplyPreset={onApplyPreset}
                    currentConfig={currentConfig}
                  />

                  {/* Recent Analyses */}
                  <Card className="card-elevated">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5 text-primary" />
                        Recent Analyses
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {recentAnalyses.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">
                          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No recent analyses</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {recentAnalyses.slice(0, 5).map((analysis, index) => (
                            <div key={index} className="p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <p className="text-sm font-medium">{analysis.language}</p>
                                  <p className="text-xs text-muted-foreground">{analysis.type}</p>
                                </div>
                                <Badge variant="secondary">{analysis.score}/10</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* File Upload Tab */}
            <TabsContent value="upload" className="space-y-6">
              <EnhancedDocumentUpload
                onDocumentExtracted={(text, filename) => {
                  setCodeInput(text);
                  setActiveTab('analyze');
                  toast.success(`Code extracted from ${filename}`);
                }}
                onDocumentUploaded={(document) => {
                  toast.success(`${document.name} uploaded successfully`);
                }}
              />
            </TabsContent>

            {/* Other tabs would be implemented similarly... */}
            <TabsContent value="templates">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Code Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Template library coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Analysis History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">History view coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Code Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Insights dashboard coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Settings panel coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </TooltipProvider>
  );
}; 