import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Profesional } from 'src/app/entidades/Profesional';
import { RestService } from '../../servicioBackend/rest.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrar-profesionales',
  templateUrl: './registrar-profesionales.component.html',
  styleUrls: ['./registrar-profesionales.component.css']
})
export class RegistrarProfesionalesComponent implements OnInit {
  ProfesionalActualizar: Profesional = null;
  fotoSeleccionada: File;
  formProduct: FormGroup;
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
      telefono: ['', [Validators.required]],
      email: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    if (this.rutaActiva.snapshot.params.id != null) {
      this.ProfesionalActualizar = this.restService.listaProfesional[this.rutaActiva.snapshot.params.id - 1];
      this.formProduct.setValue({
        id_profesional: this.ProfesionalActualizar.id_profesional,
        nombre: this.ProfesionalActualizar.nombre,
        apellido: this.ProfesionalActualizar.apellido,
        telefono: this.ProfesionalActualizar.telefono,
        email: this.ProfesionalActualizar.email,
        estado: '',
        descripcion: '',
      });
      console.log(this.ProfesionalActualizar)
    }

  }
  guardarProducto(profesional: Profesional) {
    console.log(this.fotoSeleccionada);
    this.restService.saveProfesional(profesional).subscribe((profesional) => {
      
      this.restService.saveImagenProfesional(profesional.id_profesional + "", this.fotoSeleccionada).subscribe(() => {
        return this.restService.getListaProfesional().subscribe((res: any[]) => {
          this.restService.listaProfesional = res;
        },
          err => console.log(err));
      })
    })

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
      this.guardarProducto(this.formProduct.value);
    } else {
      this.actualizarProfesional(this.formProduct.value);
    }
    this.router.navigate(['profesional/profesional']);
    console.log(this.formProduct.value);
  }
  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
  }
}
