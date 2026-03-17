'use client';

import { useState } from 'react';
import { calculateMatrix, MatrixDestiny } from '@/utils/matrixDestiny';
import MatrixVisualizer from '@/components/MatrixVisualizer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Calendar, Sparkles, Loader2, User } from 'lucide-react';

export default function Home() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [matrix, setMatrix] = useState<MatrixDestiny | null>(null);
  
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !name) return;

    // parse YYYY-MM-DD
    const [yearStr, monthStr, dayStr] = date.split('-');
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    const calculatedMatrix = calculateMatrix(day, month, year);
    setMatrix(calculatedMatrix);
    setIsLoading(true);

    const userMessageContent = JSON.stringify({
      name: name,
      date: `${day}/${month}/${year}`,
      matrix: calculatedMatrix
    }) + `\n\nXin chào, tôi tên là ${name}, ngày sinh của tôi là ${day}/${month}/${year}. Hãy phân tích cặn kẽ dựa trên ngày sinh này theo đúng các yêu cầu phân tích nhé.`;
    
    // Set initial user message
    const initialMessages = [{ role: 'user', content: userMessageContent }];
    setMessages(initialMessages);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: initialMessages })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error (${response.status}): ${errorText.substring(0, 100)}...`);
      }
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk.replace(/^0:/gm, '').replace(/"/g, '').replace(/\\n/g, '\n'); 
        
        setMessages(prev => {
           const newMessages = [...prev];
           newMessages[newMessages.length - 1].content = assistantContent;
           return newMessages;
        });
      }
      
      if (!assistantContent.trim()) {
        throw new Error("Luồng dữ liệu AI bị rỗng. Vui lòng kiểm tra lại API Key hoặc hệ thống Vercel có thể đã Timeout vì giới hạn tài khoản miễn phí (Hobby).");
      }
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setMessages(prev => {
        const newMessages = [...prev];
        // If the last message was the empty assistant placeholder, replace it
        if (newMessages[newMessages.length - 1].role === 'assistant' && !newMessages[newMessages.length - 1].content) {
          newMessages.pop();
        }
        return [...newMessages, { 
          role: 'assistant', 
          content: `**Đã xảy ra lỗi:** Lấy phản hồi thất bại.\n\nChi tiết: ${errorMessage}\n\nVui lòng làm mới trang (F5) hoặc kiểm tra lại khóa API Vercel của bạn.` 
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const assistantMessages = messages.filter((m: {role: string, content: string}) => m.role === 'assistant');
  const latestMessage = assistantMessages[assistantMessages.length - 1];

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-amber-500/30">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-amber-500" />
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              Matrix Destiny
            </span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            Nhập tên và ngày sinh của bạn để khám phá Bản Đồ Vận Mệnh 22 Arcana. Nhận bản phân tích tâm lý học chuyên sâu lên tới 10,000 chữ về cuộc đời, tính cách và tiềm năng của bạn.
          </p>
        </div>

        {/* Form area */}
        {!matrix && !isLoading && (
          <div className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 sm:p-12 ring-1 ring-zinc-200 dark:ring-zinc-800 backdrop-blur-sm max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                  Họ và Tên
                </label>
                <div className="relative mb-6">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    required
                    value={name}
                    placeholder="Nguyễn Văn A"
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-zinc-50 dark:bg-zinc-950 transition-colors"
                  />
                </div>
                <label htmlFor="dob" className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                  Ngày Sinh (Dương Lịch)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    type="date"
                    id="dob"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-zinc-50 dark:bg-zinc-950 transition-colors"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={!date}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Phân tích toàn diện hành trình
              </button>
            </form>
          </div>
        )}

        {/* Results Area */}
        {matrix && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* The Visualizer */}
            <div className="bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-8 ring-1 ring-zinc-200 dark:ring-zinc-800 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600"></div>
                <h2 className="text-2xl font-bold text-center mb-2">Ma Trận Của Bạn</h2>
                <MatrixVisualizer matrix={matrix} />
            </div>

            {/* Analysis Report */}
            <div className="bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-6 sm:p-12 ring-1 ring-zinc-200 dark:ring-zinc-800 prose prose-zinc dark:prose-invert prose-amber max-w-none">
              {latestMessage ? (
                <article>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {latestMessage.content}
                  </ReactMarkdown>
                </article>
              ) : isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-500 space-y-4">
                  <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
                  <p className="animate-pulse">Hệ thống đang tiến hành phân tích chuyên sâu...</p>
                  <p className="text-sm opacity-60">Quá trình này có thể mất vài phút vì độ chi tiết rất cao.</p>
                </div>
              ) : null}
            </div>
            
            {isLoading && latestMessage && (
               <div className="flex items-center justify-center space-x-2 text-zinc-500 py-4 animate-pulse">
                 <Loader2 className="w-5 h-5 animate-spin" />
                 <span>Đang tiếp tục viết báo cáo...</span>
               </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
