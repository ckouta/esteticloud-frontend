import { Component, OnInit } from '@angular/core';
import { RestService } from '../servicioBackend/rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profesional',
  templateUrl: './profesional.component.html',
  styleUrls: ['./profesional.component.css']
})
export class ProfesionalComponent implements OnInit {
  searchText:String;
  constructor(public restService: RestService, private router: Router) { }

  ngOnInit() {
    if (!this.restService.hasRole('ROLE_ESTETI') && !this.restService.hasRole('ROLE_ADMIN')) {
      this.router.navigate(['login']);
    }
  }
  cerrarSesion(){
    this.restService.logout();
  }
}
