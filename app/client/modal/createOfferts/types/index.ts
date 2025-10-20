export interface CreateOfertaFormData {
  // Paso 1: Servicio
  servicioId: string;

  // Paso 2: Información básica
  titulo: string;
  descripcionPersonalizada?: string;

  // Paso 3: Precio e imagen
  precioPersonalizado?: number;
  imagen?: {
    uri: string;
    mimeType: string;
  };

  // Paso 4: Disponibilidad
  disponibilidad: {
    diasSemana: string[];
    horaInicio: string;
    horaFin: string;
  };

  // Paso 5: Ubicación
  ubicacion: {
    ciudad: string;
    direccion?: string;
    modalidad: "presencial" | "virtual" | "ambas";
  };
}

export interface FormStepProps {
  onNext: () => void;
  onBack?: () => void;
}

export const DIAS_SEMANA = [
  { value: "lunes", label: "Lunes" },
  { value: "martes", label: "Martes" },
  { value: "miércoles", label: "Miércoles" },
  { value: "jueves", label: "Jueves" },
  { value: "viernes", label: "Viernes" },
  { value: "sábado", label: "Sábado" },
  { value: "domingo", label: "Domingo" },
];

export const MODALIDADES = [
  { value: "presencial", label: "Presencial" },
  { value: "virtual", label: "Virtual" },
  { value: "ambas", label: "Ambas" },
] as const;
