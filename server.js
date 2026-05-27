require("dotenv").config();

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

  const {
    texto,
    idioma,
    origem,
    destino,
    modo
  } = req.body;

  try {

    let source;
    let target;

    // ====================================
    // NOVO SISTEMA (TRADUTOR BIDIRECIONAL)
    // ====================================

    if(origem && destino){

      source = origem;
      target = destino;

    }

    // ====================================
    // SISTEMA ANTIGO (COMPATIBILIDADE)
    // ====================================

    else{

      const idiomaDestino =
        idioma === "fr" ? "fr" : "en";

      source = "pt";
      target = idiomaDestino;
    }

    const url =
      `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;

    const resposta = await fetch(url, {

      method: "POST",

      headers:{
        "Content-Type":"application/json"
      },

      body: JSON.stringify({
        q: texto,
        source,
        target,
        format:"text"
      })

    });

    const data = await resposta.json();

    if(data.error){

      console.log(
        "Erro Google:",
        data.error.message
      );

      return res.json({
        traducao:
          "Tradução indisponível no momento."
      });

    }

    const traducao =
      data.data.translations[0].translatedText;

    res.json({
      traducao
    });

  } catch (erro) {

    console.error(
      "Erro na tradução:",
      erro.message
    );

    res.json({
      traducao:"erro na tradução"
    });

  }

});
/* =========================
   TRADUÇÃO DE PALAVRA
========================= */

app.post("/traduzir-palavra", async (req,res)=>{

  const { texto } = req.body;

  try{

    const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;

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

    if(data.error){
      return res.json({
        traducao: texto
      });
    }

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
  console.log(`App rodando em http://localhost:${PORT}`);
});
