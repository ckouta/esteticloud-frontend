import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/entidades/Cliente';
import { RestService } from 'src/app/servicioBackend/rest.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  searchText: string;
  cliente: Cliente[] = [];
  constructor(public restService: RestService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    if (!this.restService.hasRole('ROLE_ESTETI')) {
      this.router.navigate(['login']);
    }
    this.restService.getProfesionalCorreo(this.restService.usuario.username).subscribe((res: any) => {
      this.restService.profesional = res;
      this.restService.getListaCliente().subscribe((res: any[]) => {
        this.cliente = res;
      })
    },
      err => this.cliente = [])
  }
  clienteEliminar(id: number) {
    this.restService.deleteCliente(id).subscribe((res => {
      Swal.fire('Cliente eliminado', "Eliminado con éxito!", 'success')
      return this.restService.getListaCliente().subscribe((res: any[]) => {
        this.cliente = res;
      });
    }
    ))
  }
}
