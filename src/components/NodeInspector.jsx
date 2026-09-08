import { networkNodes } from "../data/nodes";
import styles from "./NodeInspector.module.css";

const ROTULO_STATUS = {
  online: "ONLINE",
  warning: "WARNING",
  degraded: "DEGRADED",
  offline: "OFFLINE",
};

export default function NodeInspector({ nodeId, nodeStates, onFechar }) {
  if (!nodeId) return null;
  const no = { ...networkNodes[nodeId], ...nodeStates[nodeId] };

  return (
    <div className={styles.painel}>
      <div className={styles.cabecalho}>
        <span className={styles.nome}>{no.label}</span>
        <button className={styles.fechar} onClick={onFechar} aria-label="Fechar">
          ×
        </button>
      </div>
      <div className={styles.linhas}>
        <span className={styles.chave}>IP</span>
        <span className={styles.valor}>{no.ip}</span>

        <span className={styles.chave}>STATUS</span>
        <span className={`${styles.valor} ${styles[no.status]}`}>
          {ROTULO_STATUS[no.status] ?? no.status.toUpperCase()}
        </span>

        <span className={styles.chave}>LATÊNCIA</span>
        <span className={styles.valor}>{no.latency}</span>

        <span className={styles.chave}>PACOTES</span>
        <span className={styles.valor}>{no.packets}</span>
      </div>
    </div>
  );
}
