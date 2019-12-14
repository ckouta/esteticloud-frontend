import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/servicioBackend/rest.service';
import { Router } from '@angular/router';
import { Reserva } from 'src/app/entidades/Reserva';
import { HorarioProfesional } from 'src/app/entidades/HorarioProfesional';

@Component({
  selector: 'app-cliente-reserva',
  templateUrl: './cliente-reserva.component.html',
  styleUrls: ['./cliente-reserva.component.css']
})
export class ClienteReservaComponent implements OnInit {
  
  reserva: HorarioProfesional[] = [];

  constructor(public restService: RestService, private router: Router) { }

  ngOnInit() {
    if (!this.restService.hasRole('ROLE_CLIENT')) {
      this.router.navigate(['login']);
    }
    this.restService.getCliente(this.restService.usuario.username).subscribe((res: any) => {
      this.restService.cliente = res;
      this.restService.getReservaCliente(this.restService.cliente).subscribe((res: any[]) => {
        this.reserva=res;
      });
    })

  }

}
