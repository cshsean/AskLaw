import "./loadEnv.js";
import { Scene } from "./types.js";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-3.6-flash";

const SYSTEM_PROMPT = `You turn a lawyer-reviewed narration script into an ordered video scene plan
for a short (30-90s) educational explainer on a legal AI-tools discovery site.

The site's audience is skeptical of AI hype (see positioning: plain language, no jargon,
lead with what a tool does, never oversell). Your output must respect that tone.

Output ONLY a JSON array (no prose, no markdown fences) of scene objects matching:

  { "scene": number, "type": "narration", "narration": string, "visualIntent": string }
  { "scene": number, "type": "screen_recording", "assetRef": string, "narration": string }

Rules:
- "narration" text for "narration" scenes must be drawn from the provided script, split into
  natural beats. You may lightly trim for pacing, but do not invent claims that aren't in the
  script or the supporting documents.
- Insert exactly one "screen_recording" scene, placed where a real product screen would
  naturally illustrate the mechanism (typically after it's introduced, before the wrap-up).
  Set its assetRef to "PLACEHOLDER_<slug>-demo.mp4" using the given slug. Its "narration" is a
  short bridging line, not restating the whole script.
- If the script or documents describe a human-review/approval step, that MUST appear as its
  own narration beat — never compress it away or drop it for pacing. This is a firm compliance
  requirement, not a style choice.
- For narration scenes, "visualIntent" is one sentence describing a generic conceptual
  diagram/animation (icons, arrows, flow) that supports the line — never a description of a
  real product's actual interface. The screen_recording scene is the only place real UI
  appears, and that comes from an uploaded recording, not from you.
- Number scenes sequentially starting at 1.
- Prefer 3-6 scenes total.`;

function extractJsonArray(text: string): Scene[] {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`Gemini's response did not contain a JSON array:\n${text}`);
  return JSON.parse(match[0]);
}

export async function generateVideoScriptWithGemini(input: {
  slug: string;
  title: string;
  scriptText: string;
  documents: { name: string; text: string }[];
  directions: string;
}): Promise<Scene[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not set.");
  }
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  const documentsBlock = input.documents.length
    ? input.documents.map((d) => `--- ${d.name} ---\n${d.text}`).join("\n\n")
    : "(none provided)";

  const userPrompt = `Problem: ${input.title} (slug: ${input.slug})

Script — what should be said (this is content, not a shot list; you decide scene structure):
"""
${input.scriptText}
"""

Supporting documents (background/context, not narration text to read verbatim):
${documentsBlock}

Directions from the reviewer:
${input.directions.trim() || "(none)"}

Generate the scene JSON now.`;

  const res = await fetch(`${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: { temperature: 0.4 },
    }),
  });

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error(`Gemini did not return usable content: ${JSON.stringify(json)}`);
  return extractJsonArray(text);
}

/**
 * Used only when GEMINI_API_KEY isn't set, so the admin flow still works
 * end-to-end without live credentials. This is intentionally dumb — it just
 * splits paragraphs into scenes and inserts one screen-recording slot — and
 * every scene's visualIntent says so, so nobody mistakes it for the real
 * script-generation step.
 */
export function naiveFallbackScript(scriptText: string, slug: string): Scene[] {
  const paragraphs = scriptText
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    throw new Error("Script text is empty — nothing to split into scenes.");
  }

  const insertAt = Math.max(1, Math.floor(paragraphs.length / 2));
  const scenes: Scene[] = [];
  let sceneNum = 1;

  paragraphs.forEach((p, i) => {
    if (i === insertAt) {
      scenes.push({
        scene: sceneNum++,
        type: "screen_recording",
        assetRef: `PLACEHOLDER_${slug}-demo.mp4`,
        narration: "Here's roughly what that looks like in practice.",
      });
    }
    scenes.push({
      scene: sceneNum++,
      type: "narration",
      narration: p,
      visualIntent: "[no GEMINI_API_KEY configured — this is a naive paragraph split, not an LLM-planned scene. Write a real diagram description before treating this as final.]",
    });
  });

  return scenes;
}
