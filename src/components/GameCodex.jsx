import { AnimatePresence, motion } from "framer-motion";
import { missions } from "../data/missions";
import { getComandosDaFase } from "../data/commands";
import codexStyles from "../screens/CodexScreen.module.css";
import styles from "./GameCodex.module.css";

/**
 * Painel do Codex acessível durante a investigação (Gameplay Screen).
 * Mostra apenas os comandos disponíveis na fase atual — nome, sintaxe,
 * o que fazem e por que usá-los — SEM jamais indicar qual comando
 * resolve qual objetivo, em que ordem usá-los, ou qual parâmetro
 * específico do cenário atual usar. O jogador aprende a ferramenta,
 * não a resposta do desafio.
 */
export default function GameCodex({ aberto, onFechar, faseId }) {
  const missao = missions[faseId];
  const comandos = getComandosDaFase(faseId);

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          className={styles.overlay}
          onClick={onFechar}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={styles.painel}
            onClick={(e) => e.stopPropagation()}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className={styles.cabecalho}>
              <div className={styles.titulos}>
                <span className={styles.eyebrow}>MANUAL DE CAMPO</span>
                <span className={styles.titulo}>CODEX · COMANDOS DISPONÍVEIS</span>
              </div>
              <button className={styles.fechar} onClick={onFechar} aria-label="Fechar">
                ×
              </button>
            </div>

            <p className={styles.descricaoFase}>{missao.codexDescricao}</p>

            <div className={styles.cards}>
              {comandos.map((comando) => (
                <div className={codexStyles.card} key={comando.nome}>
                  <div className={codexStyles.cardTopo}>
                    <div>
                      <span className={codexStyles.nomeComando}>{comando.nome}</span>
                      <span className={codexStyles.sintaxe}>{comando.sintaxe}</span>
                    </div>
                    <span className={codexStyles.tags}>{comando.tags.join(" · ")}</span>
                  </div>

                  <div className={codexStyles.secao}>
                    <div className={codexStyles.secaoTitulo}>O QUE FAZ</div>
                    <p className={codexStyles.secaoTexto}>{comando.oQueFaz}</p>
                  </div>

                  <div className={codexStyles.secao}>
                    <div className={codexStyles.secaoTitulo}>POR QUE USAR</div>
                    <p className={codexStyles.secaoTexto}>{comando.porQueUsar}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
