import { useState, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => Promise<void>;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UploadingFile {
  file: File;
  progress: number;
  status: UploadStatus;
  error?: string;
}

export function DocumentUploadModal({ isOpen, onClose, onUpload }: DocumentUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  }, []);

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter(file => 
      file.type === 'application/pdf' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'text/plain'
    );

    const newUploadingFiles: UploadingFile[] = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as UploadStatus
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Simulate upload progress
    for (let i = 0; i < validFiles.length; i++) {
      const fileIndex = uploadingFiles.length + i;
      
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadingFiles(prev => 
          prev.map((f, idx) => 
            idx === fileIndex ? { ...f, progress } : f
          )
        );
      }
      
      setUploadingFiles(prev => 
        prev.map((f, idx) => 
          idx === fileIndex ? { ...f, status: 'success' as UploadStatus } : f
        )
      );
    }

    await onUpload(validFiles);
  };

  const removeFile = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setUploadingFiles([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Upload Documents
          </DialogTitle>
        </DialogHeader>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 transition-all",
            isDragging 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          )}
        >
          <input
            type="file"
            multiple
            accept=".pdf,.docx,.txt"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Upload className={cn(
                "w-8 h-8 transition-transform",
                isDragging ? "text-primary scale-110" : "text-muted-foreground"
              )} />
            </div>
            <h3 className="font-medium mb-1">
              {isDragging ? "Drop files here" : "Drag & drop files"}
            </h3>
            <p className="text-sm text-muted-foreground">
              or click to browse your files
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Supports PDF, DOCX, and TXT files
            </p>
          </div>
        </div>

        {uploadingFiles.length > 0 && (
          <div className="space-y-3 mt-4">
            {uploadingFiles.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.file.name}</p>
                  {item.status === 'uploading' && (
                    <Progress value={item.progress} className="h-1 mt-2" />
                  )}
                  {item.status === 'error' && (
                    <p className="text-xs text-destructive mt-1">{item.error}</p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  {item.status === 'uploading' && (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  )}
                  {item.status === 'success' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {item.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-destructive" />
                  )}
                  {item.status !== 'uploading' && (
                    <button
                      onClick={() => removeFile(index)}
                      className="ml-2 p-1 rounded-md hover:bg-muted transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
