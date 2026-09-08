/**
 * Dados das fases do Protocol: Breach.
 *
 * Estrutura:
 *   Fase   { id, nome, tema, descricaoGeral, desafios: Desafio[] }
 *   Desafio{ id, descricaoCenario, comandosValidos, comandoDeResolucao,
 *            mensagemSucesso, mensagemErroComandoInvalido }
 *   Comando{ nome, sintaxe, descricao, outputSucesso, outputVariantes?, outputPadrao? }
 *
 * `comandoDeResolucao` é o comando (com parâmetro) que resolve o desafio.
 * Ele NUNCA é revelado ao jogador — pode ou não coincidir com um dos
 * `comandosValidos` listados no Guia do Novato (ver Desafio 3 da Fase 1,
 * em que "isolate" é ao mesmo tempo um comando documentado e a resolução).
 *
 * Para adicionar uma nova fase, basta acrescentar um novo objeto a este
 * array — nenhum outro arquivo precisa ser alterado.
 */

export const fases = [
  {
    id: "fase-1",
    nome: "Redes",
    tema: "Investigação de tráfego de rede anômalo",
    descricaoGeral:
      "O monitoramento da empresa detectou atividade de rede anômala. Investigue a origem, verifique vulnerabilidades e contenha a ameaça.",
    desafios: [
      {
        id: "fase-1-desafio-1",
        descricaoCenario:
          'Alerta recebido às 03:14. O sistema de monitoramento detectou um volume de tráfego anormal na rede interna. Sua tarefa: identificar qual host está gerando esse tráfego suspeito.',
        comandosValidos: [
          {
            nome: "netstat",
            sintaxe: "netstat",
            descricao:
              "Lista as conexões de rede ativas na máquina/rede monitorada.",
            outputSucesso: `Executando netstat...

CONEXÕES ATIVAS:
Protocolo  End. Local        End. Remoto          Status
TCP        10.0.0.5:443      142.250.80.14:443    ESTABELECIDA
TCP        10.0.0.5:80       192.168.1.20:52344   ESTABELECIDA
TCP        10.0.0.5:22       203.0.113.77:51022   ESTABELECIDA (847 conexões nos últimos 5 min)
TCP        10.0.0.5:443      172.217.29.14:443    ESTABELECIDA

>> Aviso: volume incomum de conexões originado de 203.0.113.77`,
          },
          {
            nome: "whois",
            sintaxe: "whois <ip>",
            descricao:
              "Consulta informações de registro (proprietário, localização) de um endereço IP.",
            outputVariantes: {
              "203.0.113.77": `Executando whois 203.0.113.77...

IP: 203.0.113.77
Proprietário: Desconhecido / Faixa não alocada (documentação/teste)
Localização: Indeterminada
Reputação: Sem histórico registrado — endereço fora do padrão de tráfego da empresa

>> Este IP não corresponde a nenhum parceiro ou funcionário conhecido.`,
            },
            outputPadrao: (param) =>
              `Executando whois ${param}...\n\nNenhuma informação de registro relevante encontrada para este endereço.`,
          },
        ],
        comandoDeResolucao: "report 203.0.113.77",
        mensagemSucesso: `Executando report 203.0.113.77...

Host suspeito registrado no sistema de incidentes.
✔ Desafio concluído: Host Suspeito Identificado.`,
        mensagemErroComandoInvalido:
          'Comando não reconhecido: "{comando}"\nDigite HELP ou consulte o Guia do Novato para ver a lista de comandos disponíveis.',
      },
      {
        id: "fase-1-desafio-2",
        descricaoCenario:
          "Host suspeito identificado: 203.0.113.77. Antes de agir, verifique se esse host está explorando alguma porta vulnerável do nosso servidor.",
        comandosValidos: [
          {
            nome: "scan",
            sintaxe: "scan <ip>",
            descricao:
              "Varre um host em busca de portas abertas e serviços em execução.",
            outputVariantes: {
              "203.0.113.77": `Executando scan em 203.0.113.77...

PORTAS ABERTAS:
Porta 22   (SSH)      - Autenticação por chave, sem atividade anômala
Porta 80   (HTTP)     - Servidor web padrão, sem atividade anômala
Porta 23   (TELNET)   - ⚠ Serviço inseguro detectado — tráfego não criptografado ativo

>> Aviso: Porta 23 (Telnet) está ativa e é considerada uma vulnerabilidade crítica.`,
            },
            outputPadrao: (param) =>
              `Executando scan em ${param}...\n\nNenhuma porta relevante encontrada para este host.`,
          },
        ],
        comandoDeResolucao: "flag 23",
        mensagemSucesso: `Executando flag 23...

Porta 23 (Telnet) sinalizada como vulnerabilidade crítica.
✔ Desafio concluído: Vulnerabilidade Identificada.`,
        mensagemErroComandoInvalido:
          'Comando não reconhecido: "{comando}"\nDigite HELP ou consulte o Guia do Novato para ver a lista de comandos disponíveis.',
      },
      {
        id: "fase-1-desafio-3",
        descricaoCenario:
          "Ameaça confirmada. É hora de agir: isole o host malicioso da rede antes que ele cause mais danos.",
        comandosValidos: [
          {
            nome: "isolate",
            sintaxe: "isolate <ip>",
            descricao: "Remove um host da rede, cortando toda comunicação com ele.",
          },
          {
            nome: "block",
            sintaxe: "block <ip>",
            descricao: "Adiciona um IP à lista de bloqueio do firewall.",
            outputVariantes: {
              "203.0.113.77": `Executando block 203.0.113.77...

IP adicionado à lista de bloqueio do firewall.
>> Nota: o bloqueio impede novas conexões, mas conexões já estabelecidas continuam ativas.`,
            },
            outputPadrao: (param) =>
              `Executando block ${param}...\n\nIP adicionado à lista de bloqueio do firewall.`,
          },
        ],
        comandoDeResolucao: "isolate 203.0.113.77",
        mensagemSucesso: `Executando isolate 203.0.113.77...

Host 203.0.113.77 isolado da rede. Todas as conexões ativas foram encerradas.
✔ Desafio concluído: Ameaça Contida.`,
        mensagemErroComandoInvalido:
          'Comando não reconhecido: "{comando}"\nDigite HELP ou consulte o Guia do Novato para ver a lista de comandos disponíveis.',
      },
    ],
  },

  // Fases futuras (2–6) entram aqui como novos objetos, seguindo a mesma
  // estrutura acima. Nenhuma mudança no motor do terminal ou no Guia do
  // Novato é necessária para isso.
];
