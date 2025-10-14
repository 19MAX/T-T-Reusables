// Utilidad para convertir Firestore timestamp
export const convertFirestoreDate = (
  date: string | { _seconds: number; _nanoseconds: number } | undefined
): string => {
  if (!date) return "No disponible";

  if (typeof date === "object" && "_seconds" in date) {
    return new Date(date._seconds * 1000).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
