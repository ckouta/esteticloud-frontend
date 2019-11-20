import { estado } from './Estado';

export interface Profesional {
    id_profesional: number;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    estado:estado;
    foto:File;
}