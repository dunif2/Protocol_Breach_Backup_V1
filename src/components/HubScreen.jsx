const ROTULOS_STATUS = {
  bloqueada: "Bloqueada",
  em_progresso: "Em progresso",
  concluida: "Concluída",
};

export default function HubScreen({ fases, progresso, onSelecionarFase }) {
  return (
    <div className="tela">
      <div className="hub">
        <div className="hub__cabecalho">
          <div className="marca">SOC // SecCorp</div>
          <h1 className="titulo-jogo" style={{ fontSize: "2rem" }}>
            Central de Casos
          </h1>
          <p className="hub__subtitulo">
            Selecione uma fase para acessar o terminal de investigação.
          </p>
        </div>

        <div className="hub__grade">
          {fases.map((fase, indice) => {
            const status = progresso[fase.id]?.status ?? "bloqueada";
            const disponivel = status !== "bloqueada";

            return (
              <button
                key={fase.id}
                className={`cartao-fase ${
                  disponivel ? "cartao-fase--disponivel" : "cartao-fase--bloqueada"
                }`}
                disabled={!disponivel}
                onClick={() => disponivel && onSelecionarFase(fase.id)}
              >
                <span className="cartao-fase__numero">
                  Fase {String(indice + 1).padStart(2, "0")}
                </span>
                <h2 className="cartao-fase__nome">{fase.nome}</h2>
                <p className="cartao-fase__tema">{fase.tema}</p>
                <span className={`status-pill status-pill--${status}`}>
                  {ROTULOS_STATUS[status]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
