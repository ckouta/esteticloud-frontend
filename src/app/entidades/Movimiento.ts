import { Profesional } from './Profesional';
import { estado } from './Estado';

export interface Movimiento {
    id_movimiento: number;
    descripcion:string;
    valor:string;
    fecha:Date;
    profesional:Profesional;
    estado_movimiento:estado;
}