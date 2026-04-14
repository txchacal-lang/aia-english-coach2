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
const wrapperAssistente = document.getElementById("wrapperAssistente");

const btnSalvar  = document.getElementById("btnSalvar");
const btnExcluir = document.getElementById("btnExcluir");

const wrapperFalar  = document.getElementById("wrapperFalar");
const wrapperPlay   = document.getElementById("wrapperPlay");
const wrapperRandom = document.getElementById("wrapperRandom");

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
const statusBox = document.getElementById("statusBox");
const progressWrap = document.getElementById("progressWrap");

const contadorFrasesEl = document.getElementById("contadorFrases");
const listaMinhasFrasesEl = document.getElementById("listaMinhasFrases");

const toggleMinhasFrases = document.getElementById("toggleMinhasFrases");
const boxMinhasFrases = document.getElementById("boxMinhasFrases");

let minhasFrasesAberto = false;

const frasesControls = document.querySelector(".frases-controls");
const correctionArea = document.querySelector(".correction-area");

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
    voz =
      vozes.find(v => v.lang === "pt-BR" && v.name.toLowerCase().includes("google"))
      || vozes.find(v => v.lang === "pt-BR")
      || vozes.find(v => v.lang.startsWith("pt"));
  } else {
    voz =
      vozes.find(v => v.lang === "en-US" && v.name.toLowerCase().includes("google"))
      || vozes.find(v => v.lang === "en-US")
      || vozes.find(v => v.lang.startsWith("en"));
  }

  const u = new SpeechSynthesisUtterance(txt);

  if(voz){
    u.voice = voz;
    u.lang = voz.lang;
  }

  // 🔥 velocidade inteligente
  u.rate = modoAtual === "aprendiz" ? 0.75 : 0.95;
  u.pitch = 1;

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
  }else{
    aiaActionsParent.appendChild(aiaActions);
  }

  document.body.classList.remove("modo-frases-layout");

  [btnAprendiz,btnTradutor,btnFrases].forEach(b=>b.classList.remove("active"));

  btnProxima.style.display="none";
  frasesControls.style.display="none";
  statusBox.style.display="none";
  progressWrap.style.display="none";
  correctionArea.style.display="none";

  wrapperFalar.style.display="flex";
  wrapperPlay.style.display="none";
  wrapperRandom.style.display="none";
  wrapperAssistente.style.display = "none";

  wrapperSalvar.style.display="none";
  wrapperExcluir.style.display="none";

  if(m==="aprendiz"){
    btnAprendiz.classList.add("active");
    btnProxima.style.display="block";
    statusBox.style.display="flex";
    progressWrap.style.display="block";
    correctionArea.style.display="block";
    falarAia("Aperte Falar e diga uma frase em português.");
  }

  if(m==="tradutor"){
    btnTradutor.classList.add("active");
    falarAia("Aperte Falar que eu traduzo para você.");
    wrapperAssistente.style.display = "flex";
    wrapperSalvar.style.display="flex";
  }

  if(m==="frases"){
    btnFrases.classList.add("active");
    wrapperFalar.style.display="none";
    frasesControls.style.display="flex";
    wrapperPlay.style.display="flex";
    wrapperRandom.style.display="flex";
    falarAia("Modo Frases. Apenas escute.");
    carregarFrases();
    document.body.classList.add("modo-frases-layout");
    aiaRow.insertAdjacentElement("afterend", aiaActions);
    wrapperExcluir.style.display="flex";
  }
}

/* ========= BOTÕES ========= */
btnFalar.onclick=()=>{
  if(modoAtual==="aprendiz"){

    if(aprendiz.palavraEmCorrecao){
      corrigirPalavraIsolada();
      return;
    }

    aprendiz.etapa==="pt"?fluxoPt():fluxoEn();
  }

  if(modoAtual==="tradutor") fluxoTradutor();
}

btnPronuncia.onclick=()=>{
  if(modoAtual==="aprendiz"){
    falar(aprendiz.fraseAlvo,"en-US");

    // 🔥 ESSENCIAL
    aprendiz.etapa="en";
    aprendiz.falada=[];
  }
  if(modoAtual==="tradutor"){
    falar(ultimaTraducao,"en-US");
  }
  if(modoAtual==="frases"){
    falar(frases[indice].en,"en-US");
  }
}

/* ========= APRENDIZ ========= */
function fluxoPt(){
  const r=criarRec("pt-BR");
  r.onresult=async e=>{
    faladoEl.textContent=e.results[0][0].transcript;

    const res=await fetch("/traduzir",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({texto:faladoEl.textContent})
    });

    const d=await res.json();

    aprendiz.fraseAlvo=d.traducao;
    mostrarPalavrasIngles(d.traducao);
    falarAia("Clique em Pronúncia para ouvir em inglês.");
  }
  r.start();
}

function fluxoEn(){
  const r=criarRec("en-US");
  r.onresult=e=>{
    aprendiz.falada=e.results[0][0].transcript.toLowerCase().split(" ");
    corrigir();
  }
  r.start();
}

function corrigir(){
  feedbackEl.innerHTML="";
  const alvo=aprendiz.fraseAlvo.toLowerCase().split(" ");
  let acertos=0;

  alvo.forEach((p,i)=>{
    const s=document.createElement("span");
    s.textContent=p+" ";

    const falada = aprendiz.falada[i];

    if(
      falada === p ||
      (falada && p.includes(falada)) ||
      (falada && falada.includes(p))
    ){
      s.className="corrigido";
      acertos++;
    }else{
      s.className="errado";
      s.onclick=()=>{
        aprendiz.palavraEmCorrecao={palavra:p,span:s};
        falar(p,"en-US");
        falarAia("Repita somente esta palavra.");
      }
    }

    feedbackEl.appendChild(s);
  });

  const nota=Math.round((acertos/alvo.length)*100);
  aprendiz.totalNotas+=nota;
  aprendiz.totalFrases++;
  notaEl.textContent=nota;
  mediaEl.textContent=Math.round(aprendiz.totalNotas/aprendiz.totalFrases);
  progressBar.style.width=nota+"%";
}

function corrigirPalavraIsolada(){
  const alvo = aprendiz.palavraEmCorrecao.palavra.toLowerCase().replace(/[.,!?]/g,"");
  const span = aprendiz.palavraEmCorrecao.span;

  const r = criarRec("en-US");

  r.onresult = e => {
    const falada = e.results[0][0].transcript.toLowerCase().replace(/[.,!?]/g,"").trim();

    if(falada === alvo){
      span.className="corrigido";
      span.onclick=null;
      falarAia("Boa! Palavra corrigida.");
      aprendiz.palavraEmCorrecao=null;
    }else{
      falarAia("Quase! Tente novamente.");
    }
  };

  r.start();
}

function resetAprendiz(){
  aprendiz.fraseAlvo="";
  aprendiz.falada=[];
  aprendiz.etapa="pt";
  aprendiz.palavraEmCorrecao=null;

  faladoEl.textContent="";
  traducaoEl.textContent="";
  feedbackEl.innerHTML="";
  notaEl.textContent="-";
}

/* ========= INIT ========= */
ativar("aprendiz");

});
