import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from 'src/app/servicioBackend/rest.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Servicio } from 'src/app/entidades/Servicio';
import Swal from 'sweetalert2';
import { ServicioOfrecido } from 'src/app/entidades/ServicioOfrecido';
@Component({
  selector: 'app-registrar-servicio',
  templateUrl: './registrar-servicio.component.html',
  styleUrls: ['./registrar-servicio.component.css']
})
export class RegistrarServicioComponent implements OnInit {
  formServicio: FormGroup;
  servicioActualizar: Servicio;
  fotoSeleccionada: File;
  show:boolean=false;
  constructor(private router: Router,
    public restService: RestService,
    private formBuilder: FormBuilder,
    private rutaActiva: ActivatedRoute) {
    
  }

  ngOnInit() {
    this.rutaActiva.queryParams.subscribe(params => {
      let dato = params['ver'];
      if(dato=="true"){
        this.show= true;
      }
    });
    this.formServicio = this.formBuilder.group({
      id_servicio: [],
      nombre: [{value: '', disabled: this.show}, [Validators.required]],
      duracion: [{value: '', disabled: this.show}, [Validators.required]],
      precio: [{value: '', disabled: this.show}, [Validators.required]],
      descripcion: [{value: '', disabled: this.show}, [Validators.required,Validators.maxLength(250)]],
    });
    if (this.rutaActiva.snapshot.params.id != null) {
      this.restService.getServicio(this.rutaActiva.snapshot.params.id).subscribe((res => {

        this.servicioActualizar = res;

        this.formServicio.setValue({
          id_servicio: this.servicioActualizar.id_servicio,
          nombre: this.servicioActualizar.nombre,
          duracion: this.servicioActualizar.duracion,
          precio: this.servicioActualizar.precio,
          descripcion: this.servicioActualizar.descripcion,
        });
      })
      )
    }
  }
  guardarServicio(servicio: Servicio) {
    this.restService.saveServicio(servicio).subscribe((servicio) => {
      let ServicioOfrecido: ServicioOfrecido = { id_servicioOfrecido: null, profesional: this.restService.profesional, servicio: servicio };
      this.restService.saveServicioOfrecido(ServicioOfrecido).subscribe((res => { 
      }))
      if (this.fotoSeleccionada == null) {
        return this.restService.getListaServicio().subscribe((res: any[]) => {
          this.restService.listaServicio = res;
          Swal.fire('Actualización servicio ', 'Servicio correctamente actualizado', 'success')
          this.router.navigate(['profesional/servicios']);
        },
          err => console.error(err));
      }
      this.restService.saveImagenServicio(servicio.id_servicio + "", this.fotoSeleccionada).subscribe(() => {
        return this.restService.getListaServicio().subscribe((res: any[]) => {
          this.restService.listaServicio = res;
          Swal.fire('Ingreso correcto ', 'Servicio correctamente ingresado', 'success')
          this.router.navigate(['profesional/servicios']);
        },
          err => {
            Swal.fire('Imagen', 'Imagen no insertada', 'error')
            this.router.navigate(['profesional/servicios']);
          })
      },
        err => {
          Swal.fire('Imagen', 'Imagen no insertada', 'error')
          this.router.navigate(['profesional/servicios']);
        }
      )

    },
      err => {
        Swal.fire('Servicio', 'Servicio no insertado', 'error')
      })
  }
  actualizarServicio(servicio: Servicio) {

    this.restService.updateServicio(servicio.id_servicio, servicio).subscribe(() => {
      if (this.fotoSeleccionada == null) {
        
        return this.restService.getListaServicio().subscribe((res: any[]) => {
          this.restService.listaServicio = res;
          Swal.fire('Actualización servicio ', 'Servicio correctamente actualizado', 'success')
          this.router.navigate(['profesional/servicios']);
        },
          err => console.error(err));
      }
      this.restService.saveImagenServicio(servicio.id_servicio + "", this.fotoSeleccionada).subscribe(() => {
        return this.restService.getListaServicio().subscribe((res: any[]) => {
          this.restService.listaServicio = res;
          Swal.fire('Actualización servicio ', 'Servicio correctamente actualizado', 'success')
          this.router.navigate(['profesional/servicios']);
        },
          err => {
            Swal.fire('Campos vacíos', 'Los campos están vacíos', 'error')
          })
      },
        err => {
          Swal.fire('Imagen', 'Imagen no insertada', 'error')
          this.router.navigate(['profesional/servicios']);
        }
      )
    }
    )

  }

saveData() {

  if (this.formServicio.getRawValue().id_servicio == null) {
    this.guardarServicio(this.formServicio.value);
  } else {
    this.actualizarServicio(this.formServicio.value);
  }
  //this.router.navigate(['profesional/profesional']);
}
seleccionarFoto(event) {
  this.fotoSeleccionada = event.target.files[0];
}

}
