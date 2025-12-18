import { Sparkles, ArrowRight, Brain, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeHeroProps {
  onStartChat: () => void;
}

export function WelcomeHero({ onStartChat }: WelcomeHeroProps) {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Advanced RAG technology for precise answers',
    },
    {
      icon: Shield,
      title: 'Source Transparency',
      description: 'Every answer backed by document evidence',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Real-time semantic search across all documents',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-6">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 animate-fade-in-up">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm text-muted-foreground">Powered by Document Intelligence</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-5xl md:text-7xl font-serif font-bold text-center mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <span className="gradient-text">Ask Your</span>
        <br />
        <span className="gradient-text">Documents Anything</span>
      </h1>

      {/* Subtitle */}
      <p className="text-xl text-muted-foreground text-center max-w-2xl mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        Get instant, accurate answers grounded in your knowledge base. 
        Every response is sourced from your actual documents.
      </p>

      {/* CTA Button */}
      <Button
        size="lg"
        onClick={onStartChat}
        className="gap-2 rounded-xl px-8 py-6 text-lg animate-fade-in-up pulse-glow"
        style={{ animationDelay: '0.3s' }}
      >
        Start a Conversation
        <ArrowRight className="w-5 h-5" />
      </Button>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-20 w-full max-w-4xl">
        {features.map((feature, i) => (
          <div
            key={feature.title}
            className="glass rounded-2xl p-6 text-center opacity-0 animate-fade-in-up hover:scale-105 transition-transform cursor-default"
            style={{ animationDelay: `${0.4 + i * 0.1}s` }}
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <feature.icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
