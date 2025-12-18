import { cn } from '@/lib/utils';
import { FileSearch, Database, Cpu } from 'lucide-react';

interface SearchingOverlayProps {
  isVisible: boolean;
  stage: 'retrieving' | 'analyzing' | 'generating';
}

const stages = {
  retrieving: {
    icon: Database,
    title: 'Retrieving Documents',
    description: 'Searching through your knowledge base...'
  },
  analyzing: {
    icon: FileSearch,
    title: 'Analyzing Content',
    description: 'Finding relevant passages and evidence...'
  },
  generating: {
    icon: Cpu,
    title: 'Generating Answer',
    description: 'Synthesizing information from sources...'
  }
};

export function SearchingOverlay({ isVisible, stage }: SearchingOverlayProps) {
  const currentStage = stages[stage];
  const Icon = currentStage.icon;

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-300",
      isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      <div className="glass-strong rounded-3xl p-8 text-center max-w-sm animate-fade-in-up">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/20 flex items-center justify-center pulse-glow">
          <Icon className="w-8 h-8 text-primary animate-pulse" />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{currentStage.title}</h3>
        <p className="text-muted-foreground">{currentStage.description}</p>
        
        <div className="mt-6 flex justify-center gap-2">
          {Object.keys(stages).map((s, i) => (
            <div
              key={s}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                s === stage ? "bg-primary w-6" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
