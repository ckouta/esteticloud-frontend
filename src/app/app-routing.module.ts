import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component'; 
import { ProfesionalComponent } from './profesional/profesional.component';
import { EquipoComponent } from './home/equipo/equipo.component';
import { ServicioComponent } from './home/servicio/servicio.component';
import { ReservaComponent } from './home/reserva/reserva.component';
import { InicioComponent } from './home/inicio/inicio.component';
import { ListarProfesionalesComponent } from './profesional/listar-profesionales/listar-profesionales.component';
import { CalendarioComponent } from './profesional/calendario/calendario.component'; // for FullCalendar!
import { RegistrarProfesionalesComponent } from './profesional/listar-profesionales/registrar-profesionales/registrar-profesionales.component';
import { MovimientosComponent } from './profesional/movimientos/movimientos.component';
import { ClientesComponent } from './profesional/clientes/clientes.component';
import { ProfesionalServicioComponent } from './profesional/profesional-servicio/profesional-servicio.component';
import { RegistrarClientesComponent } from './profesional/clientes/registrar-clientes/registrar-clientes.component';
import { HorarioComponent } from './profesional/horario/horario.component';
import { RegistrarServicioComponent } from './profesional/profesional-servicio/registrar-servicio/registrar-servicio.component';
import { DetalleServicioComponent } from './profesional/profesional-servicio/detalle-servicio/detalle-servicio.component';
import { ListaHorarioComponent } from './profesional/horario/lista-horario/lista-horario.component';
import { RegistrarHorarioComponent } from './profesional/horario/registrar-horario/registrar-horario.component';
import { RegistrarComponent } from './registrar/registrar.component';


const routes: Routes = [
  {path:'',redirectTo:'/home', pathMatch:'full'},
  {path:'home',component: HomeComponent,
  children:[
    {path:'',
    component:InicioComponent},
    {path:'equipo',
    component:EquipoComponent},
    {path:'servicio',
    component:ServicioComponent},
    {path:'reserva',
    component:ReservaComponent},
    {path:'registro',
    component:RegistrarComponent}]},
    
  {path:'login',component: LoginComponent},
  {path:'profesional',component: ProfesionalComponent,
  children:[
    {path:'',
    component:CalendarioComponent},
    {path:'profesional',
    component:ListarProfesionalesComponent},
    {path:'registrar',
    component:RegistrarProfesionalesComponent},
    {path:'registrar/:id',
    component:RegistrarProfesionalesComponent},
    {path:'reserva',
    component:CalendarioComponent},
    {path:'movimientos',
    component:MovimientosComponent},
    {path:'clientes',
    component:ClientesComponent},
    {path:'clientes/registrar',
    component:RegistrarClientesComponent},
    {path:'servicios',
    component:ProfesionalServicioComponent},
    {path:'servicios/registrar',
    component:RegistrarServicioComponent},
    {path:'servicios/detalle',
    component:DetalleServicioComponent},
    {path:'horario',
    component:ListaHorarioComponent},
    {path:'horario/registrar',
    component:RegistrarHorarioComponent},
    ]}
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
