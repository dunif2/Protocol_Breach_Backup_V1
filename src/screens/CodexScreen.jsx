import { useState } from "react";
import useGameStore from "../store/useGameStore";
import { missions, missionOrder } from "../data/missions";
import { getComandosDaFase } from "../data/commands";
import styles from "./CodexScreen.module.css";

export default function CodexScreen() {
  const goToScreen = useGameStore((s) => s.goToScreen);
  const unlockedPhases = useGameStore((s) => s.unlockedPhases);

  const [abaAtiva, setAbaAtiva] = useState(
    missionOrder.find((id) => unlockedPhases.includes(id)) ?? missionOrder[0]
  );

  const missaoAtiva = missions[abaAtiva];
  const comandos = getComandosDaFase(abaAtiva);

  return (
    <div className={styles.tela}>
      <div className={styles.topbar}>
        <button className={styles.voltar} onClick={() => goToScreen("soc")}>
          ◄ SOC
        </button>
        <div className={styles.titulos}>
          <span className={styles.eyebrow}>MANUAL DE CAMPO</span>
          <span className={styles.titulo}>CODEX · COMANDOS DO TERMINAL</span>
        </div>
      </div>

      <div className={styles.conteudo}>
        <div className={styles.abas}>
          {missionOrder.map((faseId) => {
            const missao = missions[faseId];
            const desbloqueada = unlockedPhases.includes(faseId);
            return (
              <button
                key={faseId}
                className={`${styles.aba} ${
                  faseId === abaAtiva ? styles.abaAtiva : ""
                } ${!desbloqueada ? styles.abaBloqueada : ""}`}
                disabled={!desbloqueada}
                onClick={() => setAbaAtiva(faseId)}
              >
                {desbloqueada
                  ? `${missao.phase.split(" · ")[0]} · ${missao.title.toUpperCase()}`
                  : `🔒 ${missao.phase.split(" · ")[0]} · BLOQUEADO`}
              </button>
            );
          })}
        </div>

        <p className={styles.descricaoFase}>{missaoAtiva.codexDescricao}</p>

        <div className={styles.cards}>
          {comandos.map((comando) => (
            <div className={styles.card} key={comando.nome}>
              <div className={styles.cardTopo}>
                <div>
                  <span className={styles.nomeComando}>{comando.nome}</span>
                  <span className={styles.sintaxe}>{comando.sintaxe}</span>
                </div>
                <span className={styles.tags}>{comando.tags.join(" · ")}</span>
              </div>

              <div className={styles.secao}>
                <div className={styles.secaoTitulo}>O QUE FAZ</div>
                <p className={styles.secaoTexto}>{comando.oQueFaz}</p>
              </div>

              <div className={styles.secao}>
                <div className={styles.secaoTitulo}>POR QUE USAR</div>
                <p className={styles.secaoTexto}>{comando.porQueUsar}</p>
              </div>

              <div className={styles.secao}>
                <div className={styles.secaoTitulo}>EXEMPLO</div>
                <code className={styles.exemploBloco}>$ {comando.exemplo}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
