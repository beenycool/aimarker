"use client";
import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import 'katex/dist/katex.min.css';
import { getSubjectGuidance } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { Loader2, Upload, AlertTriangle, HelpCircle, ChevronRight, X, Keyboard, Pause, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import debounce from 'lodash.debounce';
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSubjectDetection, useBackendStatus } from './aimarker-hooks';
import { toast } from "sonner";
import { useHotkeys } from "react-hotkeys-hook";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Papa from 'papaparse';

// API helpers
import { getApiBaseUrl, constructApiUrl } from '@/lib/api-helpers';

// Extracted constants and utilities
import {
  SUBJECTS,
  EXAM_BOARDS,
  USER_TYPES,
  AI_MODELS,
  FALLBACK_MODELS,
  MODEL_RATE_LIMITS,
  TASK_SPECIFIC_MODELS,
  DEFAULT_THINKING_BUDGETS,
  QUESTION_TYPES,
  LOCALSTORAGE_KEYS,
  HISTORY_LIMIT,
  subjectKeywords
} from './aimarker/constants';
import {
  detectTotalMarksFromQuestion,
  calculateGradeFromBoundaries,
  shareFeedback,
  saveFeedbackAsPdf,
  printFeedback
} from './aimarker/utils';

// Extracted components
import {
  BackendStatusChecker,
  EnhancedAlert,
  TopBar,
  QuickGuide,
  BulkItemPreviewDialog,
  BatchProcessingControls,
  FeedbackDisplay,
  MathMarkdown
} from './aimarker/components';

// Enhanced layout components
import { EnhancedLayout } from './aimarker/enhanced-layout';
import { SampleQuestions } from '@/components/ui/sample-questions';

// Refactored Welcome Screen Components
import { Hero } from './aimarker/components/Hero';
import { Features } from './aimarker/components/Features';
import { HowItWorks } from './aimarker/components/HowItWorks';
import { CTA } from './aimarker/components/CTA';
import { Stats } from './aimarker/components/Stats';

const useViewport = () => {
  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  return viewportSize;
};

const AIMarker = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).BACKEND_STATUS) {
      (window as any).BACKEND_STATUS = { status: 'checking', lastChecked: null };
    }
    setIsClient(true);
  }, []);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [subject, setSubject] = useState("english");
  const [examBoard, setExamBoard] = useState("aqa");
  const [questionType, setQuestionType] = useState("general");
  const [userType, setUserType] = useState("student");
  const [markScheme, setMarkScheme] = useState("");
  const [image, setImage] = useState(null);
  const [activeTab, setActiveTab] = useState("answer");
  const [customSubject, setCustomSubject] = useState("");
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [allSubjects, setAllSubjects] = useState(SUBJECTS);
  const customSubjectInputRef = useRef(null);
  const [totalMarks, setTotalMarks] = useState("");
  const [textExtract, setTextExtract] = useState("");
  const [relevantMaterial, setRelevantMaterial] = useState("");
  const [relevantMaterialImage, setRelevantMaterialImage] = useState(null);
  const [relevantMaterialImageBase64, setRelevantMaterialImageBase64] = useState(null);
  const [relevantMaterialImageLoading, setRelevantMaterialImageLoading] = useState(false);
  const [modelThinking, setModelThinking] = useState([]);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [tier, setTier] = useState("higher");
  const [achievedMarks, setAchievedMarks] = useState<number | null>(null);
  const [ocrTextPreview, setOcrTextPreview] = useState("");
  const [showOcrPreviewDialog, setShowOcrPreviewDialog] = useState(false);
  const [hasExtractedText, setHasExtractedText] = useState(false);
  const [showSubjectGuidanceDialog, setShowSubjectGuidanceDialog] = useState(false);
  const [currentSubjectGuidance, setCurrentSubjectGuidance] = useState("");
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkItems, setBulkItems] = useState([]);
  const [bulkResults, setBulkResults] = useState([]);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkSettingPreference, setBulkSettingPreference] = useState('global');
  const [bulkProgress, setBulkProgress] = useState({ processed: 0, total: 0 });
  const bulkFileUploadRef = useRef(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [isBulkProcessingPaused, setIsBulkProcessingPaused] = useState(false);
  const bulkProcessingRef = useRef({ cancel: false, pause: false });
  const [parallelProcessing, setParallelProcessing] = useState(1);
  const [showFollowUpDialog, setShowFollowUpDialog] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [followUpResponse, setFollowUpResponse] = useState("");
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [grade, setGrade] = useState("");
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [detectedSubject, setDetectedSubject] = useState<string | null>(null);
  const [shortcutFeedback, setShortcutFeedback] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [history, setHistory] = useState<any[]>([]);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [selectedModel, setSelectedModel] = useState("deepseek/deepseek-chat-v3-0324:free");
  const [modelLastRequestTimes, setModelLastRequestTimes] = useState<{[key: string]: number}>({});
  const [backendStatus, setBackendStatus] = useState('checking');
  const currentModelForRequestRef = useRef<string | null>(null);
  const [enableGradeBoundaries, setEnableGradeBoundaries] = useState(false);
  const [gradeBoundaries, setGradeBoundaries] = useState<{ [key: string]: number }>({
    '9': 85, '8': 75, '7': 65, '6': 55, '5': 45, '4': 35, '3': 25, '2': 15
  });
  const [boundariesSource, setBoundariesSource] = useState<string | null>(null);
  const hasManuallySetSubject = useRef(false);
  const { checkBackendStatus } = useBackendStatus(getApiBaseUrl());
  const { debouncedClassifySubject } = useSubjectDetection(subjectKeywords, loading, hasManuallySetSubject, allSubjects, setSubject, setDetectedSubject, setSuccess);


  const setCurrentModelForRequest = (model: string) => {
    currentModelForRequestRef.current = model;
    setModelLastRequestTimes(prev => ({ ...prev, [model]: Date.now() }));
  };

  const debouncedSaveDraft = useCallback(
    debounce((q, a) => {
      localStorage.setItem(LOCALSTORAGE_KEYS.QUESTION, q);
      localStorage.setItem(LOCALSTORAGE_KEYS.ANSWER, a);
    }, 1500),
    []
  );

  useEffect(() => {
    if (question || answer) {
      debouncedSaveDraft(question, answer);
    }
  }, [question, answer, debouncedSaveDraft]);

  useEffect(() => {
    const savedQuestion = localStorage.getItem(LOCALSTORAGE_KEYS.QUESTION);
    if (savedQuestion) setQuestion(savedQuestion);
    const savedAnswer = localStorage.getItem(LOCALSTORAGE_KEYS.ANSWER);
    if (savedAnswer) setAnswer(savedAnswer);
    const savedSubject = localStorage.getItem(LOCALSTORAGE_KEYS.SUBJECT);
    if (savedSubject) setSubject(savedSubject);
    const savedExamBoard = localStorage.getItem(LOCALSTORAGE_KEYS.EXAM_BOARD);
    if (savedExamBoard) setExamBoard(savedExamBoard);
    const savedModel = localStorage.getItem(LOCALSTORAGE_KEYS.MODEL);
    if (savedModel) setSelectedModel(savedModel);
    const savedTier = localStorage.getItem(LOCALSTORAGE_KEYS.TIER);
    if (savedTier) setTier(savedTier);
    const savedEnableGradeBoundaries = localStorage.getItem(LOCALSTORAGE_KEYS.ENABLE_GRADE_BOUNDARIES);
    if (savedEnableGradeBoundaries) setEnableGradeBoundaries(savedEnableGradeBoundaries === 'true');
    const savedGradeBoundaries = localStorage.getItem(LOCALSTORAGE_KEYS.GRADE_BOUNDARIES);
    if (savedGradeBoundaries) setGradeBoundaries(JSON.parse(savedGradeBoundaries));
    const savedBoundariesSource = localStorage.getItem(LOCALSTORAGE_KEYS.BOUNDARIES_SOURCE);
    if (savedBoundariesSource) setBoundariesSource(savedBoundariesSource);
  }, []);
  
  useEffect(() => { localStorage.setItem(LOCALSTORAGE_KEYS.SUBJECT, subject); }, [subject]);
  useEffect(() => { localStorage.setItem(LOCALSTORAGE_KEYS.EXAM_BOARD, examBoard); }, [examBoard]);
  useEffect(() => { localStorage.setItem(LOCALSTORAGE_KEYS.MODEL, selectedModel); }, [selectedModel]);
  useEffect(() => { localStorage.setItem(LOCALSTORAGE_KEYS.TIER, tier); }, [tier]);
  useEffect(() => { localStorage.setItem(LOCALSTORAGE_KEYS.ENABLE_GRADE_BOUNDARIES, String(enableGradeBoundaries)); }, [enableGradeBoundaries]);
  useEffect(() => { localStorage.setItem(LOCALSTORAGE_KEYS.GRADE_BOUNDARIES, JSON.stringify(gradeBoundaries)); }, [gradeBoundaries]);
  useEffect(() => { localStorage.setItem(LOCALSTORAGE_KEYS.BOUNDARIES_SOURCE, boundariesSource ?? ''); }, [boundariesSource]);

  const handleBackendStatusChange = useCallback((status: 'checking' | 'online' | 'offline') => {
    setBackendStatus(status);
  }, []);

  useEffect(() => {
    if (question.length > 20 && !hasManuallySetSubject.current && !loading) {
      debouncedClassifySubject(question + " " + answer, (detected: string | null) => {
        if (detected && allSubjects.find(s => s.value === detected)) {
            setSubject(detected);
            setDetectedSubject(detected);
            setSuccess({ message: `Subject auto-detected: ${detected}` });
        }
      });
    }
  }, [question, answer, debouncedClassifySubject, loading, allSubjects]);

    const buildSystemPrompt = () => {
        let prompt = `You are an AI assistant specialized in educational assessment for the UK GCSE system. You are acting as a ${userType}. Your current task is to assess a piece of work for the subject: ${subject}. The examination board is ${examBoard}.`;
        if (allSubjects.find(s => s.value === subject)?.hasTiers) {
            prompt += ` The work is for the ${tier} tier.`;
        }
        if (questionType !== "general") {
            const subjectQuestionTypes = QUESTION_TYPES[subject as keyof typeof QUESTION_TYPES];
            if (subjectQuestionTypes) {
                const boardQuestionTypes = subjectQuestionTypes[examBoard as keyof typeof subjectQuestionTypes];
                const selectedQuestionType = boardQuestionTypes?.find((qt: { value: string; }) => qt.value === questionType);
                if (selectedQuestionType) {
                    prompt += ` Specifically, this is for ${selectedQuestionType.label}.`;
                }
            }
        }
        if (totalMarks) prompt += ` The question is out of ${totalMarks} marks.`;
        if (markScheme) prompt += `\n\nThe following mark scheme MUST be used:\n\`\`\`\n${markScheme}\n\`\`\`\n`;
        if (enableGradeBoundaries) {
            prompt += `\n\nGrade boundaries are defined as follows (minimum percentage required):\n`;
            Object.entries(gradeBoundaries).sort(([a], [b]) => parseInt(b) - parseInt(a)).forEach(([grade, threshold]) => {
                prompt += `- Grade ${grade}: ${threshold}%\n`;
            });
        }
        if (textExtract) prompt += `\n\nA text extract has been provided:\n\`\`\`\n${textExtract}\n\`\`\`\n`;
        if (relevantMaterial) prompt += `\n\nOther relevant material:\n\`\`\`\n${relevantMaterial}\n\`\`\`\n`;
        prompt += "\nYour primary goal is to provide constructive feedback and a grade. Adhere to the provided mark scheme if available.";
        return prompt;
    };

    const buildUserPrompt = () => {
        let prompt = "Please assess the following student's answer.\n\n";
        prompt += `**Question:**\n${question || "[Not provided]"}\n\n`;
        prompt += `**Student's Answer:**\n${answer || "[Not provided]"}\n\n`;
        if (totalMarks) prompt += `The question is out of **${totalMarks} marks**.\n\n`;
        if (relevantMaterialImageBase64) prompt += `**An image has also been provided with relevant material.** Please consider this in your assessment.\n\n`;
        prompt += "Based on all provided information, please provide:\n1. Overall Feedback\n2. Mark Allocation (if applicable) in the format [MARKS:X/Y]\n3. Specific Pointers\n4. Actionable Advice\n5. A grade in the format [GRADE:X]";
        return prompt;
    };

  const handleSubmitForMarking = useCallback(async () => {
    setFeedback("");
    setGrade("");
    setError(null);
    setSuccess(null);
    setModelThinking([]);
    setAchievedMarks(null);

    if (!answer) {
      setError({ type: "validation", message: "Please enter an answer to be marked" });
      return;
    }

    setLoading(true);
    setActiveTab("feedback");

    const effectiveModel = TASK_SPECIFIC_MODELS.subject_assessment[subject] || selectedModel;
    setCurrentModelForRequest(effectiveModel);

    const now = Date.now();
    const modelRateLimit = MODEL_RATE_LIMITS[effectiveModel] || 10000;
    const lastRequest = modelLastRequestTimes[effectiveModel] || 0;

    if (now - lastRequest < modelRateLimit) {
        const waitTime = Math.ceil((modelRateLimit - (now - lastRequest)) / 1000);
        setError({ type: "rate_limit", message: `Rate limited. Try again in ${waitTime}s.` });
        setLoading(false);
        return;
    }

    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt();
    setProcessingProgress("Sending request...");

    try {
        const response = await fetch(constructApiUrl('chat/completions'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream' },
            body: JSON.stringify({ model: effectiveModel, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }], stream: true }),
        });

        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = "";

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            
            const lines = chunk.split('\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.substring(6);
                    if (data.trim() === '[DONE]') continue;
                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices?.[0]?.delta?.content;
                        if(content) {
                            fullResponse += content;
                            setFeedback(prev => prev + content);
                        }
                    } catch (e) {
                        console.error("Error parsing stream data:", e);
                    }
                }
            }
        }
        
    } catch (e: unknown) {
      setLoading(false);
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError({ message: `An error occurred: ${errorMessage}` });
      toast.error(`An error occurred: ${errorMessage}`);
    } finally {
        setLoading(false);
        setProcessingProgress("");
    }
  }, [answer, question, subject, examBoard, questionType, userType, markScheme, totalMarks, textExtract, relevantMaterial, selectedModel, tier, modelLastRequestTimes, enableGradeBoundaries, gradeBoundaries]);

    useEffect(() => {
        if (!loading && feedback) {
            let tempFeedback = feedback;
            const gradeMatch = tempFeedback.match(/\[GRADE:(\w+)\]/);
            if (gradeMatch) {
                setGrade(gradeMatch[1]);
                tempFeedback = tempFeedback.replace(gradeMatch[0], "").trim();
            }

            const marksMatch = tempFeedback.match(/\[MARKS:(\d+)\/(\d+)\]/);
            if (marksMatch) {
                const achieved = parseInt(marksMatch[1], 10);
                const total = parseInt(marksMatch[2], 10);
                setAchievedMarks(achieved);
                if(!totalMarks) setTotalMarks(total);

                if(enableGradeBoundaries) {
                    const calculated = calculateGradeFromBoundaries(achieved, total, gradeBoundaries);
                    if(calculated) {
                        setGrade(calculated);
                        toast.info(`Grade calculated using boundaries: Grade ${calculated}`);
                    }
                }
                tempFeedback = tempFeedback.replace(marksMatch[0], "").trim();
            }
            setFeedback(tempFeedback); // Update feedback without the tags
        }
    }, [loading, feedback, totalMarks, enableGradeBoundaries, gradeBoundaries]);
  
  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setMarkScheme("");
    setImage(null);
    setTextExtract("");
    setRelevantMaterial("");
    setRelevantMaterialImage(null);
    setRelevantMaterialImageBase64(null);
    setTotalMarks("");
    setFeedback("");
    setGrade("");
    setAchievedMarks(null);
    setError(null);
    setSuccess(null);
    localStorage.removeItem(LOCALSTORAGE_KEYS.QUESTION);
    localStorage.removeItem(LOCALSTORAGE_KEYS.ANSWER);
    toast.success("Form has been reset.");
  };

  const handleGetStarted = () => {
    setShowWelcome(false);
    setHasInteracted(true);
  };

  const handleUseSample = (sample: any) => {
    setQuestion(sample.question);
    setAnswer(sample.answer || "");
    setSubject(sample.subject);
    setExamBoard(sample.examBoard);
    setMarkScheme(sample.markScheme || "");
    setTotalMarks(sample.totalMarks || "");
    hasManuallySetSubject.current = true;
    setShowWelcome(false);
    setHasInteracted(true);
    toast.success("Sample question loaded!");
  };

  const handleFollowUpSubmit = async () => {
    if (!followUpQuestion.trim()) return;
    
    setFollowUpLoading(true);
    try {
      const response = await fetch(constructApiUrl('/api/follow-up'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalQuestion: question,
          originalAnswer: answer,
          originalFeedback: feedback,
          followUpQuestion: followUpQuestion
        })
      });
      
      if (!response.ok) {
        throw new Error('Follow-up request failed');
      }
      
      const data = await response.json();
      setFollowUpResponse(data.response);
      setFollowUpQuestion('');
    } catch (error) {
      console.error('Follow-up error:', error);
      toast.error('Failed to get follow-up response');
    } finally {
      setFollowUpLoading(false);
    }
  };

  const handleBulkProcess = async () => {
    if (!bulkItems.length) {
      toast.error("No items to process");
      return;
    }

    setBulkProcessing(true);
    setBulkResults([]);
    setBulkProgress({ processed: 0, total: bulkItems.length });
    bulkProcessingRef.current = { cancel: false, pause: false };

    const processItem = async (item: any, index: number) => {
      if (bulkProcessingRef.current.cancel) return null;

      while (bulkProcessingRef.current.pause) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      try {
        const systemPrompt = buildSystemPrompt();
        const userPrompt = `Please assess the following student's answer.\n\n**Question:**\n${item.question}\n\n**Student's Answer:**\n${item.answer}\n\nBased on all provided information, please provide:\n1. Overall Feedback\n2. Mark Allocation (if applicable) in the format [MARKS:X/Y]\n3. Specific Pointers\n4. Actionable Advice\n5. A grade in the format [GRADE:X]`;

        const response = await fetch(constructApiUrl('chat/completions'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: selectedModel,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ]
          }),
        });

        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

        const data = await response.json();
        const feedback = data.choices?.[0]?.message?.content || '';

        // Extract grade and marks
        const gradeMatch = feedback.match(/\[GRADE:(\w+)\]/);
        const marksMatch = feedback.match(/\[MARKS:(\d+)\/(\d+)\]/);

        const result = {
          ...item,
          feedback: feedback.replace(/\[GRADE:\w+\]|\[MARKS:\d+\/\d+\]/g, '').trim(),
          grade: gradeMatch?.[1] || null,
          achievedMarks: marksMatch ? parseInt(marksMatch[1]) : null,
          totalMarks: marksMatch ? parseInt(marksMatch[2]) : null,
          processed: true
        };

        return result;
      } catch (error) {
        return {
          ...item,
          error: error.message,
          processed: true
        };
      }
    };

    const processBatch = async (items: any[]) => {
      const promises = items.map(processItem);
      const results = await Promise.all(promises);
      
      setBulkResults(prev => [...prev, ...results.filter(r => r !== null)]);
      setBulkProgress(prev => ({ ...prev, processed: prev.processed + results.length }));
    };

    try {
      for (let i = 0; i < bulkItems.length; i += parallelProcessing) {
        if (bulkProcessingRef.current.cancel) break;
        
        const batch = bulkItems.slice(i, i + parallelProcessing);
        await processBatch(batch);
        
        // Rate limiting delay
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      if (!bulkProcessingRef.current.cancel) {
        toast.success(`Bulk processing completed! Processed ${bulkResults.length} items.`);
      }
    } catch (error) {
      toast.error(`Bulk processing error: ${error.message}`);
    } finally {
      setBulkProcessing(false);
    }
  };

  useHotkeys('ctrl+k, cmd+k', (e) => { e.preventDefault(); setShowKeyboardShortcuts(true); }, { enableOnTags: ['INPUT', 'TEXTAREA', 'SELECT'] });
  useHotkeys('alt+h, opt+h', (e) => { e.preventDefault(); setShowGuide(prev => !prev); });
  useHotkeys('ctrl+enter, cmd+enter', (e) => { e.preventDefault(); handleSubmitForMarking(); }, { enableOnTags: ['INPUT', 'TEXTAREA'] });
  useHotkeys('alt+r, opt+r', (e) => { e.preventDefault(); resetForm(); });

  if (showWelcome) {
    return (
      <div className="bg-background min-h-screen">
        <header className="py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-bold">AI GCSE Marker</h1>
        </header>
        <Hero handleGetStarted={handleGetStarted} />
        <Features />
        <HowItWorks />
        <SampleQuestions onUseSample={handleUseSample} />
        <CTA handleGetStarted={handleGetStarted} />
        <Stats />
      </div>
    );
  }

  return (
    <EnhancedLayout>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="border-b bg-background shadow-sm">
          <BackendStatusChecker onStatusChange={handleBackendStatusChange} getAPI_BASE_URL={getApiBaseUrl} />
          <div className="flex items-center justify-between p-4">
            <h1 className="text-2xl font-bold text-foreground">AI GCSE Marker</h1>
          </div>
        </header>
        {isClient && showGuide && <QuickGuide onClose={() => setShowGuide(false)} />}
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
          <EnhancedAlert error={error} success={success} onRetry={handleSubmitForMarking} />
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="answer">Answer</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="bulk">
                Bulk Mark
                <Badge variant="outline" className="ml-2 text-amber-600 border-amber-400">Beta</Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="answer" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Main Content - Question & Answer */}
                <div className="lg:col-span-2 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Question & Answer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="question">Question</Label>
                        <Textarea
                          id="question"
                          placeholder="Enter the question here..."
                          value={question}
                          onChange={(e) => {
                            setQuestion(e.target.value);
                            const detected = detectTotalMarksFromQuestion(e.target.value);
                            if (detected && !totalMarks) {
                              setTotalMarks(detected.toString());
                            }
                          }}
                          className="min-h-[120px]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="answer">Student's Answer</Label>
                        <Textarea
                          id="answer"
                          placeholder="Enter your answer here..."
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          rows={10}
                          className="min-h-[200px]"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Additional Materials */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Additional Materials</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="markScheme">Mark Scheme (Optional)</Label>
                        <Textarea
                          id="markScheme"
                          placeholder="Enter the mark scheme here..."
                          value={markScheme}
                          onChange={(e) => setMarkScheme(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label htmlFor="textExtract">Text Extract (Optional)</Label>
                        <Textarea
                          id="textExtract"
                          placeholder="Enter any relevant text extract here..."
                          value={textExtract}
                          onChange={(e) => setTextExtract(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="relevantMaterial">Other Relevant Material (Optional)</Label>
                        <Textarea
                          id="relevantMaterial"
                          placeholder="Enter any other relevant material here..."
                          value={relevantMaterial}
                          onChange={(e) => setRelevantMaterial(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="image">Upload Image</Label>
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setImage(file);
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setRelevantMaterialImageBase64(event.target.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        {image && (
                          <div className="mt-2">
                            <img
                              src={URL.createObjectURL(image)}
                              alt="Uploaded"
                              className="max-w-full h-32 object-contain border rounded"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Settings Sidebar */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Assessment Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <div className="flex gap-2">
                          <Select value={subject} onValueChange={(value) => {
                            setSubject(value);
                            hasManuallySetSubject.current = true;
                            setDetectedSubject(null);
                          }}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {(allSubjects || []).map((subj) => (
                                <SelectItem key={subj.value} value={subj.value}>
                                  {subj.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsAddingSubject(!isAddingSubject)}
                          >
                            +
                          </Button>
                        </div>
                        {detectedSubject && (
                          <Badge variant="secondary" className="mt-1">
                            Auto-detected: {detectedSubject}
                          </Badge>
                        )}
                        {isAddingSubject && (
                          <div className="mt-2 flex gap-2">
                            <Input
                              ref={customSubjectInputRef}
                              placeholder="Custom subject"
                              value={customSubject}
                              onChange={(e) => setCustomSubject(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const newSubject = {
                                    value: customSubject.toLowerCase().replace(/\s+/g, '_'),
                                    label: customSubject
                                  };
                                  setAllSubjects([...allSubjects, newSubject]);
                                  setSubject(newSubject.value);
                                  setCustomSubject("");
                                  setIsAddingSubject(false);
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={() => {
                                const newSubject = {
                                  value: customSubject.toLowerCase().replace(/\s+/g, '_'),
                                  label: customSubject
                                };
                                setAllSubjects([...allSubjects, newSubject]);
                                setSubject(newSubject.value);
                                setCustomSubject("");
                                setIsAddingSubject(false);
                              }}
                            >
                              Add
                            </Button>
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="examBoard">Exam Board</Label>
                        <Select value={examBoard} onValueChange={setExamBoard}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select exam board" />
                          </SelectTrigger>
                          <SelectContent>
                            {EXAM_BOARDS.map((board) => (
                              <SelectItem key={board.value} value={board.value}>
                                {board.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="userType">User Type</Label>
                        <Select value={userType} onValueChange={setUserType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user type" />
                          </SelectTrigger>
                          <SelectContent>
                            {USER_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {allSubjects.find(s => s.value === subject)?.hasTiers && (
                        <div>
                          <Label htmlFor="tier">Tier</Label>
                          <Select value={tier} onValueChange={setTier}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tier" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="foundation">Foundation</SelectItem>
                              <SelectItem value="higher">Higher</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div>
                        <Label htmlFor="questionType">Question Type</Label>
                        <Select value={questionType} onValueChange={setQuestionType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select question type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Assessment</SelectItem>
                            {(QUESTION_TYPES[subject as keyof typeof QUESTION_TYPES]?.[examBoard as keyof typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES]] || []).map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="totalMarks">Total Marks</Label>
                        <Input
                          id="totalMarks"
                          type="number"
                          placeholder="e.g., 20"
                          value={totalMarks}
                          onChange={(e) => setTotalMarks(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="model">AI Model</Label>
                        <Select value={selectedModel} onValueChange={setSelectedModel}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select AI model" />
                          </SelectTrigger>
                          <SelectContent>
                            {AI_MODELS.map((model) => (
                              <SelectGroup key={model.category}>
                                <SelectLabel>{model.category}</SelectLabel>
                                {model.models.map((m) => (
                                  <SelectItem key={m.value} value={m.value}>
                                    <div className="flex items-center gap-2">
                                      {m.label}
                                      {m.badge && (
                                        <Badge variant="outline" className="text-xs">
                                          {m.badge}
                                        </Badge>
                                      )}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Grade Boundaries */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Grade Boundaries</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="enableGradeBoundaries"
                          checked={enableGradeBoundaries}
                          onChange={(e) => setEnableGradeBoundaries(e.target.checked)}
                        />
                        <Label htmlFor="enableGradeBoundaries">Enable Grade Boundaries</Label>
                      </div>
                      {enableGradeBoundaries && (
                        <div className="space-y-2">
                          {Object.entries(gradeBoundaries).sort(([a], [b]) => parseInt(b) - parseInt(a)).map(([grade, threshold]) => (
                            <div key={grade} className="flex items-center space-x-2">
                              <Label className="w-12">Grade {grade}:</Label>
                              <Input
                                type="number"
                                value={threshold}
                                onChange={(e) => setGradeBoundaries(prev => ({ ...prev, [grade]: parseInt(e.target.value) || 0 }))}
                                className="w-20"
                              />
                              <span className="text-sm text-muted-foreground">%</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <Card>
                    <CardContent className="pt-6 space-y-2">
                      <Button
                        onClick={handleSubmitForMarking}
                        disabled={loading || !answer}
                        className="w-full"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Mark Answer"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={resetForm}
                        className="w-full"
                      >
                        Reset Form
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setShowGuide(true)}
                        className="w-full"
                      >
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Show Guide
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="feedback" className="mt-4">
              <FeedbackDisplay
                loading={loading}
                feedback={feedback}
                grade={grade}
                selectedModel={selectedModel}
                modelThinking={modelThinking}
                achievedMarks={achievedMarks}
                totalMarks={totalMarks}
                processingProgress={processingProgress}
                setActiveTab={setActiveTab}
                markScheme={markScheme}
                onAskFollowUp={() => setShowFollowUpDialog(true)}
              />
            </TabsContent>
            <TabsContent value="bulk" className="mt-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Bulk Marking</CardTitle>
                    <Badge variant="outline" className="ml-2 text-amber-600 border-amber-400">Beta</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="bulkFile">Upload File (CSV, JSON, or TXT)</Label>
                      <Input
                        id="bulkFile"
                        type="file"
                        accept=".csv,.json,.txt"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setBulkFile(file);
                          if (file) {
                            // Parse the file and extract items
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              try {
                                const content = event.target.result;
                                let items = [];
                                
                                if (file.name.endsWith('.csv')) {
                                  const parsed = Papa.parse(content, { header: true });
                                  items = parsed.data.filter(row => row.question && row.answer);
                                } else if (file.name.endsWith('.json')) {
                                  items = JSON.parse(content);
                                } else if (file.name.endsWith('.txt')) {
                                  // Simple text format: question|answer per line
                                  items = content.split('\n')
                                    .filter(line => line.includes('|'))
                                    .map(line => {
                                      const [question, answer] = line.split('|');
                                      return { question: question.trim(), answer: answer.trim() };
                                    });
                                }
                                
                                setBulkItems(items);
                                toast.success(`Loaded ${items.length} items for bulk processing`);
                              } catch (error) {
                                toast.error(`Error parsing file: ${error.message}`);
                              }
                            };
                            reader.readAsText(file);
                          }
                        }}
                        ref={bulkFileUploadRef}
                      />
                    </div>
                    
                    {bulkItems.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {bulkItems.length} items loaded
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (bulkItems.length > 0) {
                                setPreviewItem(bulkItems[0]);
                                setShowPreviewDialog(true);
                              }
                            }}
                          >
                            Preview First Item
                          </Button>
                        </div>
                        
                        <div>
                          <Label htmlFor="bulkSettings">Bulk Processing Settings</Label>
                          <Select value={bulkSettingPreference} onValueChange={setBulkSettingPreference}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select setting source" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="global">Use Current Form Settings</SelectItem>
                              <SelectItem value="individual">Use Individual Item Settings</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="parallelism">Parallel Processing (1-5)</Label>
                          <Input
                            id="parallelism"
                            type="number"
                            min="1"
                            max="5"
                            value={parallelProcessing}
                            onChange={(e) => setParallelProcessing(parseInt(e.target.value) || 1)}
                          />
                        </div>
                        
                        <Button
                          onClick={handleBulkProcess}
                          disabled={bulkProcessing || bulkItems.length === 0}
                          className="w-full"
                        >
                          {bulkProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing... ({bulkProgress.processed}/{bulkProgress.total})
                            </>
                          ) : (
                            `Start Bulk Processing (${bulkItems.length} items)`
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {bulkProcessing && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Processing Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BatchProcessingControls
                        progress={bulkProgress}
                        onPause={() => {
                          setIsBulkProcessingPaused(true);
                          bulkProcessingRef.current.pause = true;
                        }}
                        onResume={() => {
                          setIsBulkProcessingPaused(false);
                          bulkProcessingRef.current.pause = false;
                        }}
                        onCancel={() => {
                          setBulkProcessing(false);
                          bulkProcessingRef.current.cancel = true;
                          toast.info("Bulk processing cancelled");
                        }}
                        isPaused={isBulkProcessingPaused}
                        parallelism={parallelProcessing}
                        onParallelismChange={setParallelProcessing}
                      />
                    </CardContent>
                  </Card>
                )}
                
                {bulkResults.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Results ({bulkResults.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {bulkResults.map((item, index) => (
                          <div
                            key={index}
                            className="p-3 border rounded cursor-pointer hover:bg-muted/50"
                            onClick={() => {
                              setPreviewItem(item);
                              setShowPreviewDialog(true);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Item {index + 1}</span>
                              <div className="flex items-center gap-2">
                                {item.grade && (
                                  <Badge variant="secondary">Grade {item.grade}</Badge>
                                )}
                                {item.achievedMarks && item.totalMarks && (
                                  <Badge variant="outline">
                                    {item.achievedMarks}/{item.totalMarks}
                                  </Badge>
                                )}
                                {item.error && (
                                  <Badge variant="destructive">Error</Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 truncate">
                              {item.question?.substring(0, 100)}...
                            </p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            const csvContent = Papa.unparse(bulkResults.map(item => ({
                              question: item.question,
                              answer: item.answer,
                              feedback: item.feedback,
                              grade: item.grade,
                              achievedMarks: item.achievedMarks,
                              totalMarks: item.totalMarks,
                              error: item.error || ''
                            })));
                            
                            const blob = new Blob([csvContent], { type: 'text/csv' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `bulk_results_${new Date().toISOString().split('T')[0]}.csv`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                        >
                          Export as CSV
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const jsonContent = JSON.stringify(bulkResults, null, 2);
                            const blob = new Blob([jsonContent], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `bulk_results_${new Date().toISOString().split('T')[0]}.json`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                        >
                          Export as JSON
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>

        <Dialog open={showFollowUpDialog} onOpenChange={setShowFollowUpDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ask a Follow-Up Question</DialogTitle>
              <DialogDescription>Get clarification on the feedback.</DialogDescription>
            </DialogHeader>
            <Textarea placeholder="e.g., Can you explain..." value={followUpQuestion} onChange={e => setFollowUpQuestion(e.target.value)} />
            {followUpLoading && <Loader2 className="animate-spin" />}
            {followUpResponse && <div className="prose dark:prose-invert"><MathMarkdown>{followUpResponse}</MathMarkdown></div>}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowFollowUpDialog(false)}>Cancel</Button>
              <Button onClick={handleFollowUpSubmit} disabled={followUpLoading}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {showPreviewDialog && <BulkItemPreviewDialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog} item={previewItem} onClose={() => setShowPreviewDialog(false)} />}
        
        {showKeyboardShortcuts && <KeyboardShortcuts open={showKeyboardShortcuts} onOpenChange={setShowKeyboardShortcuts} />}
      </div>
    </EnhancedLayout>
  );
};

export default AIMarker;