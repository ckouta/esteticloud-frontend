import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Profesional } from '../entidades/Profesional';
import { Servicio } from '../entidades/Servicio';
import { map, switchMap } from 'rxjs/operators';
import { Bloque } from '../entidades/Bloque_horario';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Usuario } from '../entidades/Usuario';
import { RangoFecha } from '../entidades/RangoFecha';
import { Registro } from '../entidades/Registro';
import { Reserva } from '../entidades/Reserva';
import { Cliente } from '../entidades/Cliente';
import { HorarioProfesional } from '../entidades/HorarioProfesional';
import { ServicioOfrecido } from '../entidades/ServicioOfrecido';
import { Movimiento } from '../entidades/Movimiento';
import { IntervaloFecha } from '../entidades/IntervaloFecha';


@Injectable({
  providedIn: 'root'
})
export class RestService {

  private URL = 'http://parra.chillan.ubiobio.cl:8080/alvaro.castillo1501';
  listaProfesional: Profesional[];
  listaServicio: Servicio[];
  listaBloque: Bloque[];
  reservas:[];
  cliente: Cliente;
  profesional: Profesional;
  private _usuario: Usuario;
  private _token: string;
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient, private router: Router) { }

  /*Profesional */
  getListaProfesional() {
    return this.http.get(this.URL + '/profesional/').pipe(map((res) => res as Profesional[]));
  }
  getProfesional(id: number) {
    return this.http.get(this.URL + '/profesional/' + id, { headers: this.agregarAuthorizationHeader() }).pipe(map((res) => res as Profesional));
  }
  getProfesionalCorreo(correo: string) {
    return this.http.get(this.URL + '/profesional/p/' + correo, { headers: this.agregarAuthorizationHeader() }).pipe(map((res) => res as Profesional));
  }
  saveProfesional(profesional: Profesional) {
    return this.http.post<Profesional>(this.URL + '/profesional/save', profesional, { headers: this.agregarAuthorizationHeader() });
  }
  saveUsuarioProfesional(registrar: Registro) {
    return this.http.post<Profesional>(this.URL + '/profesional/usuario', registrar, { headers: this.agregarAuthorizationHeader() });
  }
  saveImagenProfesional(id: string, archivo: File) {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    let httpHeaders = new HttpHeaders();
    let token = this.token;
    if (token != null) {
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.http.post(this.URL + '/profesional/saveimagen', formData, { headers: httpHeaders });
  }
  updateProfesional(id: number, profesional: Profesional) {
    return this.http.put(this.URL + '/profesional/' + id, profesional, { headers: this.agregarAuthorizationHeader() });
  }
  deleteProfesional(id: number) {
    return this.http.delete(this.URL + '/profesional/' + id, { headers: this.agregarAuthorizationHeader() });
  }
  /*Cliente*/
  getListaCliente() {
    return this.http.get(this.URL + '/cliente/', { headers: this.agregarAuthorizationHeader() }).pipe(map((res) => res as Cliente[]));
  }
  getCliente(correo: string) {
    return this.http.get(this.URL + '/cliente/' + correo, { headers: this.agregarAuthorizationHeader() }).pipe(map((res) => res as Cliente));
  }
  saveCliente(cliente: Cliente) {
    return this.http.post<Cliente[]>(this.URL + '/cliente/save', cliente, { headers: this.agregarAuthorizationHeader() });
  }
  saveClienteUsuario(registrar: Registro) {
    return this.http.post<Registro[]>(this.URL + '/cliente/usuario', registrar);
  }
  updateCliente(id: number, cliente: Cliente) {
    return this.http.put(this.URL + '/cliente/' + id, cliente, { headers: this.agregarAuthorizationHeader() });
  }
  /*Movimiento */
  getListaMovimiento() {
    return this.http.get(this.URL + '/movimiento/', { headers: this.agregarAuthorizationHeader() }).pipe(map((res) => res as Movimiento[]));
  }
  getMovimiento(id:number) {
    return this.http.get(this.URL + '/movimiento/'+id, { headers: this.agregarAuthorizationHeader() }).pipe(map((res) => res as Movimiento));
  }
  getMovimientoProfesional(profesional: Profesional) {
    return this.http.post(this.URL + '/movimiento/por_profesional' ,profesional, { headers: this.agregarAuthorizationHeader() }).pipe(map((res) => res as Movimiento[]));
  }
  saveMovimiento(movimiento: Movimiento) {
    return this.http.post<Movimiento[]>(this.URL + '/movimiento/save', movimiento, { headers: this.agregarAuthorizationHeader() });
  }
  updateMovimiento(id: number, movimiento: Movimiento) {
    return this.http.put(this.URL + '/movimiento/' + id, movimiento, { headers: this.agregarAuthorizationHeader() });
  }
  deleteMovimiento(id: number) {
    return this.http.delete(this.URL + '/movimiento/' + id, { headers: this.agregarAuthorizationHeader() });
  }
  /*Reserva actualizar metodos */
  getListaReserva() {
    return this.http.get(this.URL + '/reserva/', { headers: this.agregarAuthorizationHeader() }).pipe(map((res) => res as Profesional[]));
  }
  saveReserva(reserva: Reserva) {
    return this.http.post<Reserva>(this.URL + '/reserva/save', reserva, { headers: this.agregarAuthorizationHeader() });
  }
  getReservaCliente(cliente: Cliente) {
    return this.http.post(this.URL + '/reserva/listarRC' ,cliente, { headers: this.agregarAuthorizationHeader() }).pipe(map((res) => res as HorarioProfesional[]));
  }
  /*Servicio Ofrecido */
  getListaServicioOfrecido() {
    return this.http.get(this.URL + '/so/').pipe(map((res) => res as Servicio[]));
  }
  saveServicioOfrecido(servicioOfrecido: ServicioOfrecido) {
    return this.http.post<Servicio>(this.URL + '/so/save', servicioOfrecido, { headers: this.agregarAuthorizationHeader() });
  }
  deleteServicioOfrecido(id: number) {
    return this.http.delete(this.URL + '/so/' + id, { headers: this.agregarAuthorizationHeader() });
  }
  getListaServicioOfrecidoporProfesional(profesional: Profesional) {
    return this.http.post(this.URL + '/so/por_profesional', profesional).pipe(map((res) => res as Servicio[]));
  }
  getListaServicioOfrecidoNoASignadoProfesional(profesional: Profesional) {
    return this.http.post(this.URL + '/so/sin_profesional', profesional, { headers: this.agregarAuthorizationHeader() }).pipe(map((res) => res as Servicio[]));
  }
  getListaServicioOfrecidoporServicio(servicio: Servicio) {
    return this.http.post(this.URL + '/so/profesional', servicio).pipe(map((res) => res as Profesional[]));
  }
  /*Servicio */
  getListaServicio() {
    return this.http.get(this.URL + '/servicio/').pipe(map((res) => res as Servicio[]));
  }
  getServicio(id: number) {
    return this.http.get(this.URL + '/servicio/' + id).pipe(map((res) => res as Servicio));
  }
  saveServicio(servicio: Servicio) {
    return this.http.post<Servicio>(this.URL + '/servicio/save', servicio, { headers: this.agregarAuthorizationHeader() });
  }
  saveImagenServicio(id: string, archivo: File) {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    let httpHeaders = new HttpHeaders();
    let token = this.token;
    if (token != null) {
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.http.post(this.URL + '/servicio/saveimagen', formData, { headers: httpHeaders });
  }
  updateServicio(id: number, servicio: Servicio) {
    return this.http.put(this.URL + '/servicio/' + id, servicio, { headers: this.agregarAuthorizationHeader() });
  }
  /*Horario */
  getListabloques() {
    return this.http.get(this.URL + '/bloque/', { headers: this.agregarAuthorizationHeader() }).pipe(map((res) => res as Bloque[]));
  }
  saveHorario(rangoFecha: RangoFecha) {
    return this.http.post<HorarioProfesional[]>(this.URL + '/horario/save', rangoFecha, { headers: this.agregarAuthorizationHeader() });
  }
  getHorarioprofesional(profesional: Profesional) {
    return this.http.post<HorarioProfesional[]>(this.URL + '/horario/listaHoras', profesional, { headers: this.agregarAuthorizationHeader() });
  }
  getHorarioReserva(reserva: Reserva) {
    return this.http.post<HorarioProfesional>(this.URL + '/horario/hora', reserva, { headers: this.agregarAuthorizationHeader() });
  }
  getHorarioprofesionalfecha(rangoFecha: RangoFecha) {
    return this.http.post<HorarioProfesional[]>(this.URL + '/horario/listafecha', rangoFecha, { headers: this.agregarAuthorizationHeader() });
  }
  updateHorarioReserva(id: number, reserva: Reserva) {
    return this.http.put(this.URL + '/horario/reserva/' + id, reserva, { headers: this.agregarAuthorizationHeader() });
  }
  /*Reportes */

  getTopServicios(fechas: IntervaloFecha) {
    return this.http.post(this.URL + '/horario/topServicio', fechas, { headers: this.agregarAuthorizationHeader() }).pipe(map((res) => res as object[]));
  }
  getTopReservas(fechas: IntervaloFecha) {
    return this.http.post(this.URL + '/horario/topReservas', fechas, { headers: this.agregarAuthorizationHeader() }).pipe(map((res) => res as object[]));
  }
  getTopClientes(fechas: IntervaloFecha) {
    return this.http.post(this.URL + '/horario/topCliente', fechas, { headers: this.agregarAuthorizationHeader() }).pipe(map((res) => res as object[]));
  }
  getTopMovimientos(fechas: IntervaloFecha) {
    return this.http.post(this.URL + '/movimiento/fechas', fechas, { headers: this.agregarAuthorizationHeader() }).pipe(map((res) => res as object[]));
  }
  getTopProfesionales(fechas: IntervaloFecha) {
    return this.http.post(this.URL + '/horario/topProfesional', fechas, { headers: this.agregarAuthorizationHeader() }).pipe(map((res) => res as object[]));
  }
  /*Seguridad*/
  private isNOAutorizado(e): boolean {
    if (e.status == 401 || e.status == 403) {
      this.router.navigate(['login']);
      return true;
    }
    return false;
  }
  login(usuario: Usuario): Observable<any> {
    const credenciales = btoa('angularapp' + ':' + '12345');

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);
    return this.http.post<any>(this.URL + '/oauth/token', params.toString(), { headers: httpHeaders });
  }
  private agregarAuthorizationHeader() {
    let token = this.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }
  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }
  logout(): void {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
  }
  guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }
  guardarUsuario(accessToken: string): void {
    this._usuario = new Usuario();
    let payload = this.obtenerDatosToken(accessToken);

    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));

  }
  obtenerDatosToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }
  isAuthenticated(): boolean {
    let payload = this.obtenerDatosToken(this.token);
    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }
  hasRole(role: string): boolean {
    if (this.usuario.roles.includes(role)) {
      return true;
    }
    return false;
  }
  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }
}
