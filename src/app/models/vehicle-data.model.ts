export interface VehicleData {
  id: number;
  odometro: number;
  nivelCombustivel: number;
  status: string;
  lat: number;
  long: number;
  vin?: string; // não vem da API; preenchido no client com o código pesquisado
}
