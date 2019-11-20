import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfesionalComponent } from './profesional/profesional.component';
import { CalendarioComponent } from './profesional/calendario/calendario.component'; // for FullCalendar!
import { FullCalendarModule } from '@fullcalendar/angular';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component'; 
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { EquipoComponent } from './home/equipo/equipo.component';
import { ServicioComponent } from './home/servicio/servicio.component';
import { ReservaComponent } from './home/reserva/reserva.component';
import { InicioComponent } from './home/inicio/inicio.component';
import { OptionsInput } from '@fullcalendar/core';
import { ListarProfesionalesComponent } from './profesional/listar-profesionales/listar-profesionales.component';
import { HttpClientModule} from '@angular/common/http';
import { RegistrarProfesionalesComponent } from './profesional/registrar-profesionales/registrar-profesionales.component';
import { MovimientosComponent } from './profesional/movimientos/movimientos.component';
import { ClientesComponent } from './profesional/clientes/clientes.component';
import { ProfesionalServicioComponent } from './profesional/profesional-servicio/profesional-servicio.component';
import { RegistrarClientesComponent } from './profesional/registrar-clientes/registrar-clientes.component';
import { HorarioComponent } from './profesional/horario/horario.component';
import { RegistrarServicioComponent } from './profesional/registrar-servicio/registrar-servicio.component';
import { MDBBootstrapModule,WavesModule, TableModule, IconsModule } from 'angular-bootstrap-md';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DetalleServicioComponent } from './profesional/profesional-servicio/detalle-servicio/detalle-servicio.component';
import { ListaHorarioComponent } from './profesional/horario/lista-horario/lista-horario.component';
import { RegistrarHorarioComponent } from './profesional/horario/registrar-horario/registrar-horario.component';
import { RegistrarComponent } from './registrar/registrar.component';

@NgModule({
  declarations: [
    AppComponent,
    ProfesionalComponent,
    CalendarioComponent,
    LoginComponent,
    HomeComponent,
    EquipoComponent,
    ServicioComponent,
    ReservaComponent,
    InicioComponent,
    ListarProfesionalesComponent,
    RegistrarProfesionalesComponent,
    MovimientosComponent,
    ClientesComponent,
    ProfesionalServicioComponent,
    RegistrarClientesComponent,
    HorarioComponent,
    RegistrarServicioComponent,
    DetalleServicioComponent,
    ListaHorarioComponent,
    RegistrarHorarioComponent,
    RegistrarComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FullCalendarModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    WavesModule,
    TableModule,
    IconsModule ,
    NgbModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
