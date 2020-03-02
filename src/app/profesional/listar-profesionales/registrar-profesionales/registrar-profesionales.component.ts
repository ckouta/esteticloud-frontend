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
  public show:boolean = false;
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

    this.usuario = new Usuario();
    this.registrar = new Registro();
    
  }

  ngOnInit() {
  
    this.rutaActiva.queryParams.subscribe(params => {
      let dato = params['ver'];
      if(dato=="true"){
        this.show= true;
      }

       

    });

  


    this.formProduct = this.formBuilder.group({
      id_profesional: [],
      nombre: [{value: '', disabled: this.show}, [Validators.required, Validators.minLength(2)]],
      apellido: [{value: '', disabled: this.show}, [Validators.required, Validators.minLength(3)]],
      rut: [{value: '', disabled: this.show}, [Validators.required, Validators.pattern(/^\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]{1}$/)]],
      telefono: [{value: '', disabled: this.show}, [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: [{value: '', disabled: this.show}, [Validators.required, Validators.email]],
      estado: [{value: 1, disabled: this.show}, [Validators.required]],
      descripcion: [{value: '', disabled: this.show}, [Validators.required,Validators.maxLength(250)]],
      password: [{value:'', disabled: this.show},[Validators.required,Validators.minLength(6)]]
    });


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
          password: ""
  
        });
        
      })
    }
  }


  guardarProducto(registrar: Registro) {
    console.log(this.fotoSeleccionada);

    this.restService.saveUsuarioProfesional(registrar).subscribe((profesional) => {
      this.restService.saveImagenProfesional(profesional.id_profesional + "", this.fotoSeleccionada).subscribe(() => {
        return this.restService.getListaProfesional().subscribe((res: any[]) => {
          this.restService.listaProfesional = res;
          Swal.fire('Ingreso correcto ', 'Se ingresó correctamente el profesional', 'success')
          this.router.navigate(['profesional/profesional']);
          });
      },
      err =>   {Swal.fire('Imagen', 'Imagen no insertada', 'error'); console.log(err);
        }
      )

    },
    err=> {Swal.fire('Datos incorrectos', 'Profesional no insertado, datos incorrectos o duplicados', 'error');
          console.log(err);
          }
    )
  } 


  actualizarProfesional(profesional: Profesional) {

    this.restService.updateProfesional(profesional.id_profesional, profesional).subscribe(() => {
      Swal.fire('Solicitud aceptada', 'El profesional ha sido actualizado', 'success');
      return this.router.navigate(['profesional/profesional'])
      },
        err =>{
          Swal.fire('Solicitud rechazada', 'El profesional no se pudo actualizar', 'error');
        }
    )
  }

  saveData() {

    if (!this.formProduct.getRawValue().id_profesional) {
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
