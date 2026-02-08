
import React from 'react';
import { VideoQuality, DownloadStatus, ToolConfig } from '../types';

interface DownloadCardProps {
  tool: ToolConfig;
  url: string;
  setUrl: (url: string) => void;
  quality: string;
  setQuality: (q: any) => void;
  subQuality?: string;
  setSubQuality?: (q: string) => void;
  language?: string;
  setLanguage?: (l: string) => void;
  timestamps?: string;
  setTimestamps?: (t: string) => void;
  format: string;
  setFormat: (f: string) => void;
  status: DownloadStatus | null;
  isDownloading: boolean;
  onStart: () => void;
  onCancel: () => void;
  onBack: () => void;
}

export const DownloadCard: React.FC<DownloadCardProps> = ({
  tool,
  url,
  setUrl,
  quality,
  setQuality,
  subQuality,
  setSubQuality,
  language,
  setLanguage,
  timestamps,
  setTimestamps,
  format,
  setFormat,
  status,
  isDownloading,
  onStart,
  onCancel,
  onBack
}) => {
  const isSocialDownloader = tool.id === 'ig-downloader' || tool.id === 'fb-downloader';
  const isTranscript = tool.id === 'yt-transcript';
  const isSummarizer = tool.id === 'yt-summary';
  const isTikTok = tool.id === 'tt-downloader';
  const showSubQuality = isSocialDownloader && quality === 'Video';

  const getQualityLabel = () => {
    if (isTranscript) return 'Select Output Format';
    if (isSocialDownloader) return 'Select Format';
    return 'Select Quality Options';
  };

  return (
    <div className="glass-card rounded-[2.5rem] p-8 md:p-12 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-cyan-500 transition-colors group"
      >
        <i className="fa-solid fa-arrow-left transition-transform group-hover:-translate-x-1"></i>
        <span className="font-bold text-sm uppercase tracking-widest">Back to Hub</span>
      </button>

      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg overflow-hidden" style={{ backgroundColor: tool.brandColor }}>
          {tool.icon.startsWith('http') ? (
            <img src={tool.icon} alt={tool.title} className="w-full h-full object-cover p-2" />
          ) : (
            <i className={tool.icon}></i>
          )}
        </div>
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight opacity-95">{tool.title}</h2>
          <p className="opacity-60 font-medium">{tool.description}</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Input Field Group */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
            Media URL
          </label>
          <div className="relative group input-focus-ring rounded-2xl overflow-hidden transition-all duration-300">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
              <i className="fa-solid fa-link"></i>
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={tool.placeholder}
              disabled={isDownloading}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-5 outline-none placeholder:text-slate-500 transition-all focus:bg-white/10"
            />
          </div>
        </div>

        {/* Select Language for Transcript or Summarizer */}
        {(isTranscript || isSummarizer) && setLanguage && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
              Select Language
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
              {['English:en', 'Hindi:hi', 'Spanish:es', 'French:fr'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  disabled={isDownloading}
                  className={`
                    py-3 rounded-xl text-xs font-bold transition-all duration-300
                    ${language === lang 
                      ? 'bg-cyan-500 text-black shadow-xl' 
                      : 'opacity-60 hover:opacity-100 hover:bg-white/5 disabled:opacity-50'}
                  `}
                >
                  {lang.split(':')[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quality/Format Selector */}
        {tool.qualities && (
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
              {getQualityLabel()}
            </label>
            <div className={`grid gap-3 bg-white/5 p-2 rounded-2xl border border-white/5 ${
              isTikTok 
                ? 'grid-cols-5' 
                : (tool.qualities.length > 2 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2')
            }`}>
              {tool.qualities.map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  disabled={isDownloading}
                  className={`
                    py-3 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-300
                    ${quality === q 
                      ? 'bg-cyan-500 text-black shadow-xl' 
                      : 'opacity-60 hover:opacity-100 hover:bg-white/5 disabled:opacity-50'}
                  `}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Timestamps for Transcript */}
        {isTranscript && setTimestamps && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
              Timestamps
            </label>
            <div className="grid grid-cols-2 gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
              {['True', 'False'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimestamps(t)}
                  disabled={isDownloading}
                  className={`
                    py-3 rounded-xl text-sm font-bold transition-all duration-300
                    ${timestamps === t 
                      ? 'bg-cyan-500 text-black shadow-xl' 
                      : 'opacity-60 hover:opacity-100 hover:bg-white/5 disabled:opacity-50'}
                  `}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nested Video Quality for IG and FB */}
        {showSubQuality && setSubQuality && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
              Select Video Quality
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
              {['480P', '720P', '1080P', '4K'].map((v) => (
                <button
                  key={v}
                  onClick={() => setSubQuality(v)}
                  disabled={isDownloading}
                  className={`
                    py-3 rounded-xl text-sm font-bold transition-all duration-300
                    ${subQuality === v 
                      ? 'bg-cyan-500 text-black shadow-xl' 
                      : 'opacity-60 hover:opacity-100 hover:bg-white/5 disabled:opacity-50'}
                  `}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Format Selector */}
        {tool.formats && (
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
              Select Output Format
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
              {tool.formats.map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  disabled={isDownloading}
                  className={`
                    py-3 rounded-xl text-sm font-bold transition-all duration-300
                    ${format === f 
                      ? 'bg-cyan-500 text-black shadow-xl' 
                      : 'opacity-60 hover:opacity-100 hover:bg-white/5 disabled:opacity-50'}
                  `}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Button & Status */}
        <div className="pt-4 space-y-6">
          {!isDownloading ? (
            <div className="space-y-4">
              {isTranscript && (
                <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-500/80 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  Please download Transcript in original language
                </p>
              )}
              {isTikTok && (
                <p className="text-center text-xs font-bold uppercase tracking-wider text-red-400/80 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  TikTok Downloader is not available in India.
                </p>
              )}
              <button
                onClick={onStart}
                disabled={!url}
                className="w-full py-5 rounded-2xl text-black font-extrabold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3 shadow-2xl"
                style={{ background: `linear-gradient(to right, ${tool.brandColor}, #4f46e5)` }}
              >
                <i className="fa-solid fa-download"></i>
                Download Now
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="text-cyan-400 flex items-center gap-2">
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  Extracting Media... download will start in a few seconds
                </span>
                <span className="opacity-70">
                  {status ? `${Math.round(status.percent)}%` : 'Initializing Engine...'}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="absolute inset-y-0 left-0 transition-all duration-500 ease-out progress-bar-glow"
                  style={{ width: `${status?.percent || 0}%`, backgroundColor: tool.brandColor }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-[shimmer_2s_infinite] w-20"></div>
                </div>
              </div>

              <button
                onClick={onCancel}
                className="w-full py-4 rounded-xl border border-red-500/30 text-red-500 font-bold text-sm hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-xmark"></i>
                Cancel Download
              </button>
            </div>
          )}

          <div className="pt-2">
            <p className="text-center text-sm font-medium tracking-wide flex items-center justify-center gap-3 py-4 bg-white/5 rounded-2xl border border-white/5 opacity-80">
              <i className="fa-solid fa-shield-halved text-cyan-400"></i>
              High speed, secure & anonymous processing
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(500%); }
        }
      `}</style>
    </div>
  );
};
