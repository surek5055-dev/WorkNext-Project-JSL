import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Sidebar } from '../components/common/Sidebar';
import { ChatMessage } from '../types';
import Markdown from 'react-markdown';
import {
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  FileText,
  Briefcase,
  GraduationCap,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { Button } from '../components/ui/Button';

const QUICK_PROMPTS = [
  {
    icon: <FileText className="w-3.5 h-3.5" />,
    text: 'How can I optimize my resume for ATS parsers?'
  },
  {
    icon: <GraduationCap className="w-3.5 h-3.5" />,
    text: 'What are the most in-demand skills for tech jobs today?'
  },
  {
    icon: <HelpCircle className="w-3.5 h-3.5" />,
    text: 'How should I answer "Tell me about yourself" using STAR?'
  },
  {
    icon: <Briefcase className="w-3.5 h-3.5" />,
    text: 'What are effective salary negotiation strategies for candidates?'
  }
];

export const CareerChatbotPage: React.FC = () => {
  const { user, isLoggedIn } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg_initial',
        sender: 'assistant',
        text: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! I am your **WorkNext AI Career Coach**. 
        
I can assist you with:
- **Resume & ATS Reviews**: Actionable bullet points and keyword targeting.
- **Skill Development**: Career path roadmaps and skill gap assessments.
- **Interview Preparation**: Practice behavioral and technical interview questions.
- **Job Search Strategy**: Networking tactics and compensation negotiations.

How can I help support your career journey today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: [
          'Optimize my resume bullet points',
          'Practice interview questions',
          'In-demand skills for my role'
        ]
      }
    ];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isSending) return;

    setServiceError(null);
    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputMessage('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat/career', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          history: nextMessages.slice(-8),
          userProfile: {
            name: user?.name,
            title: user?.title,
            skills: user?.skills,
            experienceYears: user?.experienceYears
          }
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorText = data.error || 'The AI Career Chatbot is temporarily unavailable. Please try again shortly.';
        setServiceError(errorText);
        setMessages(prev => [
          ...prev,
          {
            id: `msg_err_${Date.now()}`,
            sender: 'assistant',
            text: `⚠️ **Service Notice:** ${errorText}\n\nYou can still use our verified **AI Resume Builder** or explore **Local Job Openings** while our AI model recovers.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        return;
      }

      const botMsg: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const networkError = 'The AI Career Chatbot service is currently unreachable. Please check your connection or try again later.';
      setServiceError(networkError);
      setMessages(prev => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ **Notice:** ${networkError}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg_initial_' + Date.now(),
        sender: 'assistant',
        text: `Conversation restarted! How can I assist you with your career, resume, or interview preparations today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setServiceError(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] dark:bg-[#111111] text-stone-900 dark:text-stone-100 flex flex-col font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <Sidebar />

        {/* Chat Center Area */}
        <main className="flex-1 flex flex-col h-[calc(100vh-12rem)] min-h-[600px] bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 rounded-3xl shadow-xl backdrop-blur-md overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 sm:px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0F766E] to-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-700/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-stone-900 dark:text-white font-display">
                    AI Career Coach
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-400 border border-teal-200 dark:border-teal-800/80 text-[10px] font-mono font-semibold">
                    <Sparkles className="w-3 h-3" /> Live
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 font-sans">
                  Tailored guidance for resumes, interview prep, and career strategy
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetChat}
                className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                title="Restart conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Chat</span>
              </button>
            </div>
          </div>

          {/* Service Notice Warning if error occurred */}
          {serviceError && (
            <div className="mx-4 mt-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{serviceError}</p>
                <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                  The chatbot connects directly to the server AI provider. If quota is exceeded, answers will resume automatically.
                </p>
              </div>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.sender === 'user'
                      ? 'bg-[#0F766E] text-white'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4 text-[#0F766E] dark:text-teal-400" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed space-y-2 shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#0F766E] text-white rounded-tr-xs'
                      : 'bg-stone-100/90 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 border border-stone-200/80 dark:border-stone-700/60 rounded-tl-xs'
                  }`}
                >
                  <div className="markdown-body font-sans break-words prose dark:prose-invert max-w-none text-xs sm:text-sm">
                    <Markdown>{msg.text}</Markdown>
                  </div>

                  {/* Optional Quick Reply Chips for assistant */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {msg.quickReplies.map((reply, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(reply)}
                          disabled={isSending}
                          className="px-2.5 py-1 rounded-full bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 text-[11px] font-medium text-stone-700 dark:text-stone-200 hover:text-[#0F766E] dark:hover:text-teal-300 hover:border-teal-500 transition-all cursor-pointer"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}

                  <span
                    className={`block text-[10px] text-right ${
                      msg.sender === 'user' ? 'text-teal-200' : 'text-stone-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex gap-3 max-w-3xl mr-auto">
                <div className="w-8 h-8 rounded-xl bg-stone-200 dark:bg-stone-800 text-[#0F766E] dark:text-teal-400 flex items-center justify-center shrink-0 border border-stone-300 dark:border-stone-700">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="p-4 rounded-3xl rounded-tl-xs bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 text-xs flex items-center gap-2 border border-stone-200 dark:border-stone-700">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0F766E] dark:text-teal-400" />
                  <span>AI Coach is crafting your response...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar (when not sending) */}
          <div className="px-4 py-2 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 hidden sm:flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 shrink-0">
              Suggestions:
            </span>
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt.text)}
                disabled={isSending}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-[11px] hover:border-[#0F766E] hover:text-[#0F766E] dark:hover:text-teal-400 transition-colors cursor-pointer"
              >
                {prompt.icon}
                <span className="truncate max-w-[200px]">{prompt.text}</span>
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder="Ask about resumes, skill gaps, interview prep, or career transitions..."
                disabled={isSending}
                className="flex-1 px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all"
              />
              <Button
                type="submit"
                variant="primary"
                disabled={!inputMessage.trim() || isSending}
                className="bg-[#0F766E] hover:bg-[#0D655E] text-white px-5 py-3 rounded-2xl shrink-0"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </Button>
            </form>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
