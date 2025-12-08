import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Calendar, 
  Zap,
  TrendingUp,
  Youtube,
  Target,
  Trash2,
  Eye,
  Filter,
  Search,
  X
} from 'lucide-react';

export interface HistoryItem {
  id: string;
  timestamp: number;
  tool: 'content-generator' | 'youtube-seo' | 'trend-hunter' | 'ppc-spy';
  mode?: 'generate' | 'repurpose';
  contentType?: string;
  keyword?: string;
  targetFormat?: string;
  generatedContent: string;
  seoAnalysis?: any;
  extractedElements?: any;
  metadata?: {
    wordCount?: string;
    country?: string;
    audience?: string;
    tone?: string;
    framework?: string;
  };
}

interface HistoryTabProps {
  isDashboard?: boolean;
}

export function HistoryTab({ isDashboard }: HistoryTabProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [filterTool, setFilterTool] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load history from localStorage
  useEffect(() => {
    loadHistory();
  }, []);

  // Filter and search
  useEffect(() => {
    let filtered = [...history];

    // Filter by tool
    if (filterTool !== 'all') {
      filtered = filtered.filter(item => item.tool === filterTool);
    }

    // Search
    if (searchQuery.trim()) {
      filtered = filtered.filter(item => 
        item.keyword?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.generatedContent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.contentType?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by most recent first
    filtered.sort((a, b) => b.timestamp - a.timestamp);

    setFilteredHistory(filtered);
  }, [history, filterTool, searchQuery]);

  function loadHistory() {
    try {
      const stored = localStorage.getItem('contentrex_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }

  function deleteItem(id: string) {
    try {
      const updated = history.filter(item => item.id !== id);
      localStorage.setItem('contentrex_history', JSON.stringify(updated));
      setHistory(updated);
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  }

  function clearAllHistory() {
    if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      localStorage.setItem('contentrex_history', JSON.stringify([]));
      setHistory([]);
      setSelectedItem(null);
    }
  }

  function getToolIcon(tool: string) {
    switch (tool) {
      case 'content-generator':
        return <Zap className="w-5 h-5" />;
      case 'youtube-seo':
        return <Youtube className="w-5 h-5" />;
      case 'trend-hunter':
        return <TrendingUp className="w-5 h-5" />;
      case 'ppc-spy':
        return <Target className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  }

  function getToolName(tool: string) {
    switch (tool) {
      case 'content-generator':
        return 'Content Generator';
      case 'youtube-seo':
        return 'YouTube SEO Optimizer';
      case 'trend-hunter':
        return 'Trend Hunter';
      case 'ppc-spy':
        return 'PPC Spy';
      default:
        return 'Unknown Tool';
    }
  }

  function formatDate(timestamp: number) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  }

  if (history.length === 0) {
    return (
      <div className="bg-white border-2 border-[#15616d] rounded-2xl p-12 text-center">
        <FileText className="w-16 h-16 text-[#15616d] mx-auto mb-4" />
        <h2 className="text-2xl text-[#001524] mb-2">No History Yet</h2>
        <p className="text-[#15616d] mb-6">
          Your generated content will appear here. Start creating content to build your history.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white border-2 border-[#15616d] rounded-2xl p-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#15616d]" />
            <input
              type="text"
              placeholder="Search by keyword or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border-2 border-[#15616d] rounded-lg focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#15616d] hover:text-[#ff7d00]"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filter by Tool */}
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-[#15616d]" />
            <select
              value={filterTool}
              onChange={(e) => setFilterTool(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-[#15616d] rounded-lg focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00] focus:outline-none"
            >
              <option value="all">All Tools</option>
              <option value="content-generator">Content Generator</option>
              <option value="youtube-seo">YouTube SEO</option>
              <option value="trend-hunter">Trend Hunter</option>
              <option value="ppc-spy">PPC Spy</option>
            </select>
          </div>
        </div>

        {/* Clear All Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearAllHistory}
            className="px-4 py-2 text-sm text-[#78290f] hover:text-[#ff7d00] transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear All History
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-[#15616d] text-sm">
        Showing {filteredHistory.length} of {history.length} items
      </div>

      {/* History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredHistory.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-[#15616d] rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#ff7d00] to-[#78290f] rounded-lg flex items-center justify-center text-white">
                  {getToolIcon(item.tool)}
                </div>
                <div>
                  <h3 className="text-lg text-[#001524]">{getToolName(item.tool)}</h3>
                  <div className="flex items-center gap-2 text-xs text-[#15616d]">
                    <Calendar className="w-3 h-3" />
                    {formatDate(item.timestamp)}
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
              {item.keyword && (
                <div className="text-sm">
                  <span className="text-[#15616d]">Keyword:</span>{' '}
                  <span className="text-[#001524]">{item.keyword}</span>
                </div>
              )}
              {item.contentType && (
                <div className="text-sm">
                  <span className="text-[#15616d]">Type:</span>{' '}
                  <span className="text-[#001524] capitalize">{item.contentType.replace(/-/g, ' ')}</span>
                </div>
              )}
              {item.mode && (
                <div className="text-sm">
                  <span className="text-[#15616d]">Mode:</span>{' '}
                  <span className="text-[#001524] capitalize">{item.mode}</span>
                </div>
              )}
            </div>

            {/* Content Preview */}
            <div className="mb-4">
              <p className="text-sm text-[#15616d] line-clamp-3">
                {item.generatedContent.substring(0, 150)}...
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedItem(item)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
              <button
                onClick={() => deleteItem(item.id)}
                className="px-4 py-2 border-2 border-[#78290f] text-[#78290f] rounded-lg hover:bg-[#78290f] hover:text-white transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredHistory.length === 0 && (
        <div className="bg-white border-2 border-[#15616d] rounded-2xl p-12 text-center">
          <Search className="w-16 h-16 text-[#15616d] mx-auto mb-4" />
          <h2 className="text-2xl text-[#001524] mb-2">No Results Found</h2>
          <p className="text-[#15616d]">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  {getToolIcon(selectedItem.tool)}
                </div>
                <div>
                  <h2 className="text-2xl">{getToolName(selectedItem.tool)}</h2>
                  <p className="text-sm text-[#ffecd1]">{formatDate(selectedItem.timestamp)}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-[#ffecd1] bg-opacity-30 rounded-lg">
                {selectedItem.keyword && (
                  <div>
                    <p className="text-sm text-[#15616d]">Keyword</p>
                    <p className="text-[#001524]">{selectedItem.keyword}</p>
                  </div>
                )}
                {selectedItem.contentType && (
                  <div>
                    <p className="text-sm text-[#15616d]">Content Type</p>
                    <p className="text-[#001524] capitalize">{selectedItem.contentType.replace(/-/g, ' ')}</p>
                  </div>
                )}
                {selectedItem.mode && (
                  <div>
                    <p className="text-sm text-[#15616d]">Mode</p>
                    <p className="text-[#001524] capitalize">{selectedItem.mode}</p>
                  </div>
                )}
                {selectedItem.metadata?.wordCount && (
                  <div>
                    <p className="text-sm text-[#15616d]">Word Count</p>
                    <p className="text-[#001524]">{selectedItem.metadata.wordCount}</p>
                  </div>
                )}
                {selectedItem.metadata?.country && (
                  <div>
                    <p className="text-sm text-[#15616d]">Country</p>
                    <p className="text-[#001524]">{selectedItem.metadata.country}</p>
                  </div>
                )}
                {selectedItem.metadata?.tone && (
                  <div>
                    <p className="text-sm text-[#15616d]">Tone</p>
                    <p className="text-[#001524] capitalize">{selectedItem.metadata.tone}</p>
                  </div>
                )}
              </div>

              {/* Generated Content */}
              <div className="mb-6">
                <h3 className="text-xl text-[#001524] mb-3">Generated Content</h3>
                <div className="bg-white border-2 border-[#15616d] rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-[#001524] font-sans">
                    {selectedItem.generatedContent}
                  </pre>
                </div>
              </div>

              {/* SEO Analysis */}
              {selectedItem.seoAnalysis && (
                <div className="mb-6">
                  <h3 className="text-xl text-[#001524] mb-3">SEO Analysis</h3>
                  <div className="bg-white border-2 border-[#15616d] rounded-lg p-4">
                    <pre className="whitespace-pre-wrap text-sm text-[#001524] font-sans">
                      {JSON.stringify(selectedItem.seoAnalysis, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t-2 border-[#15616d] flex gap-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedItem.generatedContent);
                  alert('Content copied to clipboard!');
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Copy Content
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-6 py-3 border-2 border-[#15616d] text-[#15616d] rounded-lg hover:bg-[#ffecd1] transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Helper function to save to history (export for use in other components)
export function saveToHistory(item: Omit<HistoryItem, 'id' | 'timestamp'>) {
  try {
    const stored = localStorage.getItem('contentrex_history');
    const history: HistoryItem[] = stored ? JSON.parse(stored) : [];
    
    const newItem: HistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };
    
    history.unshift(newItem);
    
    // Keep only last 100 items
    const trimmed = history.slice(0, 100);
    
    localStorage.setItem('contentrex_history', JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to save to history:', error);
  }
}
