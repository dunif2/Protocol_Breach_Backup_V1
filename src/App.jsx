import { AnimatePresence, motion } from "framer-motion";
import useGameStore from "./store/useGameStore";
import BootScreen from "./screens/BootScreen";
import SOCDashboard from "./screens/SOCDashboard";
import GameplayScreen from "./screens/GameplayScreen";
import CodexScreen from "./screens/CodexScreen";
import MissionModal from "./screens/MissionModal";
import LoadingScreen from "./components/LoadingScreen";

const TELAS = {
  boot: BootScreen,
  soc: SOCDashboard,
  gameplay: GameplayScreen,
  codex: CodexScreen,
};

export default function App() {
  const currentScreen = useGameStore((s) => s.currentScreen);
  const goToScreenWithLoading = useGameStore((s) => s.goToScreenWithLoading);
  const carregando = useGameStore((s) => Boolean(s.loading?.ativo));

  const TelaAtual = TELAS[currentScreen];
  // Durante o carregamento a troca de tela é instantânea: o overlay já cobre tudo.

  return (
    <>
      <div className="grid-bg" />
      <div className="scanline" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: carregando ? 0 : 0.35, ease: "easeInOut" }}
        >
          <TelaAtual
            onEntrar={() => goToScreenWithLoading("soc", "INICIALIZANDO SOC")}
          />
        </motion.div>
      </AnimatePresence>

      <MissionModal />
      <LoadingScreen />
    </>
  );
}
