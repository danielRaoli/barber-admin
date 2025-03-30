export interface Barber {
  id: number;
  name: string;
  whatsApp: string;
  instagram: string;
  imageUrl: string;
  barbershopId: number;
  timeService: number;  
}


export interface Service {
  id: number;
  name: string;
  price: number;
  color: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
}

 export interface Agendamento {
  id: string;
  codigo: string;
  
  data: Date;
  hora: string;
  barberId: number;
  barber: Barber;
  serviceId: number;
  service: Service;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  code: string;
  appoimentDate: string;
  hour: string;
  status: "agendado" | "concluido" | "cancelado";
}