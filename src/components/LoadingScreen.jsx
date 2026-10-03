import useGameStore from "../store/useGameStore";
import styles from "./LoadingScreen.module.css";

/**
 * Tela de carregamento simples usada nas transições (boot → SOC,
 * entrar e sair de uma fase). O estado vem da store: `loading.ativo`
 * liga e desliga o overlay, e o texto continua no estado para aparecer
 * durante o fade-out, que é feito em CSS.
 */
export default function LoadingScreen() {
  const loading = useGameStore((s) => s.loading);

  return (
    <div
      className={`${styles.overlay} ${loading?.ativo ? styles.ativo : ""}`}
      aria-hidden={!loading?.ativo}
    >
      <div className={styles.marca}>PROTOCOL: BREACH</div>
      <div className={styles.trilha}>
        {loading && (
          <div
            key={loading.id}
            className={styles.barra}
            style={{ animationDuration: `${loading.duracao}ms` }}
          />
        )}
      </div>
      <div className={styles.texto}>{loading?.texto}</div>
    </div>
  );
}
