export const routes = {
    ofertas: {
      crear: "/client/modal/createOfferts" as const,
      misofertas: "/client/modal/myOfferts" as const,
    },
    creditos: {
      comprar: "/creditos/comprar" as const,
    },
    servicios: {
      solicitar: "/servicios/solicitar" as const,
      missolicitudes: "/servicios/mis-solicitudes" as const,
    },
  } as const;