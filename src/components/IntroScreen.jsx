export default function IntroScreen({ onIniciar }) {
  return (
    <div className="tela">
      <div className="marca">Protocol :: Breach</div>
      <h1 className="titulo-jogo">PROTOCOL: BREACH</h1>
      <div className="intro__caixa">
        <p className="intro__texto">
          {"> CONEXÃO SEGURA ESTABELECIDA...\n"}
          {"> Bem-vindo(a) à SecCorp.\n\n"}
          Você acaba de ser contratado(a) como{" "}
          <strong>Analista de Segurança Júnior</strong> no Centro de Operações
          de Segurança (SOC) da empresa. Sua função é investigar alertas,
          analisar evidências e responder a incidentes usando o terminal de
          operações — a mesma ferramenta usada pelos analistas seniores.
          {"\n\n"}
          Cada caso é uma fase. Cada fase esconde pistas que só serão
          reveladas através dos comandos certos, no momento certo. Ninguém vai
          te dar a resposta — mas o{" "}
          <strong>Guia do Novato</strong> (o ícone flutuante no terminal)
          sempre estará à mão para lembrar como cada comando funciona.
          {"\n\n"}
          O primeiro alerta já está esperando por você.
        </p>
        <p className="intro__prompt">{"> aguardando_credenciais... acesso concedido"}</p>
        <div className="intro__acoes">
          <button className="botao" onClick={onIniciar}>
            Iniciar
          </button>
        </div>
      </div>
    </div>
  );
}
