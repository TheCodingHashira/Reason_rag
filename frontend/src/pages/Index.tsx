import { useState, useCallback, useEffect } from 'react';
import { QueryInput } from '@/components/QueryInput';
import { AnswerDisplay } from '@/components/AnswerDisplay';
import { EvidencePanel, type EvidenceSource } from '@/components/EvidencePanel';
import { SearchingOverlay } from '@/components/SearchingOverlay';
import { AppSidebar } from '@/components/AppSidebar';
import { DocumentUploadModal } from '@/components/DocumentUploadModal';
import { ParticleBackground } from '@/components/ParticleBackground';
import { WelcomeHero } from '@/components/WelcomeHero';
import { StatsBar } from '@/components/StatsBar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
// Mock data removed in favor of real API

type SearchStage = 'retrieving' | 'analyzing' | 'generating';

const Index = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchStage, setSearchStage] = useState<SearchStage>('retrieving');
  const [hasSearched, setHasSearched] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [sources, setSources] = useState<EvidenceSource[]>([]);
  const [answer, setAnswer] = useState('');
  const [activeSourceIndex, setActiveSourceIndex] = useState<number | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const { toast } = useToast();

  // Fetch Documents
  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:8000/documents');
      if (res.ok) {
        const data = await res.json();
        // Map to match interface expected by AppSidebar
        const docs = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          type: d.type,
          uploadedAt: new Date() // Simplified for now
        }));
        setDocuments(docs);
      }
    } catch (e) {
      console.error("Failed to fetch docs", e);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // State for real data
  const [conversations, setConversations] = useState<any[]>([]); // Start empty
  const [documents, setDocuments] = useState<any[]>([]); // Start empty

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleSearch = useCallback(async (query: string) => {
    setIsSearching(true);
    setCurrentQuestion(query);
    setHasSearched(false);
    setShowWelcome(false);
    setSources([]);
    setAnswer('');

    // Simulate retrieval stage start
    setSearchStage('retrieving');

    try {
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: query }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();

      setSearchStage('analyzing');
      await new Promise(resolve => setTimeout(resolve, 500)); // smooth transition
      setSearchStage('generating');
      // await new Promise(resolve => setTimeout(resolve, 500)); // smooth transition

      setAnswer(data.answer);

      // Map backend sources to frontend format
      const mappedSources: EvidenceSource[] = data.sources.map((src: any, index: number) => ({
        id: index.toString(),
        documentName: src.document || 'Unknown Document',
        pageNumber: src.page || 0,
        snippet: src.snippet || '',
        relevanceScore: 0.9, // Backend doesn't return score in the filtered list yet, defaulting
        highlightedText: src.snippet // Use snippet as highlight for now
      }));

      setSources(mappedSources);
      setHasSearched(true);

    } catch (error) {
      console.error("Search failed:", error);
      toast({
        title: "Error",
        description: "Failed to fetch answer from backend. Ensure main.py is running.",
        variant: "destructive"
      });
      setHasSearched(false);
    } finally {
      setIsSearching(false);
    }
  }, [toast]);

  const handleNewConversation = () => {
    setHasSearched(false);
    setShowWelcome(true);
    setCurrentQuestion('');
    setSources([]);
  };

  const handleDocumentUpload = async (files: File[]) => {
    console.log('Uploading files:', files);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Upload success:', data);

      toast({
        title: "Upload Successful",
        description: `Uploaded and ingested ${files.length} documents.`,
      });

      setUploadModalOpen(false);

    } catch (error) {
      console.error('Upload Error:', error);
      toast({
        title: "Upload Failed",
        description: "Could not upload documents.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 transition-transform duration-300",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <AppSidebar
          conversations={conversations}
          documents={documents}
          onConversationSelect={(id) => console.log('Selected:', id)}
          onNewConversation={handleNewConversation}
          onDocumentUpload={() => setUploadModalOpen(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
      </div>

      {/* Main Content */}
      <div className={cn(
        "flex-1 transition-all duration-300 relative",
        sidebarOpen ? "ml-72" : "ml-0"
      )}>
        {/* Searching Overlay */}
        <SearchingOverlay isVisible={isSearching} stage={searchStage} />

        {/* Header */}
        <header className="sticky top-0 z-30 glass-strong border-b border-border/50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-xl"
              >
                <Menu className="w-5 h-5" />
              </Button>

              {!showWelcome && (
                <StatsBar
                  documentsCount={documents.length}
                  conversationsCount={conversations.length}
                  queriesThisWeek={12}
                />
              )}
            </div>
          </div>
        </header>

        {/* Main Area */}
        <main className="relative z-10">
          {showWelcome ? (
            <WelcomeHero onStartChat={() => setShowWelcome(false)} />
          ) : !hasSearched ? (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-6">
              <QueryInput onSubmit={handleSearch} isLoading={isSearching} />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Answer Section */}
                <div className="lg:col-span-2 space-y-6">
                  <QueryInput onSubmit={handleSearch} isLoading={isSearching} />

                  <AnswerDisplay
                    question={currentQuestion}
                    answer={answer}
                    isLoading={isSearching}
                    onSourceClick={setActiveSourceIndex}
                  />
                </div>

                {/* Evidence Panel */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <EvidencePanel
                      sources={sources}
                      activeSourceIndex={activeSourceIndex}
                      onSourceSelect={setActiveSourceIndex}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="relative z-10 p-6 mt-auto">
          <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
            <p>This AI answers exclusively from your uploaded documents. No external data is used.</p>
          </div>
        </footer>
      </div>

      {/* Document Upload Modal */}
      <DocumentUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleDocumentUpload}
      />
    </div>
  );
};

export default Index;
