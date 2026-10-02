import { networkNodes } from "./nodes";

/**
 * Comandos do terminal, organizados por fase.
 *
 * Cada comando tem:
 *  - nome, sintaxe: usados no parser e no Codex
 *  - tags, oQueFaz, porQueUsar, exemplo: conteúdo exibido no Codex
 *    (nunca revelam a solução do desafio, apenas a ferramenta)
 *  - executar(paramRaw, ctx): roda o comando no terminal e retorna um
 *    resultado descritivo. `ctx` traz o estado necessário (nodeStates,
 *    objetivos já completados) sem acoplar este arquivo à store.
 *
 * Resultado de `executar`:
 *   {
 *     tipo: 'output' | 'erro' | 'restart-sequence',
 *     texto?: string,               // para 'output'/'erro'
 *     tomLinha?: 'info'|'sucesso'|'erro'|'aviso',
 *     completaObjetivo?: string,
 *     novosAlertas?: { tipo, texto }[],
 *     nodeUpdates?: { id, patch }[],
 *     alvo?: string,                 // para 'restart-sequence': id do nó
 *   }
 */

function normalizarHost(texto) {
  return texto
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");
}

function encontrarNo(query) {
  const alvo = normalizarHost(query);
  return Object.values(networkNodes).find(
    (no) =>
      normalizarHost(no.label) === alvo ||
      no.ip === query.trim() ||
      no.id === alvo
  );
}

export const commandsByPhase = {
  phase1: [
    {
      nome: "ping",
      sintaxe: "ping <host|ip>",
      tags: ["ICMP", "Latência", "Conectividade"],
      oQueFaz:
        "Envia pequenos pacotes (ICMP Echo Request) para um host e espera uma resposta.",
      porQueUsar:
        "Testa se um servidor responde na rede e mede a latência (o tempo de resposta). Se todas as requisições falham ('Request timed out'), o host está offline ou bloqueado.",
      exemplo: "ping finance-02",
      executar: (paramRaw, ctx) => {
        if (!paramRaw) {
          return {
            tipo: "erro",
            texto: "Uso: ping <host|ip>",
          };
        }
        const no = encontrarNo(paramRaw);
        if (!no) {
          return {
            tipo: "erro",
            texto: `Não encontrei o host ${paramRaw}. Confira o nome e tente de novo.`,
          };
        }
        const status = ctx.nodeStates[no.id]?.status ?? no.status;
        if (status === "offline") {
          return {
            tipo: "output",
            tomLinha: "aviso",
            texto: `Disparando ${no.label} [${no.ip}] com 32 bytes de dados:
Esgotado o tempo limite do pedido.
Esgotado o tempo limite do pedido.
Esgotado o tempo limite do pedido.

Estatísticas do Ping para ${no.ip}:
    Pacotes: Enviados = 3, Recebidos = 0, Perdidos = 3 (100% de perda)

>> Aviso: host inacessível. Considere usar tracert para localizar o ponto de falha.`,
            completaObjetivo: no.id === "finance" ? "obj2" : undefined,
          };
        }
        return {
          tipo: "output",
          texto: `Disparando ${no.label} [${no.ip}] com 32 bytes de dados:
Resposta de ${no.ip}: bytes=32 tempo=${no.latency} TTL=64
Resposta de ${no.ip}: bytes=32 tempo=${no.latency} TTL=64
Resposta de ${no.ip}: bytes=32 tempo=${no.latency} TTL=64

Estatísticas do Ping para ${no.ip}:
    Pacotes: Enviados = 3, Recebidos = 3, Perdidos = 0 (0% de perda)`,
        };
      },
    },
    {
      nome: "tracert",
      sintaxe: "tracert <host|ip>",
      tags: ["Roteamento", "Hops", "Topologia"],
      oQueFaz:
        "Mostra o caminho (cada 'hop'/roteador) que um pacote percorre até chegar ao destino.",
      porQueUsar:
        "Quando o ping falha, o tracert mostra em que ponto da rede o pacote para. Dá para saber se o problema está no roteador, no switch ou no próprio servidor.",
      exemplo: "tracert finance-02",
      executar: (paramRaw, ctx) => {
        if (!paramRaw) {
          return { tipo: "erro", texto: "Uso: tracert <host|ip>" };
        }
        const no = encontrarNo(paramRaw);
        if (!no) {
          return {
            tipo: "erro",
            texto: `Não foi possível resolver o host ${paramRaw}.`,
          };
        }
        const status = ctx.nodeStates[no.id]?.status ?? no.status;
        if (status === "offline") {
          return {
            tipo: "output",
            tomLinha: "aviso",
            texto: `Rastreando rota para ${no.label} [${no.ip}]

  1    1 ms   ROUTER-CORE [192.168.1.1]
  2    2 ms   SWITCH-01 [192.168.1.2]
  3    *      Esgotado o tempo limite do pedido.
  4    *      Esgotado o tempo limite do pedido.

>> Rastreamento interrompido: a rota falha entre SWITCH-01 e ${no.label}.`,
          };
        }
        return {
          tipo: "output",
          texto: `Rastreando rota para ${no.label} [${no.ip}]

  1    1 ms   ROUTER-CORE [192.168.1.1]
  2    2 ms   SWITCH-01 [192.168.1.2]
  3    ${no.latency}   ${no.label} [${no.ip}]

Rastreamento concluído.`,
        };
      },
    },
    {
      nome: "ipconfig",
      sintaxe: "ipconfig",
      tags: ["IP", "Sub-rede", "Gateway"],
      oQueFaz:
        "Exibe a configuração de rede da máquina local: IP, máscara de sub-rede e gateway padrão.",
      porQueUsar:
        "Confirma que a sua estação está configurada direito, antes de você sair investigando os outros hosts.",
      exemplo: "ipconfig",
      executar: () => ({
        tipo: "output",
        texto: `Configuração de IP do Windows

Adaptador Ethernet SOC-WORKSTATION:
    Endereço IPv4. . . . . . . . . . : 192.168.1.50
    Máscara de Sub-rede  . . . . . . : 255.255.255.0
    Gateway Padrão . . . . . . . . . : 192.168.1.1`,
      }),
    },
    {
      nome: "netstat",
      sintaxe: "netstat",
      tags: ["Conexões", "TCP/UDP", "Monitoramento"],
      oQueFaz: "Lista as conexões de rede ativas na máquina/rede monitorada.",
      porQueUsar:
        "Mostra quais hosts abriram conexões demais ou fora do padrão. Ajuda a achar tráfego estranho.",
      exemplo: "netstat",
      executar: () => ({
        tipo: "output",
        texto: `Conexões Ativas

  Proto  Endereço Local        Endereço Remoto        Estado
  TCP    192.168.1.50:443      142.250.80.14:443      ESTABELECIDO
  TCP    192.168.1.50:80       192.168.1.20:52344     ESTABELECIDO
  TCP    192.168.1.10:4444     45.33.22.1:51022       ESTABELECIDO

>> Aviso: conexão não usual na porta 4444 envolvendo FINANCE-02.`,
      }),
    },
    {
      nome: "restart",
      sintaxe: "restart <host>",
      tags: ["Recuperação", "Serviço", "Reinicialização"],
      oQueFaz:
        "Envia um sinal de reinicialização para um host e aguarda a confirmação de retorno ao ar.",
      porQueUsar:
        "Força um host a reiniciar a conexão de rede. Útil quando um serviço para de responder.",
      exemplo: "restart finance-02",
      executar: (paramRaw, ctx) => {
        if (!paramRaw) {
          return { tipo: "erro", texto: "Uso: restart <host>" };
        }
        const no = encontrarNo(paramRaw);
        if (!no) {
          return {
            tipo: "erro",
            texto: `Host ${paramRaw} não encontrado.`,
          };
        }
        if (no.id !== "finance") {
          return {
            tipo: "output",
            texto: `${no.label} já está operacional. Nenhuma ação necessária.`,
          };
        }
        if (!ctx.objetivos.obj2) {
          return {
            tipo: "erro",
            texto:
              "Reinício bloqueado. Diagnostique o host antes de tentar reiniciá-lo.",
          };
        }
        return { tipo: "restart-sequence", alvo: no.id, completaObjetivo: "obj3" };
      },
    },
  ],

  phase2: [
    {
      nome: "scan",
      sintaxe: "scan <ip>",
      tags: ["Portas", "Serviços", "Reconhecimento"],
      oQueFaz: "Varre um host em busca de portas abertas e serviços em execução.",
      porQueUsar:
        "Mostra portas e serviços inseguros que podem ser a porta de entrada do problema.",
      exemplo: "scan 192.168.1.10",
      executar: (paramRaw) => {
        if (!paramRaw) return { tipo: "erro", texto: "Uso: scan <ip>" };
        return {
          tipo: "output",
          tomLinha: "aviso",
          texto: `Escaneando ${paramRaw}...

PORTA     SERVIÇO        ESTADO
22/tcp    SSH            fechada
80/tcp    HTTP           fechada
4444/tcp  desconhecido   ⚠ ABERTA, tráfego não autorizado detectado

>> Porta 4444 associada à conexão suspeita registrada no netstat.`,
          completaObjetivo: "obj3",
        };
      },
    },
    {
      nome: "whois",
      sintaxe: "whois <ip>",
      tags: ["Registro", "Reputação", "OSINT"],
      oQueFaz: "Consulta informações de registro de um endereço IP.",
      porQueUsar: "Ajuda a saber se um IP suspeito é conhecido ou legítimo.",
      exemplo: "whois 45.33.22.1",
      executar: (paramRaw) => {
        if (!paramRaw) return { tipo: "erro", texto: "Uso: whois <ip>" };
        return {
          tipo: "output",
          texto: `Executando whois ${paramRaw}...

IP: ${paramRaw}
Proprietário: Desconhecido / faixa não alocada
Reputação: sem histórico, fora do padrão de tráfego da empresa

>> Este IP não corresponde a nenhum parceiro ou funcionário conhecido.`,
          completaObjetivo: "obj2",
        };
      },
    },
    {
      nome: "firewall",
      sintaxe: "firewall block <ip> | firewall status",
      tags: ["Firewall", "Contenção", "Regras"],
      oQueFaz:
        "Gerencia as regras do firewall: bloqueia IPs ou lista as regras ativas.",
      porQueUsar: "Corta a comunicação de uma ameaça já confirmada.",
      exemplo: "firewall block 45.33.22.1",
      executar: (paramRaw) => {
        const partes = (paramRaw || "").trim().split(/\s+/);
        const [acao, alvo] = partes;
        if (normalizarHost(acao || "") === "status") {
          return {
            tipo: "output",
            texto: `Regras de firewall ativas:
  DENY  45.33.22.1  (adicionada manualmente)
  ALLOW 192.168.1.0/24`,
          };
        }
        if (normalizarHost(acao || "") === "block" && alvo) {
          return {
            tipo: "output",
            tomLinha: "sucesso",
            texto: `Regra adicionada: DENY ${alvo}
✔ Invasor bloqueado com sucesso.`,
            completaObjetivo: "obj4",
            novosAlertas: [
              { tipo: "info", texto: `Conexão encerrada: ${alvo}` },
            ],
          };
        }
        return { tipo: "erro", texto: "Uso: firewall block <ip> | firewall status" };
      },
    },
    {
      nome: "netstat",
      sintaxe: "netstat -an",
      tags: ["Conexões", "TCP/UDP", "Monitoramento"],
      oQueFaz: "Lista as conexões de rede ativas, incluindo endereços externos.",
      porQueUsar: "Mostra conexões com IPs externos que fogem do padrão da empresa.",
      exemplo: "netstat -an",
      executar: () => ({
        tipo: "output",
        tomLinha: "aviso",
        texto: `Conexões Ativas (-an)

  Proto  Endereço Local        Endereço Remoto        Estado
  TCP    192.168.1.10:4444     45.33.22.1:51022       ESTABELECIDO

>> Volume incomum de conexões originado de 45.33.22.1.`,
        completaObjetivo: "obj1",
      }),
    },
  ],
};

export function getComandosDaFase(faseId) {
  return commandsByPhase[faseId] ?? [];
}

export function interpretarComandoTerminal(entradaBruta, faseId, ctx) {
  const entradaLimpa = entradaBruta.trim().replace(/\s+/g, " ");
  if (!entradaLimpa) return { tipo: "vazio" };

  const [primeiraPalavra, ...resto] = entradaLimpa.split(" ");
  const nomeComando = primeiraPalavra.toLowerCase();
  const param = resto.join(" ");

  if (nomeComando === "help") {
    const comandos = getComandosDaFase(faseId);
    const lista = comandos
      .map((c) => `  ${c.nome.padEnd(10)} ${c.sintaxe}`)
      .join("\n");
    return {
      tipo: "output",
      tomLinha: "info",
      texto: `Comandos disponíveis:\n${lista}\n\nO CODEX explica cada um com mais detalhe.`,
    };
  }

  const comando = getComandosDaFase(faseId).find(
    (c) => c.nome.toLowerCase() === nomeComando
  );

  if (!comando) {
    return {
      tipo: "erro",
      texto: `Comando não reconhecido: "${entradaLimpa}"\nDigite help ou abra o CODEX para ver o que dá para usar.`,
    };
  }

  return comando.executar(param, ctx);
}
