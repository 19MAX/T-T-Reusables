import axios from "axios";

export interface PersonaData {
  name?: string;
  surname?: string;
  address?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  gender?: string;
  full_name?: string;
  citizen_status?: string;
  civil_status?: string;
  date_of_birth?: string;
  identification?: string;
  place_of_birth?: string;
  profession?: string;
  type_identification?: string;
}

interface ApiResponse {
  code: number;
  data: PersonaData;
  status: string;
  success: boolean;
}

export class CedulaValidationService {
  private baseUrl: string;
  private token: string;

  constructor() {
    this.baseUrl =
      process.env.EXPO_PUBLIC_URL_PERSONAS || "https://api-url.com";
    this.token = process.env.EXPO_PUBLIC_API_PERSONAS || "";
    if (__DEV__) {
      if (!this.baseUrl || !this.token) {
        console.warn("Advertencia: Variables de API no configuradas");
      }
    }
  }

  public async validarCedula(id: string): Promise<ApiResponse | null> {
    try {
      if (!id || !id.trim()) {
        console.warn("ID de cédula vacío");
        return null;
      }
      const endpoint = id.length === 13 ? "api/ruc/" : "api/ci/";
      const url = `${this.baseUrl}/${endpoint}${id}`;
      const response = await axios.get<ApiResponse>(url, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "User-agent": "ReactNativeApp",
        },
        timeout: 10000,
      });
      if (response.status === 200 && response.data) {
        return response.data;
      }
      console.warn(
        `API respondió con estado ${response.status}`,
        response.data
      );
      return null;
    } catch (error: any) {
      if (error.response) {
        console.error(`Error al validar cédula: ${error.response.status}`, {
          data: error.response,
          id,
        });
        if (error.response.status === 404) {
          return null;
        }
      } else if (error.request) {
        console.error("No se recibió respuesta al validar cédula", {
          id,
          request: error.request,
        });
      } else {
        console.error(`Error al configurar la solicitud: ${error.message}`);
      }
      return null;
    }
  }
}

export default new CedulaValidationService();
