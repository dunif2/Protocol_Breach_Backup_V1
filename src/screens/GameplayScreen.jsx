import { useState } from "react";
import useGameStore from "../store/useGameStore";
import { missions } from "../data/missions";
import { useTerminal } from "../hooks/useTerminal";
import NetworkMap from "../components/NetworkMap";
import NodeInspector from "../components/NodeInspector";
import ObjectiveTracker from "../components/ObjectiveTracker";
import Terminal from "../components/Terminal";
import GameCodex from "../components/GameCodex";
import styles from "./GameplayScreen.module.css";

export default function GameplayScreen() {
  const faseId = useGameStore((s) => s.activePhase);
  const goToScreen = useGameStore((s) => s.goToScreen);
  const nodeStates = useGameStore((s) => s.nodeStates);
  const objectives = useGameStore((s) => s.objectives);

  const [nodeSelecionado, setNodeSelecionado] = useState(null);
  const [codexAberto, setCodexAberto] = useState(false);

  const missao = missions[faseId];
  const concluidos = objectives[faseId] ?? {};

  const historicoInicial = [
    { tipo: "sistema", texto: `INCIDENTE: ${missao.title}\n${missao.lore}` },
  ];

  const { historico, valor, setValor, enviar, concluirObjetivoNoMapa, processando } =
    useTerminal(faseId, historicoInicial);

  function handleNodeClick(nodeId) {
    setNodeSelecionado(nodeId);
    if (
      missao.nodeClickObjective &&
      nodeId === missao.targetNode &&
      !concluidos[missao.nodeClickObjective]
    ) {
      concluirObjetivoNoMapa(missao.nodeClickObjective);
    }
  }

  const totalConcluidos = missao.objectives.filter((o) => concluidos[o.id]).length;
  const percentual = (totalConcluidos / missao.objectives.length) * 100;

  return (
    <div className={styles.tela}>
      <div className={styles.topbar}>
        <button className={styles.voltar} onClick={() => goToScreen("soc")}>
          ◀ SOC
        </button>
        <span className={styles.faseLabel}>{missao.phase}</span>
        <div className={styles.progresso}>
          <div className={styles.trilhaProgresso}>
            <div
              className={styles.preenchimentoProgresso}
              style={{ width: `${percentual}%` }}
            />
          </div>
          <span className={styles.contagemProgresso}>
            {totalConcluidos}/{missao.objectives.length}
          </span>
        </div>
        <button
          className={styles.botaoCodex}
          onClick={() => setCodexAberto(true)}
          title="Codex · Comandos disponíveis"
        >
          📖 CODEX
        </button>
      </div>

      <div className={styles.corpo}>
        <div className={styles.colunaMapa}>
          <div className={styles.mapaHolder}>
            <NetworkMap
              titulo={`INVESTIGAÇÃO · ${missao.title.toUpperCase()}`}
              nodeStates={nodeStates}
              onNodeClick={handleNodeClick}
            />
          </div>
          <NodeInspector
            nodeId={nodeSelecionado}
            nodeStates={nodeStates}
            onFechar={() => setNodeSelecionado(null)}
          />
        </div>

        <div className={styles.colunaLateral}>
          <ObjectiveTracker objetivos={missao.objectives} concluidos={concluidos} />
          <div className={styles.terminalHolder}>
            <Terminal
              titulo="TERMINAL DE INVESTIGAÇÃO"
              promptLabel="$"
              historico={historico}
              valor={valor}
              onValorChange={setValor}
              onEnviar={enviar}
              placeholder='digite um comando ("help" lista as opções, o Codex explica cada uma)'
              processando={processando}
            />
          </div>
        </div>
      </div>

      <GameCodex
        aberto={codexAberto}
        onFechar={() => setCodexAberto(false)}
        faseId={faseId}
      />
    </div>
  );
}
