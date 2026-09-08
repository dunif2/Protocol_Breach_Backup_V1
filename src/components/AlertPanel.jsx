import styles from "./AlertPanel.module.css";

export default function AlertPanel({ alertas }) {
  return (
    <div className={styles.painel}>
      <div className={styles.cabecalho}>
        <span>ALERTAS · LIVE</span>
        <span className={styles.pontoLive} />
      </div>
      <div className={styles.lista}>
        {alertas.map((alerta, indice) => (
          <div key={indice} className={`${styles.item} ${styles[alerta.tipo]}`}>
            <span className={styles.hora}>{alerta.time}</span>
            {alerta.texto}
          </div>
        ))}
      </div>
    </div>
  );
}
