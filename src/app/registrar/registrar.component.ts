import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from '../servicioBackend/rest.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../entidades/Cliente';
import { Usuario } from '../entidades/Usuario';
import { Registro } from '../entidades/Registro';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {
  formCliente: FormGroup;
  usuario: Usuario;
  registrar: Registro;
  constructor(private router: Router,
    public restService: RestService,
    private formBuilder: FormBuilder,
    private rutaActiva: ActivatedRoute) {
    this.formCliente = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required, Validators.minLength(9),Validators.maxLength(9)]],
      email: ['', [Validators.required, Validators.email]],
      rut: ['', [Validators.required, Validators.pattern(/^\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]{1}$/)]],
      password: ['', [Validators.required,Validators.minLength(6)]],
    });
    this.usuario = new Usuario();
    this.registrar = new Registro();
  }

  ngOnInit() {
  }
  saveData() {
    console.log(this.formCliente.value);
    let cliente: Cliente = this.formCliente.value;
    this.usuario.username = cliente.email;
    this.usuario.password = this.formCliente.get("password").value;
    this.registrar.cliente = cliente;
    this.registrar.usuario = this.usuario;
    console.log(this.registrar);
    this.restService.saveClienteUsuario(this.registrar).subscribe(() => {
      Swal.fire('Solicitud aceptada', 'Se ha registrado correctamente', 'success');
      return this.router.navigate([''])

    }, err =>{
      
      Swal.fire('Solicitud rechazada', 'Hay errores al momento de generar la solicitud', 'error');
    })
  }
  regresar(){
    Swal.fire({
      title: '¿Estás seguro que deseas salir del formulario de registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'   
    }).then((result) => {
      if (result.value) {
        this.router.navigate(['']);
      }
    })
  }
}
