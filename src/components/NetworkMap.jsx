import { networkNodes, networkEdges } from "../data/nodes";
import styles from "./NetworkMap.module.css";

const RAIO_POR_TIPO = {
  router: 30,
  switch: 25,
  server: 22,
};

export default function NetworkMap({ nodeStates, onNodeClick, titulo }) {
  function resolverNo(id) {
    const base = networkNodes[id];
    return { ...base, ...nodeStates[id] };
  }

  const financeAtual = resolverNo("finance");
  const mostrarPacoteMalicioso = financeAtual.status === "offline";
  const rotaPacote = `M ${networkNodes.router.x} ${networkNodes.router.y} L ${networkNodes.switch1.x} ${networkNodes.switch1.y} L ${networkNodes.finance.x} ${networkNodes.finance.y}`;

  return (
    <div className={styles.wrap}>
      {titulo && <div className={styles.titulo}>{titulo}</div>}
      <div className={styles.svgHolder}>
        <svg className={styles.svg} viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet">
          {networkEdges.map(({ from, to }) => {
            const noDestino = resolverNo(to);
            const critica = noDestino.status === "offline";
            const a = networkNodes[from];
            const b = networkNodes[to];
            return (
              <line
                key={`${from}-${to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                className={`${styles.aresta} ${critica ? styles.arestaCritica : ""}`}
              />
            );
          })}

          {mostrarPacoteMalicioso && (
            <circle r="4" className={styles.pacote}>
              <animateMotion dur="2.4s" repeatCount="indefinite" path={rotaPacote} />
            </circle>
          )}

          {Object.keys(networkNodes).map((id) => {
            const no = resolverNo(id);
            const raio = RAIO_POR_TIPO[no.type] ?? 22;
            return (
              <g
                key={id}
                className={`${styles.no} ${styles[`status-${no.status}`]}`}
                transform={`translate(${no.x}, ${no.y})`}
                onClick={() => onNodeClick?.(id)}
              >
                <circle r={raio} className={styles.circulo} />
                <circle r={raio * 0.28} className={styles.pontoInterno} />
                <text y={raio + 16} className={styles.rotulo}>
                  {no.label}
                </text>
                <text y={raio + 29} className={styles.ip}>
                  {no.ip}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
