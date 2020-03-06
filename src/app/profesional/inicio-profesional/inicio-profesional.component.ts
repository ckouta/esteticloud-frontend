import { Component, OnInit, NgZone } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { RestService } from 'src/app/servicioBackend/rest.service';
import { IntervaloFecha } from 'src/app/entidades/IntervaloFecha';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Movimiento } from 'src/app/entidades/Movimiento';
import { HorarioProfesional } from 'src/app/entidades/HorarioProfesional';
import { NgbDateStruct, NgbDateParserFormatter, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Reserva } from 'src/app/entidades/Reserva';
import { estado } from 'src/app/entidades/Estado';


am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-inicio-profesional',
  templateUrl: './inicio-profesional.component.html',
  styleUrls: ['./inicio-profesional.component.css']
})
export class InicioProfesionalComponent {

  private chart: am4charts.XYChart;
  nombre: string;
  fechas: IntervaloFecha;
  reservas: any[] = [];
  profesionales: any[] = [];
  movimientos: Movimiento[] = [];
  ganancia:number =0;
  listReservas:HorarioProfesional[] =[];
  model: NgbDateStruct;
  listEstado:any;
  constructor(private zone: NgZone, public restService: RestService, private router: Router, private parseCalendar: NgbDateParserFormatter,
    private calendar: NgbCalendar) {
      this.model = this.calendar.getToday();
    if (this.restService.hasRole('ROLE_ADMIN')) {
      this.nombre = "Administrador"
    } else {
      this.restService.getProfesionalCorreo(this.restService.usuario.username).subscribe((res: any) => {
        this.restService.profesional = res;
        this.nombre = this.restService.profesional.nombre + " " + this.restService.profesional.apellido;
        this.restService.getHorarioprofesional(this.restService.profesional).subscribe((res: any[]) => {
          this.model = this.calendar.getToday();
          for (let index = 0; index < res.length; index++) {
            if(res[index].fecha == this.parseCalendar.format(this.model)){
              if (this.listReservas.findIndex(i => i.reserva.id_reserva == res[index].reserva.id_reserva) < 0) {
                this.listReservas.push(res[index]);
              }
            }
          }
        })
        this.restService.getMovimientoProfesional(this.restService.profesional).subscribe((res: any[]) => {
          this.movimientos = res;
          this.movimientos.forEach(element => {
            if(new Date(element.fecha).getMonth() == new Date().getMonth() && new Date(element.fecha).getFullYear() == new Date().getFullYear()){
              this.ganancia+=+element.valor;
            }
          });
        }, err =>{
          this.movimientos=[];
        })
      })
      this.restService.getListEstadoReserva().subscribe((res => {
        this.listEstado= res;
        //console.log(res);
      }));
    }

  }
  ngOnInit() {
    if (!this.restService.hasRole('ROLE_ESTETI') && !this.restService.hasRole('ROLE_ADMIN')) {
      this.router.navigate(['login']);
    }
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      if (this.restService.hasRole('ROLE_ADMIN')) {
        let chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        chart.paddingRight = 10;

        this.fechas = { fechaInicio: "2020-03-01", fechaFin: "2020-03-31" };
        this.restService.getTopReservas(this.fechas).subscribe((res: any) => {
          this.reservas = res;
          this.restService.getListaProfesional().subscribe((res: any) => {
            this.profesionales = res;
            this.profesionales.forEach(element => {
              element.contador = 0;
            });
            for (let i = 0; i < this.reservas.length; i++) {
              for (let j = 0; j < this.profesionales.length; j++) {
                if (this.profesionales[j].id_profesional == this.reservas[i][2].id_profesional) {
                  this.profesionales[j].contador++;
                  break;
                }
              }
            }

            let data = [];
            this.profesionales.forEach(element => {
              data.push({
                "name": element.nombre +' ' +element.apellido,
                "steps": element.contador,
                "href": "http://parra.chillan.ubiobio.cl:8080/alvaro.castillo1501/servicio/uploads/img/" + element.foto
              })
            });
            chart.data = data;
          })
        })

        let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        
        categoryAxis.dataFields.category = "name";
        categoryAxis.renderer.grid.template.strokeOpacity = 0;
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.labels.template.dx = -40;
        categoryAxis.renderer.minWidth = 120;
        categoryAxis.showTooltipOn = 'always';
        categoryAxis.tooltip.dx = -30;
        //categoryAxis.renderer.tooltip.dx = -40;

        let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text= "[bold]Cantidad de reservas[/]";
        valueAxis.renderer.inside = true;
        valueAxis.renderer.labels.template.fillOpacity = 0.3;
        valueAxis.renderer.grid.template.strokeOpacity = 0;
        valueAxis.min = 0;
        valueAxis.cursorTooltipEnabled = false;
        valueAxis.renderer.baseGrid.strokeOpacity = 0;
        //valueAxis.renderer.labels.template.dy = 10;

        let series = chart.series.push(new am4charts.ColumnSeries);
        series.dataFields.valueX = "steps";
        series.dataFields.categoryY = "name";
        series.tooltipText = "{valueX.value}";
        series.tooltip.pointerOrientation = "left";
        //series.tooltip.dy = - 30;
        series.tooltip.dx =  30;
        
        series.columnsContainer.zIndex = 100;

        let columnTemplate = series.columns.template;
        columnTemplate.height = am4core.percent(50);
        columnTemplate.maxHeight = 30;
        columnTemplate.column.cornerRadius(30, 10, 30, 10);
        columnTemplate.strokeOpacity = 0;

        series.heatRules.push({ target: columnTemplate, property: "fill", dataField: "valueX", min: am4core.color("#a18bca"), max: am4core.color("#6946aa") });
        series.mainContainer.mask = undefined;

        let cursor = new am4charts.XYCursor();
        chart.cursor = cursor;
        cursor.lineX.disabled = true;
        cursor.lineY.disabled = true;
        cursor.behavior = "none";

        let bullet = columnTemplate.createChild(am4charts.CircleBullet);
        bullet.circle.radius = 20;
        bullet.valign = "middle";
        bullet.align = "right";
        bullet.isMeasured = true;
        bullet.interactionsEnabled = false;
        bullet.horizontalCenter = "right";
        bullet.interactionsEnabled = false;

        let hoverState = bullet.states.create("hover");
        let outlineCircle = bullet.createChild(am4core.Circle);


        let image = bullet.createChild(am4core.Image);
        image.width = 25;
        image.height = 25;
        image.horizontalCenter = "middle";
        image.verticalCenter = "middle";
        image.propertyFields.href = "href";



        let previousBullet;
        chart.cursor.events.on("cursorpositionchanged", function (event) {
          let dataItem = series.tooltipDataItem;

          if (previousBullet && previousBullet != bullet) {
            previousBullet.isHover = false;
          }

          if (previousBullet != bullet) {

            let hs = bullet.states.getKey("hover");

            bullet.isHover = true;

            previousBullet = bullet;
          }
        }
        )
        //grafico de lineas 
        let chart2 = am4core.create("chartdiv2", am4charts.XYChart3D);

        // Add data
        chart2.data = [{
          "country": "Enero",
          "year2018": 300,
          "year2019": 350
        }, {
          "country": "Febrero",
          "year2018": 400,
          "year2019": 450
        }, {
          "country": "Marzo",
          "year2018": 452,
          "year2019": 562,
        }, {
          "country": "Abril",
          "year2018": 523,
          "year2019": 569
        }, {
          "country": "Mayo",
          "year2018": 692,
          "year2019": 624
        }, {
          "country": "Junio",
          "year2018": 741,
          "year2019": 532
        }, {
          "country": "Julio",
          "year2018": 641,
          "year2019": 712
        }, {
          "country": "Agosto",
          "year2018": 412,
          "year2019": 456
        }, {
          "country": "Septiembre",
          "year2018": 647,
          "year2019": 712
        }, {
          "country": "Octubre",
          "year2018": 541,
          "year2019": 741
        }, {
          "country": "Noviembre",
          "year2018": 412,
          "year2019": 475
        }, {
          "country": "Diciembre",
          "year2018": 658,
          "year2019": 752
        }];

        // Create axes
        let categoryAxis2 = chart2.xAxes.push(new am4charts.CategoryAxis());
        
        categoryAxis2.dataFields.category = "country";
        categoryAxis2.renderer.grid.template.location = 0;
        categoryAxis2.renderer.minGridDistance = 100;

        let valueAxis2 = chart2.yAxes.push(new am4charts.ValueAxis());
        valueAxis2.title.text = "[bold]Ganancias en miles[/]";
        valueAxis2.renderer.labels.template.adapter.add("text", function (text) {
          return "$" + text;
        });
        //leyends
        chart2.legend = new am4charts.Legend();

        // Create series
        let series2 = chart2.series.push(new am4charts.ColumnSeries3D());
        series2.dataFields.valueY = "year2018";
        series2.dataFields.categoryX = "country";
        series2.name = "Year 2018";
        series2.clustered = false;
        series2.columns.template.tooltipText = "Ganancias {category} (2018): [bold]${valueY}[/]";
        series2.columns.template.fillOpacity = 0.8;
        series2.columns.template.fill = am4core.color("#d9d1ea");
        


        let series3 = chart2.series.push(new am4charts.ColumnSeries3D());
        series3.columns.template.fill = am4core.color("#a18bca");
        series2.columns.template.fillOpacity = 0.8;
        series3.dataFields.valueY = "year2019";
        series3.dataFields.categoryX = "country";
        series3.name = "Year 2019";
        series3.clustered = false;
        series3.columns.template.tooltipText = "Ganancias {category} (2019): [bold]{valueY}[/]";

      }
    })

  }
  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  actualizarEstadoReserva(reserva:Reserva, estado:number){
    //console.log(estado)
    if(estado==1){
      reserva.estado_reserva = this.listEstado[1];
    }else{
      reserva.estado_reserva = this.listEstado[4];
    }

    this.restService.updateReserva(reserva.id_reserva,reserva).subscribe((res: any[]) => {
      Swal.fire('Solicitud aceptada', 'La reserva ha sido actualizada', 'success');
    }, err =>{
      Swal.fire('Solicitud rechazada', 'La reserva no se pudo actualizar', 'error');
    });
  
  }
}
