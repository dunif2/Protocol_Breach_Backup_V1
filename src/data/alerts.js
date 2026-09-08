/**
 * Feed inicial de alertas do SOC Dashboard. Novos alertas são
 * empilhados em tempo real (ver store) conforme o jogador age no
 * terminal ou no mapa de rede.
 */

export const initialAlerts = [
  { time: "09:14:32", tipo: "erro", texto: "Finance-02 OFFLINE" },
  { time: "09:16:01", tipo: "aviso", texto: "Latência anômala detectada" },
  { time: "09:18:44", tipo: "erro", texto: "Pacotes desconhecidos na porta 4444" },
  { time: "09:19:02", tipo: "info", texto: "Firewall log: 30 tentativas bloqueadas" },
  { time: "09:21:15", tipo: "aviso", texto: "IP suspeito: 45.33.X.X" },
  { time: "09:23:00", tipo: "erro", texto: "Conexão encerrada: DB-Core" },
];
