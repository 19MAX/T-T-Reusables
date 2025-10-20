import * as yup from "yup";

// Esquema para el paso 1: Servicio
export const step1Schema = yup.object({
  servicioId: yup
    .string()
    .required("Debes seleccionar un servicio"),
});

// Esquema para el paso 2: Información básica
export const step2Schema = yup.object({
  titulo: yup
    .string()
    .required("El título es obligatorio")
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(100, "El título no puede exceder 100 caracteres"),
  descripcionPersonalizada: yup
    .string()
    .optional()
    .max(500, "La descripción no puede exceder 500 caracteres"),
});

// Esquema para el paso 3: Precio e imagen
export const step3Schema = yup.object({
  precioPersonalizado: yup
    .number()
    .optional()
    .positive("El precio debe ser positivo")
    .max(999999, "El precio es demasiado alto"),
  imagen: yup
    .object({
      uri: yup.string().required(),
      mimeType: yup.string().required(),
    })
    .optional(),
});

// Esquema para el paso 4: Disponibilidad
export const step4Schema = yup.object({
  disponibilidad: yup.object({
    diasSemana: yup
      .array()
      .of(yup.string().required())
      .min(1, "Debes seleccionar al menos un día")
      .required("La disponibilidad es obligatoria"),
    horaInicio: yup
      .string()
      .required("La hora de inicio es obligatoria")
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:mm)"),
    horaFin: yup
      .string()
      .required("La hora de fin es obligatoria")
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:mm)")
      .test(
        "is-after-start",
        "La hora de fin debe ser posterior a la hora de inicio",
        function (value) {
          const { horaInicio } = this.parent;
          if (!horaInicio || !value) return true;
          return value > horaInicio;
        }
      ),
  }),
});

// Esquema para el paso 5: Ubicación
export const step5Schema = yup.object({
  ubicacion: yup.object({
    ciudad: yup
      .string()
      .required("La ciudad es obligatoria")
      .min(2, "La ciudad debe tener al menos 2 caracteres"),
    direccion: yup
      .string()
      .optional()
      .max(200, "La dirección no puede exceder 200 caracteres"),
    modalidad: yup
      .mixed<"presencial" | "virtual" | "ambas">()
      .oneOf(["presencial", "virtual", "ambas"])
      .required("Debes seleccionar una modalidad"),
  }),
});

// Esquema completo (para validación final)
export const fullOfertaSchema = step1Schema
  .concat(step2Schema)
  .concat(step3Schema)
  .concat(step4Schema)
  .concat(step5Schema);