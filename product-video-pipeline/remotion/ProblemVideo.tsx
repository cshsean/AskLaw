import React from "react";
import { AbsoluteFill, OffthreadVideo, Series, staticFile } from "remotion";
import problemData from "../data/billings-invoices.json";
import generated from "../data/billings-invoices.generated.json";

const FPS = 30;

const CaptionBar: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      position: "absolute",
      bottom: 60,
      left: 80,
      right: 80,
      background: "rgba(0,0,0,0.65)",
      color: "white",
      fontFamily: "Arial, sans-serif",
      fontSize: 36,
      padding: "16px 24px",
      borderRadius: 8,
      textAlign: "center",
    }}
  >
    {text}
  </div>
);

/**
 * Pilot composition for one problem ("billings-invoices"). Order is driven
 * entirely by the reviewed scene JSON (data/billings-invoices.json) plus the
 * timing computed in src/generateNarrationVideo.ts — nothing here decides
 * sequence on its own.
 */
type NarrationEntry = {
  kind: "narration";
  scene: number;
  durationInFrames: number;
  startFrame: number;
  visualIntent: string;
  caption: string;
};

type ScreenRecordingEntry = {
  kind: "screen_recording";
  scene: number;
  durationInFrames: number;
  assetRef: string;
  caption: string;
  isPlaceholder: boolean;
};

export const ProblemVideo: React.FC = () => {
  const narrationScenesBySceneNum = new Map(
    problemData.videoScript
      .filter((s: any) => s.type === "narration")
      .map((s: any) => [s.scene, s])
  );

  const narrationEntries: NarrationEntry[] = generated.narrationTiming.map((timing) => {
    const scene = narrationScenesBySceneNum.get(timing.scene)!;
    return {
      kind: "narration",
      scene: timing.scene,
      durationInFrames: Math.max(1, Math.round(timing.durationSec * FPS)),
      startFrame: Math.round(timing.startSec * FPS),
      visualIntent: scene.visualIntent,
      caption: scene.narration,
    };
  });

  const screenRecordingEntry: ScreenRecordingEntry[] = generated.screenRecording
    ? [
        {
          kind: "screen_recording",
          scene: generated.screenRecording.scene,
          durationInFrames: Math.max(1, Math.round(generated.screenRecording.durationSec * FPS)),
          assetRef: generated.screenRecording.assetRef,
          caption: generated.screenRecording.narration,
          isPlaceholder: generated.screenRecording.isPlaceholder,
        },
      ]
    : [];

  // The only thing that determines final video order: sort every scene —
  // narration or screen recording — by its `scene` number from the reviewed
  // script. Nothing downstream re-orders anything.
  const orderedEntries = [...narrationEntries, ...screenRecordingEntry].sort(
    (a, b) => a.scene - b.scene
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#f6f7f9" }}>
      <Series>
        {orderedEntries.map((entry) =>
          entry.kind === "narration" ? (
            <Series.Sequence key={entry.scene} durationInFrames={entry.durationInFrames}>
              <AbsoluteFill>
                <OffthreadVideo
                  src={staticFile(generated.narrationVideoFile)}
                  startFrom={entry.startFrame}
                  endAt={entry.startFrame + entry.durationInFrames}
                />
                <AbsoluteFill
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "Arial, sans-serif",
                    color: "#1f4e8c",
                    fontSize: 32,
                    padding: 60,
                    textAlign: "center",
                  }}
                >
                  <div style={{ background: "rgba(255,255,255,0.85)", padding: 24, borderRadius: 12 }}>
                    [diagram placeholder] {entry.visualIntent}
                  </div>
                </AbsoluteFill>
                <CaptionBar text={entry.caption} />
              </AbsoluteFill>
            </Series.Sequence>
          ) : (
            <Series.Sequence key={entry.scene} durationInFrames={entry.durationInFrames}>
              <AbsoluteFill>
                <OffthreadVideo src={staticFile(entry.assetRef)} />
                <CaptionBar text={entry.caption} />
                {entry.isPlaceholder && (
                  <div
                    style={{
                      position: "absolute",
                      top: 24,
                      left: 24,
                      background: "#b00020",
                      color: "white",
                      fontFamily: "Arial, sans-serif",
                      fontSize: 24,
                      padding: "6px 14px",
                      borderRadius: 6,
                    }}
                  >
                    PLACEHOLDER — real screen recording pending
                  </div>
                )}
              </AbsoluteFill>
            </Series.Sequence>
          )
        )}
      </Series>
    </AbsoluteFill>
  );
};
