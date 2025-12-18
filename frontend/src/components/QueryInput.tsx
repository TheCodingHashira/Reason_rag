import { useState, KeyboardEvent } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading?: boolean;
}

export function QueryInput({ onSubmit, isLoading = false }: QueryInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Powered by Document Intelligence</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-3 gradient-text">
          Ask Your Documents
        </h1>
        <p className="text-muted-foreground text-lg">
          Get accurate answers grounded in your knowledge base
        </p>
      </div>

      <div className={cn(
        "relative glass-strong rounded-2xl p-2 transition-all duration-300",
        isLoading && "pulse-glow"
      )}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your documents..."
          className="w-full min-h-[100px] p-4 bg-transparent border-none resize-none focus:outline-none text-foreground placeholder:text-muted-foreground/60 text-lg"
          disabled={isLoading}
        />
        
        <div className="flex items-center justify-between px-2 pb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="px-2 py-1 rounded-md bg-muted/30 text-xs">
              Press Enter to search
            </span>
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={!query.trim() || isLoading}
            className="gap-2 rounded-xl px-6"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search Documents
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
