
export interface DownloadStatus {
  percent: number;
  ready: boolean;
  cancelled: boolean;
}

export type VideoQuality = '480p' | '720p' | '1080p' | '4k';

export interface StartResponse {
  job_id: string;
}
