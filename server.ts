import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy GoogleGenAI initialization
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. Thinking Coach API: Generates Socratic guidance question based on student's current level & thought
app.post("/api/ai/coach", async (req, res) => {
  try {
    const { topic, level, currentStage, studentAnswer, previousQuestions, writingType } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `당신은 한국어 글쓰기 및 TOPIK 쓰기 교육 전문가입니다.
목표: 학생 대신 글을 써주지 말고, 질문을 통해 학생의 생각을 한 단계씩 끌어내는 소크라테스식 질문 코칭을 수행합니다.
규칙:
1. 절대로 모범답안이나 완성된 문장을 먼저 주지 마세요.
2. 학생의 한국어 급수(${level}급)에 맞춘 자연스럽고 쉬운 한국어(1~2급은 평이한 경어체, 5~6급은 논리적 사고 유도)로 1개의 질문과 1~2줄의 친절한 격려만 작성하세요.
3. 영어는 절대 쓰지 마세요.
4. 주제: "${topic}"
글 종류: "${writingType || '일반 글쓰기'}"
현재 단계: "${currentStage}"
이전 질문들: ${JSON.stringify(previousQuestions || [])}
학생의 최근 답변/생각: "${studentAnswer || '무슨 말을 써야 할지 모르겠어요.'}"

응답 형식(JSON):
{
  "coachQuestion": "학생에게 던질 다음 유도 질문",
  "encouragement": "짧은 격려 및 힌트",
  "easierQuestion": "학생이 막혔을 때 던질 수 있는 한 단계 더 쉬운 보조 질문",
  "suggestedKeywords": ["관련어휘1", "관련어휘2", "관련어휘3"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, data: parsed });
    }

    // Fallback if no API key
    let coachQuestion = "그 생각에 대해 조금 더 구체적으로 설명해 볼까요?";
    let easierQuestion = "가장 먼저 떠오르는 단어나 경험은 무엇인가요?";
    let encouragement = "좋은 생각의 시작이에요! 천천히 하나씩 풀어가 봐요.";
    const suggestedKeywords = ["경험", "이유", "생각"];

    if (level <= 2) {
      coachQuestion = "누가, 언제, 어디서 그런 일을 겪었나요?";
      easierQuestion = "기분이 어땠어요? 좋았어요, 나빴어요?";
      encouragement = "짧은 문장으로 편하게 대답해 보세요!";
    } else if (level <= 4) {
      coachQuestion = "그렇게 생각하게 된 특별한 이유나 주변의 실제 경험이 있나요?";
      easierQuestion = "그것의 가장 좋은 점이나 불편한 점은 무엇일까요?";
      encouragement = "이유와 예를 하나씩 덧붙이면 훌륭한 문단이 됩니다.";
    } else {
      coachQuestion = "그 주장에 대해 다른 사람들은 어떤 반대 의견을 가질 수 있을까요?";
      easierQuestion = "이 문제가 우리 사회 전체에 미치는 긍정적·부정적 영향은 무엇인가요?";
      encouragement = "다각적인 시각을 고려하면 훨씬 설득력 있는 글이 됩니다.";
    }

    return res.json({
      success: true,
      data: {
        coachQuestion,
        encouragement,
        easierQuestion,
        suggestedKeywords,
      },
    });
  } catch (error: any) {
    console.error("Coach API error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 2. 3-Area Evaluation and 3-Step Socratic Feedback
app.post("/api/ai/evaluate", async (req, res) => {
  try {
    const { topic, text, level, writingType } = req.body;
    const ai = getGeminiClient();

    if (ai && text && text.trim().length > 10) {
      const prompt = `당신은 한국어능력시험(TOPIK) 쓰기 채점 및 교육 전문가입니다.
학생 글:
"""
${text}
"""
주제: "${topic}"
학습자 수준: ${level}급
글 종류: "${writingType}"

지침:
1. 절대로 글 전체를 직접 고쳐 쓰거나 정답을 주지 마세요.
2. 세 가지 영역(내용 및 과제 수행, 글의 전개 구조, 언어 사용)을 평가하세요 (각 100점 만점).
3. 3단계 소크라테스식 피드백(문제 위치 -> 이유 질문 -> 학생이 직접 고칠 수 있도록 돕는 유도 질문)을 2~3개 도출하세요.
4. 순수 한국어로만 작성하세요.

JSON 출력 규격:
{
  "taskScore": 85,
  "taskFeedback": ["문제의 요구사항을 충실히 반영하였습니다.", "구체적인 사례가 보완되면 더욱 좋겠습니다."],
  "structureScore": 80,
  "structureFeedback": ["서론과 본론의 구분이 분명합니다.", "본론 문단 간의 연결 표현을 다양화할 필요가 있습니다."],
  "languageScore": 82,
  "languageFeedback": ["${level}급에 적절한 문어체를 구사하였습니다.", "일부 반복되는 어휘를 대체 표현으로 바꾸어 보세요."],
  "overallComment": "전반적인 총평 (격려와 방향 제시)",
  "socraticQuestions": [
    {
      "step": 1,
      "location": "본론 첫 번째 문장 부근",
      "issue": "앞뒤 문장의 인과관계 연결이 다소 어색함",
      "guideQuestion": "앞의 원인과 뒤의 결과 사이를 매끄럽게 잇기 위해 어떤 연결 표현(예: 그러므로, 왜냐하면)이 어울릴까요?"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.6,
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, data: parsed });
    }

    // Heuristic Fallback Evaluation
    const charCount = (text || "").length;
    let taskScore = 80;
    let structureScore = 78;
    let languageScore = 82;

    if (charCount > 300) {
      taskScore = 88;
      structureScore = 85;
      languageScore = 86;
    } else if (charCount < 100) {
      taskScore = 70;
      structureScore = 68;
      languageScore = 74;
    }

    return res.json({
      success: true,
      data: {
        taskScore,
        taskFeedback: [
          "주제에 대한 자신의 생각을 성실히 표현하였습니다.",
          level >= 4 ? "주장에 대한 구체적인 근거와 사회적 사례를 하나 더 덧붙여 보세요." : "이유를 한 문장 더 추가해 보세요.",
        ],
        structureScore,
        structureFeedback: [
          "생각의 순서가 자연스럽게 이어지고 있습니다.",
          "문단과 문단 사이를 연결하는 접속 표현(예: 따라서, 그러나)을 의식하며 다듬어 보세요.",
        ],
        languageScore,
        languageFeedback: [
          `${level}급 수준의 어휘를 적극적으로 활용하려 노력했습니다.`,
          "구어체 표현(해요체) 대신 격식 있는 문어체(~(으)ㄴ/는다, ~다)를 일관되게 유지해 보세요.",
        ],
        overallComment: `학습자의 생각이 잘 담긴 소중한 글입니다. AI가 직접 대신 써주는 대신, 아래 질문을 보며 스스로 다듬어 봅시다.`,
        socraticQuestions: [
          {
            step: 1,
            location: "문단의 연결 부위",
            issue: "생각의 전환이 다소 빠름",
            guideQuestion: "앞 문장의 내용과 뒤 문장의 내용은 서로 찬성하는 관계인가요, 아니면 반대되는 관계인가요? 그에 맞는 접속사를 골라볼까요?",
          },
          {
            step: 2,
            location: "예시나 이유 부분",
            issue: "표현의 구체성 부족",
            guideQuestion: "사람들이 자주 겪는 구체적인 상황을 한 가지 단어로 압축해 표현해 볼 수 있을까요?",
          },
        ],
      },
    });
  } catch (error: any) {
    console.error("Evaluate API error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Vocabulary Coach API: Analyzes student words & suggests level-graded replacements
app.post("/api/ai/vocab", async (req, res) => {
  try {
    const { text, level } = req.body;
    const ai = getGeminiClient();

    if (ai && text && text.trim().length > 5) {
      const prompt = `학생 글에서 사용된 주요 한국어 어휘를 추출하고, 원래 의미를 훼손하지 않으면서 ${level}급 학습자에게 유익한 어휘 업그레이드 사전을 만드세요.
학생 글:
"""
${text}
"""
요구사항:
1. 학생이 사용한 어휘 3~5개 선정
2. 더 정확한 표현(중급 수준)
3. 한 단계 높은 고급 표현(5~6급 수준 문어체)
4. 짧은 예문 제시

JSON 출력 규격:
[
  {
    "originalWord": "학생이 쓴 어휘",
    "accurateWord": "더 정확한 표현",
    "advancedWord": "한 단계 높은 고급 표현",
    "example": "고급 표현을 활용한 자연스러운 문장 예시"
  }
]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.5,
        },
      });

      const parsed = JSON.parse(response.text || "[]");
      return res.json({ success: true, data: parsed });
    }

    // Default pedagogically rich vocabulary recommendations
    return res.json({
      success: true,
      data: [
        {
          originalWord: "생활",
          accurateWord: "일상생활",
          advancedWord: "생활 양식 / 일상적 삶",
          example: "스마트폰은 현대인의 생활 양식에 지대한 영향을 미치고 있다.",
        },
        {
          originalWord: "문제",
          accurateWord: "문제점 / 부작용",
          advancedWord: "사회적 문제로 대두되다",
          example: "무분별한 디지털 기기 사용의 부작용이 심각한 문제로 대두되고 있다.",
        },
        {
          originalWord: "좋다",
          accurateWord: "긍정적이다 / 유익하다",
          advancedWord: "삶의 질을 향상시키다",
          example: "정보 기술의 발달은 업무 효율성을 높이고 삶의 질을 향상시킨다.",
        },
        {
          originalWord: "많이 하다",
          accurateWord: "자주 이용하다",
          advancedWord: "이용이 일상화되다 / 보편화되다",
          example: "스마트폰을 통한 비대면 소통이 사회 전반에 보편화되었다.",
        },
        {
          originalWord: "필요하다",
          accurateWord: "필요성이 있다",
          advancedWord: "필요성이 절실히 요구되다",
          example: "균형 잡힌 생활을 유지하기 위한 자기 통제력이 절실히 요구된다.",
        },
      ],
    });
  } catch (error: any) {
    console.error("Vocab API error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Teacher Article to Writing Prompt Generator API
app.post("/api/ai/generate-article-prompt", async (req, res) => {
  try {
    const { articleText, articleUrl, taskType } = req.body;
    const ai = getGeminiClient();

    const inputContent = articleText || `기사 URL 참고: ${articleUrl}`;

    if (ai) {
      const prompt = `당신은 한국어 교육 및 TOPIK 문제 출제 위원입니다.
다음 기사 또는 글의 내용을 분석하여 외국인 학습자를 위한 글쓰기 학습 문제를 생성하세요.
기사 내용:
"""
${inputContent}
"""
출제 유형: "${taskType}" (선택 가능: reading [읽고 쓰기], topik53 [TOPIK 53번형 자료분석], topik54 [TOPIK 54번형 논술])

지침:
1. 반드시 한국어로만 작성하세요.
2. 기사 분석 내용:
   - 주제
   - 핵심 내용 3줄 요약
   - 주요 사실
   - 핵심 어휘 (5개)
   - 쟁점
   - 서로 다른 관점
   - 학생이 생각할 만한 질문 (3개)
3. 지정된 taskType에 맞는 문제 초안:
   - 제목
   - 지시문
   - 세부 하위 질문 또는 제시 자료 (53번이면 수치 데이터, 54번이면 3개 하위 질문)
   - 단계별 생각 가이드 힌트

JSON 출력 규격:
{
  "analysis": {
    "topic": "기사의 핵심 주제",
    "summary": ["요약1", "요약2", "요약3"],
    "keyFacts": ["사실1", "사실2"],
    "keywords": ["어휘1", "어휘2", "어휘3", "어휘4", "어휘5"],
    "issue": "핵심 쟁점",
    "viewpoints": "찬반 또는 다양한 시각 요약",
    "thinkingQuestions": ["질문1", "질문2", "질문3"]
  },
  "generatedProblem": {
    "title": "생성된 문제 제목",
    "taskType": "${taskType}",
    "instructions": "시험 지시문",
    "subQuestions": ["하위 질문1", "하위 질문2", "하위 질문3"],
    "sampleData": "53번일 경우 표나 수치 데이터 설명"
  }
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.6,
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, data: parsed });
    }

    // High quality pedagogical fallback
    return res.json({
      success: true,
      data: {
        analysis: {
          topic: "원격 근무 확산과 사회적 변화",
          summary: [
            "재택 및 원격 근무를 도입하는 기업이 지속적으로 증가하고 있다.",
            "출퇴근 시간 절약과 업무 자율성 증대라는 장점이 있다.",
            "동시에 업무와 일상의 경계 모호, 소통 부족이라는 문제점도 제기된다.",
          ],
          keyFacts: [
            "국내 주요 기업 재택근무 도입률 45% 돌파",
            "직장인의 68%가 유연한 근무 형태를 선호한다고 응답",
          ],
          keywords: ["원격 근무", "유연성", "효율성", "소통 부재", "워라밸"],
          issue: "원격 근무의 생산성 유지와 근로자의 삶의 질 향상 간의 균형",
          viewpoints: "기업 측의 관리 효율 우려 vs 근로자 측의 삶의 만족도 및 자율성 중시",
          thinkingQuestions: [
            "원격 근무가 직장인의 하루 일과를 어떻게 바꾸어 놓았습니까?",
            "원격 근무 시 발생할 수 있는 가장 큰 어려움은 무엇입니까?",
            "이러한 어려움을 해결하기 위해 개인과 조직은 무엇을 준비해야 합니까?",
          ],
        },
        generatedProblem: {
          title: "원격 근무(재택근무) 확산에 따른 영향과 바람직한 자세",
          taskType: taskType || "topik54",
          instructions: "다음을 읽고 '원격 근무 확산'에 대하여 600~700자로 글을 쓰십시오.",
          subQuestions: [
            "원격 근무가 확산되면서 우리의 직장 생활에는 어떤 긍정적인 변화가 나타났습니까?",
            "원격 근무가 초래할 수 있는 문제점이나 한계는 무엇입니까?",
            "효과적인 원격 근무 환경을 만들기 위해 개인과 기업은 어떤 노력을 기울여야 합니까?",
          ],
          sampleData: "재택근무 도입 비율: 2020년 15% → 2023년 32% → 2026년 48%",
        },
      },
    });
  } catch (error: any) {
    console.error("Article prompt API error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    appName: "한국어 글쓰기 코치",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`한국어 글쓰기 코치 서버 실행 중: http://localhost:${PORT}`);
  });
}

startServer();
