import { useEffect, useState } from "react";
import styles from "./BootScreen.module.css";

const LINHAS_BOOT = [
  { tag: "OK", texto: "Initializing SOC systems..." },
  { tag: "OK", texto: "Loading network topology..." },
  { tag: "WARN", texto: "Anomalous traffic detected on subnet 192.168.1.0/24" },
  { tag: "CRIT", texto: "Finance-02 server OFFLINE" },
  { tag: "OK", texto: "Junior analyst credentials verified — Welcome." },
];

const TAG_CLASSE = { OK: "tagOK", WARN: "tagWARN", CRIT: "tagCRIT" };

export default function BootScreen({ onEntrar }) {
  const [linhasVisiveis, setLinhasVisiveis] = useState(0);
  const [mostrarBotao, setMostrarBotao] = useState(false);

  useEffect(() => {
    if (linhasVisiveis < LINHAS_BOOT.length) {
      const timer = setTimeout(() => setLinhasVisiveis((n) => n + 1), 450);
      return () => clearTimeout(timer);
    }
    const timerBotao = setTimeout(() => setMostrarBotao(true), 700);
    return () => clearTimeout(timerBotao);
  }, [linhasVisiveis]);

  return (
    <div className={styles.tela}>
      <div className={styles.marca}>◈ Helix Corporation ◈</div>
      <h1 className={styles.titulo}>PROTOCOL: BREACH</h1>
      <p className={styles.subtitulo}>Cybersecurity Simulation v1.0</p>

      <div className={styles.consola}>
        {LINHAS_BOOT.slice(0, linhasVisiveis).map((linha, indice) => (
          <div key={indice} className={styles.linhaBoot}>
            <span className={styles[TAG_CLASSE[linha.tag]]}>[{linha.tag}]</span>{" "}
            {linha.texto}
          </div>
        ))}
        {linhasVisiveis >= LINHAS_BOOT.length && (
          <div className={styles.cursor}>ready</div>
        )}
      </div>

      {mostrarBotao && (
        <button className={styles.botao} onClick={onEntrar}>
          ▶ ENTER SOC
        </button>
      )}
    </div>
  );
}
