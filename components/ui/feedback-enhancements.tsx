import React, { useState } from 'react';
import { Button } from './button';
import { Badge } from './badge';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Progress } from './progress';
import { 
  Download, 
  Share, 
  Printer, 
  Copy, 
  FileText, 
  Star, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Target,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  ScrollReveal, 
  MotionDiv, 
  MagneticButton,
  staggerContainer,
  fadeInUp,
  AnimatedCounter
} from './motion-components';

interface FeedbackEnhancementsProps {
  feedback: string;
  grade: string;
  achievedMarks?: number;
  totalMarks?: number;
  subject: string;
  questionType: string;
  examBoard: string;
}

export const FeedbackEnhancements: React.FC<FeedbackEnhancementsProps> = ({
  feedback,
  grade,
  achievedMarks,
  totalMarks,
  subject,
  questionType,
  examBoard
}) => {
  const [exportLoading, setExportLoading] = useState(false);

  // Parse feedback into sections (basic implementation)
  const parseFeedback = (feedback: string) => {
    const sections = {
      strengths: [] as string[],
      improvements: [] as string[],
      specific: [] as string[],
      advice: [] as string[]
    };

    const lines = feedback.split('\n').filter(line => line.trim());
    let currentSection = 'general';

    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('strength') || lowerLine.includes('good') || lowerLine.includes('excellent')) {
        sections.strengths.push(line);
      } else if (lowerLine.includes('improve') || lowerLine.includes('could') || lowerLine.includes('should')) {
        sections.improvements.push(line);
      } else if (lowerLine.includes('specific') || lowerLine.includes('detail')) {
        sections.specific.push(line);
      } else if (lowerLine.includes('advice') || lowerLine.includes('suggest') || lowerLine.includes('recommend')) {
        sections.advice.push(line);
      }
    });

    return sections;
  };

  const sections = parseFeedback(feedback);
  const percentage = totalMarks ? Math.round((achievedMarks || 0) / totalMarks * 100) : 0;

  const getGradeColor = (grade: string) => {
    const gradeNum = parseInt(grade);
    if (gradeNum >= 7) return 'text-green-600 bg-green-50 border-green-200';
    if (gradeNum >= 4) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleExportPDF = async () => {
    setExportLoading(true);
    try {
      // Implementation would depend on your PDF generation library
      toast.success('PDF export feature coming soon!');
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setExportLoading(false);
    }
  };

  const handleCopyFeedback = () => {
    navigator.clipboard.writeText(feedback);
    toast.success('Feedback copied to clipboard');
  };

  const handleShareFeedback = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AI GCSE Marker Feedback',
        text: feedback
      });
    } else {
      handleCopyFeedback();
    }
  };

  return (
    <MotionDiv
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Header with Grade and Stats */}
      <ScrollReveal animation="fadeInUp" delay={0.1}>
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm">
          <CardHeader>
            <MotionDiv 
              variants={fadeInUp}
              className="flex items-center justify-between"
            >
              <div className="space-y-2">
                <CardTitle className="text-2xl flex items-center">
                  <Sparkles className="w-6 h-6 mr-2 text-primary" />
                  Assessment Results
                </CardTitle>
                <p className="text-muted-foreground">
                  {subject.charAt(0).toUpperCase() + subject.slice(1)} • {examBoard.toUpperCase()} • {questionType}
                </p>
              </div>
              <div className="text-right space-y-2">
                {grade && (
                  <MotionDiv
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge variant="outline" className={`text-2xl font-bold p-3 ${getGradeColor(grade)} shadow-lg`}>
                      Grade {grade}
                    </Badge>
                  </MotionDiv>
                )}
                {achievedMarks !== undefined && totalMarks && (
                  <div className="text-lg font-semibold">
                    <AnimatedCounter from={0} to={achievedMarks} duration={1} />
                    /{totalMarks} marks
                  </div>
                )}
              </div>
            </MotionDiv>
          </CardHeader>
          
          {totalMarks && (
            <CardContent>
              <MotionDiv variants={fadeInUp} className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Performance</span>
                  <span className="font-semibold">
                    <AnimatedCounter from={0} to={percentage} suffix="%" duration={1.5} />
                  </span>
                </div>
                <MotionDiv
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <Progress 
                    value={percentage} 
                    className="h-3"
                    style={{ backgroundColor: '#f3f4f6' }}
                  />
                </MotionDiv>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </MotionDiv>
            </CardContent>
          )}
        </Card>
      </ScrollReveal>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleExportPDF} disabled={exportLoading} variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
        <Button onClick={handleCopyFeedback} variant="outline">
          <Copy className="mr-2 h-4 w-4" />
          Copy Feedback
        </Button>
        <Button onClick={handleShareFeedback} variant="outline">
          <Share className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button onClick={() => window.print()} variant="outline">
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
      </div>

      {/* Structured Feedback Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        {sections.strengths.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <CheckCircle className="mr-2 h-5 w-5" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {sections.strengths.slice(0, 3).map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3 flex-shrink-0" />
                    <span className="text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Areas for Improvement */}
        {sections.improvements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-amber-700">
                <Target className="mr-2 h-5 w-5" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {sections.improvements.slice(0, 3).map((improvement, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 mr-3 flex-shrink-0" />
                    <span className="text-sm">{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Full Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Detailed Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {feedback}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-blue-700">
            <TrendingUp className="mr-2 h-5 w-5" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="mr-3 h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Review and Practice</p>
                <p className="text-sm text-blue-700">
                  Focus on the improvement areas identified above
                </p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <Star className="mr-3 h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Build on Strengths</p>
                <p className="text-sm text-green-700">
                  Continue developing the positive aspects of your work
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </MotionDiv>
  );
}; 