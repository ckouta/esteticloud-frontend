import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { RestService } from 'src/app/servicioBackend/rest.service';
import { Router } from '@angular/router';
import { IntervaloFecha } from 'src/app/entidades/IntervaloFecha';
import {
  NgbDateParserFormatter, NgbCalendar, NgbDateStruct,
  NgbInputDatepicker
} from '@ng-bootstrap/ng-bootstrap';
import { Servicio } from 'src/app/entidades/Servicio';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Cliente } from 'src/app/entidades/Cliente';
import { Movimiento } from 'src/app/entidades/Movimiento';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';

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
  ingresos: number = 0;
  egresos: number = 0;
  total: number = 0;
  fechas: IntervaloFecha;
  model: NgbDateStruct; //fecha inicio
  model2: NgbDateStruct; //fecha fin
  servicios: Servicio[] = []; // lista servicios mas utilizados
  reservas: any[] = [];
  movimientos: any[] = [];
  clientes: any[] = []; // lista de clientes mas solicitados
  private chart: am4charts.XYChart; //servicios
  private chart2: am4charts.XYChart; //clientes 
  private chart3: am4charts.XYChart; //reservas
  private chart4: am4charts.XYChart; //movimientos


  constructor(
    public restService: RestService,
    private router: Router,
    private parseCalendar: NgbDateParserFormatter,
    private calendar: NgbCalendar,
    private zone: NgZone) {

    const hoy = this.calendar.getToday();
    this.model = { year: hoy.year, month: hoy.month - 1, day: hoy.month };
    this.model2 = hoy;




  }

  ngOnInit() {

    if (!this.restService.hasRole('ROLE_ESTETI') && !this.restService.hasRole('ROLE_ADMIN')) {
      this.router.navigate(['login']);
    }


    this.generarReporte()
    /*this.fechas = { fechaInicio: "2019-11-20", fechaFin: "2019-11-20" };
    this.restService.getTopReservas(this.fechas).subscribe((res: any) => {
      this.reservas = res;
      ////console.log(res);

    })*/

  }


  tab(tab: string) {
    this.li = tab;
    this.show = false;
    this.servicios = []; // lista servicios mas utilizados
    this.reservas = [];
    this.movimientos = [];
    this.clientes = []; // lista de clientes mas solicitados
    this.generarReporte();
  }

  generarReporte() {
    console.log(this.model, this.model2);
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


  crearPDF() {
    switch (this.li) {
      case 'Clientes': {
        this.crearPDFClientes(); break;
      }
      case 'Reservas': {
        this.crearPDFReservas(); break;
      }
      case 'Servicios': {
        this.crearPDFServicios(); break;
      }
      case 'Movimientos': {
        this.crearPDFMovimientos(); break;
      }
      default:
        break;
    }
  }

  getDataClientes() {
    let data = []
    /* los headers del reporte */
    data.push([
      { text: '#', bold: true, alignment: 'center' },
      { text: 'Nombre', bold: true, alignment: 'center' },
      { text: 'Teléfono', bold: true, alignment: 'center' },
      { text: 'Correo', bold: true, alignment: 'center' },
      { text: ' N° reservas solicitadas', bold: true, alignment: 'center' }]);

    this.clientes.map(function (alguien, index) {

      data.push([
        { text: index + 1 },
        { text: alguien[0].nombre + ' ' + alguien[0].apellido },
        { text: alguien[0].telefono },
        { text: alguien[0].email },
        { text: alguien[1] }
      ])
    });
    return data;
  }

  crearPDFClientes() {
    Promise.all([
      this.chart2.exporting.pdfmake,
      this.cargarGraficoClientes(),
      this.chart2.exporting.getImage("png")
    ]).then((res) => {
      let data = [];
      if (!this.clientes) {
        this.restService.getTopClientes(this.fechas).subscribe((res: any) => {
          data = this.getDataClientes();
        })
      } else {
        data = this.getDataClientes();
      }

      let pdfMake = res[0];

      let doc = {
        pageSize: "A4",
        pageOrientation: "portrait",
        pageMargins: [30, 30, 30, 30],
        content: [
          {
            text: 'Reporte de clientes frecuentes',
            style: 'header'
          },
          {
            text: '\nFecha de creación del reporte: \t' + new Date().toLocaleDateString() + '\t-\tCentro: Esteticloud',
            style: 'normal'
          },
          {
            text: '\nFechas seleccionadas: \t' + new Date(this.fechas.fechaInicio).toLocaleDateString() + ' \ty\t ' + new Date(this.fechas.fechaFin).toLocaleDateString(),
            style: 'normalB'
          },
          {
            text: '\nGráfico de clientes frecuentes\n\n',
            style: 'bigger'
          },
          {
            image: res[2],
            width: '500',
            alignment: 'center'
          },
          {
            text: '\nTabla de datos de clientes frecuentes\n\n',
            style: 'bigger'
          },
          {
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', '*', 'auto', 'auto'],
              body: data,
              alignment: 'center'
            }

          }

        ],

        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: 'center'
          },
          bigger: {
            fontSize: 14,
            italics: true,
            alignment: 'center'
          },
          normal: {
            fontSize: 10,

          },
          normalB: {
            fontSize: 10,
            bold: true

          }
        }
      };
      pdfMake.createPdf(doc).download("ReporteClientes" + new Date().toLocaleDateString() + ".pdf");
    }).catch((error) => console.error(error))

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

    series.columns.template.tooltipText = "{categoryX} solicitó [bold]{valueY}[/] reserva(s)";
    series.columns.template.fill = am4core.color("#BC60FF"); // fill
    series.columns.template.fillOpacity = .8;
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    //exportacion 
    this.chart2.exporting.menu = new am4core.ExportMenu();
    this.chart2.exporting.title = "Reporte de clientes frecuentes";
    this.chart2.exporting.filePrefix = "Reporte_clientes_" + new Date().toLocaleDateString();
    this.chart2.exporting.menu.items = [{
      "label": "<i class=\"fas fa-align-justify\"></i>",
      "menu": [
        { "type": "png", "label": "Exportar PNG" },
        { "type": "pdf", "label": "Exportar PDF" },
        { "type": "jpg", "label": "Exportar JPG" }
      ]
    }];
  }

  getDataServicios() {
    let data = []
    data.push([
      { text: '#', bold: true, alignment: 'center' },
      { text: 'Nombre', bold: true, alignment: 'center' },
      { text: 'Descripción', bold: true, alignment: 'center' },
      { text: 'N° de veces agendado', bold: true, alignment: 'center' }
    ])

    this.servicios.map(function (element, index) {

      data.push([
        { text: index + 1 },
        { text: element[0].nombre },
        { text: element[0].descripcion },
        { text: element[1] }
      ])
    });
    return data;
  }

  crearPDFServicios() {
    ////console.log("probando");
    Promise.all([
      this.chart.exporting.pdfmake,
      this.cargarGraficoServicio(),
      this.chart.exporting.getImage("png")
    ]).then((res) => {
      let data = [];
      if (!this.servicios) {
        this.restService.getTopServicios(this.fechas).subscribe((res: any) => {
          this.servicios = res;
          data = this.getDataServicios();
        })
      } else {
        data = this.getDataServicios();
      }
      ////console.log(data);

      let pdfMake = res[0];

      let doc = {
        pageSize: "A4",
        pageOrientation: "portrait",
        pageMargins: [30, 30, 30, 30],
        content: [
          {
            text: 'Reporte de servicios agendados',
            style: 'header'
          },
          {
            text: '\nFecha de creación del reporte: \t' + new Date().toLocaleDateString() + '\t-\tCentro: Esteticloud',
            style: 'normal'
          },
          {
            text: '\nFechas seleccionadas: \t' + new Date(this.fechas.fechaInicio).toLocaleDateString() + ' \ty\t ' + new Date(this.fechas.fechaFin).toLocaleDateString(),
            style: 'normalB'
          },
          {
            text: '\nGráfico de servicios agendados\n\n',
            style: 'bigger'
          },
          {
            image: res[2],
            width: '500',
            alignment: 'center'
          },
          {
            text: '\nTabla detalle servicios agendados\n\n',
            style: 'bigger'
          },
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', 'auto', 'auto'],
              body: data,
              alignment: 'center'
            }

          }

        ],

        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: 'center'
          },
          bigger: {
            fontSize: 14,
            italics: true,
            alignment: 'center'
          },
          normal: {
            fontSize: 10,

          },
          normalB: {
            fontSize: 10,
            bold: true

          }
        }
      };
      pdfMake.createPdf(doc).download("ReporteClientes" + new Date().toLocaleDateString() + ".pdf");
    }).catch((error) => console.error(error))

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
        ////console.log(element);

        data.push({
          "servicio": element[0].nombre,
          "cantidad": element[1]
        })
      });
      this.chart.data = data;
      this.show = true;
    })
    // Create axes
    let categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "servicio";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.title.text = "[bold]Servicios que han sido agendados[/] ";

    let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "[bold]N° reservas[/]";
    // Create series
    let series = this.chart.series.push(new am4charts.ColumnSeries3D());
    series.dataFields.valueY = "cantidad";
    series.dataFields.categoryX = "servicio";
    series.name = "Cantidad";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fill = am4core.color("#BC60FF"); // fill
    series.columns.template.fillOpacity = .8;
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    //exportacion 
    this.chart.exporting.menu = new am4core.ExportMenu();
    this.chart.exporting.title = "Reporte de servicios reservados";
    this.chart.exporting.filePrefix = "Reporte_servicios_" + new Date().toLocaleDateString();
    this.chart.exporting.menu.items = [{
      "label": "<i class=\"fas fa-align-justify\"></i>",
      "menu": [
        { "type": "png", "label": "Exportar PNG" },
        { "type": "pdf", "label": "Exportar PNG" },
        { "type": "jpg", "label": "Exportar PNG" }
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
      ////console.log(this.reservas);

      let agendada = 0;
      let reservada = 0;
      let canceladaCliente = 0;
      let canceladaProfesional = 0;
      let ausente = 0;

      for (let index = 0; index < this.reservas.length; index++) {
        switch (this.reservas[index][0].estado_reserva.id_estado_reserva) {
          case 1: agendada++; break;
          case 2: reservada++; break;
          case 3: canceladaCliente++; break;
          case 4: canceladaProfesional++; break;
          case 5: ausente++; break;
          default: break;
        }
      }
      this.chart3.data = [{
        "estado": "Agendada",
        "cantidad": agendada
      },
      {
        "estado": "Reservada",
        "cantidad": reservada
      },
      {
        "estado": "Cancelada Cliente",
        "cantidad": canceladaCliente
      },
      {
        "estado": "Cancelada Profesional",
        "cantidad": canceladaProfesional
      },
      {
        "estado": "El cliente no se presentó",
        "cantidad": ausente
      }]
      this.show = true;
    }, err => {
      this.reservas = [];
    })
    // Create axes
    let categoryAxis = this.chart3.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "estado";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.title.text = "[bold]Estado de la reserva[/] ";

    let valueAxis = this.chart3.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "[bold]N° reservas[/]";
    // Create series
    let series = this.chart3.series.push(new am4charts.ColumnSeries3D());
    series.dataFields.valueY = "cantidad";
    series.dataFields.categoryX = "estado";
    series.name = "cantidad";

    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";

    series.columns.template.fillOpacity = .8;
    series.columns.template.fill = am4core.color("#BC60FF");
    series.columns.template.stroke = am4core.color("#9400FF");

    let columnTemplate = series.columns.template;

    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    //exportacion 
    this.chart3.exporting.menu = new am4core.ExportMenu();
    this.chart3.exporting.title = "Reporte de servicios según estado";
    this.chart3.exporting.filePrefix = "Reporte_reservas" + new Date().toLocaleDateString();
    this.chart3.exporting.menu.items = [{
      "label": "<i class=\"fas fa-align-justify\"></i>",
      "menu": [
        { "type": "png", "label": " Exportar PNG" },
        { "type": "pdf", "label": " Exportar PDF" },
        { "type": "jpg", "label": " Exportar JPG" }
      ]
    }];
  }

  getDataReservas() {
    let data = { todo: [], porEstado: [] }
    /* los headers del reporte */
    data.todo.push([
      { text: '#', bold: true, alignment: 'center' },
      { text: 'Fecha', bold: true, alignment: 'center' },
      { text: 'Cliente', bold: true, alignment: 'center' },
      { text: 'Servicio solicitado', bold: true, alignment: 'center' },
      { text: 'Estado reserva', bold: true, alignment: 'center' }]);

    data.porEstado.push([
      { text: 'Estado de reserva', bold: true, alignment: 'center' },
      { text: 'Cantidad', bold: true, alignment: 'center' }]);


    let agendada = 0;
    let reservada = 0;
    let canceladaCliente = 0;
    let canceladaProfesional = 0;
    let ausente = 0;

    this.reservas.forEach((element, index) => {
      /*los datos del reporte */
      data.todo.push([
        { text: index + 1 },
        { text: new Date(element[1]).toLocaleDateString() },
        { text: element[0].cliente.nombre + ' ' + element[0].cliente.apellido },
        { text: element[0].servicio.nombre },
        { text: element[0].estado_reserva.nombre }
      ])
      /*tabla chica */
      switch (this.reservas[index][0].estado_reserva.id_estado_reserva) {
        case 1: agendada++; break;
        case 2: reservada++; break;
        case 3: canceladaCliente++; break;
        case 4: canceladaProfesional++; break;
        case 5: ausente++; break;
        default: break;
      }
    });

    data.porEstado.push([{ text: 'Agendada' }, { text: agendada }]);
    data.porEstado.push([{ text: 'Reservada' }, { text: reservada }]);
    data.porEstado.push([{ text: 'Cancelada por el cliente' }, { text: canceladaCliente }]);
    data.porEstado.push([{ text: 'Cancelada por el Profesional' }, { text: canceladaProfesional }]);
    data.porEstado.push([{ text: 'El cliente no se presentó' }, { text: ausente }]);
    data.porEstado.push([{ text: 'Total' }, { text: (ausente + agendada + reservada + canceladaCliente + canceladaProfesional) }]);


    return data;
  }

  crearPDFReservas() {
    Promise.all([
      this.chart3.exporting.pdfmake,
      this.cargarGraficoReservas(),
      this.chart3.exporting.getImage("png")
    ]).then((res) => {
      let data: any;
      if (!this.reservas) {
        this.restService.getTopReservas(this.fechas).subscribe((res: any) => {
          this.reservas = res;
          data = this.getDataReservas();
        })
      } else {
        data = this.getDataReservas();
      }
      ////console.log(data);

      let pdfMake = res[0];

      let doc = {
        pageSize: "A4",
        pageOrientation: "portrait",
        pageMargins: [30, 30, 30, 30],
        content: [
          {
            text: 'Reporte de reservas por estado',
            style: 'header'
          },
          {
            text: '\nFecha de creación del reporte: \t' + new Date().toLocaleDateString() + '\t-\tCentro: Esteticloud',
            style: 'normal'
          },
          {
            text: '\nFechas seleccionadas: \t' + new Date(this.fechas.fechaInicio).toLocaleDateString() + ' \ty\t ' + new Date(this.fechas.fechaFin).toLocaleDateString(),
            style: 'normalB'
          },
          {
            text: '\nGráfico de reservas por estado\n\n',
            style: 'bigger'
          },
          {
            image: res[2],
            width: 500,
            alignment: 'center'
          },
          {
            text: '\nCantidad de reservas según estado\n\n',
            style: 'bigger'
          },
          {
            table: {
              headerRows: 1,
              widths: ['60%', '40%'],
              body: data.porEstado,
              alignment: 'center'
            }
          },
          {
            text: '\nDetalle de las reservas\n\n',
            style: 'bigger'
          },
          {
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', '*', '*', '*'],
              body: data.todo,
              alignment: 'center'
            }
          }

        ],

        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: 'center'
          },
          bigger: {
            fontSize: 14,
            italics: true,
            alignment: 'center'
          },
          normal: {
            fontSize: 10,

          },
          normalB: {
            fontSize: 10,
            bold: true

          }
        }
      };

      pdfMake.createPdf(doc).download("ReporteReservas" + new Date().toLocaleDateString() + ".pdf");
    }).catch((error) => console.error(error))


  }
  getDataMovimientos() {
    let data = { todo: [], resumen: [] }
    /* los headers del reporte */
    data.todo.push([
      { text: '#', bold: true, alignment: 'center' },
      { text: 'Fecha', bold: true, alignment: 'center' },
      { text: 'Nombre del movimiento', bold: true, alignment: 'center' },
      { text: 'Nombre del profesional', bold: true, alignment: 'center' },
      { text: 'Ingreso', bold: true, alignment: 'center' },
      { text: 'Gasto', bold: true, alignment: 'center' }]);

    data.resumen.push([
      { text: 'Ingresos', bold: true, alignment: 'center' },
      { text: 'Gastos', bold: true, alignment: 'center' },
      { text: 'Total', bold: true, alignment: 'center' }]);


    let ingresos = 0;
    let gastos = 0;

    this.movimientos.forEach((element, index) => {
      /*los datos del reporte */
      let nombre = '-';
      let ing = '-';
      let eg = '-';
      if (element.profesional) {
        nombre = element.profesional.nombre + ' ' + element.profesional.apellido;
      }
      if (+element.valor >= 0) {
        ingresos = ingresos + +element.valor;
        ing = element.valor;

      } else {
        gastos = gastos + +element.valor;
        eg = element.valor;

      }
      data.todo.push([
        { text: index + 1 },
        { text: new Date(element.fecha).toLocaleDateString() },
        { text: element.nombre },
        { text: nombre },
        { text: ing },
        { text: eg }
      ])



      /*tabla chica */

    });

    data.resumen.push([{ text: ingresos }, { text: gastos }, { text: (ingresos + gastos) }]);


    return data;

  }

  crearPDFMovimientos() {
    ////console.log("haciendo");
    Promise.all([
      this.chart4.exporting.pdfmake,
      this.cargarGraficoMovimientos(),
      this.chart4.exporting.getImage("png")
    ]).then((res) => {
      let data: any;
      if (!this.movimientos) {
        this.restService.getTopMovimientos(this.fechas).subscribe((res: any) => {
          this.movimientos = res;
          data = this.getDataMovimientos();
        })
      } else {
        data = this.getDataMovimientos();
      }
      ////console.log(data);

      let pdfMake = res[0];

      let doc = {
        pageSize: "A4",
        pageOrientation: "portrait",
        pageMargins: [30, 30, 30, 30],
        content: [
          {
            text: 'Reporte de ingresos y gastos',
            style: 'header'
          },
          {
            text: '\nFecha de creación del reporte: \t' + new Date().toLocaleDateString() + '\t-\tCentro: Esteticloud',
            style: 'normal'
          },
          {
            text: '\nFechas seleccionadas: \t' + new Date(this.fechas.fechaInicio).toLocaleDateString() + ' \ty\t ' + new Date(this.fechas.fechaFin).toLocaleDateString(),
            style: 'normalB'
          },
          {
            text: '\nGráfico de ingresos y gastos\n\n',
            style: 'bigger'
          },
          {
            image: res[2],
            width: 500,
            alignment: 'center'
          },
          {
            text: '\nResumen\n\n',
            style: 'bigger'
          },
          {
            table: {
              headerRows: 1,
              widths: ['33%', '33%', '34%'],
              body: data.resumen,
              alignment: 'center'
            }
          },
          {
            text: '\nDetalle de ingresos y gastos\n\n',
            style: 'bigger'
          },
          {
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto'],
              body: data.todo,
              alignment: 'center'
            }
          }

        ],

        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: 'center'
          },
          bigger: {
            fontSize: 14,
            italics: true,
            alignment: 'center'
          },
          normal: {
            fontSize: 10,

          },
          normalB: {
            fontSize: 10,
            bold: true

          }
        }
      };

      pdfMake.createPdf(doc).download("ReporteMonetario" + new Date().toLocaleDateString() + ".pdf");
    }).catch((error) => console.error(error))


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
        let valor: number = +this.movimientos[index].valor;
        if (+this.movimientos[index].valor >= 0) {
          ingresos = ingresos + valor;
        } else {
          gastos = gastos + valor;
        }
      }
      this.ingresos = ingresos;
      this.egresos = gastos;
      this.total = ingresos + gastos;
      this.chart4.data = [{
        "country": "Ingresos",
        "visits": ingresos
      },
      {
        "country": "Gastos",
        "visits": gastos * -1
      }]
      this.show = true;
    }, err => {
      ////console.log(err);

      this.movimientos = [];
    })
    // Create axes
    let categoryAxis = this.chart4.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;


    let valueAxis = this.chart4.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "[bold]Dinero ($)[/] ";
    // Create series
    let series = this.chart4.series.push(new am4charts.ColumnSeries3D());
    series.dataFields.valueY = "visits";
    series.dataFields.categoryX = "country";
    series.name = "Visits";
    series.columns.template.tooltipText = "{categoryX}: [bold]${valueY}[/]";
    series.columns.template.fillOpacity = .8;
    series.columns.template.fill = am4core.color("#BC60FF");
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    //exportacion 
    this.chart4.exporting.menu = new am4core.ExportMenu();
    this.chart4.exporting.title = "Reporte de Ingresos y egresos";
    this.chart4.exporting.filePrefix = "Reporte_Monetario_" + new Date().toLocaleDateString();;
    this.chart4.exporting.menu.items = [{
      "label": "<i class=\"fas fa-align-justify\"></i>",
      "menu": [
        { "type": "png", "label": "Exportar PNG" },
        { "type": "pdf", "label": "Exportar PDF" },
        { "type": "jpg", "label": "Exportar JPG" }
      ]
    }];
  }

}
