import { missions } from "../data/missions";
import useGameStore from "../store/useGameStore";

/**
 * Encapsula a lógica de progresso: completar um objetivo, verificar se
 * a fase inteira foi concluída, conceder XP e desbloquear a próxima fase.
 */
export function useProgress() {
  const completeObjective = useGameStore((s) => s.completeObjective);
  const addXP = useGameStore((s) => s.addXP);
  const completePhase = useGameStore((s) => s.completePhase);
  const pushAlert = useGameStore((s) => s.pushAlert);

  /**
   * @param {string} faseId
   * @param {string} objId
   * @param {{ onFaseConcluida?: (missao: object) => void }} callbacks
   * @returns {boolean} true se essa chamada concluiu a fase inteira
   */
  function completarObjetivo(faseId, objId, { onFaseConcluida } = {}) {
    completeObjective(faseId, objId);

    const missao = missions[faseId];
    const objetivosAtualizados = {
      ...useGameStore.getState().objectives[faseId],
      [objId]: true,
    };
    const todasCompletas = missao.objectives.every(
      (o) => objetivosAtualizados[o.id]
    );
    const jaConcluida = useGameStore
      .getState()
      .completedPhases.includes(faseId);

    if (todasCompletas && !jaConcluida) {
      addXP(missao.xpReward);
      completePhase(faseId);
      pushAlert({
        tipo: "sucesso",
        texto: `Fase concluída: ${missao.title} (+${missao.xpReward} XP)`,
      });
      if (missao.unlocks) {
        pushAlert({
          tipo: "aviso",
          texto:
            missao.cliffhangerAlerta ??
            `Nova fase desbloqueada: ${missions[missao.unlocks]?.title}`,
        });
      }
      onFaseConcluida?.(missao);
      return true;
    }
    return false;
  }

  return { completarObjetivo };
}
