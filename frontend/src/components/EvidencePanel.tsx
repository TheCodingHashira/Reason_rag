import { useState } from 'react';
import { FileText, ChevronDown, ChevronRight, ExternalLink, BookOpen, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface EvidenceSource {
  id: string;
  documentName: string;
  pageNumber: number;
  snippet: string;
  relevanceScore: number;
  highlightedText: string;
}

interface EvidencePanelProps {
  sources: EvidenceSource[];
  activeSourceIndex?: number;
  onSourceSelect?: (index: number) => void;
}

export function EvidencePanel({ sources, activeSourceIndex, onSourceSelect }: EvidencePanelProps) {
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set());

  const toggleSource = (id: string) => {
    const newExpanded = new Set(expandedSources);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSources(newExpanded);
  };

  if (sources.length === 0) {
    return (
      <div className="glass-strong rounded-2xl p-6 text-center">
        <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-muted-foreground">No evidence sources yet</p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Ask a question to see relevant document excerpts
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg">Evidence Sources</h3>
        <span className="ml-auto text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
          {sources.length} sources
        </span>
      </div>

      <div className="space-y-2">
        {sources.map((source, index) => {
          const isExpanded = expandedSources.has(source.id);
          const isActive = activeSourceIndex === index;

          return (
            <div
              key={source.id}
              className={cn(
                "glass rounded-xl overflow-hidden transition-all duration-200",
                isActive && "ring-2 ring-primary"
              )}
            >
              <button
                onClick={() => {
                  toggleSource(source.id);
                  onSourceSelect?.(index);
                }}
                className="w-full p-4 flex items-start gap-3 text-left hover:bg-muted/30 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-primary">{index + 1}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium truncate">{source.documentName}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      Page {source.pageNumber}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {source.snippet}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${source.relevanceScore * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(source.relevanceScore * 100)}% relevant
                    </span>
                  </div>
                </div>

                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 animate-fade-in-up">
                  <div className="evidence-highlight ml-9">
                    <p className="text-sm italic">"{source.highlightedText}"</p>
                  </div>
                  
                  <div className="mt-3 ml-9">
                    <Button variant="outline" size="sm" className="gap-2 text-xs">
                      <ExternalLink className="w-3 h-3" />
                      View Full Document
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
