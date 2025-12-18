import { Bot, User, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnswerSegment {
  text: string;
  sourceIndex?: number;
}

interface AnswerDisplayProps {
  question: string;
  answer: string;
  segments?: AnswerSegment[];
  isLoading?: boolean;
  onSourceClick?: (index: number) => void;
}

export function AnswerDisplay({ 
  question, 
  answer, 
  segments, 
  isLoading = false,
  onSourceClick 
}: AnswerDisplayProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      {/* User Question */}
      <div className="flex gap-4 items-start">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-secondary-foreground" />
        </div>
        <div className="flex-1 pt-2">
          <p className="text-lg font-medium">{question}</p>
        </div>
      </div>

      {/* AI Answer */}
      <div className="flex gap-4 items-start">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1 glass-strong rounded-2xl p-6">
          {isLoading ? (
            <LoadingState />
          ) : segments && segments.length > 0 ? (
            <div className="prose prose-slate max-w-none">
              {segments.map((segment, i) => (
                <span key={i}>
                  {segment.text}
                  {segment.sourceIndex !== undefined && (
                    <button
                      onClick={() => onSourceClick?.(segment.sourceIndex!)}
                      className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs font-medium bg-primary/20 text-primary rounded-full hover:bg-primary/30 transition-colors cursor-pointer"
                    >
                      {segment.sourceIndex + 1}
                    </button>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-foreground leading-relaxed">{answer}</p>
          )}
          
          {!isLoading && (
            <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-sm text-muted-foreground">
              <Quote className="w-4 h-4" />
              <span>This answer was generated exclusively from your documents</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <span className="text-sm search-loading">Searching through documents...</span>
      </div>
      
      <div className="space-y-3">
        <div className="h-4 bg-muted/50 rounded-full w-full animate-pulse" />
        <div className="h-4 bg-muted/50 rounded-full w-5/6 animate-pulse" />
        <div className="h-4 bg-muted/50 rounded-full w-4/6 animate-pulse" />
      </div>
    </div>
  );
}
