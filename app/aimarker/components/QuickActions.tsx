import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, FileText, Calculator, Microscope, Globe, Clock, ChevronDown, ChevronRight, Zap, User } from 'lucide-react';
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
    color: 'bg-blue-500',
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
    color: 'bg-green-500'
  },
  {
    id: 'maths-aqa-higher',
    name: 'Maths AQA Higher',
    subject: 'mathematics',
    examBoard: 'aqa',
    questionType: 'algebra',
    totalMarks: '6',
    description: 'Higher tier (6 marks)',
    icon: Calculator,
    color: 'bg-purple-500'
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
    color: 'bg-emerald-500'
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
    color: 'bg-orange-500'
  }
];

export const QuickActions: React.FC<QuickActionsProps> = ({ 
  onApplyPreset, 
  currentConfig, 
  isLoggedIn = false, 
  onLoginRequired = () => {} 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handlePresetClick = (preset: typeof QUICK_PRESETS[0]) => {
    onApplyPreset({
      subject: preset.subject,
      examBoard: preset.examBoard,
      questionType: preset.questionType,
      totalMarks: preset.totalMarks,
      markScheme: preset.markScheme,
      name: preset.name
    });
    toast.success(`Applied preset: ${preset.name}`);
  };

  const handlePersonalConfigApply = (config: any) => {
    onApplyPreset({
      subject: config.subject,
      examBoard: config.examBoard,
      questionType: config.questionType,
      totalMarks: config.totalMarks,
      markScheme: config.markScheme,
      name: config.name
    });
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="pb-3">
        <Button
          variant="ghost"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 text-sm p-0 h-auto hover:bg-transparent"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <Zap className="h-4 w-4 text-blue-400" />
          <CardTitle className="text-sm font-medium text-white">Quick Actions</CardTitle>
        </Button>
      </CardHeader>
      
      {!isCollapsed && (
        <CardContent className="space-y-4">
          <Tabs defaultValue="presets" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700/50">
              <TabsTrigger value="presets" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Presets
              </TabsTrigger>
              <TabsTrigger value="personal" className="text-xs">
                <User className="h-3 w-3 mr-1" />
                Personal
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="presets" className="space-y-3 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {QUICK_PRESETS.map((preset) => {
                  const Icon = preset.icon;
                  return (
                    <Button
                      key={preset.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePresetClick(preset)}
                      className="flex items-center gap-2 h-auto p-3 border-gray-600 hover:border-gray-500 hover:bg-gray-700/50 text-left justify-start"
                    >
                      <div className={`p-1.5 rounded ${preset.color} text-white`}>
                        <Icon className="h-3 w-3" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-medium text-white">{preset.name}</span>
                        <span className="text-xs text-gray-400">{preset.description}</span>
                      </div>
                    </Button>
                  );
                })}
              </div>
              <div className="pt-2 border-t border-gray-700">
                <p className="text-xs text-gray-400">
                  Click any preset to auto-fill subject, exam board, question type, marks, and mark scheme
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="personal" className="mt-4">
              <PersonalConfigs
                currentConfig={currentConfig}
                onApplyConfig={handlePersonalConfigApply}
                isLoggedIn={isLoggedIn}
                onLoginRequired={onLoginRequired}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
}; 