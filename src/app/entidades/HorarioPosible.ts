import { HorarioProfesional } from './HorarioProfesional';

export interface HorarioPosible {
    horaInicio: string;
    horaFin: string;
    horarioProfesional:HorarioProfesional[];
}