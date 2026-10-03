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
      "Comandos de diagnóstico e recuperação. Com eles você descobre onde a rede quebrou e como religar o que caiu.",
    lore: `A rede da Helix Corporation caiu sem aviso. O financeiro inteiro perdeu acesso aos sistemas, e o FINANCE-02 está offline arrastando outros serviços junto.
Descubra o que aconteceu e coloque o servidor de volta no ar.`,
    objectives: [
      { id: "obj1", text: "Localizar o servidor com problema no mapa de rede (clique nele)" },
      { id: "obj2", text: "Usar ping para testar conectividade" },
      { id: "obj3", text: "Reiniciar a conexão e restaurar o servidor" },
    ],
    learn: ["IP", "Ping", "Tracert", "Roteamento", "Latência", "Servidores", "Pacotes"],
    targetNode: "finance",
    // completar este objetivo ao clicar no nó-alvo no mapa de rede
    nodeClickObjective: "obj1",
    unlocks: "phase2",
    cliffhanger: `[!] ALERTA: tráfego desconhecido na rede.
45.33.22.1 → FINANCE-02, porta 4444.
Isso não acabou. Tem mais coisa aí dentro.`,
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
      "Comandos de análise de tráfego e contenção. Servem para rastrear IPs suspeitos e barrar invasores no firewall.",
    lore: `A rede voltou, mas algo continua errado. Pacotes que ninguém reconhece circulam entre os servidores, e a origem parece ser o IP 45.33.22.1.
Alguém está tentando entrar na infraestrutura da Helix.`,
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
