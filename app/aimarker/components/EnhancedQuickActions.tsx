import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  BookOpen, 
  FileText, 
  Calculator, 
  Microscope, 
  Globe, 
  Clock, 
  ChevronDown, 
  ChevronRight, 
  Zap, 
  User,
  Search,
  Star,
  Plus,
  Edit,
  Trash2,
  Copy,
  Download,
  Upload,
  Settings,
  Filter,
  BookmarkPlus,
  History,
  Sparkles,
  Target,
  Award,
  Brain,
  Lightbulb,
  Rocket,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { PersonalConfigs } from './PersonalConfigs';

interface QuickActionsProps {
  onApplyPreset: (preset: {
    subject: string;
    examBoard: string;
    questionType: string;
    totalMarks: string;
    markScheme?: string;
    name: string;
  }) => void;
  currentConfig: {
    subject: string;
    examBoard: string;
    questionType: string;
    totalMarks: string;
    markScheme: string;
    userType: string;
    tier: string;
  };
  isLoggedIn?: boolean;
  onLoginRequired?: () => void;
}

const QUICK_PRESETS = [
  {
    id: 'english-aqa-lang-p1-q2',
    name: 'English AQA Lang P1 Q2',
    subject: 'english',
    examBoard: 'aqa',
    questionType: 'language_analysis',
    totalMarks: '8',
    description: 'Language analysis (8 marks)',
    icon: BookOpen,
    color: 'from-blue-500 to-blue-600',
    category: 'english',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
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
  {
    id: 'english-aqa-lang-p1-q4',
    name: 'English AQA Lang P1 Q4',
    subject: 'english',
    examBoard: 'aqa',
    questionType: 'evaluation',
    totalMarks: '20',
    description: 'Evaluation (20 marks)',
    icon: FileText,
    color: 'from-green-500 to-green-600',
    category: 'english',
    difficulty: 'advanced',
    estimatedTime: '25 min'
  },
  {
    id: 'maths-aqa-higher',
    name: 'Maths AQA Higher',
    subject: 'mathematics',
    examBoard: 'aqa',
    questionType: 'algebra',
    totalMarks: '6',
    description: 'Higher tier algebra (6 marks)',
    icon: Calculator,
    color: 'from-purple-500 to-purple-600',
    category: 'mathematics',
    difficulty: 'advanced',
    estimatedTime: '12 min'
  },
  {
    id: 'science-aqa-biology',
    name: 'Science AQA Biology',
    subject: 'biology',
    examBoard: 'aqa',
    questionType: 'extended_response',
    totalMarks: '6',
    description: 'Extended response (6 marks)',
    icon: Microscope,
    color: 'from-emerald-500 to-emerald-600',
    category: 'science',
    difficulty: 'intermediate',
    estimatedTime: '10 min'
  },
  {
    id: 'history-aqa-explain',
    name: 'History AQA Explain',
    subject: 'history',
    examBoard: 'aqa',
    questionType: 'explain',
    totalMarks: '12',
    description: 'Explain question (12 marks)',
    icon: Globe,
    color: 'from-orange-500 to-orange-600',
    category: 'humanities',
    difficulty: 'intermediate',
    estimatedTime: '18 min'
  },
  {
    id: 'physics-edexcel-calculation',
    name: 'Physics Edexcel Calc',
    subject: 'physics',
    examBoard: 'edexcel',
    questionType: 'calculation',
    totalMarks: '4',
    description: 'Physics calculation (4 marks)',
    icon: Zap,
    color: 'from-yellow-500 to-yellow-600',
    category: 'science',
    difficulty: 'intermediate',
    estimatedTime: '8 min'
  },
  {
    id: 'chemistry-ocr-practical',
    name: 'Chemistry OCR Practical',
    subject: 'chemistry',
    examBoard: 'ocr',
    questionType: 'practical',
    totalMarks: '8',
    description: 'Practical analysis (8 marks)',
    icon: Brain,
    color: 'from-cyan-500 to-cyan-600',
    category: 'science',
    difficulty: 'advanced',
    estimatedTime: '15 min'
  },
  {
    id: 'geography-aqa-case-study',
    name: 'Geography AQA Case Study',
    subject: 'geography',
    examBoard: 'aqa',
    questionType: 'case_study',
    totalMarks: '9',
    description: 'Case study analysis (9 marks)',
    icon: Globe,
    color: 'from-teal-500 to-teal-600',
    category: 'humanities',
    difficulty: 'advanced',
    estimatedTime: '20 min'
  }
];

const CATEGORIES = [
  { id: 'all', name: 'All', icon: Sparkles, color: 'text-gray-500' },
  { id: 'english', name: 'English', icon: BookOpen, color: 'text-blue-500' },
  { id: 'mathematics', name: 'Maths', icon: Calculator, color: 'text-purple-500' },
  { id: 'science', name: 'Science', icon: Microscope, color: 'text-green-500' },
  { id: 'humanities', name: 'Humanities', icon: Globe, color: 'text-orange-500' }
];

const DIFFICULTY_COLORS = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

export const EnhancedQuickActions: React.FC<QuickActionsProps> = ({ 
  onApplyPreset, 
  currentConfig, 
  isLoggedIn = false, 
  onLoginRequired = () => {} 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [recentPresets, setRecentPresets] = useState<string[]>([]);
  const [favoritePresets, setFavoritePresets] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Load user preferences
  useEffect(() => {
    const recent = localStorage.getItem('aimarker-recent-presets');
    const favorites = localStorage.getItem('aimarker-favorite-presets');
    
    if (recent) setRecentPresets(JSON.parse(recent));
    if (favorites) setFavoritePresets(JSON.parse(favorites));
  }, []);

  const handlePresetClick = (preset: typeof QUICK_PRESETS[0]) => {
    onApplyPreset({
      subject: preset.subject,
      examBoard: preset.examBoard,
      questionType: preset.questionType,
      totalMarks: preset.totalMarks,
      markScheme: preset.markScheme,
      name: preset.name
    });

    // Add to recent presets
    const newRecent = [preset.id, ...recentPresets.filter(id => id !== preset.id)].slice(0, 5);
    setRecentPresets(newRecent);
    localStorage.setItem('aimarker-recent-presets', JSON.stringify(newRecent));

    toast.success(`Applied preset: ${preset.name}`, {
      description: `${preset.description} • ${preset.estimatedTime}`,
      action: {
        label: 'Undo',
        onClick: () => {
          // Could implement undo functionality here
        }
      }
    });
  };

  const toggleFavorite = (presetId: string) => {
    const newFavorites = favoritePresets.includes(presetId)
      ? favoritePresets.filter(id => id !== presetId)
      : [...favoritePresets, presetId];
    
    setFavoritePresets(newFavorites);
    localStorage.setItem('aimarker-favorite-presets', JSON.stringify(newFavorites));
    
    toast.success(
      favoritePresets.includes(presetId) ? 'Removed from favorites' : 'Added to favorites'
    );
  };

  const filteredPresets = QUICK_PRESETS.filter(preset => {
    const matchesSearch = preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         preset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         preset.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || preset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const recentPresetsData = QUICK_PRESETS.filter(preset => recentPresets.includes(preset.id));
  const favoritePresetsData = QUICK_PRESETS.filter(preset => favoritePresets.includes(preset.id));

  const PresetCard = ({ preset, showStats = false }: { preset: typeof QUICK_PRESETS[0], showStats?: boolean }) => {
    const Icon = preset.icon;
    const isFavorite = favoritePresets.includes(preset.id);
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative"
      >
        <Card className="card-interactive h-full overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${preset.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
          
          <CardContent className="p-4 relative">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${preset.color} text-white shadow-lg`}>
                <Icon className="h-5 w-5" />
              </div>
              
              <div className="flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(preset.id);
                      }}
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Star className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <h3 className="font-semibold text-sm leading-tight">{preset.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{preset.description}</p>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${DIFFICULTY_COLORS[preset.difficulty as keyof typeof DIFFICULTY_COLORS]}`}
                >
                  {preset.difficulty}
                </Badge>
                <span className="text-muted-foreground">{preset.totalMarks}m</span>
              </div>
              
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{preset.estimatedTime}</span>
              </div>
            </div>

            {showStats && (
              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Success Rate</span>
                  <span className="text-green-600 font-medium">87%</span>
                </div>
              </div>
            )}

            <Button
              onClick={() => handlePresetClick(preset)}
              className="w-full mt-3 h-8 text-xs"
              size="sm"
            >
              Apply Preset
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <TooltipProvider>
      <Card className="card-elevated border-primary/20">
        <CardHeader className="pb-3">
          <Button
            variant="ghost"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-2 text-sm p-0 h-auto hover:bg-transparent justify-start"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 90 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <Zap className="h-4 w-4" />
            </div>
            <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
            <Badge variant="secondary" className="ml-auto">
              {QUICK_PRESETS.length} presets
            </Badge>
          </Button>
        </CardHeader>
        
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="space-y-4">
                {/* Search and Filters */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search presets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-9"
                    />
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {CATEGORIES.map(category => {
                      const Icon = category.icon;
                      return (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category.id)}
                          className="h-8 text-xs"
                        >
                          <Icon className={`h-3 w-3 mr-1.5 ${category.color}`} />
                          {category.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-muted/50 h-9">
                    <TabsTrigger value="all" className="text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      All
                    </TabsTrigger>
                    <TabsTrigger value="recent" className="text-xs">
                      <History className="h-3 w-3 mr-1" />
                      Recent
                    </TabsTrigger>
                    <TabsTrigger value="favorites" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Favorites
                    </TabsTrigger>
                    <TabsTrigger value="personal" className="text-xs">
                      <User className="h-3 w-3 mr-1" />
                      Personal
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="space-y-4 mt-4">
                    {filteredPresets.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No presets found</p>
                        <p className="text-xs">Try adjusting your search or filters</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredPresets.map((preset) => (
                          <PresetCard key={preset.id} preset={preset} />
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="recent" className="space-y-4 mt-4">
                    {recentPresetsData.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No recent presets</p>
                        <p className="text-xs">Start using presets to see them here</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {recentPresetsData.map((preset) => (
                          <PresetCard key={preset.id} preset={preset} showStats />
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="favorites" className="space-y-4 mt-4">
                    {favoritePresetsData.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No favorite presets</p>
                        <p className="text-xs">Star presets to save them here</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {favoritePresetsData.map((preset) => (
                          <PresetCard key={preset.id} preset={preset} showStats />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="personal" className="space-y-4 mt-4">
                    <PersonalConfigs
                      onApplyConfig={(config) => {
                        onApplyPreset({
                          subject: config.subject,
                          examBoard: config.examBoard,
                          questionType: config.questionType,
                          totalMarks: config.totalMarks,
                          markScheme: config.markScheme,
                          name: config.name
                        });
                      }}
                      currentConfig={currentConfig}
                      isLoggedIn={isLoggedIn}
                      onLoginRequired={onLoginRequired}
                    />
                  </TabsContent>
                </Tabs>

                {/* Quick Stats */}
                <div className="pt-4 border-t border-border/50">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-primary">{QUICK_PRESETS.length}</div>
                      <div className="text-xs text-muted-foreground">Total Presets</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-green-600">{favoritePresets.length}</div>
                      <div className="text-xs text-muted-foreground">Favorites</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-blue-600">{recentPresets.length}</div>
                      <div className="text-xs text-muted-foreground">Recent</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1">
                    <Lightbulb className="h-3 w-3" />
                    Click any preset to auto-fill all settings and mark schemes
                  </p>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </TooltipProvider>
  );
}; 