export const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    case "medium":
      return "text-orange-400 bg-orange-500/10 border-orange-500/20";
    case "hard":
      return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    default:
      return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
  }
};
