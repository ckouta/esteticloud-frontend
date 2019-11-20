import { Profesional } from './Profesional';
import { Bloque } from './Bloque_horario';
import { estado } from './Estado';
import { Reserva } from './Reserva';

export interface HorarioProfesional {
    id_horarioProfesional: number;
    fecha: Date;
    profesional: Profesional;
    bloque_horario: Bloque;
    reserva:Reserva;
    estado_horarioProfesional:estado;

}