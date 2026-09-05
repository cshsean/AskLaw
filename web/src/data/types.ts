export type Tool = {
  name: string;
  icon: string;
  pointers: string[];
};

export type QuickFact = {
  label: string;
  value: string;
};

export type ProblemDetail = {
  heroDesc: string;
  overview: {
    paragraphs: string[];
    callout: string;
    whatItCanDo: string[];
  };
  howToUse: {
    copy: string;
    videoBadge: string;
    videoCaption: string;
  };
  download: {
    copy: string;
    videoBadge: string;
    videoCaption: string;
    ctaLabel: string;
    ctaNote: string;
  };
  toolsIntro: string;
  tools: Tool[];
  quickFacts: QuickFact[];
};

export type Problem = {
  slug: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  toolsCount: number;
  detail?: ProblemDetail;
};

export type Category = {
  key: string;
  label: string;
};
