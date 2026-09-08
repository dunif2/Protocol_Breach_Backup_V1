import styles from "./ObjectiveTracker.module.css";

export default function ObjectiveTracker({ objetivos, concluidos }) {
  const totalConcluidos = objetivos.filter((o) => concluidos[o.id]).length;
  const percentual = (totalConcluidos / objetivos.length) * 100;

  return (
    <div className={styles.painel}>
      <div className={styles.cabecalho}>
        <span className={styles.titulo}>OBJETIVOS DA MISSÃO</span>
        <span className={styles.contagem}>
          {totalConcluidos}/{objetivos.length}
        </span>
      </div>
      <div className={styles.lista}>
        {objetivos.map((objetivo) => {
          const feito = Boolean(concluidos[objetivo.id]);
          return (
            <div
              key={objetivo.id}
              className={`${styles.item} ${feito ? styles.concluido : ""}`}
            >
              <span className={styles.check}>{feito ? "✓" : "◻"}</span>
              <span>{objetivo.text}</span>
            </div>
          );
        })}
      </div>
      <div className={styles.barraProgresso}>
        <div className={styles.barraPreenchida} style={{ width: `${percentual}%` }} />
      </div>
    </div>
  );
}
