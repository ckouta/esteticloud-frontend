import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Profesional } from '../Profesional';
import { Servicio } from '../Servicio';
import { map, switchMap } from 'rxjs/operators';
import { Bloque } from '../Bloque_horario';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private URL = 'http://localhost:8080';
  listaProfesional:Profesional[];
  listaServicio: Servicio[];
  listaBloque:Bloque[];

  constructor(private http: HttpClient) { }

  /*Profesional */
  getListaProfesional() {
    return this.http.get(this.URL+'profesional/listar').pipe(map((res) => res as Profesional[]));
  }
  saveProfesional(profesional: Profesional) {
    return this.http.post<Profesional[]>(this.URL + '/profesional/save', profesional);
  }
  updateProfesional(id: number, profesional:Profesional) {
    return this.http.put(this.URL + '/profesional/update/' + id, profesional);
  }
  /*Servicio */
  getListaServicio() {
    return this.http.get(this.URL +'/servicio/listar').pipe(map((res) => res as Servicio[]));
  }
  getServicio(id:number) {
    return this.http.get(this.URL +'/servicio/servicio/'+id).pipe(map((res) => res as Servicio));
  }
  saveServicio(servicio: Servicio) {
    return this.http.post<Servicio[]>(this.URL + '/servicio/save', servicio);
  }
  updateServicio(id:number, servicio:Servicio) {
    return this.http.put(this.URL + '/servicio/update/' + id, servicio);
  }
  /*Horario */
  getListabloques() {
    return this.http.get('http://localhost:8080/horario/listarbloque').pipe(map((res) => res as Bloque[]));
  }
}
