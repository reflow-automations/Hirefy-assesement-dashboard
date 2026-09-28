export interface JobStatusContext {
  id: number;
  status: string | null;
  skillCount: number;
  questionCount: number;
}

export function describeJobStatus(job: JobStatusContext): { label: string; explanation: string | null } {
  if (job.status === "complete") {
    return { label: "Technisch afgerond", explanation: null };
  }

  if (job.status === "failed_after_retry") {
    if (job.id === 10 && job.skillCount === 22 && job.questionCount === 220) {
      return {
        label: "Proefset niet afgerond",
        explanation: "Deze V4-proefset bevat 22 vaardigheden en 220 vragen. De afgesproken opzet is 21 vaardigheden en 210 vragen. De opgeslagen status vermeldt geen precieze foutstap. Reflow moet de set opnieuw opbouwen en inhoudelijk controleren voordat kandidaten deze gebruiken.",
      };
    }
    return {
      label: "Niet afgerond",
      explanation: "De automatische verwerking is na een nieuwe poging gestopt. Reflow moet de oorzaak onderzoeken en de set controleren voordat kandidaten deze gebruiken.",
    };
  }

  if (job.status === "partial") {
    return {
      label: "Proefrun deels uitgevoerd",
      explanation: "Er zijn al vragen opgeslagen, maar de set is niet volledig afgerond. Reflow moet de resterende vragen en de inhoud controleren voordat kandidaten deze gebruiken.",
    };
  }

  return {
    label: "Status nog onbekend",
    explanation: "De voortgang van deze set is niet bevestigd. Reflow moet de status controleren voordat kandidaten deze gebruiken.",
  };
}
