import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from '../servicioBackend/rest.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../entidades/Cliente';
import { Usuario } from '../entidades/Usuario';
import { Registro } from '../entidades/Registro';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {
  formCliente: FormGroup;
  usuario:Usuario;
  registrar: Registro;
  constructor(private router: Router,
    public restService: RestService,
    private formBuilder: FormBuilder,
    private rutaActiva: ActivatedRoute) { 
    this.formCliente = this.formBuilder.group({
      nombre:  ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      email: ['', [Validators.required]],
      rut: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.usuario = new Usuario();
    this.registrar = new Registro();
  }

  ngOnInit() {
  }
  saveData(){
    console.log(this.formCliente.value);
    let cliente: Cliente =this.formCliente.value;
    this.usuario.username= cliente.email;
    this.usuario.password=this.formCliente.get("password").value;
    this.registrar.cliente=cliente;
    this.registrar.usuario=this.usuario;
    console.log(this.registrar);
    this.restService.saveClienteUsuario(this.registrar).subscribe(() => {
      return this.restService.getListaProfesional().subscribe((res: any[]) =>{
        this.restService.listaProfesional=res;
      },
      err => console.log(err));
   })
 
  }
}
