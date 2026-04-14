const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 SERVE A PASTA PUBLIC
app.use(express.static("public"));

// 🔥 GARANTE HOME
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const PORT = process.env.PORT || 3000;

/* =========================
   TRADUÇÃO DE FRASES
========================= */

app.post("/traduzir", async (req, res) => {

  const { texto } = req.body;

  try {

    const textoLower = texto.toLowerCase().trim();

    const palavrasIngles = [
      "the","and","is","are","to","of","in","that","it",
      "you","i","we","they","do","does","did","have","has",
      "will","can","would","should"
    ];

    let contador = 0;

    palavrasIngles.forEach(p => {
      if(
        textoLower.includes(" " + p + " ") ||
        textoLower.startsWith(p + " ") ||
        textoLower.endsWith(" " + p)
      ){
        contador++;
      }
    });

    let source, target, idiomaDetectado;

    if(contador >= 1){
      source = "en";
      target = "pt";
      idiomaDetectado = "en";
    }else{
      source = "pt";
      target = "en";
      idiomaDetectado = "pt";
    }

    const resposta = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: texto,
        source: source,
        target: target,
        format: "text"
      })
    });

    const data = await resposta.json();

    const traducao = data.translatedText;

    res.json({
      idioma: idiomaDetectado,
      traducao
    });

  } catch (erro) {

    console.error("Erro na tradução:", erro.message);

    res.json({
      traducao: "erro na tradução"
    });

  }

});

/* =========================
   TRADUÇÃO DE PALAVRA
========================= */

app.post("/traduzir-palavra", async (req,res)=>{

  const { texto } = req.body;

  try{

    const resposta = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: texto,
        source: "en",
        target: "pt",
        format: "text"
      })
    });

    const data = await resposta.json();

    res.json({
      traducao: data.translatedText
    });

  }catch(e){

    console.log("Erro palavra:", e.message);

    res.json({
      traducao: texto
    });

  }

});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(`🚀 App rodando na porta ${PORT}`);
});
