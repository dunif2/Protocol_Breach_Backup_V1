import { useEffect, useRef } from "react";
import styles from "./Terminal.module.css";

/**
 * Terminal genérico e reutilizável: histórico rolável + input com prompt
 * fixo + pills de atalho opcionais. A lógica de execução de comandos vive
 * em `useTerminal` (hooks/useTerminal.js) — este componente é só a UI.
 */
export default function Terminal({
  titulo = "TERMINAL",
  promptLabel = "$",
  historico,
  valor,
  onValorChange,
  onEnviar,
  placeholder = "digite um comando...",
  pills,
  onPillClick,
  processando = false,
}) {
  const historicoRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (historicoRef.current) {
      historicoRef.current.scrollTop = historicoRef.current.scrollHeight;
    }
  }, [historico]);

  useEffect(() => {
    if (!processando) inputRef.current?.focus();
  }, [processando]);

  return (
    <div className={styles.terminal}>
      <div className={styles.barra}>
        <span className={styles.ponto} style={{ background: "#ff5f56" }} />
        <span className={styles.ponto} style={{ background: "#ffbd2e" }} />
        <span className={styles.ponto} style={{ background: "#27c93f" }} />
        <span className={styles.titulo}>{titulo}</span>
        <span className={styles.versao}>v1.0</span>
      </div>

      <div className={styles.historico} ref={historicoRef}>
        {historico.map((linha, indice) => (
          <div
            key={indice}
            className={`${styles.linha} ${
              styles[
                "linha-" + (linha.tipo === "input" ? "input" : linha.tipo || "output")
              ]
            }`}
          >
            {linha.tipo === "input" ? (
              <>
                <span className={styles.prompt}>{promptLabel}</span>
                {linha.texto}
              </>
            ) : (
              linha.texto
            )}
          </div>
        ))}
      </div>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          onEnviar();
        }}
      >
        <span className={styles.promptFixo}>{promptLabel}</span>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          value={valor}
          onChange={(e) => onValorChange(e.target.value)}
          placeholder={processando ? "processando..." : placeholder}
          autoComplete="off"
          spellCheck={false}
          disabled={processando}
        />
      </form>

      {pills && pills.length > 0 && (
        <div className={styles.pills}>
          {pills.map((pill) => (
            <button
              key={pill}
              type="button"
              className={styles.pill}
              disabled={processando}
              onClick={() => onPillClick(pill)}
            >
              {pill}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
