import { Component, OnInit } from '@angular/core';
import { Profesional } from 'src/app/entidades/Profesional';
import { RestService } from '../../servicioBackend/rest.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-listar-profesionales',
  templateUrl: './listar-profesionales.component.html',
  styleUrls: ['./listar-profesionales.component.css']
})
export class ListarProfesionalesComponent implements OnInit {
  searchText: string;

  constructor(public restService: RestService) { }

  ngOnInit() {
    this.restService.getListaProfesional().subscribe((res: any[]) => {
      this.restService.listaProfesional = res;
    });
  }
  profesionalEliminar(id: number) {
    Swal.fire({
      title: '¿Estás seguro que desea eliminar el profesional?',
      text: "El cambio es irreversible",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.restService.deleteProfesional(id).subscribe((res) => {
          this.restService.getListaProfesional().subscribe((res: any[]) => {
            this.restService.listaProfesional = res;
            Swal.fire('Profesional eliminado', "Profesional eliminado exitosamente", 'success')
          });
        }, err => {
          Swal.fire('Solicitud rechazada', 'El profesional no se pudo eliminar', 'error');
        }
        )
      }
    })

  }
}
