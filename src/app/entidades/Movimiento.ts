import { Profesional } from './Profesional';
import { estado } from './Estado';

export interface Movimiento {
    id_movimiento: number;
    nombre:string;
    descripcion:string;
    valor:string;
    fecha:Date;
    profesional:Profesional;
    estado_movimiento:estado;
}