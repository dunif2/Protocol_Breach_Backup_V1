import styles from "./XPBar.module.css";

const XP_POR_NIVEL = 500;

export default function XPBar({ xp, level }) {
  const xpNoNivel = xp % XP_POR_NIVEL;
  const percentual = (xpNoNivel / XP_POR_NIVEL) * 100;

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>XP</span>
      <div className={styles.trilha}>
        <div className={styles.preenchimento} style={{ width: `${percentual}%` }} />
      </div>
      <span className={styles.valor}>{xp}</span>
      <span className={styles.nivel}>LVL {level}</span>
    </div>
  );
}
