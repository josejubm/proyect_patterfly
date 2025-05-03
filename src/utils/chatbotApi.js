import data from '../data/compute_resumen.json';

export function getAnswerFromJson(question) {
    const lowerQuestion = question.toLowerCase();
  
    for (const [folder, info] of Object.entries(data.resumen_global)) {
      if (lowerQuestion.includes(folder.toLowerCase())) {
        if (lowerQuestion.includes("instancias") || lowerQuestion.includes("instances")) {
          return `${folder} tiene ${info.total_instances} instancias.`;
        }
        if (lowerQuestion.includes("proyectos") || lowerQuestion.includes("projects")) {
          return `${folder} tiene ${info.total_proyectos} proyectos.`;
        }
        if (lowerQuestion.includes("ram")) {
          return `${folder} está usando ${info.total_ram_gb} GB de RAM.`;
        }
        if (lowerQuestion.includes("cpu") || lowerQuestion.includes("vcpus")) {
          return `${folder} tiene ${info.total_vcpus} vCPUs.`;
        }
      }
    }
  
    if (lowerQuestion.includes("carpetas") && lowerQuestion.includes("más de") && lowerQuestion.includes("proyectos")) {
      const match = lowerQuestion.match(/más de (\d+)/);
      if (match) {
        const threshold = parseInt(match[1]);
        const result = Object.entries(data.resumen_global)
          .filter(([_, info]) => info.total_proyectos > threshold)
          .map(([folder]) => folder);
  
        if (result.length === 0) return "No hay carpetas con más de ese número de proyectos.";
        return `Carpetas con más de ${threshold} proyectos: ${result.join(', ')}`;
      }
    }
  
    return "No tengo información suficiente para responder esa pregunta.";
  }