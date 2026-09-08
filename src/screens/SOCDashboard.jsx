import { useState } from "react";
import useGameStore from "../store/useGameStore";
import { departments } from "../data/departments";
import { missions, missionOrder } from "../data/missions";
import { networkNodes } from "../data/nodes";
import DepartmentList from "../components/DepartmentList";
import AlertPanel from "../components/AlertPanel";
import NetworkMap from "../components/NetworkMap";
import Terminal from "../components/Terminal";
import XPBar from "../components/XPBar";
import styles from "./SOCDashboard.module.css";

const PILLS_MONITOR = ["help", "status", "alerts"];

function calcularNivelAmeaca(nodeStates) {
  const nos = Object.keys(networkNodes).map((id) => ({
    ...networkNodes[id],
    ...nodeStates[id],
  }));
  if (nos.some((n) => n.status === "offline")) return "HIGH";
  if (nos.some((n) => n.status === "warning" || n.status === "degraded")) return "MEDIUM";
  return "LOW";
}

export default function SOCDashboard() {
  const xp = useGameStore((s) => s.xp);
  const level = useGameStore((s) => s.level);
  const alerts = useGameStore((s) => s.alerts);
  const nodeStates = useGameStore((s) => s.nodeStates);
  const unlockedDepartments = useGameStore((s) => s.unlockedDepartments);
  const unlockedPhases = useGameStore((s) => s.unlockedPhases);
  const completedPhases = useGameStore((s) => s.completedPhases);
  const openMission = useGameStore((s) => s.openMission);
  const startPhase = useGameStore((s) => s.startPhase);
  const goToScreen = useGameStore((s) => s.goToScreen);

  const [historico, setHistorico] = useState([
    { tipo: "info", texto: "SOC Terminal v1.0 — modo monitor" },
    { tipo: "info", texto: "Digite 'help' para listar comandos disponíveis." },
    { tipo: "aviso", texto: "[09:14:32] Anomalia detectada em FINANCE-02" },
  ]);
  const [valor, setValor] = useState("");

  const faseAtiva = missionOrder.find(
    (id) => unlockedPhases.includes(id) && !completedPhases.includes(id)
  );
  const missaoAtiva = faseAtiva ? missions[faseAtiva] : null;
  const ameaca = calcularNivelAmeaca(nodeStates);

  function executarComandoMonitor(textoDigitado) {
    const texto = textoDigitado.trim();
    if (!texto) return;
    const linhas = [{ tipo: "input", texto }];
    const comando = texto.toLowerCase();

    if (comando === "help") {
      linhas.push({
        tipo: "info",
        texto:
          "Comandos: help, status, alerts.\nAbra uma missão para acessar o terminal completo de diagnóstico.",
      });
    } else if (comando === "status") {
      linhas.push({
        tipo: "info",
        texto: `Analista: LVL ${level} · ${xp} XP\nIncidente ativo: ${
          missaoAtiva ? missaoAtiva.title : "nenhum"
        }\nNível de ameaça: ${ameaca}`,
      });
    } else if (comando === "alerts") {
      linhas.push({
        tipo: "info",
        texto: alerts
          .slice(0, 6)
          .map((a) => `[${a.time}] ${a.texto}`)
          .join("\n"),
      });
    } else {
      linhas.push({
        tipo: "erro",
        texto: `Comando não reconhecido: "${texto}"\nDigite 'help' ou consulte o CODEX para ver os comandos disponíveis.`,
      });
    }

    setHistorico((atual) => [...atual, ...linhas]);
    setValor("");
  }

  function abrirOuIniciarMissao(faseId) {
    if (!unlockedPhases.includes(faseId)) return;
    if (completedPhases.includes(faseId)) {
      startPhase(faseId);
    } else {
      openMission(faseId);
    }
  }

  function handleNodeClick(nodeId) {
    if (nodeId === "finance") abrirOuIniciarMissao("phase1");
  }

  return (
    <div className={styles.tela}>
      <div className={styles.topbar}>
        <div className={styles.marca}>
          HELIX CORP <span>· SOC</span>
        </div>
        <div className={styles.incidente}>
          {missaoAtiva ? (
            <>
              INCIDENTE ATIVO: <strong>{missaoAtiva.title}</strong> ·{" "}
              {missaoAtiva.targetNode
                ? networkNodes[missaoAtiva.targetNode]?.label
                : ""}
            </>
          ) : (
            "TODOS OS INCIDENTES CONTIDOS"
          )}
        </div>
        <div className={styles.direita}>
          <span className={styles.ameaca}>
            <span className={styles.pontoAmeaca} />
            THREAT: {ameaca}
          </span>
          <XPBar xp={xp} level={level} />
        </div>
      </div>

      <div className={styles.corpo}>
        <div className={styles.colunaEsquerda}>
          <DepartmentList
            departamentos={departments}
            unlockedDepartments={unlockedDepartments}
            unlockedPhases={unlockedPhases}
            completedPhases={completedPhases}
          />
          <div className={styles.blocoAlertas}>
            <AlertPanel alertas={alerts} />
          </div>
          <button className={styles.botaoCodex} onClick={() => goToScreen("codex")}>
            📖 ABRIR CODEX
          </button>
        </div>

        <div className={styles.colunaCentro}>
          <div className={styles.mapaHolder}>
            <NetworkMap
              titulo="NETWORK TOPOLOGY · HELIX-CORP"
              nodeStates={nodeStates}
              onNodeClick={handleNodeClick}
            />
          </div>
          <div className={styles.faixaMissoes}>
            {missionOrder.map((faseId) => {
              const missao = missions[faseId];
              const desbloqueada = unlockedPhases.includes(faseId);
              const concluida = completedPhases.includes(faseId);

              if (!desbloqueada) {
                return (
                  <div key={faseId} className={`${styles.cardMissao} ${styles.bloqueada}`}>
                    <span className={styles.cadeado}>🔒</span>
                    <span className={styles.faseLabel}>{missao.phase}</span>
                    <span className={styles.tituloMissao}>{missao.title}</span>
                    <span className={styles.emBreve}>Em breve...</span>
                  </div>
                );
              }

              return (
                <button
                  key={faseId}
                  className={`${styles.cardMissao} ${
                    concluida ? styles.concluida : styles.ativa
                  }`}
                  onClick={() => abrirOuIniciarMissao(faseId)}
                >
                  <span
                    className={`${styles.badge} ${
                      missao.priority === "CRÍTICO" ? styles.critico : styles.alto
                    }`}
                  >
                    {concluida ? "RESOLVIDO" : missao.priority}
                  </span>
                  <span className={styles.faseLabel}>{missao.phase}</span>
                  <span className={styles.tituloMissao}>{missao.title}</span>
                  <span className={styles.xp}>+{missao.xpReward} XP</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.colunaDireita}>
          <Terminal
            titulo="SOC TERMINAL"
            promptLabel="soc@helix ➜"
            historico={historico}
            valor={valor}
            onValorChange={setValor}
            onEnviar={() => executarComandoMonitor(valor)}
            placeholder="digite um comando..."
            pills={PILLS_MONITOR}
            onPillClick={(pill) => executarComandoMonitor(pill)}
          />
        </div>
      </div>
    </div>
  );
}
