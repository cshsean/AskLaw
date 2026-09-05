import React from "react";
import { Composition } from "remotion";
import { ProblemVideo } from "./ProblemVideo";
import generated from "../data/billings-invoices.generated.json";

const FPS = 30;

function totalDurationInFrames(): number {
  const narrationTotal = generated.narrationTiming.reduce((sum, t) => sum + t.durationSec, 0);
  const screenRecordingTotal = generated.screenRecording?.durationSec ?? 0;
  return Math.max(1, Math.round((narrationTotal + screenRecordingTotal) * FPS));
}

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ProblemVideo"
      component={ProblemVideo}
      durationInFrames={totalDurationInFrames()}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
