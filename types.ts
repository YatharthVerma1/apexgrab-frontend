
export interface DownloadStatus {
  percent: number;
  ready: boolean;
  cancelled: boolean;
}

export type VideoQuality = '480p' | '720p' | '1080p' | '4k';
export type AudioQuality = '128kbps' | '256kbps' | '320kbps';
export type ToolType = 
  | 'yt-video' 
  | 'yt-audio' 
  | 'yt-transcript' 
  | 'yt-summary' 
  | 'ig-downloader' 
  | 'fb-downloader' 
  | 'tt-downloader';

export interface ToolConfig {
  id: ToolType;
  title: string;
  description: string;
  icon: string;
  brandColor: string;
  placeholder: string;
  qualities?: string[];
  formats?: string[];
}

export interface StartResponse {
  job_id: string;
}
