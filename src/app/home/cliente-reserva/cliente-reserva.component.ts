import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/servicioBackend/rest.service';
import { Router } from '@angular/router';
import { Reserva } from 'src/app/entidades/Reserva';
import { HorarioProfesional } from 'src/app/entidades/HorarioProfesional';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente-reserva',
  templateUrl: './cliente-reserva.component.html',
  styleUrls: ['./cliente-reserva.component.css']
})
export class ClienteReservaComponent implements OnInit {

  reserva: HorarioProfesional[] = [];
  listEstados:any;

  constructor(public restService: RestService, private router: Router) { }

  ngOnInit() {
    if (!this.restService.hasRole('ROLE_CLIENT')) {
      this.router.navigate(['login']);
    }
    this.restService.getCliente(this.restService.usuario.username).subscribe((res: any) => {
      this.restService.cliente = res;
      this.restService.getReservaCliente(this.restService.cliente).subscribe((res: any[]) => {
        this.reserva = res;
      });
      this.restService.getListEstadoReserva().subscribe((result => {
        this.listEstados = result;
      }))
    })

  }
  cancelarReserva(reserva: any) {
    Swal.fire({
      title: '¿Estás seguro que desea cancelar la reserva?',
      text: "El cambio es irreversible",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
          let res: Reserva = reserva.reserva;
          res.estado_reserva = this.listEstados[2];
          this.restService.updateReserva(res.id_reserva, res).subscribe((res: any) => {
            Swal.fire('Solicitud aceptada', 'La reserva fue cancelada', 'success');
            this.restService.getReservaCliente(this.restService.cliente).subscribe((res: any[]) => {
              this.reserva = res;
            })
          }, err => {
            Swal.fire('Solicitud rechazada', 'La reserva no logro ser cancelada', 'error');
          })
      }
    })
  }

}
