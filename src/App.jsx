import { useState } from "react";
import { fases } from "./data/fases";
import IntroScreen from "./components/IntroScreen";
import HubScreen from "./components/HubScreen";
import TerminalScreen from "./components/TerminalScreen";
import PhaseCompleteScreen from "./components/PhaseCompleteScreen";
import "./App.css";

function progressoInicial() {
  const estado = {};
  fases.forEach((fase, indice) => {
    estado[fase.id] = { status: indice === 0 ? "em_progresso" : "bloqueada" };
  });
  return estado;
}

export default function App() {
  const [tela, setTela] = useState("intro"); // intro | hub | terminal | conclusao
  const [faseAtualId, setFaseAtualId] = useState(null);
  const [progresso, setProgresso] = useState(progressoInicial);

  const indiceFaseAtual = fases.findIndex((f) => f.id === faseAtualId);
  const faseAtual = indiceFaseAtual >= 0 ? fases[indiceFaseAtual] : null;
  const proximaFase = fases[indiceFaseAtual + 1] ?? null;

  function irParaHub() {
    setFaseAtualId(null);
    setTela("hub");
  }

  function iniciarFase(faseId) {
    setFaseAtualId(faseId);
    setTela("terminal");
  }

  function concluirFase(faseId) {
    setProgresso((atual) => {
      const proximo = { ...atual, [faseId]: { status: "concluida" } };
      const indice = fases.findIndex((f) => f.id === faseId);
      const seguinte = fases[indice + 1];
      if (seguinte && proximo[seguinte.id]?.status === "bloqueada") {
        proximo[seguinte.id] = { status: "em_progresso" };
      }
      return proximo;
    });
    setTela("conclusao");
  }

  return (
    <>
      {tela === "intro" && <IntroScreen onIniciar={irParaHub} />}

      {tela === "hub" && (
        <HubScreen fases={fases} progresso={progresso} onSelecionarFase={iniciarFase} />
      )}

      {tela === "terminal" && faseAtual && (
        <TerminalScreen
          key={faseAtual.id}
          fase={faseAtual}
          onFaseConcluida={concluirFase}
          onVoltarHub={irParaHub}
        />
      )}

      {tela === "conclusao" && faseAtual && (
        <PhaseCompleteScreen
          fase={faseAtual}
          existeProximaFase={Boolean(proximaFase)}
          onProximaFase={() => iniciarFase(proximaFase.id)}
          onVoltarHub={irParaHub}
        />
      )}
    </>
  );
}
