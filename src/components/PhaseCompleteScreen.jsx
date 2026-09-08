export default function PhaseCompleteScreen({
  fase,
  existeProximaFase,
  onProximaFase,
  onVoltarHub,
}) {
  return (
    <div className="tela">
      <div className="conclusao__caixa">
        <div className="conclusao__icone">✔</div>
        <h1 className="conclusao__titulo">Caso resolvido!</h1>
        <p className="conclusao__fase">
          Fase concluída: <strong>{fase.nome}</strong>
        </p>
        <p>
          Bom trabalho, analista. O incidente foi documentado e a ameaça
          neutralizada. O próximo caso já está na fila.
        </p>
        <div className="conclusao__acoes">
          {existeProximaFase && (
            <button className="botao" onClick={onProximaFase}>
              Próxima Fase
            </button>
          )}
          <button className="botao botao--secundario" onClick={onVoltarHub}>
            Voltar ao Hub
          </button>
        </div>
      </div>
    </div>
  );
}
