import { useEffect, useRef, useState } from "react";
import { interpretarComando } from "../utils/parser";
import GuiaDoNovato from "./GuiaDoNovato";

function linhaTicket(desafio) {
  return `NOVO TICKET RECEBIDO\n${desafio.descricaoCenario}`;
}

function bannerFaseConcluida(fase) {
  const titulo = `FASE CONCLUÍDA: ${fase.nome.toUpperCase()}`;
  const borda = "═".repeat(Math.max(titulo.length, 20));
  return `${borda}\n${titulo}\n${borda}`;
}

export default function TerminalScreen({ fase, onFaseConcluida, onVoltarHub }) {
  const [desafioIndex, setDesafioIndex] = useState(0);
  const [historico, setHistorico] = useState(() => [
    { tipo: "sistema", texto: linhaTicket(fase.desafios[0]) },
  ]);
  const [valorInput, setValorInput] = useState("");
  const [guiaAberta, setGuiaAberta] = useState(false);
  const [faseConcluida, setFaseConcluida] = useState(false);

  const historicoRef = useRef(null);
  const inputRef = useRef(null);

  const desafioAtual = fase.desafios[desafioIndex];

  useEffect(() => {
    if (historicoRef.current) {
      historicoRef.current.scrollTop = historicoRef.current.scrollHeight;
    }
  }, [historico]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [faseConcluida]);

  function adicionarLinhas(...linhas) {
    setHistorico((atual) => [...atual, ...linhas]);
  }

  function handleSubmit(evento) {
    evento.preventDefault();
    if (faseConcluida) return;

    const digitado = valorInput;
    const resultado = interpretarComando(digitado, desafioAtual);

    if (resultado.tipo === "vazio") {
      return;
    }

    setValorInput("");
    const linhaInput = { tipo: "input", texto: digitado.trim() };

    if (resultado.tipo === "ajuda") {
      adicionarLinhas(linhaInput, {
        tipo: "sistema",
        texto: "Consulte o Guia do Novato para ver a lista de comandos disponíveis.",
      });
      setGuiaAberta(true);
      return;
    }

    if (resultado.tipo === "erro") {
      adicionarLinhas(linhaInput, { tipo: "erro", texto: resultado.mensagem });
      return;
    }

    if (resultado.tipo === "output") {
      adicionarLinhas(linhaInput, { tipo: "output", texto: resultado.mensagem });
      return;
    }

    if (resultado.tipo === "resolucao") {
      const ehUltimoDesafio = desafioIndex === fase.desafios.length - 1;

      if (ehUltimoDesafio) {
        adicionarLinhas(
          linhaInput,
          { tipo: "sucesso", texto: resultado.mensagem },
          { tipo: "banner", texto: bannerFaseConcluida(fase) }
        );
        setFaseConcluida(true);
      } else {
        const proximoDesafio = fase.desafios[desafioIndex + 1];
        adicionarLinhas(
          linhaInput,
          { tipo: "sucesso", texto: resultado.mensagem },
          { tipo: "sistema", texto: linhaTicket(proximoDesafio) }
        );
        setDesafioIndex((i) => i + 1);
      }
    }
  }

  return (
    <div className="terminal-tela">
      <div className="terminal-tela__topo">
        <span className="terminal-tela__fase">{fase.nome}</span>
        <span className="terminal-tela__progresso">
          {faseConcluida
            ? "Todos os desafios concluídos"
            : `Desafio ${desafioIndex + 1} de ${fase.desafios.length}`}
        </span>
        <button className="botao botao--secundario" onClick={onVoltarHub}>
          Voltar ao Hub
        </button>
      </div>

      <div className="terminal-janela">
        <div className="terminal-janela__barra">
          <span className="terminal-janela__ponto" style={{ background: "#ff5f56" }} />
          <span className="terminal-janela__ponto" style={{ background: "#ffbd2e" }} />
          <span className="terminal-janela__ponto" style={{ background: "#27c93f" }} />
          <span className="terminal-janela__titulo">soc-terminal — {fase.id}</span>
        </div>

        <div className="terminal-janela__historico" ref={historicoRef}>
          {historico.map((linha, indice) => (
            <div key={indice} className={`linha linha--${linha.tipo}`}>
              {linha.tipo === "input" ? (
                <>
                  <span className="linha__prompt">visitante@seccorp:~$</span>
                  {linha.texto}
                </>
              ) : (
                linha.texto
              )}
            </div>
          ))}
        </div>

        {faseConcluida ? (
          <div className="terminal-tela__rodape" style={{ padding: "12px 16px" }}>
            <button className="botao" onClick={() => onFaseConcluida(fase.id)}>
              Ver Resumo da Fase
            </button>
          </div>
        ) : (
          <form className="terminal-janela__form" onSubmit={handleSubmit}>
            <span className="terminal-janela__prompt-fixo">visitante@seccorp:~$</span>
            <input
              ref={inputRef}
              className="terminal-janela__input"
              type="text"
              value={valorInput}
              onChange={(e) => setValorInput(e.target.value)}
              autoFocus
              autoComplete="off"
              spellCheck={false}
              placeholder="digite um comando..."
            />
            <button type="submit" className="terminal-janela__enviar">
              Enviar
            </button>
          </form>
        )}
      </div>

      <button
        className="guia-fab"
        onClick={() => setGuiaAberta(true)}
        aria-label="Abrir Guia do Novato"
        title="Guia do Novato"
      >
        📖
      </button>

      <GuiaDoNovato
        aberto={guiaAberta}
        onFechar={() => setGuiaAberta(false)}
        comandos={desafioAtual.comandosValidos}
        nomeFase={fase.nome}
      />
    </div>
  );
}
