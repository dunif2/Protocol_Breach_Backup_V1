import { AnimatePresence, motion } from "framer-motion";
import useGameStore from "./store/useGameStore";
import BootScreen from "./screens/BootScreen";
import SOCDashboard from "./screens/SOCDashboard";
import GameplayScreen from "./screens/GameplayScreen";
import CodexScreen from "./screens/CodexScreen";
import MissionModal from "./screens/MissionModal";

const TELAS = {
  boot: BootScreen,
  soc: SOCDashboard,
  gameplay: GameplayScreen,
  codex: CodexScreen,
};

export default function App() {
  const currentScreen = useGameStore((s) => s.currentScreen);
  const goToScreen = useGameStore((s) => s.goToScreen);

  const TelaAtual = TELAS[currentScreen];

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
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <TelaAtual onEntrar={() => goToScreen("soc")} />
        </motion.div>
      </AnimatePresence>

      <MissionModal />
    </>
  );
}
