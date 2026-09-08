import { create } from "zustand";
import { persist } from "zustand/middleware";
import { missions } from "../data/missions";
import { initialAlerts } from "../data/alerts";

function horaAtual() {
  const agora = new Date();
  return agora.toTimeString().slice(0, 8);
}

export function calcularNivel(xp) {
  return Math.floor(xp / 500) + 1;
}

const useGameStore = create(
  persist(
    (set) => ({
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

      openMission: (phaseId) => set({ missionModalPhase: phaseId }),
      closeMission: () => set({ missionModalPhase: null }),

      startPhase: (phaseId) =>
        set((state) => ({
          activePhase: phaseId,
          missionModalPhase: null,
          currentScreen: "gameplay",
          objectives: {
            ...state.objectives,
            [phaseId]: state.objectives[phaseId] ?? {},
          },
        })),

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
          alerts: [{ time: horaAtual(), ...alerta }, ...state.alerts],
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
    { name: "protocol-breach-save" }
  )
);

export default useGameStore;
