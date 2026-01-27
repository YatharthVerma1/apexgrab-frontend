
import React from 'react';
import { VideoQuality, DownloadStatus } from '../types';

interface DownloadCardProps {
  url: string;
  setUrl: (url: string) => void;
  quality: VideoQuality;
  setQuality: (q: VideoQuality) => void;
  status: DownloadStatus | null;
  isDownloading: boolean;
  onStart: () => void;
  onCancel: () => void;
}

export const DownloadCard: React.FC<DownloadCardProps> = ({
  url,
  setUrl,
  quality,
  setQuality,
  status,
  isDownloading,
  onStart,
  onCancel
}) => {
  const qualities: VideoQuality[] = ['480p', '720p', '1080p', '4k'];

  return (
    <div className="glass-card rounded-[2rem] p-8 md:p-10 transition-all duration-500 hover:shadow-2xl">
      <div className="space-y-8">
        {/* Input Field Group */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
            YouTube Video URL
          </label>
          <div className="relative group input-focus-ring rounded-2xl overflow-hidden transition-all duration-300">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
              <i className="fa-solid fa-link"></i>
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              disabled={isDownloading}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-5 outline-none text-white placeholder:text-slate-600 transition-all focus:bg-white/10"
            />
          </div>
        </div>

        {/* Quality Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
            Select Quality
          </label>
          <div className="grid grid-cols-4 gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
            {qualities.map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                disabled={isDownloading}
                className={`
                  py-2.5 rounded-xl text-sm font-bold transition-all duration-300
                  ${quality === q 
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-50'}
                `}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button & Status */}
        <div className="pt-4 space-y-6">
          {!isDownloading ? (
            <button
              onClick={onStart}
              disabled={!url}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-3"
            >
              <i className="fa-solid fa-download"></i>
              Start Download
            </button>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="text-cyan-400 flex items-center gap-2">
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  Processing Video...
                </span>
                <span className="text-slate-300">
                  {status ? `${Math.round(status.percent)}%` : 'Initializing...'}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out progress-bar-glow"
                  style={{ width: `${status?.percent || 0}%` }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-[shimmer_2s_infinite] w-20"></div>
                </div>
              </div>

              <button
                onClick={onCancel}
                className="w-full py-4 rounded-xl border border-red-500/30 text-red-500 font-bold text-sm hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-xmark"></i>
                Cancel Process
              </button>
            </div>
          )}

          {/* Persistent Informational Text */}
          <div className="pt-2">
            <p className="text-center text-slate-300 text-sm md:text-base font-semibold tracking-wide flex items-center justify-center gap-3 py-4 bg-white/5 rounded-2xl border border-white/5 animate-in fade-in duration-1000">
              <i className="fa-solid fa-circle-check text-cyan-400"></i>
              Downloaded file will be directly saved on your device
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
