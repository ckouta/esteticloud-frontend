import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from '../servicioBackend/rest.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
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
      rut: ['', [Validators.required, Validators.pattern(/^\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]{1}$/),this.rutValidator]],
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

  rutValidator(control: AbstractControl): { [key: string]: boolean } | null {
   
    
    
    if(control.value.length>11){
      let dato = control.value.replace(/-/g,'').replace(/\./g,'');
      let dv = dato.slice(dato.length-1);
      dato= dato.substring(0,dato.length-1)
      console.log(dato +" "+ dv);
    }

    
    if (control.value > 18) {
      return { 'age': true };
    }
    return null;
  }

}
