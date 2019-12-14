import { Servicio } from './Servicio';
import { Profesional } from './Profesional';

export interface ServicioOfrecido {
    id_servicioOfrecido: number;
    servicio: Servicio;
    profesional: Profesional;
}