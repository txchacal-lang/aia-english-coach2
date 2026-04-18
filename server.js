const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = 3000;

// 🔥 COLE SUA CHAVE AQUI
const API_KEY = process.env.GOOGLE_API_KEY;

/* =========================
   TRADUÇÃO DE FRASES
========================= */

app.post("/traduzir", async (req, res) => {

  const { texto, idioma } = req.body;

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

    const idiomaDestino = idioma === "fr" ? "fr" : "en";

if(contador >= 1){

  source = idiomaDestino;
  target = "pt";
  idiomaDetectado = idiomaDestino;

}else{

  source = "pt";
  target = idiomaDestino;
  idiomaDetectado = "pt";

}
    const url =
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=${source}|${target}`;

    const resposta = await fetch(url);
    const data = await resposta.json();

    const traducao = data.responseData.translatedText;

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

    const url =
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=en|pt`;

    const r = await fetch(url);
    const d = await r.json();

    res.json({
      traducao: d.responseData.translatedText
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
  console.log(`App rodando em http://localhost:${PORT}`);
});
