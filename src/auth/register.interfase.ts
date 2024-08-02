export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  nombre?: string;      // Información personal opcional
  apellido?: string;    // Información personal opcional
  telefono?: string;    // Información personal opcional
  direccion?: string;   // Información de dirección opcional
  referencias?: string; // Información de dirección opcional
  tipo?: string;        // Información de dirección opcional
}

export interface RegisterResponse {
  message: string;
}
