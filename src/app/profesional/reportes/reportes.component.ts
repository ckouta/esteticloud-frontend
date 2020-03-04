import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { RestService } from 'src/app/servicioBackend/rest.service';
import { Router } from '@angular/router';
import { IntervaloFecha } from 'src/app/entidades/IntervaloFecha';
import { NgbDateParserFormatter, NgbCalendar, NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Servicio } from 'src/app/entidades/Servicio';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Cliente } from 'src/app/entidades/Cliente';
import { Movimiento } from 'src/app/entidades/Movimiento';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})


export class ReportesComponent implements OnInit {
  @ViewChild('contenido', { static: false }) myDiv: ElementRef;
  titulo = 'Generar PDF con Angular JS 5';
  imagen1 = 'assets/img/tc.jpg';
  imagen2 = 'assets/img/pm.jpg';
  imagen3 = 'assets/img/al.jpg';
  show = false;
  li = 'Clientes';
  ingresos:number = 0;
  egresos:number = 0;
  total:number = 0;
  fechas: IntervaloFecha;
  model: NgbDateStruct; //fecha inicio
  model2: NgbDateStruct; //fecha fin
  servicios: Servicio[] = []; // lista servicios mas utilizados
  reservas: any[] = [];
  movimientos: Movimiento[] = [];
  clientes: Cliente[] = []; // lista de clientes mas solicitados
  private chart: am4charts.XYChart; //servicios
  private chart2: am4charts.XYChart; //clientes 
  private chart3: am4charts.XYChart; //reservas
  private chart4: am4charts.XYChart; //movimientos


  constructor(public restService: RestService, private router: Router, private parseCalendar: NgbDateParserFormatter,
    private calendar: NgbCalendar, private zone: NgZone) {
    this.model = this.calendar.getPrev(this.calendar.getToday(),'y');
    this.model2 = this.calendar.getToday();
  }

  ngOnInit() {
    if (!this.restService.hasRole('ROLE_ESTETI') && !this.restService.hasRole('ROLE_ADMIN')) {
      this.router.navigate(['login']);
    }
    this.generarReporte()
    /*this.fechas = { fechaInicio: "2019-11-20", fechaFin: "2019-11-20" };
    this.restService.getTopReservas(this.fechas).subscribe((res: any) => {
      this.reservas = res;
      console.log(res);

    })*/

  }

  tab(tab: string) {
    this.li = tab;
    this.show = false;
    this.servicios = []; // lista servicios mas utilizados
    this.reservas= [];
    this.movimientos= [];
    this.clientes= []; // lista de clientes mas solicitados
  }

  generarReporte() {
    console.log(this.li);
    if (this.li == "Clientes") {
      this.cargarGraficoClientes();
    } else {
      if (this.li == "Reservas") {
        this.cargarGraficoReservas();
      } else {
        if (this.li == "Servicios") {
          this.cargarGraficoServicio();
        } else {
          if (this.li == "Movimientos") {
            this.cargarGraficoMovimientos();
          }
        }
      }
    }
  }

  generarPDF() {
    html2canvas(this.myDiv.nativeElement, {
      // Opciones
      allowTaint: true,
      useCORS: false,
      // Calidad del PDF
      scale: 2

    }).then(canvas => {
      var img = canvas.toDataURL("image/jpeg", 1.0);
      var doc = new jsPDF('landscape');
      doc.setFontSize(20);
      doc.addImage(img, 'JPEG', 10, 10, 280, 150);

      doc.save('reporte.pdf');
    });
  }

  cargarGraficoClientes() {
    //inicializar grafico clientes
    this.chart2 = am4core.create("chartdiv2", am4charts.XYChart);
    this.chart2.hiddenState.properties.opacity = 0; // this creates initial fade-in
    this.chart2.paddingRight = 10;
    this.fechas = { fechaInicio: this.parseCalendar.format(this.model), fechaFin: this.parseCalendar.format(this.model2) };
    //Datos
    this.restService.getTopClientes(this.fechas).subscribe((res: any) => {
      this.clientes = res;
      let data = [];
      this.clientes.forEach(element => {        
        data.push({
          "nombre": element[0].nombre,
          "reservas": element[1]
        })
      });
      this.chart2.data = data;
      this.show = true;
    })
    // Create axes
    let categoryAxis = this.chart2.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "nombre";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.title.text = "[bold]Clientes[/] ";
    
    let valueAxis = this.chart2.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "[bold]N° reservas[/]";
    // Create series
    let series = this.chart2.series.push(new am4charts.ColumnSeries3D());
    series.dataFields.valueY = "reservas";
    series.dataFields.categoryX = "nombre";
    series.name = "reservas";

    series.columns.template.tooltipText = "{categoryX}: solicitó [bold]{valueY}[/] reservas";
    series.columns.template.fill = am4core.color("#BC60FF"); // fill
    series.columns.template.fillOpacity = .8;
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    //exportacion 
    this.chart2.exporting.menu = new am4core.ExportMenu();
    this.chart2.exporting.title = "Reporte de clientes frecuentes";
    this.chart2.exporting.filePrefix ="Reporte "+ new Date().toLocaleDateString();
    this.chart2.exporting.menu.items = [{
      "label": "<i class=\"fas fa-align-justify\"></i>",
      "menu": [
        { "type": "png", "label": " Exportar PNG" },
        { "type": "pdf", "label": " Exportar PDF" },
        { "type": "jpg", "label": " Exportar JPG" }
      ]
    }];
  }

  cargarGraficoServicio() {
    //inicializar grafico clientes
    this.chart = am4core.create("chartdiv", am4charts.XYChart);
    this.chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    this.chart.paddingRight = 10;
    this.fechas = { fechaInicio: this.parseCalendar.format(this.model), fechaFin: this.parseCalendar.format(this.model2) };
    //Datos
    this.restService.getTopServicios(this.fechas).subscribe((res: any) => {
      this.servicios = res;
      let data = [];
      this.servicios.forEach(element => {
        data.push({
          "country": element[0].nombre,
          "visits": element[1]
        })
      });
      this.chart.data = data;
      this.show = true;
    })
    // Create axes
    let categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    // Create series
    let series = this.chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "visits";
    series.dataFields.categoryX = "country";
    series.name = "Visits";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    //exportacion 
    this.chart.exporting.menu = new am4core.ExportMenu();
    this.chart.exporting.title = "Reporte de Servicios";
    this.chart.exporting.filePrefix ="reporte";
    this.chart.exporting.menu.items = [{
      "label": "<i class=\"fas fa-align-justify\"></i>",
      "menu": [
        { "type": "png", "label": " Grafico en PNG" },
        { "type": "pdf", "label": " Grafico en PDF" },
        { "type": "jpg", "label": " Grafico en JPG" }
      ]
    }];
  }

  cargarGraficoReservas() {
    //inicializar grafico clientes
    this.chart3 = am4core.create("chartdiv3", am4charts.XYChart);
    this.chart3.hiddenState.properties.opacity = 0; // this creates initial fade-in
    this.chart3.paddingRight = 10;
    this.fechas = { fechaInicio: this.parseCalendar.format(this.model), fechaFin: this.parseCalendar.format(this.model2) };
    //Datos
    this.restService.getTopReservas(this.fechas).subscribe((res: any) => {
      this.reservas = res;
      let agendada = 0;
      let reservada = 0;
      let canceladaCliente = 0;
      let canceladaProfesional = 0;
      let ausente = 0;
      for (let index = 0; index < this.reservas.length; index++) {
        if (this.reservas[index][0].estado_reserva.id_estado_reserva == 1) {
          agendada++;
        } else {
          if (this.reservas[index][0].estado_reserva.id_estado_reserva == 2) {
            reservada++;
          } else {
            if (this.reservas[index][0].estado_reserva.id_estado_reserva == 3) {
              canceladaCliente++;
            } else {
              if (this.reservas[index][0].estado_reserva.id_estado_reserva == 4) {
                canceladaProfesional++;
              } else {
                ausente++;
              }
            }
          }
        }
      }
      this.chart3.data = [{
        "country": "Agendada",
        "visits": agendada
      },
      {
        "country": "Reservada",
        "visits": reservada
      },
      {
        "country": "Cancelada Cliente",
        "visits": canceladaCliente
      },
      {
        "country": "Cancelada Profesional",
        "visits": canceladaProfesional
      },
      {
        "country": "Ausente Cliente",
        "visits": ausente
      }]
      this.show = true;
    }, err => {
      this.reservas = [];
      
    })
    // Create axes
    let categoryAxis = this.chart3.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    let valueAxis = this.chart3.yAxes.push(new am4charts.ValueAxis());
    // Create series
    let series = this.chart3.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "visits";
    series.dataFields.categoryX = "country";
    series.name = "Visits";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    //exportacion 
    this.chart3.exporting.menu = new am4core.ExportMenu();
    this.chart3.exporting.title = "Reporte de Servicios";
    this.chart3.exporting.filePrefix ="reporte";
    this.chart3.exporting.menu.items = [{
      "label": "<i class=\"fas fa-align-justify\"></i>",
      "menu": [
        { "type": "png", "label": " Grafico en PNG" },
        { "type": "pdf", "label": " Grafico en PDF" },
        { "type": "jpg", "label": " Grafico en JPG" }
      ]
    }];
  }

  cargarGraficoMovimientos() {
    //inicializar grafico clientes
    this.chart4 = am4core.create("chartdiv4", am4charts.XYChart);
    this.chart4.hiddenState.properties.opacity = 0; // this creates initial fade-in
    this.chart4.paddingRight = 10;
    this.fechas = { fechaInicio: this.parseCalendar.format(this.model), fechaFin: this.parseCalendar.format(this.model2) };
    //Datos
    this.restService.getTopMovimientos(this.fechas).subscribe((res: any) => {
      this.movimientos = res;
      let ingresos = 0;
      let gastos = 0;
      for (let index = 0; index < this.movimientos.length; index++) {
        let valor:number = +this.movimientos[index].valor;
        if (+this.movimientos[index].valor >= 0) {
          ingresos = ingresos + valor;
        } else {
          gastos = gastos + valor;
        }
      }
      this.ingresos= ingresos;
      this.egresos =gastos;
      this.total = ingresos + gastos;
      this.chart4.data = [{
        "country": "Ingresos",
        "visits": ingresos
      },
      {
        "country": "Gastos",
        "visits": gastos*-1
      }]
      this.show = true;
    }, err => {
      this.movimientos = [];
    })
    // Create axes
    let categoryAxis = this.chart4.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    let valueAxis = this.chart4.yAxes.push(new am4charts.ValueAxis());
    // Create series
    let series = this.chart4.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "visits";
    series.dataFields.categoryX = "country";
    series.name = "Visits";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    //exportacion 
    this.chart4.exporting.menu = new am4core.ExportMenu();
    this.chart4.exporting.title = "Reporte de Servicios";
    this.chart4.exporting.filePrefix ="reporte";
    this.chart4.exporting.menu.items = [{
      "label": "<i class=\"fas fa-align-justify\"></i>",
      "menu": [
        { "type": "png", "label": " Grafico en PNG" },
        { "type": "pdf", "label": " Grafico en PDF" },
        { "type": "jpg", "label": " Grafico en JPG" }
      ]
    }];
  }
}
