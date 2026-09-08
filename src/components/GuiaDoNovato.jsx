export default function GuiaDoNovato({ aberto, onFechar, comandos, nomeFase }) {
  if (!aberto) return null;

  return (
    <div className="guia-overlay" onClick={onFechar}>
      <div className="guia-painel" onClick={(e) => e.stopPropagation()}>
        <div className="guia-painel__cabecalho">
          <h2 className="guia-painel__titulo">📖 Guia do Novato</h2>
          <button className="guia-painel__fechar" onClick={onFechar} aria-label="Fechar">
            ×
          </button>
        </div>
        <p className="guia-painel__subtitulo">
          Comandos disponíveis nesta etapa — {nomeFase}
        </p>

        {comandos.map((comando) => (
          <div className="guia-comando" key={comando.nome}>
            <span className="guia-comando__nome">{comando.nome}</span>
            <code className="guia-comando__sintaxe">{comando.sintaxe}</code>
            <p className="guia-comando__descricao">{comando.descricao}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
