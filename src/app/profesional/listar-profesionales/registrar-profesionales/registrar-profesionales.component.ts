import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Profesional } from 'src/app/entidades/Profesional';
import { RestService } from '../../../servicioBackend/rest.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from 'src/app/entidades/Usuario';
import { Registro } from 'src/app/entidades/Registro';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-profesionales',
  templateUrl: './registrar-profesionales.component.html',
  styleUrls: ['./registrar-profesionales.component.css']
})
export class RegistrarProfesionalesComponent implements OnInit {
  ProfesionalActualizar: Profesional = null;
  fotoSeleccionada: File;
  formProduct: FormGroup;
  usuario: Usuario;
  registrar: Registro;
  constructor(
    private router: Router,
    public restService: RestService,
    private formBuilder: FormBuilder,
    private rutaActiva: ActivatedRoute
  ) {

    this.formProduct = this.formBuilder.group({
      id_profesional: [],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      rut: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      email: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      password: ['']
    });
    this.usuario = new Usuario();
    this.registrar = new Registro();
  }

  ngOnInit() {
    if (this.rutaActiva.snapshot.params.id != null) {
       this.restService.getProfesional(this.rutaActiva.snapshot.params.id).subscribe((res: any) => {
        this.ProfesionalActualizar = res;
        this.formProduct.setValue({
          id_profesional: this.ProfesionalActualizar.id_profesional,
          nombre: this.ProfesionalActualizar.nombre,
          apellido: this.ProfesionalActualizar.apellido,
          telefono: this.ProfesionalActualizar.telefono,
          email: this.ProfesionalActualizar.email,
          rut: this.ProfesionalActualizar.rut,
          estado: res.estado_profesional,
          descripcion: this.ProfesionalActualizar.descripcion,
          password: ''
  
        });
        console.log(this.ProfesionalActualizar)
      })
    }

  }
  guardarProducto(registrar: Registro) {
    console.log(this.fotoSeleccionada);


    this.restService.saveUsuarioProfesional(registrar).subscribe((profesional) => {
      this.restService.saveImagenProfesional(profesional.id_profesional + "", this.fotoSeleccionada).subscribe(() => {
        return this.restService.getListaProfesional().subscribe((res: any[]) => {
          this.restService.listaProfesional = res;
          Swal.fire('Ingreso Correcto ', 'Se ingreso el profesional', 'success')
          this.router.navigate(['profesional/profesional']);
          });
      },
      err =>   {Swal.fire('Imagen', 'imagen no insertada', 'error')}
      )

    },
    err=> {Swal.fire('Datos incorrectos', 'profesional no insertado, Datos incorrectos o duplicados', 'error')}
    )
  } 
  actualizarProfesional(profesional: Profesional) {

    this.restService.updateProfesional(profesional.id_profesional, profesional).subscribe(() => {
      return this.restService.getListaProfesional().subscribe((res: any[]) => {
        this.restService.listaProfesional = res;
      },
        err => console.log(err));
    })
  }

  saveData() {

    if (this.formProduct.getRawValue().id_profesional == null) {
      let profesional: Profesional = this.formProduct.value;
      this.usuario.username = profesional.email;
      this.usuario.password = this.formProduct.get("password").value;
      this.registrar.profesional = profesional;
      this.registrar.usuario = this.usuario;
      this.guardarProducto(this.registrar);
    } else {
      this.actualizarProfesional(this.formProduct.value);
    }
    //this.router.navigate(['profesional/profesional']);
    console.log(this.formProduct.value);
  }
  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
  }
}
