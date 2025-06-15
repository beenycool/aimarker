'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  Paperclip
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
}

interface DocumentUploadProps {
  onDocumentExtracted: (text: string, filename: string) => void;
  onDocumentUploaded: (document: UploadedDocument) => void;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
}

const DEFAULT_ACCEPTED_TYPES = [
  '.pdf',
  '.doc',
  '.docx',
  '.txt',
  '.rtf',
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.bmp',
  '.webp',
  '.tiff'
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

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onDocumentExtracted,
  onDocumentUploaded,
  maxFileSize = 10, // 10MB default
  acceptedTypes = DEFAULT_ACCEPTED_TYPES
}) => {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extracting, setExtracting] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<UploadedDocument | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size exceeds ${maxFileSize}MB limit`;
    }

    // Check file type
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
          
          // For text files, handle locally
          if (file.type === 'text/plain') {
            resolve(fileData);
            return;
          }

          // For other file types, use backend API
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

      // Read file as appropriate format
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
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Create file URL for preview
      const fileUrl = URL.createObjectURL(file);
      
      // Create document object
      const document: UploadedDocument = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: fileUrl,
        uploadedAt: new Date().toISOString()
      };

      // Extract text if possible
      setExtracting(true);
      try {
        const extractedText = await extractTextFromFile(file);
        document.extractedText = extractedText;
        
        // Call the callback with extracted text
        onDocumentExtracted(extractedText, file.name);
        toast.success(`Text extracted from ${file.name}`);
      } catch (error) {
        console.warn('Text extraction failed:', error);
        toast.warning(`Uploaded ${file.name} but couldn't extract text`);
      } finally {
        setExtracting(false);
      }

      setUploadProgress(100);
      
      // Add to uploaded documents
      setUploadedDocuments(prev => [...prev, document]);
      onDocumentUploaded(document);
      
      toast.success(`Successfully uploaded ${file.name}`);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [maxFileSize, acceptedTypes, onDocumentExtracted, onDocumentUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const removeDocument = (documentId: string) => {
    setUploadedDocuments(prev => {
      const updated = prev.filter(doc => doc.id !== documentId);
      // Revoke object URL to free memory
      const removedDoc = prev.find(doc => doc.id === documentId);
      if (removedDoc) {
        URL.revokeObjectURL(removedDoc.url);
      }
      return updated;
    });
    toast.success('Document removed');
  };

  const previewDocumentHandler = (document: UploadedDocument) => {
    setPreviewDocument(document);
    setShowPreview(true);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
            <Paperclip className="h-4 w-4" />
            Document Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={acceptedTypes.join(',')}
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            />
            
            {uploading ? (
              <div className="space-y-3">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-400" />
                <div className="space-y-2">
                  <p className="text-sm text-gray-300">
                    {extracting ? 'Extracting text...' : 'Uploading...'}
                  </p>
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-xs text-gray-400">{uploadProgress}%</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="h-8 w-8 mx-auto text-gray-400" />
                <div>
                  <p className="text-sm text-gray-300 mb-1">
                    Drop files here or click to upload
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports: PDF, Word, Images, Text files (max {maxFileSize}MB)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Accepted file types */}
          <div className="mt-3 flex flex-wrap gap-1">
            {acceptedTypes.slice(0, 8).map((type) => (
              <Badge key={type} variant="outline" className="text-xs border-gray-600 text-gray-400">
                {type}
              </Badge>
            ))}
            {acceptedTypes.length > 8 && (
              <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                +{acceptedTypes.length - 8} more
              </Badge>
            )}
          </div>

          {/* Help text */}
          <div className="mt-3 text-xs text-gray-500 space-y-1">
            <p>• <strong>Text files (.txt)</strong>: Content will be extracted directly</p>
            <p>• <strong>PDF files (.pdf)</strong>: Text will be extracted using PDF parsing</p>
            <p>• <strong>Images (.jpg, .png, etc.)</strong>: Text will be extracted using OCR</p>
            <p>• <strong>Word documents (.doc, .docx)</strong>: Text content will be extracted</p>
            <p>• Extracted text will be automatically added to your answer field</p>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Documents */}
      {uploadedDocuments.length > 0 && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white">
              Uploaded Documents ({uploadedDocuments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uploadedDocuments.map((document) => {
                const IconComponent = getFileIcon(document.type);
                return (
                  <div
                    key={document.id}
                    className="flex items-center justify-between p-3 bg-gray-700/50 rounded border border-gray-600"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <IconComponent className="h-5 w-5 text-blue-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {document.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">
                            {formatFileSize(document.size)}
                          </span>
                          {document.extractedText && (
                            <Badge variant="outline" className="text-xs border-green-500/50 text-green-400">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Text Extracted
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {document.extractedText && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => previewDocumentHandler(document)}
                          className="h-8 w-8 p-0 hover:bg-gray-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const link = window.document.createElement('a');
                          link.href = document.url;
                          link.download = document.name;
                          link.click();
                        }}
                        className="h-8 w-8 p-0 hover:bg-gray-600"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(document.id)}
                        className="h-8 w-8 p-0 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-white">
              Document Preview: {previewDocument?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {previewDocument?.extractedText && (
              <div>
                <Label className="text-white">Extracted Text:</Label>
                <Textarea
                  value={previewDocument.extractedText}
                  readOnly
                  className="mt-2 bg-gray-700 border-gray-600 text-white min-h-[300px] resize-none"
                />
              </div>
            )}
            
            {previewDocument?.type.startsWith('image/') && (
              <div>
                <Label className="text-white">Image Preview:</Label>
                <div className="mt-2 border border-gray-600 rounded overflow-hidden">
                  <img
                    src={previewDocument.url}
                    alt={previewDocument.name}
                    className="max-w-full h-auto"
                  />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 