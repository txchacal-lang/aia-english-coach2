document.addEventListener("DOMContentLoaded",()=>{

/* ========= ELEMENTOS ========= */
const aiaRow = document.querySelector(".aia-row");
const aiaActions = document.querySelector(".aia-actions");
const aiaActionsParent = aiaActions.parentElement;
const aiaActionsNext = aiaActions.nextSibling;

const btnAprendiz = document.getElementById("btnAprendiz");
const btnTradutor = document.getElementById("btnTradutor");
const btnFrases   = document.getElementById("btnFrases");

const btnFalar    = document.getElementById("btnFalar");
const btnPlay     = document.getElementById("btnPlay");
const btnRandom   = document.getElementById("btnRandom");
const btnPronuncia= document.getElementById("btnPronuncia");

const btnAssistente = document.getElementById("btnAssistente");

const btnSalvar  = document.getElementById("btnSalvar");
const btnExcluir = document.getElementById("btnExcluir");

const wrapperFalar  = document.getElementById("wrapperFalar");
const wrapperPlay   = document.getElementById("wrapperPlay");
const wrapperRandom = document.getElementById("wrapperRandom");
const wrapperAssistente = document.getElementById("wrapperAssistente");
const wrapperSalvar  = document.getElementById("wrapperSalvar");
const wrapperExcluir = document.getElementById("wrapperExcluir");

const btnAnterior = document.getElementById("btnAnterior");
const btnProximaFrase = document.getElementById("btnProximaFrase");
const btnProxima = document.getElementById("btnProxima");

const faladoEl = document.getElementById("falado");
const traducaoEl = document.getElementById("traducao");
const feedbackEl = document.getElementById("feedback");
const aiaMsg = document.getElementById("aiaMsg");

const notaEl = document.getElementById("nota");
const mediaEl = document.getElementById("mediaSessao");
const progressBar = document.getElementById("progressBar");

const contadorFrasesEl = document.getElementById("contadorFrases");
const listaMinhasFrasesEl = document.getElementById("listaMinhasFrases");

const toggleMinhasFrases = document.getElementById("toggleMinhasFrases");
const boxMinhasFrases = document.getElementById("boxMinhasFrases");

const minhasFrasesSection = document.getElementById("minhasFrasesSection");

/* ========= ESTADO ========= */
let modoAtual = "aprendiz";

const aprendiz = {
  fraseAlvo:"",
  falada:[],
  etapa:"pt",
  totalNotas:0,
  totalFrases:0,
  palavraEmCorrecao:null
};

let ultimaTraducao="";
let frases=[];
let indice=0;
let autoplay=false;
let aleatorio=false;

let assistenteAtivo = false;
let reconhecimentoAssistente = null;

/* ========= SPEECH ========= */
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function criarRec(lang){
  const r = new SpeechRecognition();
  r.lang = lang;
  r.interimResults = true;
  return r;
}

/* ========= VOZ ========= */
let vozes = [];

function carregarVozes(){
  vozes = speechSynthesis.getVoices();
}

carregarVozes();

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = carregarVozes;
}

function falar(txt, lang){
  if(!txt) return;

  speechSynthesis.cancel();

  if(!vozes.length){
    vozes = speechSynthesis.getVoices();
  }

  let voz;

  if(lang === "pt-BR"){
    voz = vozes.find(v => v.lang === "pt-BR") || vozes[0];
  } else {
    voz = vozes.find(v => v.lang.startsWith("en")) || vozes[0];
  }

  const u = new SpeechSynthesisUtterance(txt);

  if(voz){
    u.voice = voz;
    u.lang = voz.lang;
  }

  // 🔥 ajuste de velocidade melhor
  u.rate = modoAtual === "aprendiz" ? 0.65 : 0.85;

  speechSynthesis.speak(u);
}

function falarAia(t){
  aiaMsg.textContent = t;
}

/* ========= MODOS ========= */
btnAprendiz.onclick=()=>ativar("aprendiz");
btnTradutor.onclick=()=>ativar("tradutor");
btnFrases.onclick=()=>ativar("frases");

function ativar(m){
  modoAtual=m;

  if(aiaActionsNext){
    aiaActionsParent.insertBefore(aiaActions, aiaActionsNext);
  }

  document.body.classList.remove("modo-frases-layout");

  [btnAprendiz,btnTradutor,btnFrases].forEach(b=>b.classList.remove("active"));

  wrapperFalar.style.display="flex";
  wrapperPlay.style.display="none";
  wrapperRandom.style.display="none";
  wrapperAssistente.style.display="none";
  wrapperSalvar.style.display="none";
  wrapperExcluir.style.display="none";

  if(m==="aprendiz"){
    btnAprendiz.classList.add("active");
    falarAia("Fale uma frase em português.");
  }

  if(m==="tradutor"){
    btnTradutor.classList.add("active");
    wrapperAssistente.style.display="flex";
    wrapperSalvar.style.display="flex";
    falarAia("Fale que eu traduzo.");
  }

  if(m==="frases"){
    btnFrases.classList.add("active");
    wrapperFalar.style.display="none";
    wrapperPlay.style.display="flex";
    wrapperRandom.style.display="flex";
    wrapperExcluir.style.display="flex";
    carregarFrases();
  }
}

/* ========= BOTÕES ========= */
btnFalar.onclick=()=>{
  if(modoAtual==="aprendiz"){
    aprendiz.etapa==="pt"?fluxoPt():fluxoEn();
  }
  if(modoAtual==="tradutor") fluxoTradutor();
};

btnPronuncia.onclick=()=>{
  if(modoAtual==="aprendiz") falar(aprendiz.fraseAlvo,"en-US");
  if(modoAtual==="tradutor") falar(ultimaTraducao,"en-US");
};

/* ========= ASSISTENTE ========= */
btnAssistente.onclick = ()=>{
  assistenteAtivo = !assistenteAtivo;

  if(assistenteAtivo){
    falarAia("Assistente ativo. Diga: AiA traduza...");
    iniciarAssistente();
  }else{
    falarAia("Assistente desligado.");
    if(reconhecimentoAssistente) reconhecimentoAssistente.stop();
  }
};

function iniciarAssistente(){
  reconhecimentoAssistente = criarRec("pt-BR");

  reconhecimentoAssistente.onresult = async e => {
    let texto = e.results[0][0].transcript.toLowerCase();

    if(
      texto.includes("traduz") ||
      texto.includes("aia traduz")
    ){
      texto = texto.replace("aia","").replace("traduz","").trim();

      const res = await fetch("/traduzir",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({texto})
      });

      const d = await res.json();

      traducaoEl.textContent = d.traducao;
      falar(d.traducao,"en-US");
    }
  };

  reconhecimentoAssistente.onend = ()=>{
    if(assistenteAtivo) iniciarAssistente();
  };

  reconhecimentoAssistente.start();
}

/* ========= APRENDIZ ========= */
function fluxoPt(){
  const r=criarRec("pt-BR");

  r.onresult=async e=>{
    const texto=e.results[0][0].transcript;
    faladoEl.textContent=texto;

    const res=await fetch("/traduzir",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({texto})
    });

    const d=await res.json();
    aprendiz.fraseAlvo=d.traducao;

    mostrarPalavrasIngles(d.traducao);
  };

  r.start();
}

function fluxoEn(){
  const r=criarRec("en-US");

  r.onresult=e=>{
    aprendiz.falada=e.results[0][0].transcript.toLowerCase().split(" ");
    corrigir();
  };

  r.start();
}

/* ========= CORREÇÃO MELHORADA ========= */
function parecido(a,b){
  return a===b || a.includes(b) || b.includes(a);
}

function corrigir(){
  feedbackEl.innerHTML="";
  const alvo=aprendiz.fraseAlvo.toLowerCase().split(" ");

  let acertos=0;

  alvo.forEach((p,i)=>{
    const falada = aprendiz.falada[i] || "";

    const s=document.createElement("span");
    s.textContent=p+" ";

    if(parecido(falada,p)){
      s.className="corrigido";
      acertos++;
    }else{
      s.className="errado";
    }

    feedbackEl.appendChild(s);
  });

  const nota=Math.round((acertos/alvo.length)*100);
  notaEl.textContent=nota;
  progressBar.style.width=nota+"%";
}

/* ========= TRADUTOR ========= */
function fluxoTradutor(){

  const r = criarRec("pt-BR");

  r.onresult = async e => {

    const texto = e.results[0][0].transcript;

    faladoEl.textContent = texto;

    const res = await fetch("/traduzir",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ texto })
    });

    const d = await res.json();

    ultimaTraducao = d.traducao;
    mostrarPalavrasIngles(d.traducao);

    falar(d.traducao,"en-US");
  };

  r.start();
}

/* ========= FRASES ========= */
async function carregarFrases(){
  if(frases.length) return;

  const r=await fetch("/frases.json");
  frases=await r.json();

  tocar();
}

function tocar(){
  const f=frases[indice];
  faladoEl.textContent=f.pt;
  mostrarPalavrasIngles(f.en);

  falar(f.pt,"pt-BR");
  setTimeout(()=>falar(f.en,"en-US"),1200);
}

/* ========= UTIL ========= */
function mostrarPalavrasIngles(frase){
  traducaoEl.innerHTML="";
  frase.split(" ").forEach(p=>{
    const span=document.createElement("span");
    span.textContent=p+" ";
    traducaoEl.appendChild(span);
  });
}

/* ========= INIT ========= */
ativar("aprendiz");

});
