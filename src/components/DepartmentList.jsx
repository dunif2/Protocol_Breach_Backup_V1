import styles from "./DepartmentList.module.css";

export default function DepartmentList({
  departamentos,
  unlockedDepartments,
  unlockedPhases,
  completedPhases,
}) {
  return (
    <div className={styles.lista}>
      <div className={styles.cabecalho}>DEPARTAMENTOS</div>
      {departamentos.map((depto) => {
        const desbloqueado = unlockedDepartments.includes(depto.id);
        const incidentesAtivos = depto.fasesIds.filter(
          (faseId) =>
            unlockedPhases.includes(faseId) && !completedPhases.includes(faseId)
        ).length;

        return (
          <div
            key={depto.id}
            className={`${styles.item} ${
              desbloqueado ? styles.ativo : styles.bloqueado
            }`}
          >
            <span className={styles.icone}>{desbloqueado ? depto.icone : "🔒"}</span>
            <span className={styles.nome}>{depto.nome.toUpperCase()}</span>
            {desbloqueado && incidentesAtivos > 0 && (
              <span className={styles.contagem}>
                {incidentesAtivos} {incidentesAtivos === 1 ? "INCIDENTE" : "INCIDENTES"}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
