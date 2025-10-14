// Utilidad para obtener iniciales
export const getInitials = (name: string = "U"): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
