import { create } from "zustand";
import { persist } from "zustand/middleware";
import { missions } from "../data/missions";
import { initialAlerts } from "../data/alerts";

// Relógio do jogo: cada novo alerta acontece 41 segundos depois do último,
// para o feed ficar em ordem com os alertas fictícios do início (09:14 a 09:23).
const PASSO_DO_RELOGIO_S = 41;

// Pega o maior horário da lista (formato HH:MM:SS compara certo como texto),
// assim saves antigos com a lista em outra ordem também funcionam.
function horarioMaisRecente(alertas) {
  return alertas.map((a) => a.time).sort().at(-1);
}

function proximoHorario(ultimo) {
  const [h, m, s] = (ultimo ?? "09:23:00").split(":").map(Number);
  const total = (h * 3600 + m * 60 + s + PASSO_DO_RELOGIO_S) % 86400;
  const dois = (n) => String(n).padStart(2, "0");
  return `${dois(Math.floor(total / 3600))}:${dois(Math.floor((total % 3600) / 60))}:${dois(total % 60)}`;
}

const DURACAO_CARREGAMENTO_MS = 900;
const SAIDA_CARREGAMENTO_MS = 120;

export function calcularNivel(xp) {
  return Math.floor(xp / 500) + 1;
}

const useGameStore = create(
  persist(
    (set, get) => ({
      // Tela de carregamento: { texto, duracao } enquanto uma transição roda.
      // Não é salvo no localStorage (ver partialize abaixo).
      loading: null,

      // ---- Estado do jogador ----
      xp: 0,
      level: 1,
      currentScreen: "boot", // 'boot' | 'soc' | 'gameplay' | 'codex'
      activePhase: null,
      missionModalPhase: null, // fase mostrada no briefing, null = fechado

      // ---- Progresso ----
      completedPhases: [],
      unlockedPhases: ["phase1"],
      unlockedDepartments: ["network"],

      // objetivos por fase: { phase1: { obj1: true, obj2: false } }
      objectives: {},

      // estado dos nós, sobrepõe os valores base de nodes.js
      nodeStates: {},

      // feed de alertas ao vivo (mais recente primeiro)
      alerts: initialAlerts,

      // ---- Ações de navegação ----
      goToScreen: (screen) => set({ currentScreen: screen }),

      // Mostra a tela de carregamento, roda `acao` com ela totalmente visível
      // e depois libera. Ignora pedidos enquanto outra transição está rodando.
      comCarregamento: (texto, acao, duracao = DURACAO_CARREGAMENTO_MS) => {
        if (get().loading) return;
        set({ loading: { id: Date.now(), texto, duracao } });
        setTimeout(() => {
          acao();
          setTimeout(() => set({ loading: null }), SAIDA_CARREGAMENTO_MS);
        }, duracao);
      },

      goToScreenWithLoading: (screen, texto) =>
        get().comCarregamento(texto, () => set({ currentScreen: screen })),

      openMission: (phaseId) => set({ missionModalPhase: phaseId }),
      closeMission: () => set({ missionModalPhase: null }),

      startPhase: (phaseId) => {
        if (get().loading) return;
        set({ missionModalPhase: null });
        const titulo = missions[phaseId]?.title ?? "";
        get().comCarregamento(`CARREGANDO MISSÃO · ${titulo.toUpperCase()}`, () =>
          set((state) => ({
            activePhase: phaseId,
            currentScreen: "gameplay",
            objectives: {
              ...state.objectives,
              [phaseId]: state.objectives[phaseId] ?? {},
            },
          }))
        );
      },

      // ---- Progresso da missão ----
      completeObjective: (phaseId, objId) =>
        set((state) => ({
          objectives: {
            ...state.objectives,
            [phaseId]: { ...state.objectives[phaseId], [objId]: true },
          },
        })),

      addXP: (amount) =>
        set((state) => {
          const xp = state.xp + amount;
          return { xp, level: calcularNivel(xp) };
        }),

      completePhase: (phaseId) =>
        set((state) => {
          if (state.completedPhases.includes(phaseId)) return {};
          const missao = missions[phaseId];
          const desbloqueio = missao?.unlocks;
          return {
            completedPhases: [...state.completedPhases, phaseId],
            unlockedPhases:
              desbloqueio && !state.unlockedPhases.includes(desbloqueio)
                ? [...state.unlockedPhases, desbloqueio]
                : state.unlockedPhases,
          };
        }),

      updateNodeState: (nodeId, patch) =>
        set((state) => ({
          nodeStates: {
            ...state.nodeStates,
            [nodeId]: { ...state.nodeStates[nodeId], ...patch },
          },
        })),

      pushAlert: (alerta) =>
        set((state) => ({
          alerts: [
            { time: proximoHorario(horarioMaisRecente(state.alerts)), ...alerta },
            ...state.alerts,
          ],
        })),

      resetGame: () =>
        set({
          xp: 0,
          level: 1,
          currentScreen: "boot",
          activePhase: null,
          missionModalPhase: null,
          completedPhases: [],
          unlockedPhases: ["phase1"],
          unlockedDepartments: ["network"],
          objectives: {},
          nodeStates: {},
          alerts: initialAlerts,
        }),
    }),
    {
      name: "protocol-breach-save",
      partialize: (state) =>
        Object.fromEntries(Object.entries(state).filter(([chave]) => chave !== "loading")),
    }
  )
);

export default useGameStore;
