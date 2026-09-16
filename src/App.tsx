import React, { useMemo, useRef, useState } from "react";

type Level = 1|2|3|4|5|6;
type Kind = "TOPIK 53"|"TOPIK 54"|"설명하는 글"|"주장하는 글"|"읽고 쓰기";
type Problem = { id:string; title:string; kind:Kind; prompt:string; guide:string[]; vocabulary?:string[] };
type Workbook = { id:string; title:string; description:string; problems:Problem[] };

const SAMPLE: Workbook[] = [{
  id:"basic",
  title:"기본 한국어 글쓰기",
  description:"TOPIK과 일반 글쓰기를 단계별로 연습합니다.",
  problems:[
    {id:"54-1",title:"스마트폰 사용과 생활",kind:"TOPIK 54",prompt:"스마트폰 사용이 우리의 생활에 미치는 영향에 대해 자신의 생각을 쓰십시오.",guide:["문제에서 요구하는 핵심 주제를 한 문장으로 적어 보세요.","스마트폰 사용의 장점 한 가지를 적어 보세요.","문제점 한 가지와 그 이유를 적어 보세요.","구체적인 예를 하나 적어 보세요.","문제를 줄이기 위한 방법을 적어 보세요.","앞의 내용을 바탕으로 결론을 한 문장으로 정리해 보세요."],vocabulary:["영향을 미치다","편리하다","의존하다","문제점","해결 방안"]},
    {id:"53-1",title:"대학생의 스마트폰 사용 시간",kind:"TOPIK 53",prompt:"2022년 3.1시간, 2024년 3.8시간, 2026년 4.5시간이라는 자료를 보고 변화의 특징을 설명하십시오.",guide:["무엇을 조사한 자료인지 적어 보세요.","2022년과 2026년의 수치를 비교해 보세요.","증가 또는 감소의 방향을 적어 보세요.","가장 중요한 변화 한 가지를 문장으로 만드세요.","자료 전체의 특징을 정리해 보세요."],vocabulary:["증가하다","감소하다","~에 비해","나타나다","차지하다"]},
    {id:"arg-1",title:"대중교통 이용",kind:"주장하는 글",prompt:"도시에서 대중교통 이용을 늘리기 위해 필요한 방법에 대해 쓰십시오.",guide:["나의 주장을 정하세요.","그렇게 생각하는 이유를 적으세요.","근거 또는 경험을 적으세요.","다른 관점도 생각해 보세요.","결론에서 주장을 다시 정리하세요."],vocabulary:["필요성이 있다","효율적이다","환경","대책","실천하다"]}
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
  const [view,setView]=useState<"home"|"learn"|"upload"|"saved">("home");
  const [saved,setSaved]=useState<any[]>(()=>{try{return JSON.parse(localStorage.getItem("mannal-essays")||"[]")}catch{return []}});
  const fileRef=useRef<HTMLInputElement>(null);
  const book=books.find(b=>b.id===bookId)||books[0];
  const problem=book?.problems.find(p=>p.id===problemId)||book?.problems[0];
  const kinds=useMemo(()=>Array.from(new Set(book?.problems.map(p=>p.kind)||[])),[book]);

  const chooseProblem=(id:string)=>{setProblemId(id);setAnswers([]);setEssay("");setView("learn")};
  const saveEssay=()=>{if(!problem||!essay.trim())return;const next=[{id:Date.now(),title:problem.title,level,date:new Date().toLocaleDateString("ko-KR"),text:essay},...saved];setSaved(next);localStorage.setItem("mannal-essays",JSON.stringify(next));alert("내 글에 저장했습니다.")};
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
        {problem.vocabulary&&<section className="bg-white border rounded-2xl p-4"><h3 className="font-bold text-sm">필수·추천 어휘</h3><div className="flex flex-wrap gap-2 mt-2">{problem.vocabulary.map(v=><span key={v} className="px-2.5 py-1 rounded-full bg-stone-100 text-sm">{v}</span>)}</div></section>}
        <section className="space-y-3"><h3 className="font-bold">글의 설계도</h3>{problem.guide.map((q,i)=><div key={i} className="bg-white border rounded-2xl p-4"><label className="text-sm font-semibold">{i+1}. {q}</label><textarea value={answers[i]||""} onChange={e=>{const a=[...answers];a[i]=e.target.value;setAnswers(a)}} rows={2} className="mt-2 w-full border rounded-xl p-3 text-base" placeholder="내 생각을 직접 적어 보세요."/></div>)}</section>
        <section className="bg-white border rounded-2xl p-4"><h3 className="font-bold">원고 작성</h3><p className="text-xs text-stone-500 mt-1">위에서 정리한 생각을 연결하여 하나의 글로 완성하세요.</p><textarea value={essay} onChange={e=>setEssay(e.target.value)} rows={14} className="mt-3 w-full border rounded-xl p-3 leading-7" placeholder="여기에 글을 작성하세요."/><div className="text-right text-xs mt-1 text-stone-500">{essay.length}자</div></section>
        <section className="bg-white border rounded-2xl p-4"><h3 className="font-bold">스스로 점검하기</h3><div className="mt-2 space-y-2 text-sm">{["문제에서 요구한 내용에 모두 답했나요?","중심 생각과 이유가 연결되어 있나요?","구체적인 설명이나 예가 있나요?","문단을 알맞게 나누었나요?","급수에 맞는 어휘와 문어체를 사용했나요?"].map(x=><label key={x} className="flex gap-2"><input type="checkbox"/><span>{x}</span></label>)}</div></section>
        <button onClick={saveEssay} className="w-full bg-emerald-700 text-white rounded-2xl py-4 font-bold">내 글 저장하기</button>
      </div>}

      {view==="upload"&&<div className="space-y-4"><button onClick={()=>setView("home")} className="text-sm">← 홈</button><section className="bg-white border rounded-2xl p-5"><h2 className="text-xl font-bold">문제집 추가</h2><p className="text-sm text-stone-600 mt-2 leading-6">인터넷 서버나 AI API 없이 이 기기에 문제집을 추가합니다. JSON 문제집 파일을 선택하세요.</p><input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={e=>e.target.files?.[0]&&importJson(e.target.files[0])}/><button onClick={()=>fileRef.current?.click()} className="mt-4 w-full py-4 rounded-2xl bg-emerald-700 text-white font-bold">문제집 파일 선택</button></section><section className="bg-stone-100 rounded-2xl p-4 text-xs leading-5"><b>문제집 형식</b><pre className="mt-2 whitespace-pre-wrap overflow-auto">{'{\n  "title":"나의 문제집",\n  "description":"설명",\n  "problems":[{\n    "id":"p1", "title":"문제 제목",\n    "kind":"TOPIK 54",\n    "prompt":"문제 내용",\n    "guide":["생각 질문 1","생각 질문 2"],\n    "vocabulary":["어휘1","어휘2"]\n  }]\n}'}</pre></section></div>}

      {view==="saved"&&<div className="space-y-3"><button onClick={()=>setView("home")} className="text-sm">← 홈</button><h2 className="text-xl font-bold">내가 저장한 글</h2>{saved.length===0?<p className="bg-white border rounded-2xl p-5 text-sm">아직 저장한 글이 없습니다.</p>:saved.map(s=><article key={s.id} className="bg-white border rounded-2xl p-4"><div className="text-xs text-stone-500">{s.date} · {s.level}급</div><h3 className="font-bold mt-1">{s.title}</h3><p className="text-sm whitespace-pre-wrap mt-3 leading-6">{s.text}</p></article>)}</div>}
    </main>
  </div>
}
