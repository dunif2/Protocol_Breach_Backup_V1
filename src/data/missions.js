/**
 * Dados das missões (fases). Estrutura baseada no prompt "código completo":
 * cada fase pertence a um departamento, tem lore, objetivos e recompensa
 * de XP. `unlocks` aponta para a próxima fase liberada ao concluir esta.
 */

export const missions = {
  phase1: {
    id: "phase1",
    department: "network",
    title: "Network Failure",
    phase: "FASE 01 · DEPARTAMENTO DE REDES",
    priority: "CRÍTICO",
    xpReward: 350,
    codexDescricao:
      "Comandos de diagnóstico e recuperação. Aprenda a localizar falhas e restaurar conectividade na rede corporativa.",
    lore: `A rede principal da Helix Corporation sofreu uma queda inesperada.
Funcionários do setor financeiro perderam acesso a todos os sistemas.
O servidor FINANCE-02 está offline e gerando cascata de falhas.
Seu trabalho é investigar, identificar o problema e restaurar a conectividade.`,
    objectives: [
      { id: "obj1", text: "Localizar o servidor offline no mapa de rede" },
      { id: "obj2", text: "Usar ping para testar conectividade" },
      { id: "obj3", text: "Reiniciar a conexão e restaurar o servidor" },
    ],
    learn: ["IP", "Ping", "Tracert", "Roteamento", "Latência", "Servidores", "Pacotes"],
    targetNode: "finance",
    // completar este objetivo ao clicar no nó-alvo no mapa de rede
    nodeClickObjective: "obj1",
    unlocks: "phase2",
    cliffhanger: `[!] ALERTA: Tráfego desconhecido detectado na rede
45.33.22.1 → FINANCE-02 · Porta 4444
Investigação adicional necessária.`,
    cliffhangerAlerta: "Tráfego desconhecido detectado: 45.33.22.1 → FINANCE-02",
  },
  phase2: {
    id: "phase2",
    department: "network",
    title: "Unknown Traffic",
    phase: "FASE 02 · DEPARTAMENTO DE REDES",
    priority: "ALTO",
    xpReward: 500,
    codexDescricao:
      "Comandos de análise de tráfego e contenção. Aprenda a rastrear IPs suspeitos e bloquear invasores com o firewall.",
    lore: `Com a rede restaurada, algo estranho aparece: pacotes desconhecidos
circulando entre os servidores. Uma conexão não autorizada foi detectada vindo
do IP 45.33.22.1. Alguém está tentando se infiltrar na infraestrutura da Helix.`,
    objectives: [
      { id: "obj1", text: "Identificar tráfego suspeito na rede" },
      { id: "obj2", text: "Rastrear a origem do IP desconhecido" },
      { id: "obj3", text: "Analisar portas abertas no servidor comprometido" },
      { id: "obj4", text: "Ativar firewall e bloquear o invasor" },
    ],
    learn: ["Portas", "Protocolos", "TCP/UDP", "Firewall", "IDS", "Análise de Tráfego"],
    targetNode: "finance",
    unlocks: null,
  },
};

export const missionOrder = ["phase1", "phase2"];
