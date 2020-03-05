import { Component, OnInit } from '@angular/core';
import { Usuario } from '../entidades/Usuario';
import { Router } from '@angular/router';
import { RestService } from '../servicioBackend/rest.service';
import Swal from 'sweetalert2';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { Registro } from '../entidades/Registro';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  usuario: Usuario;
  modalRef: MDBModalRef;
  IsmodelShow: boolean = false;
  IsmodelShow2: boolean = false;
  cambioContrasena: Registro;
  contrasenaActual: string;
  constructor(private router: Router, public restService: RestService, private modalService: MDBModalService) {
    this.usuario = new Usuario();
    this.cambioContrasena = new Registro();
    this.cambioContrasena.usuario = new Usuario();
  }

  ngOnInit() {

  }
  login(): void {
    //console.log(this.usuario);
    if (this.usuario.username == null || this.usuario.password == null) {
      Swal.fire('Campos vacíos', 'Los campos están vacíos', 'error');
      return;
    }
    this.restService.login(this.usuario).subscribe(response => {
      //console.log(response);
      this.restService.guardarUsuario(response.access_token);
      this.restService.guardarToken(response.access_token);
      this.router.navigate(['home/reserva']);
      this.IsmodelShow = true;
      this.restService.getCliente(this.usuario.username).subscribe(res =>{
        this.restService.cliente=res;
        //console.log(this.restService.cliente);
      })
    }, err => {
      if (err.status == 400) {
        Swal.fire('Credenciales incorrectas', 'Las credenciales no coinciden', 'error');
      }
    }
    )
  }

abrirmodal(){
  if(this.restService.hasRole('ROLE_CLIENT')){
    this.router.navigate(['home/reserva']);
    this.IsmodelShow = true;
  }else{
    this.IsmodelShow = false;
  }
}
cerrarSesion(){
  this.restService.logout();
  this.router.navigate(['home']);
}

cambiarContrasena(){
  this.cambioContrasena.usuario.password = this.contrasenaActual;
  this.cambioContrasena.usuario.username= this.restService.usuario.username;
  this.restService.updateContrasena(this.cambioContrasena).subscribe(res =>{
    Swal.fire('Cambio de contraseña ', 'La contraseña se cambio con éxito', 'success');
    this.IsmodelShow2 = true;
  },err =>{
    Swal.fire('Credenciales incorrectas', 'Las credenciales no coinciden', 'error');
    this.IsmodelShow2 = false;
  })
}
}
