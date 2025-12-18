import { useState } from 'react';
import { 
  MessageSquare, 
  FileText, 
  Upload, 
  Settings, 
  Moon, 
  Sun,
  ChevronRight,
  Plus,
  Trash2,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: Date;
}

interface AppSidebarProps {
  conversations: Conversation[];
  documents: Document[];
  activeConversationId?: string;
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
  onDocumentUpload: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function AppSidebar({
  conversations,
  documents,
  activeConversationId,
  onConversationSelect,
  onNewConversation,
  onDocumentUpload,
  isDarkMode,
  onToggleDarkMode,
}: AppSidebarProps) {
  const [activeTab, setActiveTab] = useState<'chats' | 'docs'>('chats');

  return (
    <div className="w-72 h-screen glass-strong border-r border-border/50 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">RAG Assistant</h1>
            <p className="text-xs text-muted-foreground">Document Intelligence</p>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="p-3 border-b border-border/50">
        <div className="flex gap-1 p-1 rounded-lg bg-muted/30">
          <button
            onClick={() => setActiveTab('chats')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all",
              activeTab === 'chats' 
                ? "bg-card shadow-sm text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <MessageSquare className="w-4 h-4" />
            Chats
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all",
              activeTab === 'docs' 
                ? "bg-card shadow-sm text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <FileText className="w-4 h-4" />
            Docs
          </button>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-3">
        <Button
          onClick={activeTab === 'chats' ? onNewConversation : onDocumentUpload}
          className="w-full gap-2 rounded-xl"
          variant="default"
        >
          {activeTab === 'chats' ? (
            <>
              <Plus className="w-4 h-4" />
              New Chat
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload Document
            </>
          )}
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 px-3">
        {activeTab === 'chats' ? (
          <div className="space-y-1 pb-4">
            {conversations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No conversations yet
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => onConversationSelect(conv.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all group",
                    activeConversationId === conv.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/50 text-foreground"
                  )}
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{conv.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {conv.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-1 pb-4">
            {documents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No documents uploaded
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.type}</p>
                  </div>
                  <button className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border/50 space-y-2">
        <Button
          variant="ghost"
          onClick={onToggleDarkMode}
          className="w-full justify-start gap-3 rounded-xl"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-4 h-4" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="w-4 h-4" />
              Dark Mode
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-xl"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}
