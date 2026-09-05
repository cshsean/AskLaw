import "./loadEnv.js";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { ProblemRecord, NarrationScene } from "./types.js";
import { renderNarrationWithHeygen } from "./heygenClient.js";

const root = path.resolve(import.meta.dirname, "..");
const assetsDir = path.join(root, "assets");
mkdirSync(assetsDir, { recursive: true });

/**
 * Auto-generate a placeholder clip for any PLACEHOLDER_*.mp4 the (possibly
 * LLM-generated) script references but doesn't have a real file for yet.
 * The script names this asset from the problem's slug (see
 * scriptGenerator.ts's system prompt), so a single fixed pre-made file can't
 * cover every slug — generate on demand instead.
 */
function ensurePlaceholderClip(assetPath: string, seconds = 8) {
  if (existsSync(assetPath)) return;
  console.log(`Screen recording asset missing — generating placeholder: ${path.basename(assetPath)}`);
  execFileSync("ffmpeg", [
    "-y",
    "-f", "lavfi",
    "-i", `color=c=0x1f4e8c:s=1920x1080:d=${seconds}`,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    assetPath,
  ]);
}

function ffprobeDuration(filePath: string): number {
  const out = execFileSync("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    filePath,
  ]).toString().trim();
  return parseFloat(out);
}

async function downloadFile(url: string, destPath: string) {
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(destPath, buf);
}

async function main() {
  const dataPath = path.join(root, "data", "billings-invoices.json");
  const record: ProblemRecord = JSON.parse(readFileSync(dataPath, "utf-8"));

  const narrationScenes = record.videoScript.filter(
    (s): s is NarrationScene => s.type === "narration"
  ).sort((a, b) => a.scene - b.scene);

  const screenRecordingScene = record.videoScript.find((s) => s.type === "screen_recording");

  const useMock = !process.env.HEYGEN_API_KEY || !process.env.HEYGEN_AVATAR_ID || !process.env.HEYGEN_VOICE_ID;
  const narrationLocalPath = path.join(assetsDir, "heygen-narration.mp4");

  if (useMock) {
    console.log("HEYGEN_API_KEY / HEYGEN_AVATAR_ID not set — using mock narration asset.");
    const mockPath = path.join(assetsDir, "mock-heygen-narration.mp4");
    if (!existsSync(mockPath)) {
      throw new Error("Mock asset missing. Run `npm run make-placeholders` first.");
    }
    execFileSync("node", ["-e", `require('fs').copyFileSync(${JSON.stringify(mockPath)}, ${JSON.stringify(narrationLocalPath)})`]);
  } else {
    console.log("Calling real HeyGen API with", narrationScenes.length, "ordered narration scenes...");
    const remoteUrl = await renderNarrationWithHeygen(narrationScenes);
    await downloadFile(remoteUrl, narrationLocalPath);
  }

  const totalDuration = ffprobeDuration(narrationLocalPath);

  // Split the single concatenated narration video back into per-scene
  // timing, proportional to each scene's word count (HeyGen doesn't expose
  // per-scene timestamps on this endpoint, so this is an estimate — see
  // docs/video-pipeline-plan.md §3 for the acknowledged limitation).
  const wordCounts = narrationScenes.map((s) => s.narration.split(/\s+/).length);
  const totalWords = wordCounts.reduce((a, b) => a + b, 0);
  let cursor = 0;
  const narrationTiming = narrationScenes.map((s, i) => {
    const duration = (wordCounts[i] / totalWords) * totalDuration;
    const timing = { scene: s.scene, startSec: cursor, durationSec: duration };
    cursor += duration;
    return timing;
  });

  let screenRecording = null;
  if (screenRecordingScene && screenRecordingScene.type === "screen_recording") {
    const assetPath = path.join(assetsDir, screenRecordingScene.assetRef);
    if (!existsSync(assetPath)) {
      if (screenRecordingScene.assetRef.startsWith("PLACEHOLDER_")) {
        ensurePlaceholderClip(assetPath);
      } else {
        throw new Error(`Screen recording asset not found: ${assetPath}. Upload the real capture via the admin page, or via assets/.`);
      }
    }
    screenRecording = {
      scene: screenRecordingScene.scene,
      assetRef: screenRecordingScene.assetRef,
      durationSec: ffprobeDuration(assetPath),
      narration: screenRecordingScene.narration,
      isPlaceholder: screenRecordingScene.assetRef.startsWith("PLACEHOLDER_"),
    };
  }

  const generated = {
    slug: record.slug,
    generatedAt: new Date().toISOString(),
    usedMock: useMock,
    narrationVideoFile: "heygen-narration.mp4",
    narrationTiming,
    screenRecording,
  };

  writeFileSync(
    path.join(root, "data", "billings-invoices.generated.json"),
    JSON.stringify(generated, null, 2)
  );
  console.log("Wrote data/billings-invoices.generated.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
