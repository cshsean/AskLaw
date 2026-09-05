import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync } from "node:fs";
import path from "node:path";

const assetsDir = path.resolve(import.meta.dirname, "..", "assets");
mkdirSync(assetsDir, { recursive: true });

function makeClip(outFile: string, seconds: number, _text: string, bg: string) {
  const outPath = path.join(assetsDir, outFile);
  if (existsSync(outPath)) {
    console.log(`skip (exists): ${outFile}`);
    return;
  }
  // Plain color card — no drawtext (fontconfig isn't reliably available in
  // every ffmpeg build). Remotion overlays the caption text on top instead,
  // so the label still shows up in preview/render.
  execFileSync("ffmpeg", [
    "-y",
    "-f", "lavfi",
    "-i", `color=c=${bg}:s=1920x1080:d=${seconds}`,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    outPath,
  ]);
  console.log(`generated: ${outFile}`);
}

// Placeholder for the real screen-recording segment (§3a of the video pipeline
// plan) — swap this file for an actual capture of the featured tool.
makeClip(
  "PLACEHOLDER_billings-tool-demo.mp4",
  8,
  "SCREEN RECORDING PLACEHOLDER\\n(real capture pending)",
  "0x1f4e8c"
);

// Mock HeyGen output, used only when HEYGEN_API_KEY / HEYGEN_AVATAR_ID are not
// set, so the rest of the pipeline (timing, composition) can be exercised
// end-to-end without live credentials.
makeClip(
  "mock-heygen-narration.mp4",
  15,
  "MOCK HEYGEN NARRATION\\n(no API key configured)",
  "0x333333"
);
