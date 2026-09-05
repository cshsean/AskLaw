export type NarrationScene = {
  scene: number;
  type: "narration";
  narration: string;
  visualIntent: string;
};

export type ScreenRecordingScene = {
  scene: number;
  type: "screen_recording";
  assetRef: string;
  narration: string;
  notes?: string;
};

export type Scene = NarrationScene | ScreenRecordingScene;

export type ProblemRecord = {
  slug: string;
  title: string;
  category: string;
  overviewCopy: string;
  videoScript: Scene[];
  videoAsset: {
    url: string | null;
    captionsUrl: string | null;
    generatedAt: string | null;
    sourceCopyHash: string | null;
  };
};
