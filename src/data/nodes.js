/**
 * Nós e conexões da topologia de rede da Helix Corporation, renderizados
 * pelo componente <NetworkMap>. Coordenadas em um viewBox de 1000x620.
 *
 * `status` inicial de cada nó; pode ser sobrescrito em tempo de execução
 * via `nodeStates` na store (ex: 'finance' passa de 'offline' para
 * 'online' ao restaurar o servidor na Fase 1).
 */

export const networkNodes = {
  router: {
    id: "router",
    label: "ROUTER-CORE",
    ip: "192.168.1.1",
    type: "router",
    status: "online",
    latency: "1ms",
    packets: "OK",
    x: 500,
    y: 90,
  },
  switch1: {
    id: "switch1",
    label: "SWITCH-01",
    ip: "192.168.1.2",
    type: "switch",
    status: "online",
    latency: "2ms",
    packets: "OK",
    x: 305,
    y: 255,
  },
  switch2: {
    id: "switch2",
    label: "SWITCH-02",
    ip: "192.168.1.3",
    type: "switch",
    status: "online",
    latency: "2ms",
    packets: "OK",
    x: 695,
    y: 255,
  },
  finance: {
    id: "finance",
    label: "FINANCE-02",
    ip: "192.168.1.10",
    type: "server",
    status: "offline",
    latency: "TIMEOUT",
    packets: "ERR, 100% loss",
    x: 195,
    y: 430,
    isMissionTarget: true,
  },
  web1: {
    id: "web1",
    label: "WEB-01",
    ip: "192.168.1.20",
    type: "server",
    status: "online",
    latency: "8ms",
    packets: "OK",
    x: 410,
    y: 430,
  },
  mail: {
    id: "mail",
    label: "MAIL-SRV",
    ip: "192.168.1.23",
    type: "server",
    status: "warning",
    latency: "120ms",
    packets: "instável",
    x: 500,
    y: 500,
  },
  db: {
    id: "db",
    label: "DB-CORE",
    ip: "192.168.1.21",
    type: "server",
    status: "degraded",
    latency: "84ms",
    packets: "instável",
    x: 590,
    y: 430,
  },
  hr: {
    id: "hr",
    label: "HR-SRV",
    ip: "192.168.1.22",
    type: "server",
    status: "online",
    latency: "6ms",
    packets: "OK",
    x: 805,
    y: 430,
  },
};

export const networkEdges = [
  { from: "router", to: "switch1" },
  { from: "router", to: "switch2" },
  { from: "router", to: "mail" },
  { from: "switch1", to: "finance" },
  { from: "switch1", to: "web1" },
  { from: "switch2", to: "db" },
  { from: "switch2", to: "hr" },
];
