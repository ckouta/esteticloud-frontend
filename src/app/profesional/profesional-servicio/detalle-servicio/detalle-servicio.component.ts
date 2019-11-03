import { Component, OnInit } from '@angular/core';
import { Servicio } from 'src/app/servicio';
import { RestService } from 'src/app/servicioBackend/rest.service';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-detalle-servicio',
  templateUrl: './detalle-servicio.component.html',
  styleUrls: ['./detalle-servicio.component.css']
})
export class DetalleServicioComponent implements OnInit {

  servicio: Servicio; 
  constructor(public restService: RestService,private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activateRoute.paramMap.subscribe(params =>{
      let id:number = +params.get('id');
      if(id){
        this.restService.getServicio(id).subscribe(res =>{
          this.servicio=res;
        })
      }
    } )
    }

}
