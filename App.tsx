
import React, { useState, useEffect, useRef } from 'react';
import { DownloadCard } from './components/DownloadCard';
import { VideoQuality, DownloadStatus, StartResponse, ToolType, ToolConfig } from './types';

// For production: set VITE_API_URL in Vercel to your Railway backend URL (e.g. https://yourapp.up.railway.app)
const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

const TOOLS: ToolConfig[] = [
  {
    id: 'yt-video',
    title: 'YouTube Video',
    description: 'Ultra HD 4K video downloader',
    icon: 'fa-brands fa-youtube',
    brandColor: '#FF0000',
    placeholder: 'Paste YouTube video or playlist URL...',
    qualities: ['480P', '720P', '1080P', '4K']
  },
  {
    id: 'yt-audio',
    title: 'YouTube Audio',
    description: 'High quality MP3/WAV and many formats audio downloader',
    icon: 'fa-solid fa-music',
    brandColor: '#FF4D4D',
    placeholder: 'Paste YouTube URL for audio extraction...',
    qualities: ['Best:320kbps', 'High:192kbps', 'Mid:128kbps', 'Low:64kbps'],
    formats: ['MP3', 'WAV', 'FLAC', 'M4A', 'OPUS']
  },
  {
    id: 'ig-downloader',
    title: 'Instagram Downloader',
    description: 'Save Reels, Stories and Audio of them',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
    brandColor: '#E1306C',
    placeholder: 'Paste Instagram link here...',
    qualities: ['Video', 'Audio']
  },
  {
    id: 'fb-downloader',
    title: 'Facebook Downloader',
    description: 'Ultra HD 4k Facebook video and audio saver',
    icon: 'fa-brands fa-facebook',
    brandColor: '#1877F2',
    placeholder: 'Paste Facebook video link...',
    qualities: ['Video', 'Audio']
  },
  {
    id: 'yt-transcript',
    title: 'YouTube Transcript',
    description: 'Extract subtitles and captions',
    icon: 'fa-solid fa-file-lines',
    brandColor: '#FF8000',
    placeholder: 'Paste YouTube URL to get transcript...',
    qualities: ['TXT', 'PDF']
  },
  {
    id: 'yt-summary',
    title: 'YouTube Summarizer',
    description: 'AI-powered video summarization',
    icon: 'fa-solid fa-wand-magic-sparkles',
    brandColor: '#FFCC00',
    placeholder: 'Paste YouTube URL for AI summary...',
    // Qualities removed as per request
  },
  {
    id: 'tt-downloader',
    title: 'TikTok Downloader',
    description: 'Download without watermarks',
    icon: 'fa-brands fa-tiktok',
    brandColor: '#000000',
    placeholder: 'Paste TikTok video link...',
    qualities: ['Best', '480P', '720P', '1080P', '4K']
  }
];

const ThemeToggle: React.FC<{ isDark: boolean; onToggle: () => void }> = ({ isDark, onToggle }) => (
  <button
    onClick={onToggle}
    className="fixed top-6 right-6 z-[120] w-12 h-12 rounded-2xl glass-card flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-all shadow-xl"
    aria-label="Toggle Theme"
  >
    <i className={`fa-solid ${isDark ? 'fa-sun text-yellow-400' : 'fa-moon text-indigo-600'}`}></i>
  </button>
);

const FeatureCard: React.FC<{ icon: string, title: string, description: string, color: string }> = ({ icon, title, description, color }) => (
  <div className="glass-card p-8 rounded-[2.5rem] flex flex-col items-start gap-6 group hover:border-white/20 transition-all duration-500">
    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner bg-slate-900/20 dark:bg-slate-900/50 group-hover:scale-110 transition-transform" style={{ color: color }}>
      <i className={icon}></i>
    </div>
    <div className="space-y-3">
      <h3 className="text-2xl font-extrabold tracking-tight opacity-90">{title}</h3>
      <p className="opacity-60 leading-relaxed font-medium">{description}</p>
    </div>
  </div>
);

const PrivacyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="glass-card relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-[2rem] p-8 md:p-10 animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 opacity-40 hover:opacity-100 transition-opacity">
          <i className="fa-solid fa-xmark text-2xl opacity-70"></i>
        </button>
        <h2 className="text-2xl font-extrabold modal-accent-text mb-6 border-b theme-border pb-4">Privacy Policy</h2>
        <div className="space-y-6 opacity-100 text-sm md:text-base leading-relaxed">
          <p>Welcome to ApexGrab. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our service.</p>

          <section>
            <h3 className="font-bold mb-2">1. Information We Collect</h3>
            <div className="space-y-2 ml-4">
              <p><strong>1.1 Information You Provide:</strong> Video URLs you submit for downloading and contact information if you reach out to us.</p>
              <p><strong>1.2 Automatically Collected Information:</strong> IP address (anonymized for analytics), Browser type and version, Device type (mobile/desktop), Pages visited and time spent, Referring website.</p>
            </div>
          </section>

          <section>
            <h3 className="font-bold mb-2">2. How We Use Your Information</h3>
            <p>We use collected information to: Process your download requests, Improve our services and user experience, Analyze usage patterns and website performance, Respond to your inquiries, and Comply with legal obligations.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">3. Information We DO NOT Collect</h3>
            <p>We want to be clear about what we DO NOT do:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>We DO NOT store the videos you download</li>
              <li>We DO NOT create user accounts or profiles</li>
              <li>We DO NOT sell your personal information to third parties</li>
              <li>We DO NOT track your download history</li>
              <li>We DO NOT require registration to use our service</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold mb-2">4. Data Retention</h3>
            <p>Download requests are processed in real-time and not stored. Server logs are automatically deleted after 30 days. Analytics data is anonymized and aggregated.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">5. Third-Party Services</h3>
            <p>Our website may use third-party services like Google Analytics, Google AdSense, and Cloudflare. These services have their own privacy policies, and we encourage you to review them.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">6. Advertisements</h3>
            <p>We display advertisements through Google AdSense to support our free service. These ads may use cookies to show relevant content. You can opt out of personalized advertising by visiting Google's Ads Settings.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">7. Data Security</h3>
            <p>We implement appropriate security measures: HTTPS encryption for all connections, regular security updates, and no storage of sensitive personal data.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">8. Children's Privacy</h3>
            <p>Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">9. Your Rights</h3>
            <p>You have the right to access your personal data, request deletion of your data, opt out of analytics tracking, and disable cookies in your browser.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">10. Changes to This Policy</h3>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated date.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">11. Contact Us</h3>
            <p>If you have questions about this Privacy Policy, please contact us at: support@apexgrab.com</p>
          </section>
        </div>
        <div className="mt-8 pt-6 border-t theme-border">
          <button onClick={onClose} className="w-full py-3 rounded-xl bg-slate-500/10 border theme-border font-bold hover:bg-slate-500/20 transition-all">Close</button>
        </div>
      </div>
    </div>
  );
};

const CopyrightModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="glass-card relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-[2rem] p-8 md:p-10 animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 opacity-40 hover:opacity-100 transition-opacity">
          <i className="fa-solid fa-xmark text-2xl opacity-70"></i>
        </button>
        <h2 className="text-2xl font-extrabold modal-accent-text mb-6 border-b theme-border pb-4">COPYRIGHT CLAIMS</h2>
        <div className="space-y-6 opacity-100 text-sm md:text-base leading-relaxed">
          <p>ApexGrab respects the intellectual property rights of others and expects users of our Service to do the same.</p>

          <section>
            <h3 className="font-bold mb-2">1. Our Position on Copyright</h3>
            <p>ApexGrab is a tool that processes publicly available URLs. We:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>DO NOT host, store, or distribute any copyrighted content</li>
              <li>DO NOT upload or share any videos or audio files</li>
              <li>Act only as a technical intermediary</li>
              <li>Encourage users to respect copyright laws</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold mb-2">2. User Responsibility</h3>
            <p>Users are solely responsible for ensuring they have the legal right to download any content. Our Service should only be used for content you own, have permission for, or content in the public domain/Creative Commons.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">3. DMCA Compliance</h3>
            <p>We comply with the Digital Millennium Copyright Act (DMCA) and similar international copyright laws.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">4. Filing a Copyright Complaint</h3>
            <p>If you believe your copyrighted work has been infringed, please send a written notice containing:</p>
            <ol className="list-decimal pl-5 mt-2 space-y-3">
              <li><strong>Contact Information:</strong> Full legal name, mailing address, phone number, and email.</li>
              <li><strong>Identification of Work:</strong> Description of the copyrighted work and URL/location of original.</li>
              <li><strong>Identification of Infringing Material:</strong> Specific URL(s) on our website related to the complaint.</li>
              <li><strong>Statements:</strong> Good faith belief statement and accuracy statement under penalty of perjury.</li>
              <li><strong>Signature:</strong> Physical or electronic signature of owner or authorized rep.</li>
            </ol>
            <p className="mt-4"><strong>Send DMCA Notices To:</strong> support@apexgrab.com (Subject: DMCA Copyright Complaint)</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">6. Our Response</h3>
            <p>Upon receiving a valid DMCA notice, we will review the complaint within 120 hours, take appropriate action, and notify relevant parties as required by law.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">7. Counter-Notification</h3>
            <p>If you believe content was wrongly removed, you may submit a counter-notification with contact info, identification of removed material, and a good faith belief statement under penalty of perjury.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">8. Repeat Infringers</h3>
            <p>We reserve the right to terminate access to users who repeatedly infringe copyrights.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">9. Disclaimer</h3>
            <p>This page is for informational purposes only and does not constitute legal advice. For legal concerns, consult a qualified attorney.</p>
          </section>
        </div>
        <div className="mt-8 pt-6 border-t theme-border">
          <button onClick={onClose} className="w-full py-3 rounded-xl bg-slate-500/10 border theme-border font-bold hover:bg-slate-500/20 transition-all">Close</button>
        </div>
      </div>
    </div>
  );
};

const TermsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="glass-card relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-[2rem] p-8 md:p-10 animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 opacity-40 hover:opacity-100 transition-opacity">
          <i className="fa-solid fa-xmark text-2xl opacity-70"></i>
        </button>
        <h2 className="text-2xl font-extrabold modal-accent-text mb-6 border-b theme-border pb-4">TERMS OF SERVICE</h2>
        <div className="space-y-6 opacity-100 text-sm md:text-base leading-relaxed">
          <p>Please read these Terms of Service ("Terms") carefully before using ApexGrab ("Service").</p>

          <section>
            <h3 className="font-bold mb-2">1. Acceptance of Terms</h3>
            <p>By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">2. Description of Service</h3>
            <p>ApexGrab provides a free online tool that allows users to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Download videos for personal, offline viewing</li>
              <li>Download audio from videos for personal use</li>
              <li>Download video transcripts and summaries</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold mb-2">3. Permitted Use</h3>
            <p>You may use our Service ONLY for:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Downloading content you own or have rights to</li>
              <li>Downloading content that is freely available for download</li>
              <li>Personal, non-commercial use</li>
              <li>Educational purposes</li>
              <li>Creating backups of your own content</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold mb-2">4. Prohibited Use</h3>
            <p>You agree NOT to use our Service to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Download copyrighted content without permission</li>
              <li>Distribute, sell, or commercially exploit downloaded content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon intellectual property rights of others</li>
              <li>Download content for any illegal purpose</li>
              <li>Overload our servers with automated requests</li>
              <li>Attempt to bypass any security measures</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold mb-2">5. User Responsibility</h3>
            <p>YOU ARE SOLELY RESPONSIBLE FOR:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Ensuring you have the right to download any content</li>
              <li>Complying with the terms of service of the source platforms</li>
              <li>Any consequences resulting from your use of downloaded content</li>
              <li>Verifying the legality of downloads in your jurisdiction</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold mb-2">6. Intellectual Property</h3>
            <div className="space-y-2 ml-4">
              <p><strong>6.1 Our Content:</strong> The Service, including its design, logos, and original content, is owned by ApexGrab and protected by intellectual property laws.</p>
              <p><strong>6.2 Third-Party Content:</strong> We do not claim ownership of any videos, audio, or content downloaded through our Service. All content belongs to their respective owners.</p>
            </div>
          </section>

          <section>
            <h3 className="font-bold mb-2">7. Disclaimer of Warranties</h3>
            <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO: Merchantability, Fitness for a particular purpose, Non-infringement, Accuracy or reliability of content.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">8. Limitation of Liability</h3>
            <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW: We are not liable for any indirect, incidental, special, or consequential damages. We are not responsible for the content of downloaded materials. We are not liable for any loss of data or service interruptions.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">9. Indemnification</h3>
            <p>You agree to indemnify and hold harmless ApexGrab, its owners, employees, and affiliates from any claims, damages, or expenses arising from your use of the Service, your violation of these Terms, or your violation of any third-party rights.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">10. Service Modifications</h3>
            <p>We reserve the right to: Modify or discontinue the Service at any time, change these Terms at any time, limit access to certain features, or remove any content or functionality.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">11. Termination</h3>
            <p>We may terminate or suspend your access to the Service immediately, without prior notice, for any reason, including breach of these Terms.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">12. Governing Law</h3>
            <p>THE LAWS OF INDIA SHALL GOVERN THESE TERMS.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">13. Severability</h3>
            <p>If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">14. Contact Us</h3>
            <p>For questions about these Terms, please contact us at: support@apexgrab.com</p>
          </section>
        </div>
        <div className="mt-8 pt-6 border-t theme-border">
          <button onClick={onClose} className="w-full py-3 rounded-xl bg-slate-500/10 border theme-border font-bold hover:bg-slate-500/20 transition-all">Close</button>
        </div>
      </div>
    </div>
  );
};

const DisclaimerModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="glass-card relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-[2rem] p-8 md:p-10 animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 opacity-40 hover:opacity-100 transition-opacity">
          <i className="fa-solid fa-xmark text-2xl opacity-70"></i>
        </button>
        <h2 className="text-2xl font-extrabold modal-accent-text mb-6 border-b theme-border pb-4">DISCLAIMER</h2>
        <div className="space-y-6 opacity-100 text-sm md:text-base leading-relaxed">
          <section>
            <p>ApexGrab is an educational tool designed for media extraction research. We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with YouTube, Instagram, Facebook, TikTok, or any of their subsidiaries or affiliates.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">Use at Own Risk</h3>
            <p>Users are solely responsible for their actions while using this platform. We do not host or store any media content on our servers. All processing is transient and intended for personal educational use only.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">Intellectual Property</h3>
            <p>All product and company names are trademarks™ or registered® trademarks of their respective holders. Use of them does not imply any affiliation with or endorsement by them.</p>
          </section>

          <p className="mt-4 pt-4 border-t theme-border font-medium">ApexGrab provides a free service for downloading online content. By using this service, you acknowledge and agree to the following:</p>

          <section>
            <h3 className="font-bold mb-2">1. No Affiliation</h3>
            <p>We are NOT affiliated with, endorsed by, or connected to YouTube, Instagram, Facebook, TikTok, or any other platform. All trademarks and brand names belong to their respective owners.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">2. Educational & Personal Use</h3>
            <p>This tool is intended for educational purposes, personal non-commercial use, and downloading content you have rights to or backing up your own content.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">3. Legal Compliance</h3>
            <p>Users must comply with copyright laws in their jurisdiction, terms of service of source platforms, and all applicable local and international laws.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">4. No Liability</h3>
            <p>We are not liable for how users choose to use downloaded content, any copyright infringement by users, or any legal consequences resulting from misuse.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">5. Service Availability</h3>
            <p>We do not guarantee uninterrupted service availability, compatibility with all videos, or specific download quality/formats.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">6. Fair Use Notice</h3>
            <p>Some content may be downloaded under "Fair Use" provisions for purposes such as criticism, commentary, news reporting, teaching, research, and scholarship. Fair use is determined on a case-by-case basis. When in doubt, seek permission from the content owner.</p>
          </section>
        </div>
        <div className="mt-8 pt-6 border-t theme-border">
          <button onClick={onClose} className="w-full py-3 rounded-xl bg-slate-500/10 border theme-border font-bold hover:bg-slate-500/20 transition-all">Close</button>
        </div>
      </div>
    </div>
  );
};

const ServiceCard: React.FC<{ tool: ToolConfig; onClick: () => void }> = ({ tool, onClick }) => (
  <button
    onClick={onClick}
    className="glass-card p-6 rounded-[2rem] text-left group hover:scale-[1.03] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-white/5 hover:border-white/20"
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg transition-transform group-hover:scale-110 overflow-hidden" style={{ backgroundColor: tool.brandColor }}>
        {tool.icon.startsWith('http') ? (
          <img src={tool.icon} alt={tool.title} className="w-full h-full object-cover p-2" />
        ) : (
          <i className={tool.icon}></i>
        )}
      </div>
      <h3 className="text-xl font-extrabold group-hover:modal-accent-text transition-colors">{tool.title}</h3>
    </div>
    <p className="opacity-70 text-sm font-medium leading-relaxed">{tool.description}</p>
    <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">
      <span>Get Started</span>
      <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
    </div>
  </button>
);

const ComplianceModal: React.FC<{ onAccept: () => void }> = ({ onAccept }) => {
  const [showRejection, setShowRejection] = useState(false);

  if (showRejection) {
    return (
      <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="glass-card relative w-full max-w-lg rounded-[2.5rem] p-8 md:p-12 text-center animate-in zoom-in-95 duration-300 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-400 mx-auto mb-8">
            <i className="fa-solid fa-circle-exclamation text-4xl"></i>
          </div>
          <h2 className="text-3xl font-extrabold mb-4 tracking-tight">Access Restricted</h2>
          <p className="opacity-80 text-lg leading-relaxed mb-10">
            Click on <span className="modal-accent-text font-bold">Yes</span> to enter website.
          </p>
          <button
            onClick={() => setShowRejection(false)}
            className="w-full py-4 rounded-2xl bg-slate-500/10 border theme-border font-bold text-lg hover:bg-slate-500/20 transition-all active:scale-95"
          >
            Return to Guidelines
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      <div className="glass-card relative w-full max-w-lg rounded-[2.5rem] p-8 md:p-12 text-center animate-in zoom-in-95 duration-300 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center text-cyan-400 mx-auto mb-8">
          <i className="fa-solid fa-scale-balanced text-4xl"></i>
        </div>
        <h2 className="text-3xl font-extrabold mb-4 tracking-tight">Community Guidelines</h2>
        <p className="opacity-80 text-lg leading-relaxed mb-10">
          This is an <span className="modal-accent-text font-bold">Education Project</span>.
          By using this tool, you acknowledge that you <span className="modal-accent-text font-bold underline decoration-current underline-offset-4">respect Social Media policies</span> and will only use it for legitimate purpose and will not share any of the files.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onAccept}
            className="flex-1 py-4 rounded-2xl bg-cyan-500 text-black font-extrabold text-lg transition-all hover:scale-105 active:scale-95"
          >
            Yes, I respect
          </button>
          <button
            onClick={() => setShowRejection(true)}
            className="flex-1 py-4 rounded-2xl border theme-border opacity-70 font-bold text-lg hover:bg-slate-500/5 transition-all"
          >
            No, I don't
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolConfig | null>(null);
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState<string>('');
  const [subQuality, setSubQuality] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [timestamps, setTimestamps] = useState<string>('');
  const [format, setFormat] = useState<string>('');
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<DownloadStatus | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingToolId, setDownloadingToolId] = useState<string | null>(null);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(false);
  const [isCheckingTerms, setIsCheckingTerms] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Modal States
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showCopyright, setShowCopyright] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const pollerRef = useRef<number | null>(null);
  const mockIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const accepted = sessionStorage.getItem('apexgrab_accepted_terms');
    if (accepted === 'true') {
      setHasAcceptedTerms(true);
    }
    setIsCheckingTerms(false);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('light-mode');
  };

  const handleAcceptTerms = () => {
    sessionStorage.setItem('apexgrab_accepted_terms', 'true');
    setHasAcceptedTerms(true);
  };

  const selectTool = (tool: ToolConfig) => {
    setActiveTool(tool);

    // Set default quality logic
    let defaultQuality = tool.qualities ? tool.qualities[0] : '';
    let defaultSubQuality = '';
    let defaultLanguage = '';
    let defaultTimestamps = '';

    if (tool.id === 'yt-video' && tool.qualities?.includes('1080P')) {
      defaultQuality = '1080P';
    } else if (tool.id === 'yt-audio' && tool.qualities?.includes('Best:320kbps')) {
      defaultQuality = 'Best:320kbps';
    } else if (tool.id === 'ig-downloader' || tool.id === 'fb-downloader') {
      defaultQuality = 'Video';
      defaultSubQuality = '1080P';
    } else if (tool.id === 'yt-transcript' || tool.id === 'yt-summary') {
      defaultLanguage = 'English:en';
      if (tool.id === 'yt-transcript') defaultTimestamps = 'False';
    } else if (tool.id === 'tt-downloader') {
      defaultQuality = 'Best';
    }

    setQuality(defaultQuality);
    setSubQuality(defaultSubQuality);
    setLanguage(defaultLanguage);
    setTimestamps(defaultTimestamps);
    setFormat(tool.formats ? tool.formats[0] : '');
    setUrl('');
    if (downloadingToolId !== tool.id) {
      setStatus(null);
    }
  };

  const startDownload = async () => {
    if (!url.trim() || !activeTool) return;
    setIsDownloading(true);
    setDownloadingToolId(activeTool.id);
    setStatus({ percent: 0, ready: false, cancelled: false });

    const data = new FormData();
    data.append("url", url);
    data.append("quality", quality);
    if (subQuality) data.append("subQuality", subQuality);
    if (language) data.append("language", language);
    if (timestamps) data.append("timestamps", timestamps);
    if (format) data.append("format", format);
    // Fix: Using activeTool.id instead of undefined 'tool' variable
    data.append("tool", activeTool.id);

    try {
      const res = await fetch(`${API_BASE}/start`, { method: "POST", body: data });
      const json: StartResponse = await res.json();
      setJobId(json.job_id);
    } catch (error) {
      console.error("Failed to start process", error);
      let p = 0;
      mockIntervalRef.current = window.setInterval(() => {
        p += 5;
        setStatus({ percent: p, ready: p >= 100, cancelled: false });
        if (p >= 100) {
          if (mockIntervalRef.current) window.clearInterval(mockIntervalRef.current);
          setIsDownloading(false);
          setDownloadingToolId(null);
        }
      }, 300);
    }
  };

  const cancelDownload = async () => {
    if (jobId) {
      try {
        await fetch(`${API_BASE}/cancel/${jobId}`, { method: "POST" });
      } catch (error) {
        console.error("Failed to cancel", error);
      }
    }

    if (pollerRef.current) window.clearInterval(pollerRef.current);
    if (mockIntervalRef.current) window.clearInterval(mockIntervalRef.current);

    setIsDownloading(false);
    setDownloadingToolId(null);
    setStatus(null);
    setJobId(null);
  };

  useEffect(() => {
    if (jobId) {
      pollerRef.current = window.setInterval(async () => {
        try {
          const r = await fetch(`${API_BASE}/status/${jobId}`);
          const j: DownloadStatus = await r.json();
          setStatus(j);
          if (j.ready) {
            if (pollerRef.current) window.clearInterval(pollerRef.current);
            // Use anchor tag for reliable cross-origin file download
            const link = document.createElement('a');
            link.href = `${API_BASE}/download/${jobId}`;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setIsDownloading(false);
            setDownloadingToolId(null);
            setJobId(null);
          }
          if (j.cancelled) {
            if (pollerRef.current) window.clearInterval(pollerRef.current);
            setIsDownloading(false);
            setDownloadingToolId(null);
            setJobId(null);
            setStatus(null);
          }
        } catch (error) { }
      }, 1000);
    }
    return () => {
      if (pollerRef.current) window.clearInterval(pollerRef.current);
      if (mockIntervalRef.current) window.clearInterval(mockIntervalRef.current);
    };
  }, [jobId]);

  if (isCheckingTerms) return null;

  return (
    <>
      {!hasAcceptedTerms && <ComplianceModal onAccept={handleAcceptTerms} />}

      <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />

      {/* Modals */}
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <CopyrightModal isOpen={showCopyright} onClose={() => setShowCopyright(false)} />
      <DisclaimerModal isOpen={showDisclaimer} onClose={() => setShowDisclaimer(false)} />

      <div className={`min-h-screen flex flex-col items-center pt-12 pb-12 px-4 transition-all duration-700 ${!hasAcceptedTerms ? 'blur-sm pointer-events-none' : 'blur-0'}`}>

        {/* Navigation / Header */}
        <header className="w-full max-w-7xl flex flex-col items-center mb-16 text-center">
          <div className="flex items-center gap-4 mb-10 cursor-pointer group" onClick={() => setActiveTool(null)}>
            <div className="w-12 h-12 bg-cyan-500 rounded-[1.25rem] flex items-center justify-center text-black shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-transform group-hover:scale-110">
              <i className="fa-solid fa-bolt text-xl"></i>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">
              Apex<span className="modal-accent-text">Grab</span>
            </h1>
          </div>

          {!activeTool ? (
            <div className="animate-in fade-in slide-in-from-top-4 duration-700">
              <h2 className="text-3xl md:text-5xl font-semibold mb-6 tracking-tight opacity-90 leading-tight">
                The most advanced all-in-one <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 font-black italic text-4xl md:text-6xl drop-shadow-[0_0_20_rgba(6,182,212,0.6)] px-2">4k</span> media extraction platform.
              </h2>
              <p className="opacity-60 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                Fast, secure, and built for professionals.
              </p>
            </div>
          ) : null}
        </header>

        {/* Main Content Area */}
        <main className="w-full max-w-7xl">
          {!activeTool ? (
            <div className="space-y-24">
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500 delay-200">
                {TOOLS.map((tool) => (
                  <ServiceCard key={tool.id} tool={tool} onClick={() => selectTool(tool)} />
                ))}
              </section>

              {/* Features Section */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 animate-in fade-in duration-700 delay-400">
                <FeatureCard
                  icon="fa-solid fa-cloud-arrow-down"
                  title="Fast Downloads"
                  description="Optimized servers ensure your downloads complete in record time."
                  color="#22d3ee"
                />
                <FeatureCard
                  icon="fa-solid fa-display"
                  title="4K Support"
                  description="Crystal clear quality. Select between 480p up to stunning 4K resolutions."
                  color="#a855f7"
                />
                <FeatureCard
                  icon="fa-solid fa-shield-halved"
                  title="Safe & Private"
                  description="No tracking, no storage. Your download history is yours and yours alone."
                  color="#10b981"
                />
              </section>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <DownloadCard
                tool={activeTool}
                url={url}
                setUrl={setUrl}
                quality={quality}
                setQuality={setQuality}
                subQuality={subQuality}
                setSubQuality={setSubQuality}
                language={language}
                setLanguage={setLanguage}
                timestamps={timestamps}
                setTimestamps={setTimestamps}
                format={format}
                setFormat={setFormat}
                status={status}
                isDownloading={isDownloading && downloadingToolId === activeTool.id}
                onStart={startDownload}
                onCancel={cancelDownload}
                onBack={() => setActiveTool(null)}
              />
            </div>
          )}
        </main>

        {/* SEO Content Section - Exactly 20 lines, fixed visibility for light mode, no highlight on the word 'free' in body text */}
        {!activeTool && (
          <div className="w-full max-w-7xl mt-32 px-4 animate-in fade-in duration-1000 delay-500">
            <div className="glass-card rounded-[3rem] p-10 md:p-20 border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <i className="fa-solid fa-bolt text-9xl"></i>
              </div>
              <h2 className="text-3xl font-extrabold mb-12 tracking-tight uppercase text-center italic">
                Download Professional Grade <span className="modal-accent-text not-italic">FREE</span> Media
              </h2>
              <div className="opacity-90 leading-relaxed text-base md:text-xl font-medium space-y-4 text-center max-w-5xl mx-auto">
                <p>ApexGrab is the definitive professional choice for users who want to safely <span className="modal-accent-text font-extrabold">download youtube video</span> content in any resolution.</p>
                <p>Our system is engineered to provide the fastest way to <span className="modal-accent-text font-extrabold">download instagram reels</span> without any registration or hidden fees.</p>
                <p>You can instantly <span className="modal-accent-text font-extrabold">download facebook video</span> posts directly to your storage with our powerful cloud extraction script.</p>
                <p>For creators, the ability to <span className="modal-accent-text font-extrabold">download tiktok without watermark</span> is essential for high-quality cross-platform content repurposing.</p>
                <p>As a versatile <span className="modal-accent-text font-extrabold">youtube mp3 converter</span>, we extract the highest quality audio tracks for your personal offline library.</p>
                <p>Every single tool on ApexGrab is designed to be completely free and accessible for everyone across all devices.</p>
                <p>Our 4K engine ensures that when you <span className="modal-accent-text font-extrabold">download youtube video</span>, you get the exact clarity and framerate of the original upload.</p>
                <p>Browsing through social media is better when you can <span className="modal-accent-text font-extrabold">download instagram reels</span> to watch later without any internet connection.</p>
                <p>Don't miss out on important clips; use our tool to <span className="modal-accent-text font-extrabold">download facebook video</span> tutorials and live streams in high definition.</p>
                <p>The cleanest way to archive your favorite trends is to <span className="modal-accent-text font-extrabold">download tiktok without watermark</span> using our reliable, private cloud server.</p>
                <p>Switch from video to audio seamlessly with our integrated <span className="modal-accent-text font-extrabold">youtube mp3 converter</span> which supports multiple bitrates up to 320kbps.</p>
                <p>We prioritize your privacy above all, ensuring that every free media fetch is private and never stored on our secure database.</p>
                <p>Experience the future of media management where you can <span className="modal-accent-text font-extrabold">download youtube video</span> playlists with just a single click URL paste.</p>
                <p>Mobile users love the speed at which they can <span className="modal-accent-text font-extrabold">download instagram reels</span> and share them instantly with their close friends and family.</p>
                <p>Our cross-platform compatibility makes it easier than ever to <span className="modal-accent-text font-extrabold">download facebook video</span> content on any modern mobile or desktop browser.</p>
                <p>Say goodbye to blurry logos; our unique algorithm lets you <span className="modal-accent-text font-extrabold">download tiktok without watermark</span> in stunning, vertical high-definition quality.</p>
                <p>Transform any educational lecture or podcast into a portable audio file using our industry-leading <span className="modal-accent-text font-extrabold">youtube mp3 converter</span> service.</p>
                <p>ApexGrab remains the top choice for media enthusiasts because our core features are always free and constantly updated.</p>
                <p>Whether you need to <span className="modal-accent-text font-extrabold">download youtube video</span> clips or archive trending social media, we provide the ultimate professional toolkit.</p>
                <p>Trust ApexGrab for your next <span className="modal-accent-text font-extrabold">download instagram reels</span> task and experience the fastest processing speeds currently available on the web.</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-auto pt-24 text-sm flex flex-col items-center gap-6 w-full">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 font-bold uppercase tracking-widest text-base">
            <button onClick={() => setShowPrivacy(true)} className="footer-link">Privacy</button>
            <button onClick={() => setShowTerms(true)} className="footer-link">Terms</button>
            <button className="footer-link">Contact</button>
            <button onClick={() => setShowCopyright(true)} className="footer-link">Copyright Claims</button>
            <button onClick={() => setShowDisclaimer(true)} className="footer-link">Disclaimer</button>
          </div>
          <div className="flex flex-col items-center gap-4 text-center px-4 opacity-60">
            <div className="flex items-center justify-center gap-2">
              <span className="opacity-50">© 2025</span>
              <span className="font-bold opacity-80">ApexGrab</span>
            </div>
            <p className="text-sm font-bold tracking-tight opacity-70">
              Education Project • <span className="modal-accent-text font-bold">Respect Social Media Policies</span>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default App;
