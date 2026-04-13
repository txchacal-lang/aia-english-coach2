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

// === NOVO ===
const btnSalvar  = document.getElementById("btnSalvar");
const btnExcluir = document.getElementById("btnExcluir");
// === FIM NOVO ===

const wrapperFalar  = document.getElementById("wrapperFalar");
const wrapperPlay   = document.getElementById("wrapperPlay");
const wrapperRandom = document.getElementById("wrapperRandom");

// === NOVO ===
const wrapperSalvar  = document.getElementById("wrapperSalvar");
const wrapperExcluir = document.getElementById("wrapperExcluir");
// === FIM NOVO ===

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
// === NOVO ===
const contadorFrasesEl = document.getElementById("contadorFrases");
// === FIM NOVO ===
// === NOVO ===
const listaMinhasFrasesEl = document.getElementById("listaMinhasFrases");
// === FIM NOVO ===
// === NOVO ===
const toggleMinhasFrases = document.getElementById("toggleMinhasFrases");
const boxMinhasFrases = document.getElementById("boxMinhasFrases");
let minhasFrasesAberto = false;
// === FIM NOVO ===
const frasesControls = document.querySelector(".frases-controls");
const correctionArea = document.querySelector(".correction-area");

/* ========= ESTADO ========= */
let modoAtual = "aprendiz";

/* APRENDIZ */
const aprendiz = {
  fraseAlvo:"",
  falada:[],
  etapa:"pt",
  totalNotas:0,
  totalFrases:0,
  palavraEmCorrecao:null
};

/* TRADUTOR */
let ultimaTraducao="";

/* FRASES */
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
/* ========= VOZ ========= */

let vozes = [];

// Função para carregar vozes corretamente
function carregarVozes(){
  vozes = speechSynthesis.getVoices();
}

// Força carregar imediatamente
carregarVozes();

// Garante carregar quando o navegador disponibilizar
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = carregarVozes;
}

function falar(txt, lang){
  if(!txt) return;

  speechSynthesis.cancel();

  // garante que vozes estejam atualizadas
  if(!vozes.length){
    vozes = speechSynthesis.getVoices();
  }

  let voz;

  if(lang === "pt-BR"){

    // tenta Google pt-BR
    voz = vozes.find(v =>
      v.lang === "pt-BR" &&
      v.name.toLowerCase().includes("google")
    )

    // tenta qualquer pt-BR
    || vozes.find(v => v.lang === "pt-BR")

    // tenta qualquer pt
    || vozes.find(v => v.lang.startsWith("pt"));

  } else {

    // tenta Google en-US
    voz = vozes.find(v =>
      v.lang === "en-US" &&
      v.name.toLowerCase().includes("google")
    )

    // tenta qualquer en-US
    || vozes.find(v => v.lang === "en-US")

    // tenta qualquer en
    || vozes.find(v => v.lang.startsWith("en"));

  }

  // Se não achar voz, usa padrão do navegador
  const u = new SpeechSynthesisUtterance(txt);

  if(voz){
    u.voice = voz;
    u.lang = voz.lang;
  }

  u.rate = 0.95;  // velocidade mais natural
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
  // === restaura posição original dos botões ===
if(aiaActionsNext){
  aiaActionsParent.insertBefore(aiaActions, aiaActionsNext);
}else{
  aiaActionsParent.appendChild(aiaActions);
}
  // === reposiciona botões no layout padrão ===
  document.body.classList.remove("modo-frases-layout");

  [btnAprendiz,btnTradutor,btnFrases].forEach(b=>b.classList.remove("active"));

  btnProxima.style.display="none";
  frasesControls.style.display="none";
  statusBox.style.display="none";
  progressWrap.style.display="none";
  correctionArea.style.display="none";
  minhasFrasesSection.style.display="none";

  wrapperFalar.style.display="flex";
  wrapperPlay.style.display="none";
  wrapperRandom.style.display="none";
  wrapperAssistente.style.display = "none";



  // === NOVO ===
  wrapperSalvar.style.display="none";
  wrapperExcluir.style.display="none";
  // === FIM NOVO ===

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

    // === NOVO ===
    wrapperSalvar.style.display="flex";
    // === FIM NOVO ===
  }

  if(m==="frases"){
    btnFrases.classList.add("active");
    wrapperFalar.style.display="none";
    frasesControls.style.display="flex";
    wrapperPlay.style.display="flex";
    wrapperRandom.style.display="flex";
    falarAia("Modo Frases. Apenas escute.");
    carregarFrases();
    minhasFrasesSection.style.display="block";
    document.body.classList.add("modo-frases-layout");

// === move botões para baixo do AIA no modo frases ===
aiaRow.insertAdjacentElement("afterend", aiaActions);

    // === NOVO ===
    wrapperExcluir.style.display="flex";
    // === FIM NOVO ===
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
    aprendiz.etapa="en";
  }
  if(modoAtual==="tradutor"){
    falar(ultimaTraducao,"en-US");
  }
  if(modoAtual==="frases"){
    falar(frases[indice].en,"en-US");
  }
}

// === NOVO ===
btnSalvar.onclick=()=>{

  if(!faladoEl.textContent || !traducaoEl.textContent){
    falarAia("Nada para salvar.");
    return;
  }

  const nova={pt:faladoEl.textContent,en:traducaoEl.textContent};

  let salvas=JSON.parse(localStorage.getItem("frasesSalvas"))||[];

  if(salvas.some(f=>f.pt===nova.pt&&f.en===nova.en)){
    falarAia("Essa frase já foi salva.");
    return;
  }

  salvas.push(nova);
  localStorage.setItem("frasesSalvas",JSON.stringify(salvas));
  falarAia("Frase salva com sucesso!");
// === NOVO ===
atualizarContadorFrases();
// === FIM NOVO ===
};
// === FIM NOVO ===

btnPlay.onclick=()=>{
  if(modoAtual!=="frases") return;
  autoplay=!autoplay;
  btnPlay.textContent=autoplay?"⏸":"▶️";
  if(autoplay) tocar();
}

btnRandom.onclick=()=>{
  if(modoAtual!=="frases") return;
  aleatorio=!aleatorio;
  btnRandom.style.opacity=aleatorio?1:0.5;
}

btnAnterior.onclick=()=>{
  if(modoAtual!=="frases") return;
  indice=(indice-1+frases.length)%frases.length;
  tocar();
}

btnProximaFrase.onclick=()=>{
  if(modoAtual!=="frases") return;
  proxima();
}

btnProxima.onclick=()=>{
  if(modoAtual==="aprendiz"){
    resetAprendiz();
    falarAia("Nova frase. Aperte Falar em português.");
  }
}

// === ASSISTENTE CONTÍNUO ===

btnAssistente.onclick = ()=>{

  assistenteAtivo = !assistenteAtivo;

  if(assistenteAtivo){
    btnAssistente.style.background = "linear-gradient(135deg,#22c55e,#16a34a)";
    falarAia("Assistente ativado. Diga: AiA traduza ...");
    iniciarAssistente();
  }else{
    btnAssistente.style.background = "";
    falarAia("Assistente desativado.");
    if(reconhecimentoAssistente){
      reconhecimentoAssistente.stop();
    }
  }

};

function iniciarAssistente(){

  if(!assistenteAtivo) return;

  reconhecimentoAssistente = criarRec("pt-BR");

  reconhecimentoAssistente.onresult = async e => {

  let texto = "";

  for(let i = e.resultIndex; i < e.results.length; i++){
    if(e.results[i].isFinal){
      texto += e.results[i][0].transcript;
    }
  }

  texto = texto.toLowerCase().trim();

  if(texto.startsWith("traduzir") || texto.startsWith("traduza")){

    texto = texto
      .replace("traduzir","")
      .replace("traduza","")
      .trim();

    if(texto.length > 0){

      faladoEl.textContent = texto;

      const res = await fetch("/traduzir",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({texto})
      });

      const d = await res.json();
      ultimaTraducao = d.traducao;
      traducaoEl.textContent = d.traducao;

      falar(d.traducao,"en-US");
    }
  }

};

  reconhecimentoAssistente.onend = ()=>{
    if(assistenteAtivo){
      iniciarAssistente();
    }
  };

  reconhecimentoAssistente.start();
}
/* ========= APRENDIZ ========= */
function fluxoPt(){
  const r=criarRec("pt-BR");
  r.onresult=async e=>{
    faladoEl.textContent=e.results[0][0].transcript;
    const res=await fetch("/traduzir",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({texto:faladoEl.textContent})});
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

    if(aprendiz.falada[i]===p){
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
  const alvo = aprendiz.palavraEmCorrecao.palavra;
  const span = aprendiz.palavraEmCorrecao.span;

  const r = criarRec("en-US");

  r.onresult = e => {
    const falada = e.results[0][0].transcript.toLowerCase();

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

    // fala no idioma correto
    if(d.idioma === "pt"){
      falar(d.traducao,"en-US");
    }else{
      falar(d.traducao,"pt-BR");
    }

  };

  r.start();

}

/* ========= FRASES ========= */
async function carregarFrases(){
  if(frases.length) return;
  const r=await fetch("/frases.json");
  frases=await r.json();

  // === NOVO ===
  const salvas=JSON.parse(localStorage.getItem("frasesSalvas"))||[];
  frases=[...salvas,...frases];
  // === FIM NOVO ===

  tocar();
}

function tocar(){
  const f=frases[indice];
  faladoEl.textContent=f.pt;
  mostrarPalavrasIngles(f.en);
  speechSynthesis.cancel();

  const uPt=new SpeechSynthesisUtterance(f.pt);
  uPt.lang="pt-BR";
  uPt.rate=0.7;

  uPt.onend=()=>{
    const uEn=new SpeechSynthesisUtterance(f.en);
    uEn.lang="en-US";
    uEn.rate=0.7;

    uEn.onend=()=>{
      if(autoplay) proxima();
    }

    speechSynthesis.speak(uEn);
  }

  speechSynthesis.speak(uPt);
}

function proxima(){
  if(aleatorio){
    indice=Math.floor(Math.random()*frases.length);
  }else{
    indice=(indice+1)%frases.length;
  }
  tocar();
}

// === NOVO ===
btnExcluir.onclick=()=>{

  const salvas=JSON.parse(localStorage.getItem("frasesSalvas"))||[];
  const atual=frases[indice];

  const i=salvas.findIndex(f=>f.pt===atual.pt&&f.en===atual.en);

  if(i===-1){
    falarAia("Essa frase não é salva.");
    return;
  }

  salvas.splice(i,1);
  localStorage.setItem("frasesSalvas",JSON.stringify(salvas));

  frases.splice(indice,1);
  if(indice>=frases.length) indice=0;

  falarAia("Frase excluída.");
// === NOVO ===
atualizarContadorFrases();
// === FIM NOVO ===
  tocar();
};
// === FIM NOVO ===

// === NOVO ===
function atualizarContadorFrases(){
  const salvas = JSON.parse(localStorage.getItem("frasesSalvas")) || [];
  contadorFrasesEl.textContent = "📚 Frases salvas: " + salvas.length;

  atualizarListaMinhasFrases(); // NOVO
}
// === FIM NOVO ===
// === NOVO ===
function atualizarListaMinhasFrases(){

  const salvas = JSON.parse(localStorage.getItem("frasesSalvas")) || [];

  if(salvas.length === 0){
    listaMinhasFrasesEl.innerHTML = "Nenhuma frase salva ainda.";
    return;
  }

  listaMinhasFrasesEl.innerHTML = "";

  salvas.forEach((f,idx)=>{

    const div = document.createElement("div");
    div.style.marginBottom = "10px";

    div.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div><strong>PT:</strong> ${f.pt}</div>
          <div><strong>EN:</strong> ${f.en}</div>
        </div>
        <button data-index="${idx}" 
                style="background:none;border:none;font-size:18px;cursor:pointer;">
          🗑️
        </button>
      </div>
      <hr style="opacity:.2">
    `;

    listaMinhasFrasesEl.appendChild(div);
  });

  // liga os botões excluir
  listaMinhasFrasesEl.querySelectorAll("button").forEach(btn=>{
    btn.onclick = ()=>{
      excluirFraseDaLista(parseInt(btn.dataset.index));
    };
  });

}
// === FIM NOVO ===
// === NOVO ===
toggleMinhasFrases.onclick = ()=>{
  minhasFrasesAberto = !minhasFrasesAberto;

  boxMinhasFrases.style.display = minhasFrasesAberto ? "block" : "none";
  toggleMinhasFrases.textContent = 
    minhasFrasesAberto ? "📂 Minhas Frases ▾" : "📂 Minhas Frases ▸";
};
// === FIM NOVO ===
// === NOVO ===
function excluirFraseDaLista(index){

  let salvas = JSON.parse(localStorage.getItem("frasesSalvas")) || [];

  if(!salvas[index]) return;

  const removida = salvas[index];

  salvas.splice(index,1);
  localStorage.setItem("frasesSalvas", JSON.stringify(salvas));

  // remove também da lista atual do modo Frases (se existir)
  frases = frases.filter(f => !(f.pt === removida.pt && f.en === removida.en));

  if(indice >= frases.length) indice = 0;

  falarAia("Frase removida.");
  atualizarContadorFrases();
  tocar();
}
// === FIM NOVO ===

function mostrarPalavrasIngles(frase){

  traducaoEl.innerHTML = "";

  const palavras = frase.split(" ");

  palavras.forEach(p => {

    const palavraLimpa = p.replace(/[.,!?]/g,"");

    const span = document.createElement("span");
    span.textContent = p + " ";
    span.style.cursor = "pointer";
    span.style.position = "relative";

    span.onclick = async ()=>{

      try{

        const res = await fetch("/traduzir-palavra",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({texto:palavraLimpa})
        });

        const d = await res.json();

        mostrarBalao(span,d.traducao);

      }catch(e){
        console.log("erro tradução palavra");
      }

    };

    traducaoEl.appendChild(span);

  });

}

function mostrarBalao(span,traducao){

  const balao = document.createElement("div");

  balao.textContent = traducao;

  balao.style.position="absolute";
  balao.style.bottom="30px";
  balao.style.left="50%";
  balao.style.transform="translateX(-50%)";
  balao.style.background="#020617";
  balao.style.border="2px solid #22c55e";
  balao.style.padding="6px 12px";
  balao.style.borderRadius="10px";
  balao.style.fontSize="12px";
  balao.style.whiteSpace="nowrap";
  balao.style.zIndex="50";

  span.appendChild(balao);

  setTimeout(()=>{
    balao.remove();
  },2000);

}
/* ========= INIT ========= */
ativar("aprendiz");
// === NOVO ===
atualizarContadorFrases();
// === FIM NOVO ===

});