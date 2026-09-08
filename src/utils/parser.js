/**
 * Motor de interpretação de comandos do terminal.
 *
 * Regras (ver PRD "Regras de Terminal"):
 *  - Comparação case-insensitive e tolerante a espaços extras.
 *  - Se o comando (com parâmetro) bater com o `comandoDeResolucao` do
 *    desafio atual, o desafio é resolvido — independentemente de esse
 *    comando também aparecer (ou não) em `comandosValidos`.
 *  - Senão, se o nome do comando bater com um item de `comandosValidos`,
 *    retorna o output daquele comando (usando `outputVariantes` quando o
 *    parâmetro digitado corresponde a uma variante conhecida).
 *  - Caso contrário, o comando é desconhecido.
 */

/** Colapsa espaços extras e remove espaços nas pontas, preservando o texto. */
function limparEspacos(texto) {
  return texto.trim().replace(/\s+/g, " ");
}

/** Normaliza para comparação: minúsculas + espaços colapsados. */
function normalizar(texto) {
  return limparEspacos(texto).toLowerCase();
}

/** Separa "comando arg1 arg2" em { nome, param }. */
function separarComando(textoLimpo) {
  const partes = textoLimpo.split(" ");
  const nome = partes[0] || "";
  const param = partes.slice(1).join(" ");
  return { nome, param };
}

/**
 * Interpreta o texto digitado pelo jogador no contexto do desafio atual.
 *
 * @param {string} entradaBruta texto digitado pelo jogador
 * @param {object} desafio desafio atual
 * @returns {
 *   { tipo: 'resolucao', mensagem: string } |
 *   { tipo: 'output', mensagem: string } |
 *   { tipo: 'erro', mensagem: string } |
 *   { tipo: 'ajuda' }
 * }
 */
export function interpretarComando(entradaBruta, desafio) {
  const entradaLimpa = limparEspacos(entradaBruta);
  if (!entradaLimpa) {
    return { tipo: "vazio" };
  }

  const entradaNormalizada = normalizar(entradaLimpa);

  // comando especial global: HELP
  if (entradaNormalizada === "help") {
    return { tipo: "ajuda" };
  }

  // 1. Resolução do desafio?
  if (entradaNormalizada === normalizar(desafio.comandoDeResolucao)) {
    return { tipo: "resolucao", mensagem: desafio.mensagemSucesso };
  }

  // 2. Comando conhecido (mas não resolutivo)?
  const { nome, param } = separarComando(entradaNormalizada);
  const { param: paramOriginal } = separarComando(entradaLimpa);

  const comando = desafio.comandosValidos.find(
    (c) => normalizar(c.nome) === nome
  );

  if (comando) {
    if (comando.outputVariantes) {
      const chaveVariante = Object.keys(comando.outputVariantes).find(
        (chave) => normalizar(chave) === param
      );
      if (chaveVariante) {
        return { tipo: "output", mensagem: comando.outputVariantes[chaveVariante] };
      }
    }
    if (comando.outputSucesso) {
      return { tipo: "output", mensagem: comando.outputSucesso };
    }
    if (comando.outputPadrao) {
      return {
        tipo: "output",
        mensagem: comando.outputPadrao(paramOriginal || "(sem parâmetro)"),
      };
    }
    return {
      tipo: "output",
      mensagem: "Comando executado, mas nenhum resultado relevante foi encontrado.",
    };
  }

  // 3. Comando desconhecido.
  return {
    tipo: "erro",
    mensagem: desafio.mensagemErroComandoInvalido.replace(
      "{comando}",
      entradaLimpa
    ),
  };
}
