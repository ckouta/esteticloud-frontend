import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from 'src/app/servicioBackend/rest.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Servicio } from 'src/app/entidades/Servicio';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-servicio',
  templateUrl: './registrar-servicio.component.html',
  styleUrls: ['./registrar-servicio.component.css']
})
export class RegistrarServicioComponent implements OnInit {
  formServicio: FormGroup;
  servicioActualizar: Servicio;
  fotoSeleccionada: File;
  constructor(private router: Router,
    public restService: RestService,
    private formBuilder: FormBuilder,
    private rutaActiva: ActivatedRoute) {
    this.formServicio = this.formBuilder.group({
      id_servicio: [],
      nombre: ['', [Validators.required]],
      duracion: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
    });
  }

  ngOnInit() {
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
      if (this.fotoSeleccionada == null) {
        
        return this.restService.getListaServicio().subscribe((res: any[]) => {
          this.restService.listaServicio = res;
          Swal.fire('Actualizacion servicio ', 'Se actualizo el servicio', 'success')
          this.router.navigate(['profesional/servicios']);
        },
          err => console.log(err));
      }
      this.restService.saveImagenServicio(servicio.id_servicio + "", this.fotoSeleccionada).subscribe(() => {
        return this.restService.getListaServicio().subscribe((res: any[]) => {
          this.restService.listaServicio = res;
          Swal.fire('Ingreso Correcto ', 'Se ingreso el servicio', 'success')
          this.router.navigate(['profesional/servicios']);
        },
          err => {
            Swal.fire('Campos Vacios', 'los campos estan vacios', 'error')
          })
      },
        err => {
          Swal.fire('Imagen', 'imagen no insertada', 'error')
        }
      )

    },
      err => {
        Swal.fire('Servicio', 'servicio no insertada', 'error')
      })
  }
  actualizarServicio(servicio: Servicio) {

    this.restService.updateServicio(servicio.id_servicio, servicio).subscribe(() => {
      if (this.fotoSeleccionada == null) {
        
        return this.restService.getListaServicio().subscribe((res: any[]) => {
          this.restService.listaServicio = res;
          Swal.fire('Actualizacion servicio ', 'Se actualizo el servicio', 'success')
          this.router.navigate(['profesional/servicios']);
        },
          err => console.log(err));
      }
      this.restService.saveImagenServicio(servicio.id_servicio + "", this.fotoSeleccionada).subscribe(() => {
        return this.restService.getListaServicio().subscribe((res: any[]) => {
          this.restService.listaServicio = res;
          Swal.fire('Actualizacion servicio ', 'Se actualizo el servicio', 'success')
          this.router.navigate(['profesional/servicios']);
        },
          err => {
            Swal.fire('Campos Vacios', 'los campos estan vacios', 'error')
          })
      },
        err => {
          Swal.fire('Imagen', 'imagen no insertada', 'error')
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
