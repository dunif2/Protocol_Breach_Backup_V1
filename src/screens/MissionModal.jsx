import { AnimatePresence, motion } from "framer-motion";
import useGameStore from "../store/useGameStore";
import { missions } from "../data/missions";
import styles from "./MissionModal.module.css";

export default function MissionModal() {
  const faseId = useGameStore((s) => s.missionModalPhase);
  const closeMission = useGameStore((s) => s.closeMission);
  const startPhase = useGameStore((s) => s.startPhase);

  const missao = faseId ? missions[faseId] : null;

  return (
    <AnimatePresence>
      {missao && (
        <motion.div
          className={styles.overlay}
          onClick={closeMission}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={styles.caixa}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className={styles.linhaTopo} />
            <div className={styles.conteudo}>
              <div className={styles.badgeFase}>{missao.phase}</div>
              <h2 className={styles.tituloMissao}>{missao.title}</h2>

              <div className={styles.secaoTitulo}>SITUAÇÃO</div>
              <p className={styles.lore}>{missao.lore}</p>

              <div className={styles.secaoTitulo}>OBJETIVOS</div>
              <div className={styles.objetivos}>
                {missao.objectives.map((obj) => (
                  <div key={obj.id} className={styles.objetivo}>
                    <span className={styles.marcador}>▸</span>
                    {obj.text}
                  </div>
                ))}
              </div>

              <div className={styles.secaoTitulo}>O QUE VOCÊ VAI APRENDER</div>
              <div className={styles.tags}>
                {missao.learn.map((item) => (
                  <span key={item} className={styles.tag}>
                    {item}
                  </span>
                ))}
              </div>

              <div className={styles.rodape}>
                <span className={styles.recompensa}>
                  ★ +{missao.xpReward} XP · PRIORIDADE {missao.priority}
                </span>
                <div className={styles.acoes}>
                  <button className={styles.botaoCancelar} onClick={closeMission}>
                    CANCELAR
                  </button>
                  <button
                    className={styles.botaoIniciar}
                    onClick={() => startPhase(faseId)}
                  >
                    INICIAR MISSÃO ▶
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
