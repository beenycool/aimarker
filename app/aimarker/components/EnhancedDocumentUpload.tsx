import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Upload, 
  File, 
  FileText, 
  Image, 
  FileImage, 
  X, 
  Eye, 
  Download,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileType,
  Paperclip,
  Search,
  Filter,
  Clock,
  Trash2,
  Copy,
  Share2,
  FolderOpen,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Calendar,
  FileSize,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  extractedText?: string;
  thumbnail?: string;
  uploadedAt: string;
  tags?: string[];
  category?: string;
}

interface EnhancedDocumentUploadProps {
  onDocumentExtracted: (text: string, filename: string) => void;
  onDocumentUploaded: (document: UploadedDocument) => void;
  maxFileSize?: number;
  acceptedTypes?: string[];
  showRecentFiles?: boolean;
  enableSearch?: boolean;
  enableCategories?: boolean;
}

const DEFAULT_ACCEPTED_TYPES = [
  '.pdf', '.doc', '.docx', '.txt', '.rtf',
  '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff'
];

const FILE_TYPE_ICONS = {
  'application/pdf': FileText,
  'application/msword': FileText,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileText,
  'text/plain': File,
  'text/rtf': FileText,
  'image/jpeg': Image,
  'image/jpg': Image,
  'image/png': Image,
  'image/gif': Image,
  'image/bmp': Image,
  'image/webp': Image,
  'image/tiff': Image,
  'default': FileType
};

const CATEGORIES = [
  { id: 'all', name: 'All Files', color: 'bg-gray-500' },
  { id: 'documents', name: 'Documents', color: 'bg-blue-500' },
  { id: 'images', name: 'Images', color: 'bg-green-500' },
  { id: 'assignments', name: 'Assignments', color: 'bg-purple-500' },
  { id: 'resources', name: 'Resources', color: 'bg-orange-500' }
];

export const EnhancedDocumentUpload: React.FC<EnhancedDocumentUploadProps> = ({
  onDocumentExtracted,
  onDocumentUploaded,
  maxFileSize = 10,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  showRecentFiles = true,
  enableSearch = true,
  enableCategories = true
}) => {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extracting, setExtracting] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<UploadedDocument | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load documents from localStorage on mount
  useEffect(() => {
    const savedDocs = localStorage.getItem('aimarker-documents');
    if (savedDocs) {
      try {
        setUploadedDocuments(JSON.parse(savedDocs));
      } catch (error) {
        console.error('Error loading saved documents:', error);
      }
    }
  }, []);

  // Save documents to localStorage when updated
  useEffect(() => {
    if (uploadedDocuments.length > 0) {
      localStorage.setItem('aimarker-documents', JSON.stringify(uploadedDocuments));
    }
  }, [uploadedDocuments]);

  const getFileIcon = (mimeType: string) => {
    const IconComponent = FILE_TYPE_ICONS[mimeType as keyof typeof FILE_TYPE_ICONS] || FILE_TYPE_ICONS.default;
    return IconComponent;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size exceeds ${maxFileSize}MB limit`;
    }

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`;
    }

    return null;
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const fileData = e.target?.result as string;
          
          if (file.type === 'text/plain') {
            resolve(fileData);
            return;
          }

          const response = await fetch('/api/documents/extract', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileData,
              fileName: file.name,
              fileType: file.type
            })
          });

          if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
          }

          const result = await response.json();
          if (result.success) {
            resolve(result.extractedText);
          } else {
            reject(new Error(result.error || 'Failed to extract text'));
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));

      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileUpload = useCallback(async (files: FileList) => {
    const file = files[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const fileUrl = URL.createObjectURL(file);
      
      const document: UploadedDocument = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: fileUrl,
        uploadedAt: new Date().toISOString(),
        category: file.type.startsWith('image/') ? 'images' : 'documents'
      };

      setUploadProgress(100);
      clearInterval(progressInterval);

      // Extract text if needed
      if (file.type === 'text/plain' || file.type === 'application/pdf' || 
          file.type.includes('word') || file.type.startsWith('image/')) {
        setExtracting(true);
        try {
          const extractedText = await extractTextFromFile(file);
          document.extractedText = extractedText;
          onDocumentExtracted(extractedText, file.name);
        } catch (error) {
          console.error('Text extraction failed:', error);
          toast.error('Text extraction failed, but file was uploaded successfully');
        } finally {
          setExtracting(false);
        }
      }

      setUploadedDocuments(prev => [document, ...prev]);
      onDocumentUploaded(document);
      toast.success(`${file.name} uploaded successfully!`);

    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [maxFileSize, acceptedTypes, onDocumentExtracted, onDocumentUploaded]);

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
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  const removeDocument = (documentId: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== documentId));
    toast.success('Document removed');
  };

  const copyDocumentText = (document: UploadedDocument) => {
    if (document.extractedText) {
      navigator.clipboard.writeText(document.extractedText);
      toast.success('Text copied to clipboard');
    }
  };

  const filteredDocuments = uploadedDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (doc.extractedText?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'date':
        comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
        break;
      case 'size':
        comparison = a.size - b.size;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Enhanced Upload Area */}
        <Card className="relative overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary/50 transition-all duration-300">
          <div
            className={`relative p-8 text-center transition-all duration-300 ${
              dragActive ? 'bg-primary/10 border-primary scale-105' : 'hover:bg-muted/20'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <AnimatePresence>
              {(uploading || extracting) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10"
                >
                  <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        {uploading ? 'Uploading...' : 'Extracting text...'}
                      </p>
                      {uploading && (
                        <Progress value={uploadProgress} className="w-48 mx-auto" />
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              animate={{ scale: dragActive ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Drop files here or click to upload</h3>
                <p className="text-sm text-muted-foreground">
                  Support for PDF, Word, images, and text files up to {maxFileSize}MB
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {acceptedTypes.slice(0, 6).map(type => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type.toUpperCase()}
                  </Badge>
                ))}
                {acceptedTypes.length > 6 && (
                  <Badge variant="secondary" className="text-xs">
                    +{acceptedTypes.length - 6} more
                  </Badge>
                )}
              </div>

              <Button
                onClick={() => fileInputRef.current?.click()}
                className="btn-apple-primary"
                disabled={uploading || extracting}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
            </motion.div>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={acceptedTypes.join(',')}
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            />
          </div>
        </Card>

        {/* File Management Interface */}
        {showRecentFiles && uploadedDocuments.length > 0 && (
          <Card className="card-elevated">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  Document Library
                  <Badge variant="secondary">{uploadedDocuments.length}</Badge>
                </CardTitle>
                
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                      >
                        {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Switch to {viewMode === 'grid' ? 'list' : 'grid'} view
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Search and Filters */}
              {enableSearch && (
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {enableCategories && (
                    <div className="flex gap-2 flex-wrap">
                      {CATEGORIES.map(category => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category.id)}
                          className="text-xs"
                        >
                          <div className={`w-2 h-2 rounded-full ${category.color} mr-2`} />
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </CardHeader>

            <CardContent>
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No documents found</p>
                </div>
              ) : (
                <div className={`grid gap-4 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {filteredDocuments.map((document) => {
                    const Icon = getFileIcon(document.type);
                    return (
                      <motion.div
                        key={document.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`card-interactive p-4 ${
                          viewMode === 'list' ? 'flex items-center gap-4' : 'space-y-3'
                        }`}
                      >
                        <div className={`flex items-center gap-3 ${
                          viewMode === 'list' ? 'flex-1' : ''
                        }`}>
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{document.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{formatFileSize(document.size)}</span>
                              <span>•</span>
                              <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {document.extractedText && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyDocumentText(document)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Copy text</TooltipContent>
                            </Tooltip>
                          )}

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setPreviewDocument(document);
                                  setShowPreview(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Preview</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDocument(document.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Remove</TooltipContent>
                          </Tooltip>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {previewDocument?.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 overflow-y-auto">
              {previewDocument?.extractedText ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Extracted Text</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => previewDocument && copyDocumentText(previewDocument)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Text
                    </Button>
                  </div>
                  <Textarea
                    value={previewDocument.extractedText}
                    readOnly
                    className="min-h-[400px] font-mono text-sm"
                  />
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                  <p>No text content available for preview</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}; 