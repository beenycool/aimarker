"use client";
import * as React from 'react';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import 'katex/dist/katex.min.css';
import { getSubjectGuidance } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { Loader2, Upload, AlertTriangle, HelpCircle, ChevronRight, ChevronDown, X, Keyboard, Pause, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
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
  subjectKeywords,
  EXAM_PRESETS,
  SUBJECT_KEYWORDS_OPTIMIZED
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
import { QuickActions } from './aimarker/components/QuickActions';
import { DocumentUpload } from './aimarker/components/DocumentUpload';

// Enhanced layout components
import { EnhancedLayout } from './aimarker/enhanced-layout';
import { SampleQuestions } from '@/components/ui/sample-questions';
import { Header } from '@/components/header';

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
  const [modelThinking, setModelThinking] = useState<any[]>([]);
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
  const [processingProgress, setProcessingProgress] = useState<string>("");
  const [history, setHistory] = useState<any[]>([]);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [selectedModel, setSelectedModel] = useState("deepseek/deepseek-chat-v3");
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

  // Performance optimizations: Memoized computations
  const memoizedSubjects = useMemo(() => allSubjects, [allSubjects]);
  const memoizedExamBoards = useMemo(() => EXAM_BOARDS, []);
  const memoizedUserTypes = useMemo(() => USER_TYPES, []);
  const memoizedAiModels = useMemo(() => AI_MODELS, []);
  
  // Memoized preset options for better performance
  const memoizedPresetOptions = useMemo(() => {
    return Object.entries(EXAM_PRESETS).map(([key, preset]) => ({
      key,
      value: key,
      label: preset.name,
      description: preset.description,
      preset
    }));
  }, []);

  // Optimized subject detection using Map lookup
  const optimizedSubjectDetection = useCallback((text: string) => {
    const words = text.toLowerCase().split(/\s+/);
    const subjectScores = new Map();
    
    for (const [subject, keywords] of SUBJECT_KEYWORDS_OPTIMIZED) {
      let score = 0;
      for (const word of words) {
        if (keywords.has(word)) {
          score++;
        }
      }
      if (score > 0) {
        subjectScores.set(subject, score);
      }
    }
    
    if (subjectScores.size === 0) return null;
    
    // Return subject with highest score
    return Array.from(subjectScores.entries())
      .sort(([,a], [,b]) => b - a)[0][0];
  }, []);

  // These will be defined after the function definitions

  // Handler for applying presets from QuickActions
  const handleApplyPreset = useCallback((preset: {
    subject: string;
    examBoard: string;
    questionType: string;
    totalMarks: string;
    markScheme?: string;
    name: string;
  }) => {
    setSubject(preset.subject);
    setExamBoard(preset.examBoard);
    setQuestionType(preset.questionType);
    setTotalMarks(preset.totalMarks);
    if (preset.markScheme) {
      setMarkScheme(preset.markScheme);
    }
    hasManuallySetSubject.current = true;
    setDetectedSubject(null);
  }, []);

  // Handler for generating mark scheme using Gemini 2.0 Flash
  const handleGenerateMarkScheme = useCallback(async () => {
    if (!question.trim()) {
      toast.error('Please enter a question first');
      return;
    }

    setLoading(true);
    setProcessingProgress("Generating mark scheme...");

    try {
      const systemPrompt = `You are an expert GCSE examiner. Generate a detailed mark scheme for the following question. Include:
1. Assessment objectives (AOs) if applicable
2. Level descriptors with mark ranges
3. Specific marking criteria
4. Example responses or key points to look for

Subject: ${subject}
Exam Board: ${examBoard}
Total Marks: ${totalMarks || 'Not specified'}`;

      const userPrompt = `Generate a comprehensive mark scheme for this GCSE question:\n\n${question}`;

      const response = await fetch(constructApiUrl('chat/completions'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-exp:free',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const generatedMarkScheme = data.choices?.[0]?.message?.content || '';
      
      if (generatedMarkScheme) {
        setMarkScheme(generatedMarkScheme);
        toast.success('Mark scheme generated successfully');
      } else {
        throw new Error('No mark scheme generated');
      }
    } catch (error) {
      console.error('Error generating mark scheme:', error);
      toast.error('Failed to generate mark scheme. Please try again.');
    } finally {
      setLoading(false);
      setProcessingProgress("");
    }
  }, [question, subject, examBoard, totalMarks]);

  // Advanced options state
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [automaticMaxTokens, setAutomaticMaxTokens] = useState(true);
  const [enableThinkingBudget, setEnableThinkingBudget] = useState(true);
  const [thinkingBudget, setThinkingBudget] = useState([1024]);
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);

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

  // Memoized system prompt builder
  const memoizedSystemPrompt = useMemo(() => {
    return buildSystemPrompt();
  }, [subject, examBoard, questionType, userType, markScheme, totalMarks, textExtract, relevantMaterial, enableGradeBoundaries, gradeBoundaries, tier]);

  // Memoized user prompt builder
  const memoizedUserPrompt = useMemo(() => {
    return buildUserPrompt();
  }, [question, answer, totalMarks, relevantMaterialImageBase64]);

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

    const effectiveModel = TASK_SPECIFIC_MODELS.subject_assessment[subject as keyof typeof TASK_SPECIFIC_MODELS.subject_assessment] || selectedModel;
    setCurrentModelForRequest(effectiveModel);

    const now = Date.now();
    const modelRateLimit = MODEL_RATE_LIMITS[effectiveModel as keyof typeof MODEL_RATE_LIMITS] || 10000;
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

        if (!response.body) throw new Error('Response body is null');

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
                if(!totalMarks) setTotalMarks(total.toString());

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
    setUploadedDocuments([]);
    localStorage.removeItem(LOCALSTORAGE_KEYS.QUESTION);
    localStorage.removeItem(LOCALSTORAGE_KEYS.ANSWER);
    toast.success("Form has been reset.");
  };

  const handleGetStarted = () => {
    setShowWelcome(false);
    setHasInteracted(true);
  };

  const handleDocumentExtracted = useCallback((text: string, filename: string) => {
    // Add extracted text to the answer field or relevant material
    if (answer.trim()) {
      setAnswer(prev => prev + `\n\n[From ${filename}]\n${text}`);
    } else {
      setAnswer(text);
    }
    toast.success(`Text extracted from ${filename} and added to answer`);
  }, [answer]);

  const handleDocumentUploaded = useCallback((document: any) => {
    setUploadedDocuments(prev => [...prev, document]);
    toast.success(`Document ${document.name} uploaded successfully`);
  }, []);

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
          error: error instanceof Error ? error.message : String(error),
          processed: true
        };
      }
    };

    const processBatch = async (items: any[]) => {
      const promises = items.map(processItem);
      const results = await Promise.all(promises);
      
      setBulkResults(prev => [...prev, ...results.filter(r => r !== null)] as any);
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
  useHotkeys('ctrl+enter, cmd+enter', (e) => { e.preventDefault(); handleSubmitForMarking(); });
  useHotkeys('alt+r, opt+r', (e) => { e.preventDefault(); resetForm(); });

  if (showWelcome) {
    return (
      <div className="bg-black min-h-screen">
        <Header />
        <Hero handleGetStarted={handleGetStarted} />
        <Features />
        <HowItWorks />
        <section className="relative py-24 overflow-hidden bg-black">
          <div className="container-custom relative z-10" id="sample-questions">
            <SampleQuestions onUseSample={handleUseSample} />
          </div>
        </section>
        <CTA handleGetStarted={handleGetStarted} />
        <Stats />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <BackendStatusChecker onStatusChange={handleBackendStatusChange} getAPI_BASE_URL={getApiBaseUrl} />
      {isClient && showGuide && <QuickGuide onClose={() => setShowGuide(false)} />}
      
      {/* Header */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">AI GCSE Marker</h1>
                <Badge variant="outline" className="text-xs">v2.1.3</Badge>
              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>API Connected</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-gray-700 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    </div>
                    <span>500 requests left</span>
                  </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => setShowKeyboardShortcuts(true)}>
                      <Keyboard className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Keyboard shortcuts</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => setShowGuide(true)}>
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Help</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow container mx-auto p-6 max-w-5xl">
        <EnhancedAlert error={error} success={success} onRetryAction={handleSubmitForMarking} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="answer">Answer</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="bulk">
              Bulk Mark
              <Badge variant="outline" className="ml-2 text-xs">Very Beta</Badge>
            </TabsTrigger>
          </TabsList>
                      <TabsContent value="answer" className="mt-6">
            <div className="space-y-6">
                {/* Preset Selector */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Quick Presets</Label>
                  <Select onValueChange={(value) => {
                    if (value) {
                      const presetOption = memoizedPresetOptions.find(opt => opt.value === value);
                      if (presetOption) {
                        const preset = presetOption.preset;
                        setSubject(preset.subject);
                        setExamBoard(preset.examBoard);
                        setQuestionType(preset.questionType);
                        setTotalMarks(preset.totalMarks);
                        if ('markScheme' in preset && preset.markScheme) {
                          setMarkScheme(preset.markScheme);
                        }
                        toast.success(`Applied preset: ${preset.name}`);
                      }
                    }
                  }}>
                    <SelectTrigger className="bg-gray-800/50 border-gray-700">
                      <SelectValue placeholder="Choose a preset or configure manually" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {memoizedPresetOptions.map((option) => (
                        <SelectItem key={option.key} value={option.value} className="hover:bg-gray-700">
                          <div className="flex flex-col">
                            <span className="font-medium">{option.label}</span>
                            <span className="text-xs text-gray-400">{option.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quick Actions */}
                <QuickActions 
                  onApplyPreset={handleApplyPreset}
                  currentConfig={{
                    subject,
                    examBoard,
                    questionType,
                    totalMarks,
                    markScheme,
                    userType,
                    tier
                  }}
                  isLoggedIn={false} // TODO: Replace with actual auth state
                  onLoginRequired={() => toast.info('Please login to save personal configurations')}
                />

                {/* Question Input */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="question" className="text-sm font-medium">Question</Label>
                    <span className="text-xs text-destructive">(Required)</span>
                    <Badge variant="outline" className="text-xs">GCSE Level</Badge>
                  </div>
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
                    className="min-h-[140px] resize-none p-4"
                  />
                </div>

                {/* Answer Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="answer" className="text-sm font-medium">Your Answer</Label>
                      <span className="text-xs text-destructive">(Required)</span>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </Button>
                  </div>
                  <Textarea
                    id="answer"
                    placeholder="Enter your answer here..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="min-h-[220px] resize-none p-4"
                  />
                </div>

                {/* Document Upload */}
                <DocumentUpload
                  onDocumentExtracted={handleDocumentExtracted}
                  onDocumentUploaded={handleDocumentUploaded}
                  maxFileSize={10}
                  acceptedTypes={['.pdf', '.doc', '.docx', '.txt', '.rtf', '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff']}
                />

                              {/* Form Controls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">Subject</Label>
                      <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-muted-foreground hover:text-foreground">
                        <HelpCircle className="h-3 w-3 mr-1" />
                        View Guidance
                      </Button>
                    </div>
                    <Select value={subject} onValueChange={(value) => {
                      setSubject(value);
                      hasManuallySetSubject.current = true;
                      setDetectedSubject(null);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {memoizedSubjects.map((subj) => (
                          <SelectItem key={subj.value} value={subj.value}>
                            {subj.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Exam Board</Label>
                    <Select value={examBoard} onValueChange={setExamBoard}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exam board" />
                      </SelectTrigger>
                      <SelectContent>
                        {memoizedExamBoards.map((board) => (
                          <SelectItem key={board.value} value={board.value}>
                            {board.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">I am a</Label>
                    <Select value={userType} onValueChange={setUserType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                      <SelectContent>
                        {memoizedUserTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Advanced Options */}
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="flex items-center gap-2 text-sm"
                  >
                    {showAdvancedOptions ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    Advanced Options
                  </Button>
                  
                  {showAdvancedOptions && (
                    <div className="space-y-6 pl-8 border-l-2 border-gray-700 mt-4">
                      {/* Mark Scheme */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm font-medium">Mark Scheme</Label>
                            <span className="text-xs text-muted-foreground">(Optional)</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Adding a mark scheme will enhance feedback with detailed criteria analysis
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleGenerateMarkScheme}
                            disabled={loading || !question.trim()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Generate
                          </Button>
                        </div>
                        <Textarea
                          placeholder="Enter the mark scheme here..."
                          value={markScheme}
                          onChange={(e) => setMarkScheme(e.target.value)}
                          className="min-h-[100px] resize-none"
                        />
                      </div>

                      {/* Total Marks */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Total Marks <span className="text-xs text-muted-foreground">(Optional)</span></Label>
                        <Input
                          type="number"
                          placeholder="Enter total marks"
                          value={totalMarks}
                          onChange={(e) => setTotalMarks(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          If not provided, system will attempt to detect total marks from the question (like "8 marks" or "[Total: 10]").
                        </p>
                      </div>

                      {/* Text Extract */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Text Extract <span className="text-xs text-muted-foreground">(Optional)</span></Label>
                        <Textarea
                          placeholder="Enter any relevant text extract here..."
                          value={textExtract}
                          onChange={(e) => setTextExtract(e.target.value)}
                          className="min-h-[80px] resize-none"
                        />
                      </div>

                      {/* Relevant Material */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Relevant Material <span className="text-xs text-muted-foreground">(Optional)</span></Label>
                        <Textarea
                          placeholder="Enter any other relevant material here..."
                          value={relevantMaterial}
                          onChange={(e) => setRelevantMaterial(e.target.value)}
                          className="min-h-[80px] resize-none"
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Add image as relevant material</span>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                          </Button>
                        </div>
                      </div>

                      {/* AI Model */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">AI Model <span className="text-xs text-muted-foreground">(Optional)</span></Label>
                        <Select value={selectedModel} onValueChange={setSelectedModel}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select AI model" />
                          </SelectTrigger>
                          <SelectContent>
                            {memoizedAiModels.map((category) => (
                              <SelectGroup key={category.category}>
                                <SelectLabel className="text-xs font-medium text-gray-400">
                                  {category.category}
                                </SelectLabel>
                                {category.models.map((model) => (
                                  <SelectItem 
                                    key={model.value} 
                                    value={model.value}
                                    disabled={model.tier === 'premium' && !false} // TODO: Replace with actual premium status
                                    className={model.tier === 'premium' && !false ? 'opacity-50 cursor-not-allowed' : ''}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex items-center gap-2">
                                        <span>{model.label}</span>
                                        <Badge variant="outline" className="text-xs">
                                          {model.badge}
                                        </Badge>
                                        {model.tier === 'premium' && (
                                          <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-400 border-amber-500/50">
                                            Premium
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedModel && memoizedAiModels.some(cat => 
                          cat.models.some(model => model.value === selectedModel && model.tier === 'premium')
                        ) && !false && ( // TODO: Replace with actual premium status
                          <div className="bg-amber-500/10 border border-amber-500/20 rounded p-2">
                            <p className="text-xs text-amber-400">
                              This is a premium model. Upgrade your account to use advanced AI models.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Automatic Max Tokens */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-medium">Automatic Max Tokens</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Automatically sets the maximum number of tokens</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Switch
                          checked={automaticMaxTokens}
                          onCheckedChange={setAutomaticMaxTokens}
                        />
                      </div>

                      {/* Thinking Budget - Only for Gemini 2.5 Flash */}
                      {selectedModel === 'gemini-2.5-flash-preview-05-20' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Label className="text-sm font-medium">Enable Thinking Budget</Label>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Controls reasoning depth for Gemini 2.5 Flash</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <Switch
                              checked={enableThinkingBudget}
                              onCheckedChange={setEnableThinkingBudget}
                            />
                          </div>
                          
                          {enableThinkingBudget && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm">Thinking Budget: {thinkingBudget[0]}</Label>
                                <div className="flex items-center gap-2">
                                  <Slider
                                    value={thinkingBudget}
                                    onValueChange={setThinkingBudget}
                                    max={24576}
                                    min={0}
                                    step={64}
                                    className="w-32"
                                  />
                                  <Input
                                    type="number"
                                    value={thinkingBudget[0]}
                                    onChange={(e) => setThinkingBudget([parseInt(e.target.value) || 0])}
                                    className="w-20"
                                  />
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Defines the maximum tokens used for thinking. Higher values may improve quality for complex tasks. (Min: 0, Max: 24576)
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmitForMarking}
                    disabled={loading || !answer}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mark Answer
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Mark Answer
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetForm}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset Form
                  </Button>
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
                <Card className="bg-gray-900/80 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Bulk Marking</CardTitle>
                    <Badge variant="outline" className="ml-2 text-amber-400 border-amber-500/50 bg-amber-500/10">Beta</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="bulkFile" className="text-gray-300">Upload File (CSV, JSON, or TXT)</Label>
                      <Input
                        id="bulkFile"
                        type="file"
                        accept=".csv,.json,.txt"
                        className="bg-gray-800/50 border-gray-700 text-white file:bg-gray-700 file:text-white file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-md file:text-sm hover:file:bg-gray-600"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setBulkFile(file);
                          if (file) {
                            // Parse the file and extract items
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              try {
                                const content = event.target?.result;
                                let items = [];
                                
                                if (file.name.endsWith('.csv')) {
                                  const parsed = Papa.parse(content as string, { header: true });
                                  items = parsed.data.filter((row: any) => row.question && row.answer);
                                } else if (file.name.endsWith('.json')) {
                                  items = JSON.parse(content as string);
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
                                toast.error(`Error parsing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
                          <span className="text-sm text-gray-400">
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
                            className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700"
                          >
                            Preview First Item
                          </Button>
                        </div>
                        
                        <div>
                          <Label htmlFor="bulkSettings" className="text-gray-300">Bulk Processing Settings</Label>
                          <Select value={bulkSettingPreference} onValueChange={setBulkSettingPreference}>
                            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                              <SelectValue placeholder="Select setting source" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="global" className="text-white hover:bg-gray-700">Use Current Form Settings</SelectItem>
                              <SelectItem value="individual" className="text-white hover:bg-gray-700">Use Individual Item Settings</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="parallelism" className="text-gray-300">Parallel Processing (1-5)</Label>
                          <Input
                            id="parallelism"
                            type="number"
                            min="1"
                            max="5"
                            value={parallelProcessing}
                            onChange={(e) => setParallelProcessing(parseInt(e.target.value) || 1)}
                            className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600"
                          />
                        </div>
                        
                        <Button
                          onClick={handleBulkProcess}
                          disabled={bulkProcessing || bulkItems.length === 0}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0"
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
                  <Card className="bg-gray-900/80 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">Processing Status</CardTitle>
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
                  <Card className="bg-gray-900/80 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">Results ({bulkResults.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {bulkResults.map((item, index) => (
                          <div
                            key={index}
                            className="p-3 border border-gray-700 rounded cursor-pointer hover:bg-gray-800/50 bg-gray-800/30"
                            onClick={() => {
                              setPreviewItem(item);
                              setShowPreviewDialog(true);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-white">Item {index + 1}</span>
                              <div className="flex items-center gap-2">
                                {item.grade && (
                                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">Grade {item.grade}</Badge>
                                )}
                                {item.achievedMarks && item.totalMarks && (
                                  <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                    {item.achievedMarks}/{item.totalMarks}
                                  </Badge>
                                )}
                                {item.error && (
                                  <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">Error</Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-400 mt-1 truncate">
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
                          className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700"
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
                          className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700"
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
          <DialogContent className="bg-gray-900 border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Ask a Follow-Up Question</DialogTitle>
              <DialogDescription className="text-gray-400">Get clarification on the feedback.</DialogDescription>
            </DialogHeader>
            <Textarea 
              placeholder="e.g., Can you explain..." 
              value={followUpQuestion} 
              onChange={e => setFollowUpQuestion(e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600"
            />
            {followUpLoading && <Loader2 className="animate-spin text-white" />}
            {followUpResponse && <div className="prose dark:prose-invert"><MathMarkdown>{followUpResponse}</MathMarkdown></div>}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowFollowUpDialog(false)} className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700">Cancel</Button>
              <Button onClick={handleFollowUpSubmit} disabled={followUpLoading} className="bg-blue-600 hover:bg-blue-700 text-white border-0">Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {showPreviewDialog && <BulkItemPreviewDialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog} item={previewItem} onClose={() => setShowPreviewDialog(false)} />}
        
        {showKeyboardShortcuts && <KeyboardShortcuts open={showKeyboardShortcuts} onOpenChange={setShowKeyboardShortcuts} />}
      </div>
    );
  };

export default AIMarker;