export type KoreanLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type WritingCategory = 
  | "thinking"     // 생각하고 쓰기
  | "topik53"      // TOPIK 53번 (자료분석)
  | "topik54"      // TOPIK 54번 (논술형)
  | "reading"      // 읽고 쓰기
  | "expository"   // 설명하는 글
  | "argumentative"// 주장하는 글
  | "my_writings"  // 나의 글
  | "teacher";     // 선생님 메뉴

export type LearningStep = 
  | "topic_check"   // 주제 및 문제 파악
  | "thinking_coach"// 생각 코치 (소크라테스식 문답)
  | "blueprint"     // 글의 설계도
  | "paragraph_link"// 문장 -> 문단 연결 훈련
  | "manuscript"    // 원고지 작성 (원고지 / 편하게 쓰기)
  | "ai_feedback"   // AI 3단계 피드백
  | "self_revision" // 학생 스스로 수정
  | "completed";    // 완료 및 비교

export interface BlueprintCardItem {
  id: string;
  stepNumber: number;
  title: string;
  guideQuestion: string;
  hint: string;
  studentAnswer: string;
  recommendedConnector?: string;
  levelRequired: number; // minimum level from which this card appears
}

export interface LevelConfig {
  level: KoreanLevel;
  title: string;
  description: string;
  charTarget: { min: number; max: number };
  focusAreas: string[];
  blueprintStepTitles: string[];
  recommendedVocabularyLevel: string;
}

export interface Topik53Problem {
  id: string;
  title: string;
  institution: string;
  topic: string;
  timeframe: string;
  mainData: {
    yearOrCategory: string;
    value: number | string;
    unit: string;
  }[];
  secondaryData?: {
    category: string;
    percentage: number;
  }[];
  analysisSteps: {
    question: string;
    guidance: string;
    sampleSentence: string;
    selectedOrAnswered?: string;
  }[];
  essentialPhrases: string[];
  targetChars: { min: number; max: number };
}

export interface Topik54Problem {
  id: string;
  title: string;
  promptBackground: string;
  subQuestions: string[];
  structureTemplate: {
    section: "서론" | "본론 1" | "본론 2" | "반대의견" | "결론";
    elements: string[];
    guide: string;
  }[];
  keywords: string[];
  targetChars: { min: number; max: number };
}

export interface ReadingTask {
  id: string;
  title: string;
  passage: string[]; // paragraphs
  topicQuestion: string;
  topicOptions: string[];
  correctTopicIndex: number;
  keywords: {
    word: string;
    isKey: boolean;
    reason: string;
  }[];
  keySentenceIndex: number; // paragraph and sentence index
  structureType: "두괄식" | "미괄식" | "양괄식";
  structureExplanation: string;
  structureFlow: {
    stage: string;
    description: string;
  }[];
}

export interface SocraticFeedbackItem {
  step: number;
  location: string;
  issue: string;
  guideQuestion: string;
  studentAnswer?: string;
}

export interface AiEvaluationReport {
  taskScore: number;
  taskFeedback: string[];
  structureScore: number;
  structureFeedback: string[];
  languageScore: number;
  languageFeedback: string[];
  overallComment: string;
  socraticQuestions: SocraticFeedbackItem[];
}

export interface VocabUpgradeItem {
  originalWord: string;
  accurateWord: string;
  advancedWord: string;
  example: string;
}

export type VocabUpgradeSuggestion = VocabUpgradeItem;

export interface EssayDraftRecord {
  version: 1 | 2 | 3; // 1: 초고, 2: 1차 수정본, 3: 최종 완성본
  text: string;
  charCount: number;
  timestamp: string;
  evaluation?: AiEvaluationReport;
}

export interface SavedEssay {
  id: string;
  title: string;
  category: WritingCategory;
  level: KoreanLevel;
  date: string;
  drafts: EssayDraftRecord[];
  currentVersion: number;
  vocabUpgrades?: VocabUpgradeItem[];
}

export interface TeacherArticleTask {
  id: string;
  title: string;
  sourceType: "url" | "text";
  sourceInput: string;
  taskType: "reading" | "topik53" | "topik54";
  analysis: {
    topic: string;
    summary: string[];
    keyFacts: string[];
    keywords: string[];
    issue: string;
    viewpoints: string;
    thinkingQuestions: string[];
  };
  generatedProblem: {
    title: string;
    instructions: string;
    subQuestions: string[];
    sampleData?: string;
  };
  approved: boolean;
  createdAt: string;
}
