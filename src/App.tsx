import React, { useMemo, useRef, useState } from "react";

type Level = 1|2|3|4|5|6;
type Kind = "TOPIK 53"|"TOPIK 54"|"설명하는 글"|"주장하는 글"|"읽고 쓰기";
type ExamplePart = { label:string; text:string };
type Problem = { id:string; title:string; kind:Kind; prompt:string; guide:string[]; vocabulary?:string[]; example?:string; exampleStructure?:ExamplePart[]; keyExpressions?:string[] };
type Workbook = { id:string; title:string; description:string; problems:Problem[] };

const SAMPLE: Workbook[] = [{
  id:"basic",
  title:"기본 한국어 글쓰기",
  description:"TOPIK과 일반 글쓰기를 단계별로 연습합니다.",
  problems:[
    {id:"54-1",title:"스마트폰 사용과 생활",kind:"TOPIK 54",prompt:"스마트폰 사용이 우리의 생활에 미치는 영향에 대해 자신의 생각을 쓰십시오.",example:"스마트폰은 정보를 빠르게 찾고 다른 사람과 쉽게 연락할 수 있게 해 준다. 그러나 지나치게 사용하면 수면이나 학업에 문제가 생길 수 있다. 예를 들어 밤늦게까지 스마트폰을 사용하면 다음 날 생활에 집중하기 어렵다. 따라서 사용 시간을 정하고 필요한 경우에는 스마트폰을 잠시 멀리하는 습관이 필요하다.",exampleStructure:[{label:"서론",text:"스마트폰이 생활을 편리하게 한다는 배경을 제시합니다."},{label:"본론",text:"장점과 문제점을 설명하고 구체적인 예를 듭니다."},{label:"결론",text:"문제를 줄이기 위한 방법을 제안합니다."}],keyExpressions:["~에 영향을 미치다","예를 들어","따라서","~할 필요가 있다"],guide:["문제에서 요구하는 핵심 주제를 한 문장으로 적어 보세요.","스마트폰 사용의 장점 한 가지를 적어 보세요.","문제점 한 가지와 그 이유를 적어 보세요.","구체적인 예를 하나 적어 보세요.","문제를 줄이기 위한 방법을 적어 보세요.","앞의 내용을 바탕으로 결론을 한 문장으로 정리해 보세요."],vocabulary:["영향을 미치다","편리하다","의존하다","문제점","해결 방안"]},
    {id:"53-1",title:"대학생의 스마트폰 사용 시간",kind:"TOPIK 53",prompt:"2022년 3.1시간, 2024년 3.8시간, 2026년 4.5시간이라는 자료를 보고 변화의 특징을 설명하십시오.",example:"대학생의 하루 스마트폰 사용 시간은 지속적으로 증가한 것으로 나타났다. 2022년에는 3.1시간이었으나 2024년에는 3.8시간으로 늘었다. 2026년에는 4.5시간으로 조사되어 2022년에 비해 1.4시간 증가하였다. 이를 통해 대학생의 스마트폰 사용 시간이 점차 늘고 있음을 알 수 있다.",exampleStructure:[{label:"자료 소개",text:"무엇을 조사한 자료인지 밝힙니다."},{label:"비교·변화",text:"연도별 수치를 비교하고 증가 폭을 설명합니다."},{label:"정리",text:"자료 전체에서 나타나는 특징을 한 문장으로 정리합니다."}],keyExpressions:["~로 나타났다","~에 비해","증가하였다","~임을 알 수 있다"],guide:["무엇을 조사한 자료인지 적어 보세요.","2022년과 2026년의 수치를 비교해 보세요.","증가 또는 감소의 방향을 적어 보세요.","가장 중요한 변화 한 가지를 문장으로 만드세요.","자료 전체의 특징을 정리해 보세요."],vocabulary:["증가하다","감소하다","~에 비해","나타나다","차지하다"]},
    {id:"arg-1",title:"대중교통 이용",kind:"주장하는 글",prompt:"도시에서 대중교통 이용을 늘리기 위해 필요한 방법에 대해 쓰십시오.",example:"도시의 교통 문제를 줄이기 위해서는 대중교통 이용을 늘릴 필요가 있다. 대중교통을 이용하면 한 번에 많은 사람이 이동할 수 있어 도로의 혼잡을 줄이는 데 도움이 된다. 또한 자동차 이용이 줄어들면 환경 보호에도 긍정적인 영향을 줄 수 있다. 이를 위해서는 시민이 편리하게 이용할 수 있도록 노선과 운행 시간을 개선해야 한다.",exampleStructure:[{label:"주장",text:"대중교통 이용을 늘려야 한다는 입장을 밝힙니다."},{label:"근거",text:"교통 혼잡과 환경 문제를 이유로 제시합니다."},{label:"제안",text:"실천 가능한 개선 방법을 제시합니다."}],keyExpressions:["~할 필요가 있다","~에 도움이 되다","긍정적인 영향을 주다","이를 위해서는"],guide:["나의 주장을 정하세요.","그렇게 생각하는 이유를 적으세요.","근거 또는 경험을 적으세요.","다른 관점도 생각해 보세요.","결론에서 주장을 다시 정리하세요."],vocabulary:["필요성이 있다","효율적이다","환경","대책","실천하다"]}
  ]
}];

const LEVEL_TEXT:Record<Level,string>={
  1:"짧고 분명한 문장으로 생각을 표현해 보세요.",
  2:"생각과 이유를 2~3문장으로 연결해 보세요.",
  3:"주장-이유-예-마무리 순서로 써 보세요.",
  4:"두 가지 이유와 구체적인 설명을 연결해 보세요.",
  5:"근거와 사례, 다른 관점을 포함해 논리적으로 써 보세요.",
  6:"쟁점, 근거, 반대 관점의 검토와 결론까지 정교하게 구성해 보세요."
};

export default function App(){
  const [level,setLevel]=useState<Level>(4);
  const [books,setBooks]=useState<Workbook[]>(()=>{try{return JSON.parse(localStorage.getItem("mannal-workbooks")||"null")||SAMPLE}catch{return SAMPLE}});
  const [bookId,setBookId]=useState("basic");
  const [problemId,setProblemId]=useState("54-1");
  const [answers,setAnswers]=useState<string[]>([]);
  const [essay,setEssay]=useState("");
  const [view,setView]=useState<"home"|"learn"|"review"|"revise"|"upload"|"saved">("home");
  const [draftId,setDraftId]=useState<number|null>(null);
  const [originalEssay,setOriginalEssay]=useState("");
  const [checks,setChecks]=useState<Record<string,boolean>>({});
  const [exampleOpen,setExampleOpen]=useState(true);
  const [copyNotice,setCopyNotice]=useState("");
  const [localCheck,setLocalCheck]=useState<{corrected:string;notes:string[]}|null>(null);
  const [saved,setSaved]=useState<any[]>(()=>{try{return JSON.parse(localStorage.getItem("mannal-essays")||"[]")}catch{return []}});
  const fileRef=useRef<HTMLInputElement>(null);
  const book=books.find(b=>b.id===bookId)||books[0];
  const problem=book?.problems.find(p=>p.id===problemId)||book?.problems[0];
  const kinds=useMemo(()=>Array.from(new Set(book?.problems.map(p=>p.kind)||[])),[book]);

  const chooseProblem=(id:string)=>{setProblemId(id);setAnswers([]);setEssay("");setExampleOpen(true);setCopyNotice("");setView("learn")};
  const combineAnswers=()=>{const parts=answers.map(x=>(x||"").trim()).filter(Boolean);if(!parts.length){alert("먼저 글의 설계도에 생각을 적어 주세요.");return;}setEssay(parts.join("\n\n"));setCopyNotice("설계도 답을 순서대로 원고 작성란에 넣었습니다. 이제 문장 사이를 자연스럽게 연결해 보세요.")};
  const localKoreanCheck=(text:string)=>{
    let corrected=text.normalize("NFC").replace(/[ \\t]+/g," ").replace(/ *\\n */g,"\\n").trim();
    const notes:string[]=[];
    const rules:[RegExp,string,string][]=[
      [/안보이게/g,"안 보이게","'안'은 뒤의 용언과 띄어 씁니다."],
      [/하게된다/g,"하게 된다","보조 용언 '되다' 앞을 띄어 씁니다."],
      [/할수/g,"할 수","의존 명사 '수'는 앞말과 띄어 씁니다."],
      [/할것/g,"할 것","의존 명사 '것'은 앞말과 띄어 씁니다."],
      [/때문에/g,"때문에",""],
      [/스마트폰사용/g,"스마트폰 사용","명사 결합의 기본 띄어쓰기를 확인했습니다."]
    ];
    for(const [pattern,replacement,reason] of rules){if(pattern.test(corrected)){corrected=corrected.replace(pattern,replacement);if(reason)notes.push(reason)}}
    const lines=corrected.split(/\\n+/).map(x=>x.trim()).filter(Boolean);
    const fragments=lines.filter(x=>x.length>0&&!/[.!?。]$/.test(x)&&x.split(/\\s+/).length<=3);
    if(fragments.length)notes.push("짧은 메모 형태가 있습니다. AI 평가 전에 주어와 서술어가 있는 완전한 문장으로 연결해 보세요.");
    if(problem?.kind==="TOPIK 54"&&corrected.length<500)notes.push(`현재 ${corrected.length}자입니다. TOPIK 54 연습에서는 내용을 충분히 전개했는지 확인해 보세요.`);
    if(problem?.kind==="TOPIK 53"&&corrected.length<150)notes.push(`현재 ${corrected.length}자입니다. TOPIK 53 연습에서는 자료의 핵심 수치와 비교가 충분한지 확인해 보세요.`);
    return {corrected,notes:Array.from(new Set(notes))};
  };
  const runLocalCheck=()=>{if(!essay.trim())return;const result=localKoreanCheck(essay);setLocalCheck(result);if(result.corrected!==essay)setEssay(result.corrected);};
  const makeEvaluationPrompt=(text:string)=>{
    const rubric=problem?.kind==="TOPIK 53"?"TOPIK II 쓰기 53번의 채점 관점에 맞추어 내용 및 과제 수행, 글의 전개 구조, 언어 사용을 구분해 평가하고 총점 30점 기준의 예상 점수를 제시하세요.":problem?.kind==="TOPIK 54"?"TOPIK II 쓰기 54번의 채점 관점에 맞추어 내용 및 과제 수행, 글의 전개 구조, 언어 사용을 구분해 평가하고 총점 50점 기준의 예상 점수를 제시하세요.":"한국어 글쓰기 학습용으로 내용, 구조, 어휘, 문법을 각각 평가하고 총점 100점 기준의 학습용 예상 점수를 제시하세요.";
    return `당신은 한국어 글쓰기 학습을 돕는 채점·첨삭 도우미입니다.
아래 글은 한국어 학습자가 직접 작성한 글이며 목표 수준은 ${level}급입니다.

[문제 유형]
${problem?.kind}

[문제]
${problem?.prompt}

[평가 기준]
${rubric}
점수는 실제 TOPIK 공식 성적이 아니라 학습을 위한 예상 점수임을 밝혀 주세요.

[반드시 제공할 결과]
1. 예상 총점과 항목별 점수
2. 잘한 점 3가지
3. 내용에서 고칠 점
4. 구조와 문장 연결에서 고칠 점
5. 어휘에서 고칠 점
6. 문법·맞춤법에서 고칠 점
7. 수정이 필요한 부분을 "원문 → 수정 예시 → 이유" 형식으로 제시
8. 가장 중요한 수정 포인트 3가지를 우선순위로 제시
9. 수정 방향을 반영한 참고용 개선 예시를 제시하되 학습자의 원래 생각을 바꾸지 말 것
10. 설명은 ${level}급 학습자가 이해하기 쉽게 할 것

[학습자 글]
${text}`;
  };
  const copyForAI=async(text:string)=>{const payload=makeEvaluationPrompt(text);try{await navigator.clipboard.writeText(payload);setCopyNotice("저장 완료 · AI 채점용 글과 프롬프트를 클립보드에 복사했습니다.");return true;}catch{try{const ta=document.createElement("textarea");ta.value=payload;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.focus();ta.select();const ok=document.execCommand("copy");document.body.removeChild(ta);setCopyNotice(ok?"저장 완료 · AI 채점용 내용을 클립보드에 복사했습니다.":"글은 저장했지만 자동 복사가 되지 않았습니다.");return ok;}catch{setCopyNotice("글은 저장했지만 자동 복사가 되지 않았습니다.");return false;}}};
  const saveEssay=async()=>{if(!problem||!essay.trim())return;const checked=localKoreanCheck(essay);const finalText=checked.corrected;setEssay(finalText);setLocalCheck(checked);const id=Date.now();const item={id,title:problem.title,kind:problem.kind,level,date:new Date().toLocaleDateString("ko-KR"),text:finalText,originalText:finalText,status:"점검 중"};const next=[item,...saved];setSaved(next);localStorage.setItem("mannal-essays",JSON.stringify(next));setDraftId(id);setOriginalEssay(finalText);setChecks({});await copyForAI(finalText);setView("review")};
  const finishRevision=()=>{if(!draftId)return;const next=saved.map(s=>s.id===draftId?{...s,text:essay,revisedText:essay,status:"수정 완료"}:s);setSaved(next);localStorage.setItem("mannal-essays",JSON.stringify(next));setView("saved")};
  const reviewGroups=problem?.kind==="TOPIK 53"?{
    "내용":["자료가 무엇을 보여 주는지 밝혔나요?","중요한 수치와 변화를 빠뜨리지 않았나요?","자료에 없는 내용을 임의로 넣지 않았나요?"],
    "구조":["자료 소개→주요 결과→비교·변화→정리 순서가 자연스러운가요?","숫자를 단순히 나열하지 않고 비교했나요?"],
    "어휘":["증가하다·감소하다·~에 비해 등 자료 설명 표현을 알맞게 사용했나요?","같은 표현을 지나치게 반복하지 않았나요?"],
    "문법":["조사와 어미가 자연스러운가요?","문어체로 일관되게 썼나요?"]
  }:{
    "내용":["문제에서 요구한 내용에 모두 답했나요?","중심 생각이나 주장이 분명한가요?","이유와 구체적인 설명·예가 있나요?"],
    "구조":["서론·본론·결론의 흐름이 보이나요?","문장과 문단의 순서가 자연스러운가요?","이유와 근거가 중심 생각에 연결되나요?"],
    "어휘":["현재 급수에 맞는 어휘를 사용했나요?","같은 단어를 지나치게 반복하지 않았나요?","글의 주제에 맞는 정확한 표현을 사용했나요?"],
    "문법":["조사와 어미가 자연스러운가요?","문장 호응이 자연스러운가요?","말하기 표현보다 글쓰기 문어체를 사용했나요?"]
  };
  const importJson=(file:File)=>{const r=new FileReader();r.onload=()=>{try{const data=JSON.parse(String(r.result));const incoming:Array<Workbook>=Array.isArray(data)?data:[data];if(!incoming.every(x=>x.title&&Array.isArray(x.problems)))throw 0;const normalized=incoming.map((x,i)=>({...x,id:x.id||("book-"+Date.now()+"-"+i)}));const next=[...books,...normalized];setBooks(next);localStorage.setItem("mannal-workbooks",JSON.stringify(next));setBookId(normalized[0].id);setView("home");alert("문제집을 추가했습니다.")}catch{alert("문제집 JSON 형식을 확인해 주세요.")}};r.readAsText(file,"utf-8")};

  return <div className="min-h-screen bg-stone-50 text-stone-900">
    <header className="sticky top-0 z-20 bg-white border-b border-stone-200">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={()=>setView("home")} className="font-bold text-emerald-800">한국어 글쓰기 학습</button>
        <select value={level} onChange={e=>setLevel(Number(e.target.value) as Level)} className="border rounded-xl px-3 py-2 text-sm bg-white">
          {[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n}급</option>)}
        </select>
      </div>
    </header>

    <main className="max-w-md mx-auto p-4 pb-24">
      {view==="home"&&<div className="space-y-5">
        <section className="rounded-3xl bg-emerald-800 text-white p-6">
          <p className="text-sm opacity-90">{level}급 맞춤 학습</p>
          <h1 className="text-2xl font-bold mt-1">생각을 한국어 글로 만들어 보세요.</h1>
          <p className="text-sm mt-3 leading-6 opacity-90">{LEVEL_TEXT[level]}</p>
        </section>
        <section>
          <div className="flex justify-between items-center mb-2"><h2 className="font-bold">문제집</h2><button onClick={()=>setView("upload")} className="text-sm px-3 py-2 rounded-xl border bg-white">+ 문제집 추가</button></div>
          <div className="grid grid-cols-1 gap-2">{books.map(b=><button key={b.id} onClick={()=>{setBookId(b.id);setProblemId(b.problems[0]?.id||"")}} className={"text-left p-4 rounded-2xl border "+(bookId===b.id?"border-emerald-600 bg-emerald-50":"bg-white border-stone-200")}><b>{b.title}</b><p className="text-xs text-stone-600 mt-1">{b.description}</p><p className="text-xs mt-2">{b.problems.length}문제</p></button>)}</div>
        </section>
        <section><h2 className="font-bold mb-2">학습할 문제 선택</h2><div className="space-y-2">{book?.problems.map(p=><button key={p.id} onClick={()=>chooseProblem(p.id)} className="w-full text-left bg-white border border-stone-200 rounded-2xl p-4"><span className="text-xs font-semibold text-emerald-700">{p.kind}</span><div className="font-semibold mt-1">{p.title}</div></button>)}</div></section>
        <button onClick={()=>setView("saved")} className="w-full py-3 rounded-2xl border bg-white font-semibold">내가 저장한 글 보기 ({saved.length})</button>
      </div>}

      {view==="learn"&&problem&&<div className="space-y-4">
        <button onClick={()=>setView("home")} className="text-sm">← 문제 목록</button>
        <section className="bg-white border rounded-2xl p-4"><span className="text-xs font-bold text-emerald-700">{problem.kind} · {level}급</span><h2 className="text-xl font-bold mt-1">{problem.title}</h2><p className="mt-3 leading-7">{problem.prompt}</p></section>
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-4"><b className="text-sm">이 수준에서의 목표</b><p className="text-sm mt-1">{LEVEL_TEXT[level]}</p></section>
        {(problem.example||problem.exampleStructure?.length)&&<section className="bg-white border-2 border-sky-200 rounded-2xl p-4">
          <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold text-sky-700">쓰기 전에 살펴보기</p><h3 className="text-lg font-bold mt-1">구조를 배우는 예시 글</h3></div><button onClick={()=>setExampleOpen(!exampleOpen)} className="px-3 py-2 rounded-xl border bg-white font-semibold">{exampleOpen?"예시 접기":"예시 다시 보기"}</button></div>
          {exampleOpen&&<div className="mt-4 space-y-4">
            <div className="rounded-xl bg-sky-50 p-4"><p className="leading-8 whitespace-pre-wrap">{problem.example}</p></div>
            {problem.exampleStructure?.length&&<div><h4 className="font-bold">글의 구조를 찾아보세요</h4><div className="mt-2 space-y-2">{problem.exampleStructure.map((part,i)=><div key={i} className="border rounded-xl p-3"><span className="font-bold text-emerald-800">[{part.label}]</span><p className="mt-1">{part.text}</p></div>)}</div></div>}
            {problem.keyExpressions?.length&&<div><h4 className="font-bold">핵심 표현</h4><div className="flex flex-wrap gap-2 mt-2">{problem.keyExpressions.map(x=><span key={x} className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">{x}</span>)}</div></div>}
            <div className="rounded-xl bg-stone-100 p-3 text-sm">예시의 문장을 그대로 옮기기보다, 글이 어떤 순서로 전개되는지 살펴본 뒤 자신의 생각으로 써 보세요.</div>
            <button onClick={()=>setExampleOpen(false)} className="w-full py-3 rounded-xl bg-sky-700 text-white font-bold">예시를 접고 내가 직접 써보기</button>
          </div>}
        </section>}
        {problem.vocabulary&&<section className="bg-white border rounded-2xl p-4"><h3 className="font-bold text-sm">필수·추천 어휘</h3><div className="flex flex-wrap gap-2 mt-2">{problem.vocabulary.map(v=><span key={v} className="px-2.5 py-1 rounded-full bg-stone-100 text-sm">{v}</span>)}</div></section>}
        <section className="space-y-3"><h3 className="font-bold">글의 설계도</h3>{problem.guide.map((q,i)=><div key={i} className="bg-white border rounded-2xl p-4"><label className="text-sm font-semibold">{i+1}. {q}</label><textarea value={answers[i]||""} onChange={e=>{const a=[...answers];a[i]=e.target.value;setAnswers(a)}} rows={2} className="mt-2 w-full border rounded-xl p-3 text-base" placeholder="내 생각을 직접 적어 보세요."/></div>)}</section>
        <button onClick={combineAnswers} className="w-full bg-sky-700 text-white rounded-2xl py-4 font-bold">설계도 답을 원고에 합치기</button>
        {copyNotice&&view==="learn"&&<p className="rounded-xl bg-sky-50 border border-sky-200 p-3 text-sm">{copyNotice}</p>}
        <section className="bg-white border rounded-2xl p-4"><h3 className="font-bold">원고 작성</h3><p className="text-xs text-stone-500 mt-1">위의 답을 합친 뒤, 접속 표현과 문장 연결을 직접 다듬어 하나의 글로 완성하세요.</p><textarea value={essay} onChange={e=>setEssay(e.target.value)} rows={14} className="mt-3 w-full border rounded-xl p-3 leading-7" placeholder="여기에 글을 작성하세요."/><div className="text-right text-xs mt-1 text-stone-500">{essay.length}자</div></section>
        <section className="bg-white border rounded-2xl p-4"><h3 className="font-bold">스스로 점검하기</h3><div className="mt-2 space-y-2 text-sm">{["문제에서 요구한 내용에 모두 답했나요?","중심 생각과 이유가 연결되어 있나요?","구체적인 설명이나 예가 있나요?","문단을 알맞게 나누었나요?","급수에 맞는 어휘와 문어체를 사용했나요?"].map(x=><label key={x} className="flex gap-2"><input type="checkbox"/><span>{x}</span></label>)}</div></section>
        <button onClick={saveEssay} className="w-full bg-emerald-700 text-white rounded-2xl py-4 font-bold">저장하고 AI 채점용 내용 복사하기</button>
      </div>}

      {view==="review"&&problem&&<div className="space-y-4">
        <button onClick={()=>setView("learn")} className="text-sm">← 작성 화면</button>
        <section className="bg-emerald-800 text-white rounded-3xl p-5"><p className="text-sm opacity-90">1차 글 저장 완료</p><h2 className="text-2xl font-bold mt-1">이제 내 글을 점검해 보세요.</h2><p className="mt-2 text-sm leading-6 opacity-90">정답을 확인하는 것이 아니라, 내가 쓴 글을 스스로 읽고 고칠 부분을 찾는 단계입니다.</p></section>
        {copyNotice&&<section className="bg-sky-50 border border-sky-200 rounded-2xl p-4"><h3 className="font-bold">AI에서 점검받기</h3><p className="mt-2">{copyNotice}</p><p className="text-sm mt-2">원하는 AI 브라우저를 열고 붙여넣으면 문제·원고·채점 요청이 함께 입력됩니다. AI 점수는 공식 TOPIK 점수가 아니라 학습용 예상 점수입니다.</p><button onClick={()=>copyForAI(originalEssay)} className="mt-3 w-full py-3 rounded-xl border bg-white font-bold">AI 채점용 내용 다시 복사</button></section>}
        <section className="bg-white border rounded-2xl p-4"><h3 className="font-bold">내가 쓴 1차 글</h3><p className="mt-3 whitespace-pre-wrap leading-7">{originalEssay}</p></section>
        {Object.entries(reviewGroups||{}).map(([group,items])=><section key={group} className="bg-white border rounded-2xl p-4"><h3 className="text-lg font-bold text-emerald-800">{group}</h3><div className="mt-3 space-y-3">{items.map((x,i)=>{const key=group+i;return <label key={key} className="flex gap-3 items-start cursor-pointer"><input type="checkbox" checked={!!checks[key]} onChange={e=>setChecks({...checks,[key]:e.target.checked})} className="mt-1 w-5 h-5"/><span>{x}</span></label>})}</div></section>)}
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-4"><b>{level}급 수정 목표</b><p className="mt-1">{LEVEL_TEXT[level]}</p></section>
        <button onClick={()=>setView("revise")} className="w-full bg-emerald-700 text-white rounded-2xl py-4 font-bold">점검하고 내 글 수정하기</button>
      </div>}

      {view==="revise"&&problem&&<div className="space-y-4">
        <button onClick={()=>setView("review")} className="text-sm">← 자기점검</button>
        <section className="bg-white border rounded-2xl p-4"><h2 className="text-xl font-bold">1차 글과 비교하며 수정하기</h2><p className="text-sm text-stone-600 mt-2">점검한 내용을 생각하면서 아래 글을 직접 고쳐 보세요.</p></section>
        <section className="bg-stone-100 rounded-2xl p-4"><h3 className="font-bold">수정 전 글</h3><p className="mt-2 whitespace-pre-wrap leading-7">{originalEssay}</p></section>
        <section className="bg-white border-2 border-emerald-600 rounded-2xl p-4"><h3 className="font-bold text-emerald-800">수정할 글</h3><textarea value={essay} onChange={e=>setEssay(e.target.value)} rows={16} className="mt-3 w-full border rounded-xl p-3 leading-7" /><div className="text-right text-sm mt-1 text-stone-500">{essay.length}자</div></section>
        <button onClick={finishRevision} className="w-full bg-emerald-700 text-white rounded-2xl py-4 font-bold">수정한 글 최종 저장</button>
      </div>}

      {view==="upload"&&<div className="space-y-4"><button onClick={()=>setView("home")} className="text-sm">← 홈</button><section className="bg-white border rounded-2xl p-5"><h2 className="text-xl font-bold">문제집 추가</h2><p className="text-sm text-stone-600 mt-2 leading-6">인터넷 서버나 AI API 없이 이 기기에 문제집을 추가합니다. JSON 문제집 파일을 선택하세요.</p><input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={e=>e.target.files?.[0]&&importJson(e.target.files[0])}/><button onClick={()=>fileRef.current?.click()} className="mt-4 w-full py-4 rounded-2xl bg-emerald-700 text-white font-bold">문제집 파일 선택</button></section><section className="bg-stone-100 rounded-2xl p-4 text-xs leading-5"><b>문제집 형식</b><pre className="mt-2 whitespace-pre-wrap overflow-auto">{'{\n  "title":"나의 문제집",\n  "description":"설명",\n  "problems":[{\n    "id":"p1", "title":"문제 제목",\n    "kind":"TOPIK 54",\n    "prompt":"문제 내용",\n    "guide":["생각 질문 1","생각 질문 2"],\n    "vocabulary":["어휘1","어휘2"],\n    "example":"학습 전에 볼 예시 글",\n    "exampleStructure":[{"label":"서론","text":"구조 설명"}],\n    "keyExpressions":["핵심 표현"]\n  }]\n}'}</pre></section></div>}

      {view==="saved"&&<div className="space-y-3"><button onClick={()=>setView("home")} className="text-sm">← 홈</button><h2 className="text-xl font-bold">내가 저장한 글</h2>{saved.length===0?<p className="bg-white border rounded-2xl p-5 text-sm">아직 저장한 글이 없습니다.</p>:saved.map(s=><article key={s.id} className="bg-white border rounded-2xl p-4"><div className="text-xs text-stone-500">{s.date} · {s.level}급</div><h3 className="font-bold mt-1">{s.title}</h3><p className="text-sm font-semibold mt-2 text-emerald-700">{s.status||"저장됨"}</p>{s.originalText&&s.revisedText&&s.originalText!==s.revisedText?<details className="mt-3"><summary className="cursor-pointer font-semibold">수정 전·후 비교</summary><div className="mt-3 p-3 bg-stone-100 rounded-xl"><b>수정 전</b><p className="whitespace-pre-wrap mt-1">{s.originalText}</p></div><div className="mt-2 p-3 bg-emerald-50 rounded-xl"><b>수정 후</b><p className="whitespace-pre-wrap mt-1">{s.revisedText}</p></div></details>:<p className="text-sm whitespace-pre-wrap mt-3 leading-6">{s.text}</p>}</article>)}</div>}
    </main>
  </div>
}
