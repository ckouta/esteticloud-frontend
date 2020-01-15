import { Component, OnInit } from '@angular/core';
import { Usuario } from '../entidades/Usuario';
import { Router } from '@angular/router';
import { RestService } from '../servicioBackend/rest.service';
import Swal from 'sweetalert2';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  usuario: Usuario;
  modalRef: MDBModalRef;
  IsmodelShow: boolean = false;
  constructor(private router: Router, public restService: RestService, private modalService: MDBModalService) {
    this.usuario = new Usuario();
  }

  ngOnInit() {

  }
  login(): void {
    console.log(this.usuario);
    if (this.usuario.username == null || this.usuario.password == null) {
      Swal.fire('campos Vacios', 'Los campos están vacíos', 'error');
      return;
    }
    this.restService.login(this.usuario).subscribe(response => {
      console.log(response);
      this.restService.guardarUsuario(response.access_token);
      this.restService.guardarToken(response.access_token);
      this.router.navigate(['home/reserva']);
      this.IsmodelShow = true;
      this.restService.getCliente(this.usuario.username).subscribe(res =>{
        this.restService.cliente=res;
        console.log(this.restService.cliente);
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


}
