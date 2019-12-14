import { estado } from './Estado';

export interface Profesional {
    id_profesional: number;
    nombre: string;
    apellido: string;
    rut:string;
    telefono: string;
    email: string;
    estado:estado;
    descripcion:string;
    foto:File;
}