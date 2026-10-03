import { useRef } from "react";
import useGameStore from "../store/useGameStore";
import styles from "./LoadingScreen.module.css";

/**
 * Tela de carregamento simples usada nas transições (boot → SOC,
 * entrar e sair de uma fase). O estado vem da store: `loading` é null
 * quando não há transição rodando. O fade é feito em CSS, e o último
 * texto fica guardado para aparecer durante o fade-out.
 */
export default function LoadingScreen() {
  const loading = useGameStore((s) => s.loading);
  const ultimo = useRef(null);
  if (loading) ultimo.current = loading;
  const info = ultimo.current;

  return (
    <div
      className={`${styles.overlay} ${loading ? styles.ativo : ""}`}
      aria-hidden={!loading}
    >
      <div className={styles.marca}>PROTOCOL: BREACH</div>
      <div className={styles.trilha}>
        {info && (
          <div
            key={info.id}
            className={styles.barra}
            style={{ animationDuration: `${info.duracao}ms` }}
          />
        )}
      </div>
      <div className={styles.texto}>{info?.texto}</div>
    </div>
  );
}
