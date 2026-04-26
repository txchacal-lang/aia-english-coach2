document.addEventListener("DOMContentLoaded",()=>{

/* ========= ELEMENTOS ========= */
const aiaRow = document.querySelector(".aia-row");
const aiaActions = document.querySelector(".aia-actions");
const aiaActionsParent = aiaActions.parentElement;
const aiaActionsNext = aiaActions.nextSibling;

const btnEN = document.getElementById("btnEN");
const btnFR = document.getElementById("btnFR");

const btnAprendiz = document.getElementById("btnAprendiz");
const btnTradutor = document.getElementById("btnTradutor");
const btnFrases   = document.getElementById("btnFrases");
const btnConversar = document.getElementById("btnConversar");

const btnFalar    = document.getElementById("btnFalar");
const btnPlay     = document.getElementById("btnPlay");
const btnRandom   = document.getElementById("btnRandom");
const btnPronuncia= document.getElementById("btnPronuncia");

const btnAssistente = document.getElementById("btnAssistente");
const wrapperAssistente = document.getElementById("wrapperAssistente");
const sectionTitles = document.querySelectorAll(".section-title");


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
const labelIdioma = document.getElementById("labelIdioma");
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
const minhasFrasesSection = document.getElementById("minhasFrasesSection");
// === FIM NOVO ===
// === NOVO ===
const toggleMinhasFrases = document.getElementById("toggleMinhasFrases");
const boxMinhasFrases = document.getElementById("boxMinhasFrases");
let minhasFrasesAberto = false;
// === FIM NOVO ===
const frasesControls = document.querySelector(".frases-controls");
const correctionArea = document.querySelector(".correction-area");

/* ========= ESTADO ========= */
let perguntasDesdeErro = 0;
let perguntasErradas = [];
let perguntasUsadas = [];
let perguntaAtual = null;
let modoAtual = "aprendiz";
let idiomaAtual = "fr"; // teste com francês


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
let frasesFiltradas=[];
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

// Função atualizar label

function atualizarLabelIdioma(){
  if(idiomaAtual === "en") labelIdioma.textContent = "Inglês";
  if(idiomaAtual === "fr") labelIdioma.textContent = "Francês";
}

// Função atualizar Botões

function atualizarBotoesIdioma(){

  btnEN.classList.remove("active");
  btnFR.classList.remove("active");

  if(idiomaAtual === "en"){
    btnEN.classList.add("active");
  }

  if(idiomaAtual === "fr"){
    btnFR.classList.add("active");
  }
}

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

function getLangCode(){
  if(idiomaAtual === "en") return "en-US";
  if(idiomaAtual === "fr") return "fr-FR";
  return "en-US";
}

function falar(txt, lang){
  if(!txt) return;

  speechSynthesis.cancel();

  if(!vozes.length){
    vozes = speechSynthesis.getVoices();
  }

  let voz;

  if(lang === "pt-BR"){
    voz = vozes.find(v => v.lang === "pt-BR")
        || vozes.find(v => v.lang.startsWith("pt"));
  }

  else if(lang === "fr-FR"){
    voz = vozes.find(v => v.lang === "fr-FR")
        || vozes.find(v => v.lang.startsWith("fr"));
  }

  else if(lang === "en-US"){
    voz = vozes.find(v => v.lang === "en-US")
        || vozes.find(v => v.lang.startsWith("en"));
  }

  const u = new SpeechSynthesisUtterance(txt);

  if(voz){
    u.voice = voz;
    u.lang = voz.lang;
  }else{
    u.lang = lang;
  }

  u.rate = 0.75;
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
btnConversar.onclick=()=>ativar("conversar");

// 👇 NOVO
btnEN.onclick = ()=>{
  idiomaAtual = "en";
  atualizarLabelIdioma();
  atualizarBotoesIdioma();
};

btnFR.onclick = ()=>{
  idiomaAtual = "fr";
  atualizarLabelIdioma();
  atualizarBotoesIdioma();
};

function ativar(m){
  modoAtual=m;
// restaura padrão
sectionTitles[0].textContent = "Português";
labelIdioma.textContent = idiomaAtual === "en" ? "Inglês" : "Francês";
  // === restaura posição original dos botões ===
if(aiaActionsNext){
  aiaActionsParent.insertBefore(aiaActions, aiaActionsNext);
}else{
  aiaActionsParent.appendChild(aiaActions);
}
  // === reposiciona botões no layout padrão ===
  document.body.classList.remove("modo-frases-layout");

  [btnAprendiz,btnTradutor,btnFrases,btnConversar].forEach(b=>b.classList.remove("active"));

  btnProxima.style.display="none";
  frasesControls.style.display="none";
  statusBox.style.display="none";
  progressWrap.style.display="none";
  correctionArea.style.display="none";
  if(minhasFrasesSection){
  minhasFrasesSection.style.display="none";
}

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

    if(minhasFrasesSection){
      minhasFrasesSection.style.display="block";
    }

    document.body.classList.add("modo-frases-layout");

    // === move botões para baixo do AIA no modo frases ===
    aiaRow.insertAdjacentElement("afterend", aiaActions);

    wrapperExcluir.style.display="flex";
  }

  if(m==="conversar"){
    btnConversar.classList.add("active");

    wrapperFalar.style.display = "flex";
    wrapperPlay.style.display = "none";
    wrapperRandom.style.display = "none";
    wrapperSalvar.style.display = "none";
    wrapperExcluir.style.display = "none";
    wrapperAssistente.style.display = "none";

    frasesControls.style.display = "none";
    statusBox.style.display = "none";
    progressWrap.style.display = "none";
    correctionArea.style.display = "block";

    falarAia("Modo Conversar. Eu vou fazer uma pergunta e você responde.");
    faladoEl.textContent = "";
    traducaoEl.textContent = "";
    feedbackEl.textContent = "Em breve: conversa por nível e assunto.";
    iniciarConversa();
    
    // troca títulos para modo conversa
sectionTitles[0].textContent = "Pergunta";
labelIdioma.textContent = "Resposta";
  }
}
/* ========= BOTÕES ========= */
let recognitionAtual = null;
let gravando = false;

// INICIAR GRAVAÇÃO
function iniciarGravacao(){

  if(gravando) return;

  gravando = true;

  btnFalar.style.background = "#ef4444"; // 🔴 feedback visual
  btnFalar.textContent = "🎤 Gravando...";

  let lang;

if(modoAtual === "aprendiz" && aprendiz.etapa !== "pt"){
  lang = getLangCode();
}
else if(modoAtual === "conversar"){
  lang = getLangCode(); // 👈 ESSENCIAL
}
else{
  lang = "pt-BR";
}

  recognitionAtual = criarRec(lang);

  let textoFinal = "";

  recognitionAtual.onresult = e => {
    for(let i = e.resultIndex; i < e.results.length; i++){
      if(e.results[i].isFinal){
        textoFinal += e.results[i][0].transcript + " ";
      }
    }
  };

  recognitionAtual.onend = async () => {

    gravando = false;

    btnFalar.style.background = ""; 
    btnFalar.innerHTML = "🎤";

    textoFinal = textoFinal.trim();

    if(!textoFinal) return;

// ===== CONVERSAR =====
if(modoAtual === "conversar"){

  traducaoEl.textContent = textoFinal;

  if(!perguntaAtual){
    falarAia("Erro na pergunta.");
    return;
  }

  const texto = textoFinal.toLowerCase();

  // 🔥 pega respostas do JSON
  const respostasValidas = perguntaAtual.respostasAceitas[idiomaAtual] 
    || perguntaAtual.respostasAceitas.en;

  const acertou = respostasValidas.some(r => texto.includes(r));

if(acertou){

  perguntasDesdeErro++;

  perguntasErradas = perguntasErradas.filter(id => id !== perguntaAtual.id);

  feedbackEl.textContent = "✅ Boa! Resposta correta.";
  falarAia("Muito bem!");

  // 🔥 NOVO: próxima pergunta automática
  setTimeout(()=>{
    iniciarConversa();
  }, 1500);

}else{

  const exemplo = respostasValidas[0];

  feedbackEl.innerHTML = `
    ❌ Quase!<br><br>

    Sua resposta:<br>
    <span style="color:#ef4444">${textoFinal}</span><br><br>

    Melhor forma:<br>
    <strong>${exemplo}...</strong><br><br>

    🔊 Toque em <strong>Pronúncia</strong> para ouvir e repetir
  `;

  // 🔥 ESSA LINHA ESTAVA FALTANDO
  if(perguntaAtual && !perguntasErradas.includes(perguntaAtual.id)){
    perguntasErradas.push(perguntaAtual.id);
  }

  falarAia("Toque em pronúncia e repita.");

  return;
}
}
    // ===== APRENDIZ =====
    if(modoAtual === "aprendiz"){

      if(aprendiz.palavraEmCorrecao){
        const alvo = aprendiz.palavraEmCorrecao.palavra;

        if(textoFinal.toLowerCase() === alvo){
          aprendiz.palavraEmCorrecao.span.className="corrigido";
          aprendiz.palavraEmCorrecao.span.onclick=null;
          falarAia("Boa! Palavra corrigida.");
          aprendiz.palavraEmCorrecao=null;
        }else{
          falarAia("Quase! Tente novamente.");
        }

        return;
      }

      if(aprendiz.etapa === "pt"){

        faladoEl.textContent = textoFinal;

        const res = await fetch("/traduzir",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({
          texto: textoFinal,
          idioma: idiomaAtual
        })
        });

        const d = await res.json();

        aprendiz.fraseAlvo = d.traducao;
        mostrarPalavrasIngles(d.traducao);

        falarAia("Clique em Pronúncia para ouvir a tradução. Depois aperte Falar e repita.");

      } else {

        aprendiz.falada = textoFinal.toLowerCase().split(" ");
        corrigir();

      }

    }

    // ===== TRADUTOR =====
        if(modoAtual === "tradutor"){

      faladoEl.textContent = textoFinal;

      const res = await fetch("/traduzir",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
  texto: textoFinal,
  idioma: idiomaAtual
})
      });

      const d = await res.json();

      ultimaTraducao = d.traducao;
      mostrarPalavrasIngles(d.traducao);

      if(d.idioma === "pt"){
  falar(d.traducao, getLangCode());
}else{
  falar(d.traducao,"pt-BR");
}
    }

  };

  recognitionAtual.start();
}

// PARAR GRAVAÇÃO
function pararGravacao(){
  if(recognitionAtual && gravando){
    recognitionAtual.stop();
  }
}

// EVENTOS (PC + CELULAR)
btnFalar.addEventListener("mousedown", iniciarGravacao);
btnFalar.addEventListener("mouseup", pararGravacao);

btnFalar.addEventListener("touchstart", iniciarGravacao);
btnFalar.addEventListener("touchend", pararGravacao);

btnPronuncia.onclick=()=>{
if(modoAtual==="conversar" && perguntaAtual){

  const exemplo = perguntaAtual.respostasAceitas[idiomaAtual]?.[0]
    || perguntaAtual.respostasAceitas.en[0];

  falar(exemplo, getLangCode());
}
  if(modoAtual==="aprendiz"){
    const lang = getLangCode();
falar(aprendiz.fraseAlvo, lang);
aprendiz.etapa = idiomaAtual;
  }
  if(modoAtual==="tradutor"){
  falar(ultimaTraducao, getLangCode());
}
  if(modoAtual==="frases"){
  falar(frases[indice][idiomaAtual], getLangCode());
 }
}

// === NOVO ===
btnSalvar.onclick = async ()=>{

  if(!faladoEl.textContent || !traducaoEl.textContent){
    falarAia("Nada para salvar.");
    return;
  }

  const pt = faladoEl.textContent;

  let en = "";
  let fr = "";

  try{

    // traduz para inglês
    let resEN = await fetch("/traduzir",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ texto: pt, idioma: "en" })
    });

    let dEN = await resEN.json();
    en = dEN.traducao;

    // traduz para francês
    let resFR = await fetch("/traduzir",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ texto: pt, idioma: "fr" })
    });

    let dFR = await resFR.json();
    fr = dFR.traducao;

  }catch(e){
    falarAia("Erro ao salvar frase.");
    return;
  }

  const nova = { pt, en, fr };

  let salvas = JSON.parse(localStorage.getItem("frasesSalvas")) || [];

  if(salvas.some(f => f.pt === pt)){
    falarAia("Essa frase já foi salva.");
    return;
  }

  salvas.push(nova);
  localStorage.setItem("frasesSalvas", JSON.stringify(salvas));

  falarAia("Frase salva com sucesso!");

  atualizarContadorFrases();
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
  if(modoAtual!=="frases" || !frases.length) return;
  indice=(indice-1+frases.length)%frases.length;
  tocar();
}

btnProximaFrase.onclick=()=>{
  if(modoAtual!=="frases" || !frases.length) return;
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

    const falada = aprendiz.falada[i] || "";

// normaliza (remove pontuação e deixa minúsculo)
const alvoLimpo = p.toLowerCase().replace(/[.,!?]/g,"");
const faladaLimpa = falada.toLowerCase().replace(/[.,!?]/g,"");

// aceita pequenas variações
const correto = 
  faladaLimpa === alvoLimpo ||                     // igual
  faladaLimpa.includes(alvoLimpo) ||               // falou maior ("going" vs "go")
  alvoLimpo.includes(faladaLimpa) ||               // falou menor ("go" vs "going")
  similaridade(faladaLimpa, alvoLimpo) > 0.7;     // parecido

if(correto){
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

function similaridade(a, b){

  if(!a || !b) return 0;

  let iguais = 0;
  const min = Math.min(a.length, b.length);

  for(let i=0;i<min;i++){
    if(a[i] === b[i]) iguais++;
  }

  return iguais / Math.max(a.length, b.length);
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
      body: JSON.stringify({
      texto: textoFinal,
      idioma: idiomaAtual
    })
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

  if(frases.length){
  tocar();
  return;
}

  try{
  const r = await fetch("/frases.json");
  frases = await r.json();
}catch(e){
  console.log("Erro ao carregar frases.json");
}
  const salvas = JSON.parse(localStorage.getItem("frasesSalvas")) || [];
  frases = [...salvas, ...frases];

  if(frases.length === 0){
    falarAia("Nenhuma frase disponível.");
    return;
  }

frases = frases.filter(f => !f.tipo || f.tipo === "frase");

frasesFiltradas = [...frases];
indice = 0;
tocar();
}

function tocar(){

  if(!frases.length){
    falarAia("Sem frases para tocar.");
    return;
  }

 const f = frasesFiltradas[indice];

  if(!f){
    falarAia("Erro ao carregar frase.");
    return;
  }

  faladoEl.textContent = f.pt;
  const traducao = f[idiomaAtual] || f.en;

mostrarPalavras(traducao);

  speechSynthesis.cancel();

  const uPt = new SpeechSynthesisUtterance(f.pt);
  uPt.lang = "pt-BR";
  uPt.rate = 1.2;

uPt.onend = ()=>{

  setTimeout(()=>{

    const textoTraduzido = f[idiomaAtual] || f.en;

    // 🔊 1ª fala (normal)
    const uLang1 = new SpeechSynthesisUtterance(textoTraduzido);
    uLang1.lang = getLangCode();
    uLang1.rate = 0.6;

    uLang1.onend = ()=>{

      // 🔊 2ª fala (mais lenta)
      setTimeout(()=>{

        const uLang2 = new SpeechSynthesisUtterance(textoTraduzido);
        uLang2.lang = getLangCode();
        uLang2.rate = 0.35;

        uLang2.onend = ()=>{

          // ⏱️ pausa maior antes da próxima
          if(autoplay){
            setTimeout(()=>{
              proxima();
            }, 1800);
          }

        };

        speechSynthesis.speak(uLang2);

      }, 500); // pequena pausa entre repetições
    };

    speechSynthesis.speak(uLang1);

  }, 550); // pausa após português
};
  speechSynthesis.speak(uPt);
}

function aplicarFiltros(){

  const nivel = document.getElementById("filtroNivel").value;
  const categoria = document.getElementById("filtroCategoria").value;

frasesFiltradas = frases.filter(f => {

  const okTipo = !f.tipo || f.tipo === "frase";
  const okNivel = !nivel || f.nivel === nivel;
  const okCategoria = !categoria || f.categoria === categoria;

  return okTipo && okNivel && okCategoria;
});

  indice = 0;

  if(frasesFiltradas.length){
    tocar();
  }else{
    falarAia("Nenhuma frase encontrada.");
  }
}

function proxima(){

  if(!frases.length){
    falarAia("Sem frases.");
    return;
  }

  if(aleatorio){
    indice = Math.floor(Math.random() * frasesFiltradas.length);
  }else{
    indice = (indice + 1) % frasesFiltradas.length;
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

function mostrarPalavras(frase){

  traducaoEl.innerHTML = "";

  const palavras = frase.split(" ");

  palavras.forEach(p => {

    const span = document.createElement("span");
    span.textContent = p + " ";
    span.style.cursor = "default"; // sem clique

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
/* ========= CONVERSA ========= */
async function iniciarConversa(){

  let banco = [];

  try{
    const r = await fetch("/frases.json");
    banco = await r.json();
  }catch(e){
    falarAia("Erro ao carregar perguntas.");
    return;
  }

const nivel = document.getElementById("filtroNivel").value;
const categoria = document.getElementById("filtroCategoria").value;

let perguntas = banco.filter(f => {

  const okTipo = f.tipo === "conversa";
  const okNivel = !nivel || f.nivel === nivel;
  const okCategoria = !categoria || f.categoria === categoria;

  return okTipo && okNivel && okCategoria;
});

if(perguntas.length === 0){
  falarAia("Nenhuma pergunta disponível.");
  return;
}

// 🔥 remove perguntas já usadas
let pool = perguntas.filter(p => !perguntasUsadas.includes(p.id));

// 🔁 se acabou todas → reset
if(pool.length === 0){
  perguntasUsadas = [];
  pool = perguntas;
}

const erradasDisponiveis = perguntas.filter(p => perguntasErradas.includes(p.id));

if(erradasDisponiveis.length > 0 && perguntasDesdeErro >= 2){
  pool = erradasDisponiveis;
  perguntasDesdeErro = 0;
}

// 🎯 sorteia
perguntaAtual = pool[Math.floor(Math.random() * pool.length)];

// marca como usada
perguntasUsadas.push(perguntaAtual.id);

  const texto = perguntaAtual.pergunta[idiomaAtual] || perguntaAtual.pergunta.en;

  falarAia("Responda:");
  faladoEl.textContent = texto;
  traducaoEl.textContent = "";
  feedbackEl.textContent = "";

  falar(texto, getLangCode());
}
/* ========= INIT ========= */
ativar("aprendiz");
// === NOVO ===
atualizarContadorFrases();
atualizarLabelIdioma();
atualizarBotoesIdioma();
document.getElementById("filtroNivel").onchange = aplicarFiltros;
document.getElementById("filtroCategoria").onchange = aplicarFiltros;
// === FIM NOVO ===


});
