import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Brain,
  Code,
  Upload,
  FileText,
  Zap,
  Star,
  Clock,
  Award,
  TrendingUp,
  Search,
  Filter,
  Settings,
  HelpCircle,
  Eye,
  Copy,
  Download,
  Share2,
  Bookmark,
  History,
  Lightbulb,
  Rocket,
  Shield,
  Target,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  RotateCcw,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Grid3X3,
  List,
  Calendar,
  Tag,
  Users,
  Globe,
  Activity,
  BarChart3,
  PieChart,
  Loader2,
  CheckCircle,
  AlertCircle,
  Info,
  X
} from 'lucide-react';
import { toast } from 'sonner';

// Import enhanced components
import { 
  EnhancedCard, 
  EnhancedButton, 
  EnhancedProgress, 
  StatItem, 
  EnhancedUploadArea,
  SearchFilterBar,
  EnhancedTooltip,
  LoadingSpinner,
  LoadingSkeleton,
  fadeInUp,
  slideInRight,
  scaleIn,
  staggerContainer
} from './UIEnhancements';

interface EnhancedInterfaceProps {
  onAnalyzeCode?: (code: string, config: any) => void;
  onUploadFile?: (file: File) => void;
  isAnalyzing?: boolean;
  analysisProgress?: number;
  analysisResult?: any;
  userStats?: {
    totalAnalyses: number;
    averageScore: number;
    timeSpent: string;
    streak: number;
    recentActivity: any[];
  };
}

const PROGRAMMING_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', icon: '🟨', color: 'from-yellow-400 to-yellow-600' },
  { id: 'typescript', name: 'TypeScript', icon: '🔷', color: 'from-blue-400 to-blue-600' },
  { id: 'python', name: 'Python', icon: '🐍', color: 'from-green-400 to-green-600' },
  { id: 'java', name: 'Java', icon: '☕', color: 'from-orange-400 to-orange-600' },
  { id: 'cpp', name: 'C++', icon: '⚡', color: 'from-purple-400 to-purple-600' },
  { id: 'csharp', name: 'C#', icon: '🔷', color: 'from-indigo-400 to-indigo-600' },
  { id: 'go', name: 'Go', icon: '🐹', color: 'from-cyan-400 to-cyan-600' },
  { id: 'rust', name: 'Rust', icon: '🦀', color: 'from-red-400 to-red-600' }
];

const ANALYSIS_TYPES = [
  { id: 'code-review', name: 'Code Review', icon: Eye, description: 'Comprehensive analysis' },
  { id: 'bug-detection', name: 'Bug Detection', icon: Shield, description: 'Find potential issues' },
  { id: 'performance', name: 'Performance', icon: Rocket, description: 'Optimize performance' },
  { id: 'security', name: 'Security Scan', icon: Shield, description: 'Security vulnerabilities' },
  { id: 'best-practices', name: 'Best Practices', icon: Star, description: 'Code quality check' },
  { id: 'documentation', name: 'Documentation', icon: FileText, description: 'Generate docs' }
];

const QUICK_ACTIONS = [
  { id: 'format', name: 'Format Code', icon: Code, shortcut: 'Ctrl+Shift+F' },
  { id: 'lint', name: 'Lint Code', icon: CheckCircle, shortcut: 'Ctrl+Shift+L' },
  { id: 'optimize', name: 'Optimize', icon: Rocket, shortcut: 'Ctrl+Shift+O' },
  { id: 'document', name: 'Generate Docs', icon: FileText, shortcut: 'Ctrl+Shift+D' },
  { id: 'test', name: 'Generate Tests', icon: Target, shortcut: 'Ctrl+Shift+T' },
  { id: 'refactor', name: 'Refactor', icon: Edit, shortcut: 'Ctrl+Shift+R' }
];

export const EnhancedInterface: React.FC<EnhancedInterfaceProps> = ({
  onAnalyzeCode,
  onUploadFile,
  isAnalyzing = false,
  analysisProgress = 0,
  analysisResult,
  userStats = {
    totalAnalyses: 0,
    averageScore: 0,
    timeSpent: '0h',
    streak: 0,
    recentActivity: []
  }
}) => {
  const [activeTab, setActiveTab] = useState('analyze');
  const [codeInput, setCodeInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [analysisType, setAnalysisType] = useState('code-review');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showSettings, setShowSettings] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [recentFiles, setRecentFiles] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Enhanced drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onUploadFile?.(file);
      
      // Add to recent files
      const newFile = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      };
      setRecentFiles(prev => [newFile, ...prev.slice(0, 9)]);
    }
  }, [onUploadFile]);

  const handleAnalyze = () => {
    if (!codeInput.trim()) {
      toast.error('Please enter some code to analyze');
      return;
    }

    onAnalyzeCode?.(codeInput, {
      language: selectedLanguage,
      analysisType,
      timestamp: new Date().toISOString()
    });

    toast.success('Analysis started', {
      description: `Analyzing ${selectedLanguage} code for ${analysisType.replace('-', ' ')}`
    });
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const QuickActionButton = ({ action }: { action: typeof QUICK_ACTIONS[0] }) => {
    const Icon = action.icon;
    return (
      <EnhancedTooltip content={`${action.name} (${action.shortcut})`}>
        <EnhancedButton
          variant="ghost"
          size="sm"
          className="h-12 w-full justify-start gap-3 text-left"
          onClick={() => toast.info(`${action.name} feature coming soon!`)}
        >
          <Icon className="h-4 w-4" />
          <div className="flex-1">
            <div className="font-medium">{action.name}</div>
            <div className="text-xs text-muted-foreground">{action.shortcut}</div>
          </div>
        </EnhancedButton>
      </EnhancedTooltip>
    );
  };

  return (
    <TooltipProvider>
      <div 
        className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Enhanced Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3"
              >
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AI Code Mentor
                  </h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Intelligent code analysis & feedback
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center gap-2">
              <SearchFilterBar
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
              />
              
              <EnhancedTooltip content="Settings">
                <EnhancedButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                >
                  <Settings className="h-4 w-4" />
                </EnhancedButton>
              </EnhancedTooltip>

              <EnhancedTooltip content="Help">
                <EnhancedButton variant="ghost" size="sm">
                  <HelpCircle className="h-4 w-4" />
                </EnhancedButton>
              </EnhancedTooltip>
            </div>
          </div>
        </motion.header>

        <div className="container mx-auto p-6 space-y-8">
          {/* Enhanced Stats Dashboard */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <motion.div variants={fadeInUp}>
              <StatItem
                label="Total Analyses"
                value={userStats.totalAnalyses}
                icon={FileText}
                color="from-blue-500 to-blue-600"
                trend={12}
                description="This month"
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <StatItem
                label="Average Score"
                value={`${userStats.averageScore}/10`}
                icon={Award}
                color="from-green-500 to-green-600"
                trend={8}
                description="Code quality"
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <StatItem
                label="Time Spent"
                value={userStats.timeSpent}
                icon={Clock}
                color="from-purple-500 to-purple-600"
                trend={15}
                description="Learning time"
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <StatItem
                label="Current Streak"
                value={`${userStats.streak} days`}
                icon={TrendingUp}
                color="from-orange-500 to-orange-600"
                trend={5}
                description="Keep it up!"
              />
            </motion.div>
          </motion.div>

          {/* Enhanced Main Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 lg:grid-cols-6 bg-muted/50 p-1 h-12">
                <TabsTrigger value="analyze" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <span className="hidden sm:inline">Analyze</span>
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span className="hidden sm:inline">Upload</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">History</span>
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Insights</span>
                </TabsTrigger>
                <TabsTrigger value="templates" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span className="hidden sm:inline">Templates</span>
                </TabsTrigger>
                <TabsTrigger value="help" className="flex items-center gap-2 hidden lg:flex">
                  <HelpCircle className="h-4 w-4" />
                  <span>Help</span>
                </TabsTrigger>
              </TabsList>

              {/* Code Analysis Tab */}
              <TabsContent value="analyze" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Code Input */}
                  <div className="lg:col-span-2 space-y-6">
                    <EnhancedCard hover glow>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Code className="h-5 w-5 text-primary" />
                            Code Analysis
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {selectedLanguage}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {analysisType.replace('-', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Language and Analysis Type Selection */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Programming Language</Label>
                            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                              <SelectTrigger className="h-11">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {PROGRAMMING_LANGUAGES.map((lang) => (
                                  <SelectItem key={lang.id} value={lang.id}>
                                    <div className="flex items-center gap-2">
                                      <span>{lang.icon}</span>
                                      <span>{lang.name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Analysis Type</Label>
                            <Select value={analysisType} onValueChange={setAnalysisType}>
                              <SelectTrigger className="h-11">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ANALYSIS_TYPES.map((type) => {
                                  const Icon = type.icon;
                                  return (
                                    <SelectItem key={type.id} value={type.id}>
                                      <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4" />
                                        <div>
                                          <div>{type.name}</div>
                                          <div className="text-xs text-muted-foreground">{type.description}</div>
                                        </div>
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Code Input Area */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Your Code</Label>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{codeInput.length} characters</span>
                              <span>•</span>
                              <span>{codeInput.split('\n').length} lines</span>
                            </div>
                          </div>
                          <Textarea
                            value={codeInput}
                            onChange={(e) => setCodeInput(e.target.value)}
                            placeholder="Paste your code here for analysis..."
                            className="min-h-[400px] font-mono text-sm resize-none bg-muted/20 border-0 focus:bg-background transition-colors"
                          />
                        </div>

                        {/* Analysis Progress */}
                        <AnimatePresence>
                          {isAnalyzing && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-3"
                            >
                              <div className="flex items-center gap-2">
                                <LoadingSpinner size="sm" />
                                <span className="text-sm font-medium">Analyzing your code...</span>
                              </div>
                              <EnhancedProgress 
                                value={analysisProgress} 
                                label="Analysis Progress"
                                animated
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <EnhancedButton
                            variant="gradient"
                            size="lg"
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !codeInput.trim()}
                            loading={isAnalyzing}
                            className="flex-1"
                            glow
                          >
                            <Brain className="h-4 w-4 mr-2" />
                            {isAnalyzing ? 'Analyzing...' : 'Analyze Code'}
                          </EnhancedButton>
                          
                          <EnhancedTooltip content="Copy code">
                            <EnhancedButton variant="outline" size="lg">
                              <Copy className="h-4 w-4" />
                            </EnhancedButton>
                          </EnhancedTooltip>
                          
                          <EnhancedTooltip content="Clear code">
                            <EnhancedButton 
                              variant="outline" 
                              size="lg"
                              onClick={() => setCodeInput('')}
                            >
                              <RotateCcw className="h-4 w-4" />
                            </EnhancedButton>
                          </EnhancedTooltip>
                        </div>
                      </CardContent>
                    </EnhancedCard>

                    {/* Analysis Results */}
                    <AnimatePresence>
                      {analysisResult && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <EnhancedCard hover>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                Analysis Results
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                                    <div className="text-2xl font-bold text-green-500">8.5</div>
                                    <div className="text-xs text-muted-foreground">Overall Score</div>
                                  </div>
                                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-500">3</div>
                                    <div className="text-xs text-muted-foreground">Issues Found</div>
                                  </div>
                                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-500">12</div>
                                    <div className="text-xs text-muted-foreground">Suggestions</div>
                                  </div>
                                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-500">2.3s</div>
                                    <div className="text-xs text-muted-foreground">Analysis Time</div>
                                  </div>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                  <h4 className="font-medium">Key Findings</h4>
                                  <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>• Code structure is well-organized</li>
                                    <li>• Consider adding error handling</li>
                                    <li>• Variable naming could be improved</li>
                                    <li>• Performance optimization opportunities found</li>
                                  </ul>
                                </div>
                              </div>
                            </CardContent>
                          </EnhancedCard>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Quick Actions */}
                    <EnhancedCard>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-primary" />
                          Quick Actions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {QUICK_ACTIONS.map((action) => (
                          <QuickActionButton key={action.id} action={action} />
                        ))}
                      </CardContent>
                    </EnhancedCard>

                    {/* Recent Files */}
                    <EnhancedCard>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <History className="h-5 w-5 text-primary" />
                          Recent Files
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {recentFiles.length === 0 ? (
                          <div className="text-center py-6 text-muted-foreground">
                            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No recent files</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {recentFiles.slice(0, 5).map((file) => (
                              <div key={file.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/20 cursor-pointer">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(file.uploadedAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <EnhancedButton
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleFavorite(file.id)}
                                >
                                  <Star className={`h-3 w-3 ${favorites.includes(file.id) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                                </EnhancedButton>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </EnhancedCard>
                  </div>
                </div>
              </TabsContent>

              {/* File Upload Tab */}
              <TabsContent value="upload" className="space-y-6">
                <EnhancedUploadArea
                  onFileSelect={(files) => {
                    const file = files[0];
                    if (file) {
                      onUploadFile?.(file);
                      toast.success(`Uploaded ${file.name}`);
                    }
                  }}
                  isDragActive={dragActive}
                  accept=".js,.ts,.py,.java,.cpp,.cs,.go,.rs,.php,.rb"
                  maxSize={10}
                />
              </TabsContent>

              {/* Other tabs would be implemented similarly... */}
              <TabsContent value="history">
                <EnhancedCard>
                  <CardHeader>
                    <CardTitle>Analysis History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Your analysis history will appear here</p>
                    </div>
                  </CardContent>
                </EnhancedCard>
              </TabsContent>

              <TabsContent value="insights">
                <EnhancedCard>
                  <CardHeader>
                    <CardTitle>Code Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Detailed insights and analytics coming soon</p>
                    </div>
                  </CardContent>
                </EnhancedCard>
              </TabsContent>

              <TabsContent value="templates">
                <EnhancedCard>
                  <CardHeader>
                    <CardTitle>Code Templates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Code templates and snippets coming soon</p>
                    </div>
                  </CardContent>
                </EnhancedCard>
              </TabsContent>

              <TabsContent value="help">
                <EnhancedCard>
                  <CardHeader>
                    <CardTitle>Help & Documentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Help documentation coming soon</p>
                    </div>
                  </CardContent>
                </EnhancedCard>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        {/* Settings Dialog */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Settings panel coming soon</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Global Drag Overlay */}
        <AnimatePresence>
          {dragActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-primary/10 backdrop-blur-sm flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-card border-2 border-dashed border-primary rounded-2xl p-8 text-center"
              >
                <Upload className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">Drop your code files here</h3>
                <p className="text-muted-foreground">We'll analyze them automatically</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}; 