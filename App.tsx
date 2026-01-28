import React, { useState, useEffect, useRef } from 'react';
import { DownloadCard } from './components/DownloadCard';
import { VideoQuality, DownloadStatus, StartResponse } from './types';

// Backend API URL
const API_BASE_URL = 'http://localhost:8000';

const ComplianceModal: React.FC<{ onAccept: () => void }> = ({ onAccept }) => {
  const [showRejection, setShowRejection] = useState(false);

  if (showRejection) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl"></div>
        <div className="glass-card relative w-full max-w-lg rounded-[2.5rem] p-8 md:p-12 text-center animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-400 mx-auto mb-8">
            <i className="fa-solid fa-circle-exclamation text-4xl"></i>
          </div>
          <h2 className="text-3xl font-extrabold mb-4 tracking-tight text-white">
            Access Restricted
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-10">
            Click on <span className="text-cyan-400 font-bold">Yes</span> to enter website.
          </p>
          <button
            onClick={() => setShowRejection(false)}
            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all active:scale-95"
          >
            Return to Guidelines
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl"></div>
      <div className="glass-card relative w-full max-w-lg rounded-[2.5rem] p-8 md:p-12 text-center animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center text-cyan-400 mx-auto mb-8">
          <i className="fa-solid fa-scale-balanced text-4xl"></i>
        </div>
        <h2 className="text-3xl font-extrabold mb-4 tracking-tight text-white">
          Community Guidelines
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed mb-10">
          This is an <span className="text-cyan-400 font-bold">Education Project</span>. 
          By using this tool, you acknowledge that you <span className="text-white font-bold underline decoration-cyan-500 underline-offset-4">respect YouTube policies</span> and will only use it for legitimate educational purposes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onAccept}
            className="flex-1 py-4 rounded-2xl bg-cyan-500 text-black font-extrabold text-lg transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            Yes, I respect
          </button>
          <button
            onClick={() => setShowRejection(true)}
            className="flex-1 py-4 rounded-2xl border border-white/10 text-slate-400 font-bold text-lg hover:bg-white/5 transition-all"
          >
            No, I don't
          </button>
        </div>
      </div>
    </div>
  );
};

const PrivacyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="glass-card relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-[2rem] p-8 md:p-10 animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
        >
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>
        
        <h2 className="text-2xl font-extrabold text-cyan-400 mb-6 border-b border-white/10 pb-4">Privacy Policy</h2>
        
        <div className="space-y-6 text-slate-300 text-sm md:text-base leading-relaxed">
          <p>By using ApexGrab website, you consent to our privacy policy. This document describes how I treat personal information related to your use of this website and the services offered on and through it, including information you provide when using it.</p>
          
          <section>
            <h3 className="text-white font-bold mb-2">1. Data Collected</h3>
            <p>We do not collect any information, when you use our website. There are no cookies used on this website and I do not store any information of any kind.</p>
          </section>

          <section>
            <h3 className="text-white font-bold mb-2">2. Data usage</h3>
            <p>Since we do not collect any information of any users, I do not use user data in any way or case.</p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <button 
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const CopyrightModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="glass-card relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-[2rem] p-8 md:p-10 animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
        >
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>
        
        <h2 className="text-2xl font-extrabold text-cyan-400 mb-6 border-b border-white/10 pb-4">COPYRIGHT CLAIMS</h2>
        
        <div className="space-y-6 text-slate-300 text-sm md:text-base leading-relaxed">
          <p>If you are a copyright owner or an agent thereof and believe that any Content on our website infringes upon your copyrights, you may submit a claim. Your claim should include the following information:</p>
          
          <ul className="list-disc pl-5 space-y-2">
            <li>URL or list of URLs and content description you want me to disallow.</li>
            <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
            <li>Identification of the copyrighted work claimed to have been infringed, or, if multiple copyrighted works at a single online site are covered by a single notification, a representative list of such works at that site.</li>
            <li>Contact information in the form of an email address with which we will be able to contact you.</li>
          </ul>

          <p>When the information is reviewed, content will be removed from our service within 120 hours.</p>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <button 
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const TermsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="glass-card relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-[2rem] p-8 md:p-10 animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
        >
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>
        
        <h2 className="text-2xl font-extrabold text-cyan-400 mb-6 border-b border-white/10 pb-4">TERMS OF USE</h2>
        
        <div className="space-y-6 text-slate-300 text-sm md:text-base leading-relaxed">
          <section>
            <h3 className="text-white font-bold mb-2">Your Acceptance</h3>
            <p>By using ApexGrab website, you agree to comply with our terms of use. These Terms & Conditions apply to all users of the Website. If you do not agree to these Terms & Conditions or the Privacy Policy, then please do not use the website.</p>
          </section>

          <section>
            <h3 className="text-white font-bold mb-2">Intellectual Property</h3>
            <p>a) The Content on the website, text, graphical images, scripts, trademarks, and logos are owned by me. All Proprietary Materials are subject to copyright. We reserve all of our rights over our Proprietary Materials. b) You agree not to copy, modify, publish, transmit or distribute and in any other way exploit, any content.</p>
          </section>

          <section>
            <h3 className="text-white font-bold mb-2">Grant of use</h3>
            <p>a) We grant you a non-exclusive, non-transferable and limited right to access, non-publicly display, and use the Website. You may only access and use the Website for your personal and noncommercial use. b) This grant is terminable by me at will for any reason and at our sole discretion, with or without prior notice.</p>
          </section>

          <section>
            <h3 className="text-white font-bold mb-2">Limitation of Liability</h3>
            <p>a) We do not guarantee that our services will be uninterrupted, error-free, or secure. b) WE are not liable for any damages, including but not limited to direct, indirect, incidental, or consequential damages, arising out of your use of our website or any content obtained from our website.</p>
          </section>

          <section>
            <h3 className="text-white font-bold mb-2">Change of Terms</h3>
            <p>We reserve the right to update or modify these terms of use at any time without prior notice. Any changes made will be effective immediately upon posting on the website. Your continued use of our services after the posting of changes constitutes your acceptance of the updated terms of use.</p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <button 
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState<VideoQuality>('720p');
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<DownloadStatus | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(false);
  const [isCheckingTerms, setIsCheckingTerms] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showCopyrightModal, setShowCopyrightModal] = useState(false);

  const pollerRef = useRef<number | null>(null);

  useEffect(() => {
    const accepted = sessionStorage.getItem('apexgrab_accepted_terms');
    if (accepted === 'true') {
      setHasAcceptedTerms(true);
    }
    setIsCheckingTerms(false);
  }, []);

  const handleAcceptTerms = () => {
    sessionStorage.setItem('apexgrab_accepted_terms', 'true');
    setHasAcceptedTerms(true);
  };

  const startDownload = async () => {
    if (!url.trim()) return;

    setIsDownloading(true);
    setStatus({ percent: 0, ready: false, cancelled: false });

    const data = new FormData();
    data.append("url", url);
    data.append("quality", quality);

    try {
      const res = await fetch(`${API_BASE_URL}/start`, { method: "POST", body: data });
      const json: StartResponse = await res.json();
      setJobId(json.job_id);
    } catch (error) {
      console.error("Failed to start download", error);
      setIsDownloading(false);
      setStatus(null);
    }
  };

  const cancelDownload = async () => {
    if (!jobId) return;
    try {
      await fetch(`${API_BASE_URL}/cancel/${jobId}`, { method: "POST" });
    } catch (error) {
      console.error("Failed to cancel", error);
    }
  };

  useEffect(() => {
    if (jobId) {
      pollerRef.current = window.setInterval(async () => {
        try {
          const r = await fetch(`${API_BASE_URL}/status/${jobId}`);
          const j: DownloadStatus = await r.json();
          setStatus(j);

          if (j.ready) {
            if (pollerRef.current) window.clearInterval(pollerRef.current);
            window.location.href = `${API_BASE_URL}/download/${jobId}`;
            setIsDownloading(false);
            setJobId(null);
          }

          if (j.cancelled) {
            if (pollerRef.current) window.clearInterval(pollerRef.current);
            setIsDownloading(false);
            setJobId(null);
            setStatus(null);
          }
        } catch (error) {
          console.error("Status polling failed", error);
        }
      }, 1000);
    }

    return () => {
      if (pollerRef.current) window.clearInterval(pollerRef.current);
    };
  }, [jobId]);

  if (isCheckingTerms) return null;

  return (
    <>
      {!hasAcceptedTerms && <ComplianceModal onAccept={handleAcceptTerms} />}
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
      <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
      <CopyrightModal isOpen={showCopyrightModal} onClose={() => setShowCopyrightModal(false)} />
      
      <div className={`min-h-screen flex flex-col items-center pt-20 pb-12 px-4 transition-all duration-700 ${!hasAcceptedTerms ? 'blur-md pointer-events-none' : 'blur-0'}`}>
        {/* Hero Section */}
        <header className="text-center mb-12 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-6 animate-pulse">
            <i className="fa-solid fa-bolt"></i>
            Next-Gen Downloader
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
            Apex<span className="text-cyan-400">Grab</span>
          </h1>
          <p className="text-slate-300 text-xl md:text-2xl font-semibold leading-relaxed">
            Download your favorite YouTube videos in up to 4K quality. 
            Fast, secure, and completely free.
          </p>
        </header>

        {/* Main Action Component */}
        <main className="w-full max-w-2xl">
          <DownloadCard
            url={url}
            setUrl={setUrl}
            quality={quality}
            setQuality={setQuality}
            status={status}
            isDownloading={isDownloading}
            onStart={startDownload}
            onCancel={cancelDownload}
          />
        </main>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl w-full">
          <div className="glass-card p-6 rounded-2xl">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 mb-4">
              <i className="fa-solid fa-cloud-arrow-down text-xl"></i>
            </div>
            <h3 className="text-lg font-bold mb-2">Fast Downloads</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Optimized servers ensure your downloads complete in record time.</p>
          </div>
          <div className="glass-card p-6 rounded-2xl">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-4">
              <i className="fa-solid fa-display text-xl"></i>
            </div>
            <h3 className="text-lg font-bold mb-2">4K Support</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Crystal clear quality. Select between 480p up to stunning 4K resolutions.</p>
          </div>
          <div className="glass-card p-6 rounded-2xl">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
              <i className="fa-solid fa-shield-halved text-xl"></i>
            </div>
            <h3 className="text-lg font-bold mb-2">Safe & Private</h3>
            <p className="text-slate-400 text-sm leading-relaxed">No tracking, no storage. Your download history is yours and yours alone.</p>
          </div>
        </section>

        <footer className="mt-auto pt-24 text-slate-500 text-sm flex flex-col items-center gap-6 w-full">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <button 
              onClick={() => setShowPrivacyModal(true)}
              className="hover:text-cyan-400 transition-colors"
            >
              Privacy
            </button>
            <button 
              onClick={() => setShowTermsModal(true)}
              className="hover:text-cyan-400 transition-colors"
            >
              Terms
            </button>
            <button className="hover:text-cyan-400 transition-colors">Contact</button>
            <button 
              onClick={() => setShowCopyrightModal(true)}
              className="hover:text-cyan-400 transition-colors"
            >
              Copyright Claims
            </button>
          </div>
          <div className="flex flex-col items-center gap-4 text-center px-4">
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
              <span className="opacity-50">© 2025 ApexGrab Labs</span>
              <div className="hidden md:block h-4 w-[1px] bg-slate-800"></div>
            </div>
            <p className="text-lg md:text-xl font-bold tracking-tight text-slate-300">
              Education Project, respect YouTube policies
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default App;