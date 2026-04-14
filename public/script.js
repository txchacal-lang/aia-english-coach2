// 🔥 SOMENTE TRECHOS CORRIGIDOS (não mexi na estrutura)

// ================= VOZ MELHORADA =================
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

  // 🔥 VELOCIDADE INTELIGENTE
  if(modoAtual === "aprendiz"){
    u.rate = 0.75;
  } else {
    u.rate = 0.95;
  }

  u.pitch = 1;

  speechSynthesis.speak(u);
}

// ================= PRONÚNCIA (FIX BUG) =================
btnPronuncia.onclick=()=>{
  if(modoAtual==="aprendiz"){
    falar(aprendiz.fraseAlvo,"en-US");

    // 🔥 ESSENCIAL PRA NÃO VIRAR TRADUTOR
    aprendiz.etapa = "en";
    aprendiz.falada = [];
  }
  if(modoAtual==="tradutor"){
    falar(ultimaTraducao,"en-US");
  }
  if(modoAtual==="frases"){
    falar(frases[indice].en,"en-US");
  }
}

// ================= CORREÇÃO TOLERANTE =================
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

// ================= CORRIGIR PALAVRA (FIX REAL) =================
function corrigirPalavraIsolada(){
  const alvo = aprendiz.palavraEmCorrecao.palavra.toLowerCase().replace(/[.,!?]/g,"");
  const span = aprendiz.palavraEmCorrecao.span;

  const r = criarRec("en-US");

  r.onresult = e => {
    const falada = e.results[0][0].transcript
      .toLowerCase()
      .replace(/[.,!?]/g,"")
      .trim();

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

// ================= RESET LIMPO =================
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
