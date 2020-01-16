import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/servicioBackend/rest.service';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { Calendar } from '@fullcalendar/core';
import { RangoFecha } from 'src/app/entidades/RangoFecha';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css']
})
export class HorarioComponent implements OnInit {
  fromDate: NgbDate;
  toDate: NgbDate;

  lunes: number = new Date().getDay();
  constructor(public restService: RestService, private calendar: NgbCalendar, private parseCalendar: NgbDateParserFormatter, private dia: NgbDatepickerI18n) {
    this.fromDate = calendar.getToday();

  }

  ngOnInit() {
    this.restService.getListabloques().subscribe((res: any[]) => {
      this.restService.listaBloque = res;
      this.restService.listaBloque.sort(function (a, b) {
        if (a.idBloque < b.idBloque) {
          return 1;
        }
        if (a.idBloque > b.idBloque) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
    });
  }
  
}
