import { NarrationScene } from "./types.js";

// v2 (/v2/video/generate) is legacy and sunsets 2026-10-31 per HeyGen's own
// API response — this pipeline targets the current /v3/videos endpoint.
const HEYGEN_API_BASE = "https://api.heygen.com";

type HeygenStudioScene = {
  type: "avatar_video";
  input: { type: "avatar"; avatar_id: string; script: string; voice_id: string };
};

/**
 * Builds the HeyGen v3 "studio" request body. `scenes` array order is what
 * HeyGen concatenates — narration scenes are sorted by `scene` number before
 * being placed into the array, so the reviewed script's order is exactly
 * what gets rendered.
 */
export function buildHeygenRequestBody(narrationScenes: NarrationScene[], avatarId: string, voiceId: string) {
  const ordered = [...narrationScenes].sort((a, b) => a.scene - b.scene);
  const scenes: HeygenStudioScene[] = ordered.map((s) => ({
    type: "avatar_video",
    input: { type: "avatar", avatar_id: avatarId, script: s.narration, voice_id: voiceId },
  }));
  return { type: "studio", scenes, aspect_ratio: "16:9", resolution: "1080p" };
}

async function pollUntilComplete(videoId: string, apiKey: string, timeoutMs = 5 * 60 * 1000): Promise<string> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const res = await fetch(`${HEYGEN_API_BASE}/v3/videos/${videoId}`, {
      headers: { "X-Api-Key": apiKey },
    });
    const json = await res.json();
    const status = json.data?.status;
    if (status === "completed") return json.data.video_url as string;
    if (status === "failed") throw new Error(`HeyGen render failed: ${json.data?.failure_reason ?? JSON.stringify(json.data)}`);
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error("HeyGen render timed out");
}

/**
 * Real call: submits the ordered scenes, polls, returns the single
 * concatenated narration video URL. Requires HEYGEN_API_KEY, HEYGEN_AVATAR_ID
 * and HEYGEN_VOICE_ID.
 */
export async function renderNarrationWithHeygen(narrationScenes: NarrationScene[]): Promise<string> {
  const apiKey = process.env.HEYGEN_API_KEY;
  const avatarId = process.env.HEYGEN_AVATAR_ID;
  const voiceId = process.env.HEYGEN_VOICE_ID;
  if (!apiKey || !avatarId || !voiceId) {
    throw new Error("HEYGEN_API_KEY, HEYGEN_AVATAR_ID and HEYGEN_VOICE_ID must be set to call the real HeyGen API.");
  }
  const body = buildHeygenRequestBody(narrationScenes, avatarId, voiceId);
  const createRes = await fetch(`${HEYGEN_API_BASE}/v3/videos`, {
    method: "POST",
    headers: { "X-Api-Key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const createJson = await createRes.json();
  const videoId = createJson.data?.video_id;
  if (!videoId) throw new Error(`HeyGen did not return a video_id: ${JSON.stringify(createJson)}`);
  return pollUntilComplete(videoId, apiKey);
}
