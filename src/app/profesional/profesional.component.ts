import { Component, OnInit } from '@angular/core';
import { RestService } from '../servicioBackend/rest.service';
import { Router } from '@angular/router';
import { Registro } from '../entidades/Registro';
import Swal from 'sweetalert2';
import { Usuario } from '../entidades/Usuario';

@Component({
  selector: 'app-profesional',
  templateUrl: './profesional.component.html',
  styleUrls: ['./profesional.component.css']
})
export class ProfesionalComponent implements OnInit {
  usuario: Usuario;
  searchText:String;
  cambioContrasena: Registro;
  contrasenaActual: string;
  IsmodelShow2: boolean = false;
  constructor(public restService: RestService, private router: Router) { 
    this.usuario = new Usuario();
    this.cambioContrasena = new Registro();
    this.cambioContrasena.usuario = new Usuario();
  }

  ngOnInit() {
    if (!this.restService.hasRole('ROLE_ESTETI') && !this.restService.hasRole('ROLE_ADMIN')) {
      this.router.navigate(['login']);
    }
  }
  cerrarSesion(){
    this.restService.logout();
  }
  cambiarContrasena(){
    this.cambioContrasena.usuario.password = this.contrasenaActual;
    this.cambioContrasena.usuario.username= this.restService.usuario.username;
    this.restService.updateContrasena(this.cambioContrasena).subscribe(res =>{
      Swal.fire('Cambio de contraseña ', 'La contraseña se cambio con éxito', 'success');
      this.IsmodelShow2 = true;
      this.router.navigate(['login']);
      this.cerrarSesion();
    },err =>{
      Swal.fire('Credenciales incorrectas', 'Las credenciales no coinciden', 'error');
      this.IsmodelShow2 = false;
    })
  }
}
