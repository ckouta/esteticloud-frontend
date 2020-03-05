import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../entidades/Usuario';
import { RestService } from '../servicioBackend/rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formUser: FormGroup;
  usuario: Usuario;

  constructor(private router: Router,private restService: RestService) { 
    this.usuario = new Usuario();
  }

  ngOnInit() {
    
  }
  
  
  login(): void{
    //console.log(this.usuario);
    if(this.usuario.username ==null || this.usuario.password == null){
      Swal.fire('Campos vacíos', 'Los campos están vacíos', 'error');
      return;
    }
    this.restService.login(this.usuario).subscribe(response =>{
      //console.log(response);
    this.restService.guardarUsuario(response.access_token);
    this.restService.guardarToken(response.access_token);
    if(this.restService.hasRole('ROLE_CLIENT')){
        this.restService.logout();
        Swal.fire('Credenciales incorrectas', 'Las credenciales no coinciden', 'error');
    }else{
      this.router.navigate(['profesional']);
    }
    }, err =>{
        Swal.fire('Credenciales incorrectas', 'Las credenciales no coinciden', 'error');
    }
    )
  }
}
