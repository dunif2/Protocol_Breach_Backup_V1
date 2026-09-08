/**
 * Departamentos do SOC. Cada departamento agrupa um conjunto de fases
 * (ver `missions.js`). Departamentos bloqueados exibem cadeado no Hub
 * até que sejam desbloqueados via progresso do jogador.
 */

export const departments = [
  {
    id: "network",
    nome: "Redes",
    icone: "🌐",
    fasesIds: ["phase1", "phase2"],
  },
  {
    id: "endpoint",
    nome: "Segurança de Endpoint",
    icone: "🔒",
    fasesIds: [],
  },
  {
    id: "crypto",
    nome: "Criptografia",
    icone: "🔒",
    fasesIds: [],
  },
  {
    id: "forensics",
    nome: "Forense Digital",
    icone: "🔒",
    fasesIds: [],
  },
];
