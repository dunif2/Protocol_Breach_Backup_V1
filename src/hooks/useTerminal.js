import { useState } from "react";
import { interpretarComandoTerminal } from "../data/commands";
import { networkNodes } from "../data/nodes";
import { missions } from "../data/missions";
import useGameStore from "../store/useGameStore";
import { useProgress } from "./useProgress";

/**
 * Hook de terminal: histórico, input e execução de comandos no
 * contexto de uma fase específica. Reutilizado tanto pelo terminal do
 * SOC Dashboard (modo monitor, sem fase ativa) quanto pelo terminal de
 * gameplay (fase ativa, comandos resolvem objetivos).
 *
 * @param {string|null} faseId fase ativa; null = modo apenas leitura (SOC)
 * @param {{ texto: string, tom?: string }[]} historicoInicial
 */
export function useTerminal(faseId, historicoInicial = []) {
  const [historico, setHistorico] = useState(historicoInicial);
  const [valor, setValor] = useState("");
  const [processando, setProcessando] = useState(false);

  const nodeStates = useGameStore((s) => s.nodeStates);
  const objectives = useGameStore((s) => s.objectives);
  const updateNodeState = useGameStore((s) => s.updateNodeState);
  const pushAlert = useGameStore((s) => s.pushAlert);
  const { completarObjetivo } = useProgress();

  function adicionarLinhas(...linhas) {
    setHistorico((atual) => [...atual, ...linhas]);
  }

  function linhasDeConclusaoDaFase(missao) {
    return [
      {
        tipo: "sucesso",
        texto: `✔ FASE CONCLUÍDA: ${missao.title.toUpperCase()} (+${missao.xpReward} XP)`,
      },
      ...(missao.cliffhanger
        ? [{ tipo: "aviso", texto: missao.cliffhanger }]
        : []),
      ...(missao.unlocks
        ? [
            {
              tipo: "info",
              texto: `🔓 Nova fase desbloqueada: ${
                missions[missao.unlocks]?.title ?? missao.unlocks
              }`,
            },
          ]
        : []),
    ];
  }

  function aplicarEfeitos(resultado) {
    resultado.novosAlertas?.forEach((a) => pushAlert(a));
    resultado.nodeUpdates?.forEach(({ id, patch }) => updateNodeState(id, patch));
    if (resultado.completaObjetivo && faseId) {
      completarObjetivo(faseId, resultado.completaObjetivo, {
        onFaseConcluida: (missao) =>
          adicionarLinhas(...linhasDeConclusaoDaFase(missao)),
      });
    }
  }

  function rodarSequenciaRestart(alvoId, objetivoId) {
    setProcessando(true);
    const no = networkNodes[alvoId];
    const estadoAnterior = nodeStates[alvoId]?.status ?? no.status;

    adicionarLinhas({ tipo: "sistema", texto: "Enviando sinal de reinício..." });

    setTimeout(() => {
      adicionarLinhas({ tipo: "sistema", texto: "Aguardando resposta do host..." });

      setTimeout(() => {
        adicionarLinhas({ tipo: "sistema", texto: "Servidor respondendo..." });

        setTimeout(() => {
          updateNodeState(alvoId, { status: "online", latency: "3ms", packets: "OK" });
          adicionarLinhas({
            tipo: "sucesso",
            texto: `✔ ${no.label} ONLINE. Conectividade restaurada.`,
          });
          if (estadoAnterior === "offline") {
            pushAlert({
              tipo: "info",
              texto: `Conectividade restaurada: ${no.label}`,
            });
          }
          if (objetivoId && faseId) {
            completarObjetivo(faseId, objetivoId, {
              onFaseConcluida: (missao) =>
                adicionarLinhas(...linhasDeConclusaoDaFase(missao)),
            });
          }
          setProcessando(false);
        }, 1200);
      }, 1200);
    }, 1200);
  }

  function executar(textoDigitado) {
    if (processando) return;

    const objetivosFase = faseId ? objectives[faseId] ?? {} : {};
    const resultado = interpretarComandoTerminal(textoDigitado, faseId, {
      nodeStates,
      objetivos: objetivosFase,
    });

    if (resultado.tipo === "vazio") return;

    adicionarLinhas({ tipo: "input", texto: textoDigitado.trim() });
    setValor("");

    if (resultado.tipo === "erro") {
      adicionarLinhas({ tipo: "erro", texto: resultado.texto });
      return;
    }

    if (resultado.tipo === "output") {
      adicionarLinhas({ tipo: resultado.tomLinha ?? "output", texto: resultado.texto });
      aplicarEfeitos(resultado);
      return;
    }

    if (resultado.tipo === "restart-sequence") {
      rodarSequenciaRestart(resultado.alvo, resultado.completaObjetivo);
    }
  }

  function enviar(evento) {
    evento?.preventDefault();
    executar(valor);
  }

  return {
    historico,
    valor,
    setValor,
    enviar,
    executar,
    processando,
  };
}
