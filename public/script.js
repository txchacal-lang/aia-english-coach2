document.addEventListener("DOMContentLoaded",()=>{

/* ========= ELEMENTOS ========= */
const tituloModo = document.getElementById("tituloModo");
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
const wrapperIda = document.getElementById("wrapperIda");
const wrapperVolta = document.getElementById("wrapperVolta");

const btnIda = document.getElementById("btnIda");
const btnVolta = document.getElementById("btnVolta");

const txtIda = document.getElementById("txtIda");
const txtVolta = document.getElementById("txtVolta");

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
const tituloCorrecao = document.getElementById("tituloCorrecao");
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

const controlesConversa = document.getElementById("controlesConversa");
const btnModoResponder = document.getElementById("btnModoResponder");
const btnModoPerguntar = document.getElementById("btnModoPerguntar");

const tituloPerguntaResposta = document.getElementById("tituloPerguntaResposta");

const contadorEstudo = document.getElementById("contadorEstudo");

const contadorAprendidos =
  document.getElementById("contadorAprendidos");

// === LÓGICA JS (CONTROLE DE TELA) ===

const telaIdioma = document.getElementById("telaIdioma");
const telaModos = document.getElementById("telaModos");
const telaApp = document.getElementById("telaApp");

let telaAtual = "idioma";

// === BOTÃO Ajuda ===

const btnAjuda = document.getElementById("btnAjuda");
const modalAjuda = document.getElementById("modalAjuda");
const fecharAjuda = document.getElementById("fecharAjuda");
const tituloAjuda = document.getElementById("tituloAjuda");
const textoAjuda = document.getElementById("textoAjuda");
const btnJaSei = document.getElementById("btnJaSei");

// === BOTÃO VOLTAR ===

const btnVoltarModos = document.getElementById("btnVoltarModos");
const btnVoltarApp = document.getElementById("btnVoltarApp");

btnVoltarModos.onclick = ()=>{
  trocarTela("idioma");
};

btnVoltarApp.onclick = ()=>{
  trocarTela("modos");
};

const clickSound = new Audio("audio/click.mp3");
clickSound.volume = 0.25;

function tocarClique(){
  clickSound.currentTime = 0;
  clickSound.play().catch(()=>{});
}

document.querySelectorAll("button, select").forEach(el=>{
  el.addEventListener("click", tocarClique);
  el.addEventListener("change", tocarClique);
});

// === AÇÕES ===

// === Escolher idioma ===

escolherEN.onclick = ()=>{
  idiomaAtual = "en";
  atualizarLabelIdioma();
  atualizarBotoesIdioma();
  trocarTela("modos");
};

escolherFR.onclick = ()=>{
  idiomaAtual = "fr";
  atualizarLabelIdioma();
  atualizarBotoesIdioma();
  trocarTela("modos");
};
// === Escolher modo ===

modoTradutor.onclick = ()=>{
  trocarTela("app");
  ativar("tradutor");
};

modoFrases.onclick = ()=>{
  trocarTela("app");
  ativar("frases");
};

modoAprendiz.onclick = ()=>{
  trocarTela("app");
  ativar("aprendiz");
};

modoConversar.onclick = ()=>{
  trocarTela("app");
  ativar("conversar");
};

// === AÇÕES ===


/* ========= ESTADO ========= */
let modoConversaTipo = "responder"; // ou "perguntar"
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
let direcaoTraducao = "ida";

/* FRASES */
let frases=[];
let frasesFiltradas=[];
let indice=0;
let autoplay=false;
let aleatorio=false;
let frasesAleatoriasUsadas = [];
let verbosAleatoriosUsados = [];

let assistenteAtivo = false;

let reconhecimentoAssistente = null;

let palavras = [];
let expressoes = [];
let indicePalavra = 0;

let palavrasJaSei =
  JSON.parse(localStorage.getItem("palavrasJaSei")) || [];

let palavrasAleatoriasUsadas = [];

let verbos = [];
let indiceVerbo = 0;
let verbosJaSei =
  JSON.parse(localStorage.getItem("verbosJaSei")) || [];
let frasesJaSei =
  JSON.parse(localStorage.getItem("frasesJaSei")) || [];

/* ========= SPEECH ========= */
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function criarRec(lang){
  const r = new SpeechRecognition();
  r.lang = lang;
  r.interimResults = true;
  return r;
}


/* ========= FUNÇÃO DE TROCA ========= */

function trocarTela(tela){

  telaIdioma.style.display = "none";
  telaModos.style.display = "none";
  telaApp.style.display = "none";

  if(tela === "idioma"){
    telaIdioma.style.display = "block";
  }

if(tela === "modos"){
  telaModos.style.display = "block";
}

  if(tela === "app"){
    telaApp.style.display = "block";
  }

  telaAtual = tela;
}

/* ========= VOZ ========= */

let vozes = [];

// Função atualizar label

function atualizarLabelIdioma(){

  if(idiomaAtual === "en"){
    labelIdioma.textContent = "Inglês";

    txtIda.textContent = "PT → EN";
    txtVolta.textContent = "EN → PT";
  }

  if(idiomaAtual === "fr"){
    labelIdioma.textContent = "Francês";

    txtIda.textContent = "PT → FR";
    txtVolta.textContent = "FR → PT";
  }

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

function falar(txt, lang, rate = 0.68){
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

 u.rate = rate;
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

const seletorConversa = document.getElementById("seletorConversa");

seletorConversa.onchange = ()=>{
  modoConversaTipo = seletorConversa.value;

  if(modoConversaTipo === "responder"){
    falarAia("Modo Responder. Eu pergunto e você responde.");
  }

  if(modoConversaTipo === "perguntar"){
    falarAia("Me faça a pergunta e ouça a resposta.");
  }

  iniciarConversa();
};

const seletorEstudo = document.getElementById("seletorEstudo");

let tipoEstudo = "frases";

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
btnPronuncia.style.display = "flex";
document.body.classList.remove(
  "modo-tradutor",
  "modo-frases",
  "modo-aprendiz",
  "modo-conversar"
);

function iniciarTraducaoDireta(direcao){

  direcaoTraducao = direcao;
 
  faladoEl.textContent = "";
  traducaoEl.textContent = "";

  const langEscuta = direcao === "ida" ? "pt" : getLangCode();
  const idiomaDestino = direcao === "ida"
  ? idiomaAtual
  : "pt";

  falarAia(direcao === "ida" ? "Fale em português." : "O nativo pode falar.");

  const rec = criarRec(langEscuta);

  let textoFinal = "";

  rec.onresult = e => {
    for(let i = e.resultIndex; i < e.results.length; i++){
      if(e.results[i].isFinal){
        textoFinal += e.results[i][0].transcript + " ";
      }
    }
  };

  rec.onend = async ()=>{

    textoFinal = textoFinal.trim();
    if(!textoFinal) return;

    if(direcao === "ida"){
  faladoEl.textContent = textoFinal;
}else{
  traducaoEl.textContent = textoFinal;
}

    const res = await fetch("/traduzir",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
body:JSON.stringify({
  texto: textoFinal,

  origem:
    direcao === "ida"
      ? "pt"
      : idiomaAtual,

  destino:
    direcao === "ida"
      ? idiomaAtual
      : "pt",

  modo:"tradutor"
})
    });

    const d = await res.json();

    ultimaTraducao = d.traducao;
    if(direcao === "ida"){
  traducaoEl.textContent = d.traducao;
}else{
  faladoEl.textContent = d.traducao;
}

    falar(
      d.traducao,
      direcao === "ida" ? getLangCode() : "pt",
      0.68
    );
  };

  recognitionAtual = rec;
rec.start();
}

btnIda.addEventListener("mousedown", ()=>{

  if(navigator.vibrate){
  navigator.vibrate(40);
}

  btnIda.style.background = "linear-gradient(135deg,#22c55e,#16a34a)";
  btnVolta.style.background = "";
  iniciarTraducaoDireta("ida");
});

btnIda.addEventListener("mouseup", ()=>{
  pararGravacao();
  btnIda.style.background = "";
});

btnIda.addEventListener("touchstart", ()=>{
  btnIda.style.background = "linear-gradient(135deg,#22c55e,#16a34a)";
  btnVolta.style.background = "";
  iniciarTraducaoDireta("ida");
});

btnIda.addEventListener("touchend", ()=>{
  pararGravacao();
  btnIda.style.background = "";
});

btnVolta.addEventListener("mousedown", ()=>{

  if(navigator.vibrate){
  navigator.vibrate(40);
}

  btnVolta.style.background = "linear-gradient(135deg,#2563eb,#1d4ed8)";
  btnIda.style.background = "";
  iniciarTraducaoDireta("volta");
});

btnVolta.addEventListener("mouseup", ()=>{

  setTimeout(()=>{
    pararGravacao();
  }, 700);
  btnVolta.style.background = "";
});

btnVolta.addEventListener("touchstart", ()=>{
  btnVolta.style.background = "linear-gradient(135deg,#2563eb,#1d4ed8)";
  btnIda.style.background = "";
  iniciarTraducaoDireta("volta");
});

btnVolta.addEventListener("touchend", ()=>{

  setTimeout(()=>{
    pararGravacao();
  }, 700);

  btnVolta.style.background = "";
});

if(m === "tradutor") document.body.classList.add("modo-tradutor");
if(m === "frases") document.body.classList.add("modo-frases");
if(m === "aprendiz") document.body.classList.add("modo-aprendiz");
if(m === "conversar") document.body.classList.add("modo-conversar");

if(m==="tradutor") tituloModo.textContent = "TRADUZIR";
if(m==="frases") tituloModo.textContent = "ESTUDAR";
if(m==="aprendiz") tituloModo.textContent = "PRATICAR";
if(m==="conversar") tituloModo.textContent = "CONVERSAR";

controlesConversa.style.display = "none";

document.querySelector(".mode-row").style.display = "none";
document.querySelector(".language-selector").style.display = "none";

 // === TELA ATUAL ===
trocarTela("app");

// restaura padrão
tituloPerguntaResposta.textContent = "Português";
labelIdioma.textContent = idiomaAtual === "en" ? "Inglês" : "Francês";
tituloCorrecao.textContent = "Correção";
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
wrapperIda.style.display = "none";
wrapperVolta.style.display = "none";



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
    falarAia("Escolha a direção da tradução.");
  }

if(m==="tradutor"){
  btnTradutor.classList.add("active");
  falarAia("Escolha a direção da tradução e segure para falar.");

wrapperFalar.style.display = "none";
  wrapperAssistente.style.display = "flex";
wrapperIda.style.display = "flex";
wrapperVolta.style.display = "flex";
wrapperSalvar.style.display = "flex";

  if(minhasFrasesSection){
    minhasFrasesSection.style.display = "block";
  }

  atualizarContadorFrases();
}

  if(m==="frases"){
    btnPronuncia.style.display = "none";
    btnFrases.classList.add("active");
    wrapperFalar.style.display="none";
    frasesControls.style.display="flex";
    wrapperPlay.style.display="flex";
    wrapperRandom.style.display="flex";
    falarAia("Aperte PLAY e escute as frases.");
    carregarFrases();

    if(minhasFrasesSection){
      minhasFrasesSection.style.display="block";
    }

    document.body.classList.add("modo-frases-layout");

    // === move botões para baixo do AIA no modo frases ===
    //aiaRow.insertAdjacentElement("afterend", aiaActions);===

    wrapperExcluir.style.display="flex";
  }

  if(m==="conversar"){
    btnConversar.classList.add("active");
    btnProxima.style.display = "block";

    tituloCorrecao.textContent = "Correção";
    
    controlesConversa.style.display = "flex";
  

    wrapperFalar.style.display = "flex";
    wrapperPlay.style.display = "none";
    wrapperRandom.style.display = "none";
    wrapperSalvar.style.display = "none";
    wrapperExcluir.style.display = "none";
    wrapperAssistente.style.display = "none";
    wrapperIda.style.display = "none";
    wrapperVolta.style.display = "none";

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
tituloPerguntaResposta.textContent = "Pergunta";
labelIdioma.textContent = "Resposta";
tituloCorrecao.textContent = "Correção";
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

else if(modoAtual === "tradutor"){

  lang =
    direcaoTraducao === "ida"
      ? "pt-BR"
      : getLangCode();

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

if(modoConversaTipo === "perguntar"){

  traducaoEl.textContent = textoFinal;

  const perguntaCorreta = perguntaAtual.pergunta[idiomaAtual] 
    || perguntaAtual.pergunta.en;

  const falou = textoFinal.toLowerCase();
  const alvo = perguntaCorreta.toLowerCase();

const palavrasFaladas = falou.split(" ");
const palavrasAlvo = alvo.split(" ");

let acertos = 0;

palavrasAlvo.forEach(palavra => {

  const encontrou = palavrasFaladas.some(falada => {

    return (
      falada === palavra ||
      falada.includes(palavra) ||
      palavra.includes(falada) ||
      similaridade(falada, palavra) > 0.72
    );

  });

  if(encontrou) acertos++;

});

const percentual = acertos / palavrasAlvo.length;

const correto = percentual >= 0.65;

  if(correto){

  const modelo =
    perguntaAtual.respostaModelo?.[idiomaAtual] ||
    perguntaAtual.respostaModelo?.en ||
    "";

  feedbackEl.textContent = "✅ Boa! Pergunta correta.";
  traducaoEl.textContent = modelo;

  falarAia("Muito bem! Agora ouça a resposta.");

  if(modelo){
    falar(modelo, getLangCode(), 0.68);
  }

  setTimeout(()=>{
    iniciarConversa();
  },3500);


  }else{

    feedbackEl.innerHTML = `
      ❌ Quase!<br><br>
      Tente assim:<br>
      <strong>${perguntaCorreta}</strong><br><br>
      🔊 Use Pronúncia para ouvir
    `;

    falarAia("Repita a pergunta corretamente.");

  }

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
  idioma:
    direcaoTraducao === "ida"
      ? idiomaAtual
      : "pt"
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

// BOTÃO OUVIR PERGUNTA

const btnOuvirPergunta = document.getElementById("btnOuvirPergunta");

btnOuvirPergunta.onclick = ()=>{
  if(modoAtual !== "conversar" || !perguntaAtual) return;

  const pergunta =
    perguntaAtual.pergunta?.[idiomaAtual] ||
    perguntaAtual.pergunta?.en ||
    "";

  if(pergunta){
    falar(pergunta, getLangCode(), 0.68);
  }
};

btnPronuncia.onclick=()=>{

  if(modoAtual==="conversar" && perguntaAtual){

    const modelo =
      perguntaAtual.respostaModelo?.[idiomaAtual] ||
      perguntaAtual.respostaModelo?.en ||
      "";

    if(modelo){
      falar(modelo, getLangCode(), 0.68);
    }

    return;
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

  autoplay = !autoplay;
  btnPlay.textContent = autoplay ? "⏸" : "▶️";

  if(!autoplay){
    speechSynthesis.cancel();
    return;
  }

  if(tipoEstudo === "verbos"){
    tocarVerbo();
    return;
  }

  if(tipoEstudo === "palavras"){
    tocarPalavraAuto();
    return;
  }

  if(tipoEstudo === "expressoes"){
    tocarExpressao();
    return;
  }

  tocar();
}

btnAnterior.onclick=()=>{

  if(modoAtual!=="frases") return;

  if(tipoEstudo === "verbos"){
    indiceVerbo = (indiceVerbo - 1 + verbos.length) % verbos.length;
    tocarVerbo();
    return;
  }

  if(tipoEstudo === "palavras" || tipoEstudo === "expressoes"){

    const lista = tipoEstudo === "expressoes" ? expressoes : palavras;
    if(!lista.length) return;

    indicePalavra = (indicePalavra - 1 + lista.length) % lista.length;

    tipoEstudo === "expressoes" ? tocarExpressao() : tocarPalavraAuto();
    return;
  }

  indice = (indice - 1 + frasesFiltradas.length) % frasesFiltradas.length;
  tocar();
}

btnProximaFrase.onclick=()=>{

  if(modoAtual!=="frases") return;

  if(tipoEstudo === "verbos"){
    indiceVerbo = (indiceVerbo + 1) % verbos.length;
    tocarVerbo();
    return;
  }

if(tipoEstudo === "palavras" || tipoEstudo === "expressoes"){

  const lista =
    tipoEstudo === "expressoes" ? expressoes : palavras;

  if(!lista.length) return;

  if(aleatorio){

    let disponiveis = lista.filter(p =>
      !palavrasJaSei.includes(p.id)
    );

    if(!disponiveis.length){
      falarAia("Tudo foi aprendido.");
      return;
    }

    let escolhido =
      disponiveis[
        Math.floor(Math.random() * disponiveis.length)
      ];

    indicePalavra =
      lista.findIndex(p => p.id === escolhido.id);

  }else{

    indicePalavra =
      (indicePalavra + 1) % lista.length;
  }

  if(tipoEstudo === "expressoes"){
    tocarExpressao();
  }else{
    tocarPalavraAuto();
  }

  return;
}
  proxima();
};

btnJaSei.onclick = ()=>{

  // ===== PALAVRAS / EXPRESSÕES =====
  if(tipoEstudo === "palavras" || tipoEstudo === "expressoes"){

    const lista =
      tipoEstudo === "expressoes"
        ? expressoes
        : palavras;

    const atual = lista[indicePalavra];

    if(!atual) return;

    const jaExiste =
      palavrasJaSei.includes(atual.id);

    if(jaExiste){

      palavrasJaSei =
        palavrasJaSei.filter(id => id !== atual.id);

      falarAia("Removido dos aprendidos.");

    }else{

      palavrasJaSei.push(atual.id);

      falarAia("Marcado como aprendido.");
    }

    localStorage.setItem(
      "palavrasJaSei",
      JSON.stringify(palavrasJaSei)
    );

    if(tipoEstudo === "expressoes"){
      tocarExpressao();
    }else{
      tocarPalavra();
    }

    return;
  }

  // ===== FRASES =====
  if(tipoEstudo === "frases"){

    const atual = frasesFiltradas[indice];

    if(!atual) return;

    const idFrase = atual.id || atual.pt;

    const jaExiste =
      frasesJaSei.includes(idFrase);

    if(jaExiste){

      frasesJaSei =
        frasesJaSei.filter(id => id !== idFrase);

    }else{

      frasesJaSei.push(idFrase);
    }

    localStorage.setItem(
      "frasesJaSei",
      JSON.stringify(frasesJaSei)
    );

    tocar();
    return;
  }

  // ===== VERBOS =====
  if(tipoEstudo === "verbos"){

    const atual = verbos[indiceVerbo];

    if(!atual) return;

    const jaExiste =
      verbosJaSei.includes(atual.id);

    if(jaExiste){

      verbosJaSei =
        verbosJaSei.filter(id => id !== atual.id);

    }else{

      verbosJaSei.push(atual.id);
    }

    localStorage.setItem(
      "verbosJaSei",
      JSON.stringify(verbosJaSei)
    );

    tocarVerbo();
  }
};

btnRandom.onclick=()=>{

  if(modoAtual !== "frases") return;

  aleatorio = !aleatorio;

  btnRandom.classList.toggle("active", aleatorio);

  falarAia(
    aleatorio
      ? "Aleatório ativado."
      : "Aleatório desativado."
  );
};

btnProxima.onclick=()=>{
  if(modoAtual==="aprendiz"){
    resetAprendiz();
    falarAia("Nova frase. Aperte Falar em português.");
  }

  if(modoAtual==="conversar"){
    iniciarConversa();
  }
}

seletorEstudo.onchange = ()=>{

  tipoEstudo = seletorEstudo.value;

 if(tipoEstudo === "frases"){

  falarAia("Modo Frases ativado.");

  wrapperRandom.style.display = "flex";
  document.querySelector(".filtros-frases").style.display = "flex";

  carregarFrases();
  return;
}

if(tipoEstudo === "verbos"){

  falarAia("Modo Verbos ativado.");

  document.querySelector(".filtros-frases").style.display = "none";

  feedbackEl.innerHTML = `
    📘 Uso dos Verbos<br><br>
    Presente, passado,
    futuro, negativo e pergunta.
  `;

  carregarVerbos();

  return;
}

if(tipoEstudo === "palavras"){

  falarAia("Modo Palavras ativado.");

  document.querySelector(".filtros-frases").style.display = "none";

  wrapperRandom.style.display = "flex";

  carregarPalavras();

  return;
}

if(tipoEstudo === "expressoes"){

  falarAia("Modo Expressões ativado.");

  document.querySelector(".filtros-frases").style.display = "none";

  wrapperRandom.style.display = "flex";

  carregarExpressoes();

  return;
}

  if(tipoEstudo === "expressoes"){

    faladoEl.textContent = "";
    traducaoEl.textContent = "";

    falarAia("Expressões importantes em desenvolvimento.");

    feedbackEl.innerHTML = `
      🚧 Em breve:<br><br>
      Expressões muito usadas
      por nativos.
    `;
  }

};


// === ASSISTENTE CONTÍNUO ===

btnAssistente.onclick = ()=>{

  assistenteAtivo = !assistenteAtivo;

  if(assistenteAtivo){
btnAssistente.style.setProperty(
  "background",
  "linear-gradient(145deg,#ffffff,#e2e8f0)",
  "important"
);

btnAssistente.style.setProperty(
  "color",
  "#111827",
  "important"
);
    falarAia("Assistente ativado. Diga: TRADUZ ...");
    iniciarAssistente();
  }else{
btnAssistente.style.removeProperty("background");
btnAssistente.style.removeProperty("color");
    falarAia("Assistente desativado.");
    if(reconhecimentoAssistente){
      reconhecimentoAssistente.stop();
    }
  }

};

btnAjuda.onclick = ()=>{

  tituloAjuda.textContent = "Ajuda - " + tituloModo.textContent;

  if(modoAtual === "tradutor"){
    textoAjuda.innerHTML = `
      <p><strong>PT → EN/FR:</strong> segure para falar em português.</p>
      <p><strong>EN/FR → PT:</strong> segure para o nativo falar.</p>
      <p><strong>Salvar:</strong> guarda a frase traduzida.</p>
      <p><strong>Assistente:</strong> diga <strong>TRADUZ</strong> antes da frase.</p>
    `;
  }

  if(modoAtual === "frases"){
    textoAjuda.innerHTML = `
      <p>Use <strong>Play</strong> para ouvir as frases.</p>
      <p>Use <strong>Aleatório</strong> para estudar fora de ordem.</p>
      <p>Use <strong>Anterior</strong> e <strong>Próxima</strong> para navegar.</p>
    `;
  }

  if(modoAtual === "aprendiz"){
    textoAjuda.innerHTML = `
      <p>Fale uma frase em português.</p>
      <p>Ouça a pronúncia.</p>
      <p>Repita no idioma escolhido.</p>
      <p>A AiA corrige palavra por palavra.</p>
    `;
  }

  if(modoAtual === "conversar"){
    textoAjuda.innerHTML = `
      <p><strong>Responder:</strong> ouça a pergunta e responda.</p>
      <p><strong>Perguntar:</strong> faça a pergunta correta.</p>
      <p>Use os botões Pergunta e Resposta para ouvir.</p>
    `;
  }

  modalAjuda.style.display = "flex";
};

fecharAjuda.onclick = ()=>{
  modalAjuda.style.display = "none";
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

    if(
      texto.startsWith("traduz") ||
      texto.startsWith("traduzir") ||
      texto.startsWith("traduza")
    ){

      texto = texto
        .replace("traduzir","")
        .replace("traduza","")
        .replace("traduz","")
        .trim();

      setTimeout(async ()=>{

        if(texto.length > 0){

          faladoEl.textContent = texto;

          const res = await fetch("/traduzir",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
              texto:texto,
              idioma:idiomaAtual
            })
          });

          const d = await res.json();

          ultimaTraducao = d.traducao;
          traducaoEl.textContent = d.traducao;

          falar(d.traducao,getLangCode());
        }

      }, 900);
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

  const r = criarRec(
  direcaoTraducao === "ida"
    ? "pt-BR"
    : getLangCode()
);

  r.onresult = async e => {

    const texto = e.results[0][0].transcript;

    faladoEl.textContent = texto;

    const res = await fetch("/traduzir",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        texto: texto,
        idioma: idiomaAtual
      })
    });

    const d = await res.json();

    ultimaTraducao = d.traducao;

    mostrarPalavrasIngles(d.traducao);

    // MOSTRA A TRADUÇÃO
    traducaoEl.textContent = d.traducao;

    // fala no idioma correto
    if(d.idioma === "pt"){

      falar(d.traducao, getLangCode());

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

async function carregarVerbos(){

  if(verbos.length){
    tocarVerbo();
    return;
  }

  try{

    const r = await fetch("/verbos.json");
    verbos = await r.json();

  }catch(e){

    falarAia("Erro ao carregar verbos.");
    return;
  }

  indiceVerbo = 0;

  tocarVerbo();
}

async function carregarPalavras(){

  try{

    const res =
      await fetch("palavras.json");

    const todas = await res.json();

    palavras = todas.filter(p => p.tipo !== "expressao");

    indicePalavra = 0;

    tocarPalavra();

  }catch(e){

    falarAia("Erro ao carregar palavras.");
  }
}

async function carregarExpressoes(){

  try{

    const res =
      await fetch("palavras.json");

    const todas = await res.json();

    expressoes =
      todas.filter(p => p.tipo === "expressao");

    indicePalavra = 0;

    tocarExpressao();

  }catch(e){

    falarAia("Erro ao carregar expressões.");
  }
}

function tocarPalavra(){

  const p =
  tipoEstudo === "expressoes"
    ? expressoes[indicePalavra]
    : palavras[indicePalavra];

  if(!p) return;

  faladoEl.innerHTML = `
    ${p.pt}<br>
    <small style="opacity:.7">
      ${p.tipo}
    </small>
  `;

  traducaoEl.textContent =
    p[idiomaAtual];

  contadorEstudo.textContent =
    `Palavra ${indicePalavra + 1} de ${palavras.length}`;

  contadorAprendidos.textContent =
    `Aprendidas: ${palavrasJaSei.length}`;

  const jaSei =
    palavrasJaSei.includes(p.id);

  btnJaSei.textContent =
    jaSei ? "✓ Aprendida" : "✓ Já Sei";

  btnJaSei.style.background =
    jaSei
      ? "linear-gradient(145deg,#22c55e,#16a34a)"
      : "linear-gradient(145deg,#ffffff,#e2e8f0)";
btnJaSei.style.color =
  jaSei ? "#fff" : "#111827";

}

function tocarPalavraAuto(){

  const p = palavras[indicePalavra];

  if(!p) return;

  faladoEl.innerHTML = `
    ${p.pt}<br>
    <small style="opacity:.7">
      ${p.tipo}
    </small>
  `;

  traducaoEl.textContent = p[idiomaAtual];

  speechSynthesis.cancel();

  const uPt = new SpeechSynthesisUtterance(p.pt);
  uPt.lang = "pt-BR";
  uPt.rate = 0.78;

  uPt.onend = ()=>{

    setTimeout(()=>{

      const uLang = new SpeechSynthesisUtterance(p[idiomaAtual]);
      uLang.lang = getLangCode();
      uLang.rate = 0.60;

      uLang.onend = ()=>{

        if(autoplay){
          setTimeout(()=>{
            btnProximaFrase.click();
          }, 1400);
        }

      };

      speechSynthesis.speak(uLang);

    }, 900);

  };

  speechSynthesis.speak(uPt);

  contadorEstudo.textContent =
    `Palavra ${indicePalavra + 1} de ${palavras.length}`;

  contadorAprendidos.textContent =
    `Aprendidas: ${palavrasJaSei.length}`;
}

function tocarExpressao(){

  const p = expressoes[indicePalavra];

  if(!p) return;

  faladoEl.innerHTML = `
    ${p.pt}<br>
    <small style="opacity:.7">
      Expressão
    </small>
  `;

  traducaoEl.textContent = p[idiomaAtual];

  speechSynthesis.cancel();

  const uPt = new SpeechSynthesisUtterance(p.pt);
  uPt.lang = "pt-BR";
  uPt.rate = 0.78;

  uPt.onend = ()=>{

    setTimeout(()=>{

      const uLang = new SpeechSynthesisUtterance(p[idiomaAtual]);
      uLang.lang = getLangCode();
      uLang.rate = 0.60;

      uLang.onend = ()=>{

        if(autoplay){
          setTimeout(()=>{
            btnProximaFrase.click();
          }, 1400);
        }

      };

      speechSynthesis.speak(uLang);

    }, 900);

  };

  speechSynthesis.speak(uPt);

  contadorEstudo.textContent =
    `Expressão ${indicePalavra + 1} de ${expressoes.length}`;

contadorAprendidos.textContent =
  `Aprendidas: ${palavrasJaSei.length}`;

const jaSei =
  palavrasJaSei.includes(p.id);

btnJaSei.textContent =
  jaSei ? "✓ Aprendida" : "✓ Já Sei";

btnJaSei.style.background =
  jaSei
    ? "linear-gradient(145deg,#22c55e,#16a34a)"
    : "linear-gradient(145deg,#ffffff,#e2e8f0)";

btnJaSei.style.color =
  jaSei ? "#fff" : "#111827";
}


function tocarVerbo(){

  if(!verbos.length) return;

  const v = verbos[indiceVerbo];

contadorEstudo.textContent =
  `Verbo ${indiceVerbo + 1} de ${verbos.length}`;

contadorAprendidos.textContent =
  `Aprendidos: ${verbosJaSei.length}`;

  const jaSei = verbosJaSei.includes(v.id);

btnJaSei.textContent =
  jaSei ? "✓ Aprendido" : "✓ Já Sei";

btnJaSei.style.background =
  jaSei
    ? "linear-gradient(145deg,#22c55e,#16a34a)"
    : "linear-gradient(145deg,#ffffff,#e2e8f0)";

btnJaSei.style.color =
  jaSei ? "#fff" : "#111827";

  faladoEl.innerHTML = `
    <div>${v.presente.pt}</div>
    <div style="margin-top:8px;">
      <strong>Verbo:</strong> ${v.pt}
    </div>
  `;

traducaoEl.innerHTML = `

<span class="verbo-presente">
🟢 Presente:
</span>
${v.presente[idiomaAtual]}<br>

<span class="verbo-passado">
🔵 Passado:
</span>
${v.passado[idiomaAtual]}<br>

<span class="verbo-futuro">
🟣 Futuro:
</span>
${v.futuro[idiomaAtual]}<br>

<span class="verbo-negativo">
🔴 Negativo:
</span>
${v.negativo[idiomaAtual]}<br>

<span class="verbo-pergunta">
🟠 Pergunta:
</span>
${v.pergunta[idiomaAtual]}
`;
falar(
  v.presente[idiomaAtual],
  getLangCode(),
  0.65
);

if(autoplay){
  setTimeout(()=>{
    btnProximaFrase.click();
  }, 4500);
}

}

function tocar(){

  if(!frases.length){
    falarAia("Sem frases para tocar.");
    return;
  }

 const f = frasesFiltradas[indice];

contadorEstudo.textContent =
  `Frase ${indice + 1} de ${frasesFiltradas.length}`;

contadorAprendidos.textContent =
  `Aprendidas: ${frasesJaSei.length}`;

const idFrase = f.id || f.pt;

const jaSei =
  frasesJaSei.includes(idFrase);

btnJaSei.textContent =
  jaSei ? "✓ Aprendida" : "✓ Já Sei";

btnJaSei.style.background =
  jaSei
    ? "linear-gradient(145deg,#22c55e,#16a34a)"
    : "linear-gradient(145deg,#ffffff,#e2e8f0)";

btnJaSei.style.color =
  jaSei ? "#fff" : "#111827";

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

  const frasesDisponiveis =
    frasesFiltradas.filter(f => {

      const idFrase = f.id || f.pt;

      return !frasesJaSei.includes(idFrase);
    });

  if(frasesDisponiveis.length === 0){

    falarAia("Todas as frases foram aprendidas.");
    return;
  }

  const fraseEscolhida =
    frasesDisponiveis[
      Math.floor(Math.random() * frasesDisponiveis.length)
    ];

  indice =
    frasesFiltradas.findIndex(f => {

      const idFrase = f.id || f.pt;

      return idFrase === (fraseEscolhida.id || fraseEscolhida.pt);
    });

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

const modelo =
  perguntaAtual.respostaModelo?.[idiomaAtual] ||
  perguntaAtual.respostaModelo?.en ||
  "";

if(modoConversaTipo === "perguntar"){

  falarAia("Me faça a pergunta e ouça a resposta.");

  faladoEl.textContent = "";
  traducaoEl.textContent = modelo;

  feedbackEl.innerHTML = `
    💡 Pergunta correta:<br>
    <strong>${texto}</strong><br><br>
    <small>Faça essa pergunta em voz alta.</small>
  `;

}else{

  falarAia("Ouça a pergunta e responda. Se quiser, use a resposta modelo.");

  faladoEl.textContent = texto;
  traducaoEl.textContent = "";

  feedbackEl.innerHTML = `
    💡 Resposta modelo:<br>
    <strong>${modelo}</strong><br><br>
    <small>Você pode responder livremente ou repetir o modelo.</small>
  `;

  falar(texto, getLangCode(), 0.68);
}

}
/* ========= INIT ========= */
trocarTela("idioma");
// === NOVO ===
atualizarContadorFrases();
atualizarLabelIdioma();
atualizarBotoesIdioma();
document.getElementById("filtroNivel").onchange = aplicarFiltros;
document.getElementById("filtroCategoria").onchange = aplicarFiltros;
// === FIM NOVO ===


});
