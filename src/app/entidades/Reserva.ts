import { Servicio } from './Servicio';
import { estado } from './Estado';
import { Cliente } from './Cliente';

export interface Reserva {
    id_reserva: number;
    cliente: Cliente;
    servicio: Servicio;
    estado_reserva: estado;

}