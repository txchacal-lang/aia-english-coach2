const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// 🔥 COLE SUA CHAVE AQUI
const GOOGLE_API_KEY = "AIzaSyBhNOwOznv5bW7FmnNynYSFqY2SbsDQw40";

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

const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;

const resposta = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    q: texto,
    source: source,
    target: target,
    format: "text"
  })
});

const data = await resposta.json();

const traducao = data.data.translations[0].translatedText;

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

    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`;

    const resposta = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: texto,
        source: "en",
        target: "pt",
        format: "text"
      })
    });

    const data = await resposta.json();

    res.json({
      traducao: data.data.translations[0].translatedText
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
  console.log(`App rodando na porta ${PORT}`);
});
