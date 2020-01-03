import { Component, OnInit, NgZone } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { RestService } from 'src/app/servicioBackend/rest.service';
import { IntervaloFecha } from 'src/app/entidades/IntervaloFecha';


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
  constructor(private zone: NgZone, public restService: RestService) {
    if (this.restService.hasRole('ROLE_ADMIN')) {
      this.nombre = "Administrador"
    } else {
      this.restService.getProfesionalCorreo(this.restService.usuario.username).subscribe((res: any) => {
        this.restService.profesional = res;
        this.nombre = this.restService.profesional.nombre + " " + this.restService.profesional.apellido;
      })
    }

  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      if (this.restService.hasRole('ROLE_ADMIN')) {
        let chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        chart.paddingRight = 10;

        this.fechas = { fechaInicio: "2019-10-20", fechaFin: "2020-11-20" };
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
                "name": element.nombre,
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
        categoryAxis.renderer.tooltip.dx = -40;

        let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.inside = true;
        valueAxis.renderer.labels.template.fillOpacity = 0.3;
        valueAxis.renderer.grid.template.strokeOpacity = 0;
        valueAxis.min = 0;
        valueAxis.cursorTooltipEnabled = false;
        valueAxis.renderer.baseGrid.strokeOpacity = 0;
        valueAxis.renderer.labels.template.dy = 20;

        let series = chart.series.push(new am4charts.ColumnSeries);
        series.dataFields.valueX = "steps";
        series.dataFields.categoryY = "name";
        series.tooltipText = "{valueX.value}";
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.dy = - 30;
        series.columnsContainer.zIndex = 100;

        let columnTemplate = series.columns.template;
        columnTemplate.height = am4core.percent(50);
        columnTemplate.maxHeight = 50;
        columnTemplate.column.cornerRadius(60, 10, 60, 10);
        columnTemplate.strokeOpacity = 0;

        series.heatRules.push({ target: columnTemplate, property: "fill", dataField: "valueX", min: am4core.color("#e5dc36"), max: am4core.color("#5faa46") });
        series.mainContainer.mask = undefined;

        let cursor = new am4charts.XYCursor();
        chart.cursor = cursor;
        cursor.lineX.disabled = true;
        cursor.lineY.disabled = true;
        cursor.behavior = "none";

        let bullet = columnTemplate.createChild(am4charts.CircleBullet);
        bullet.circle.radius = 30;
        bullet.valign = "middle";
        bullet.align = "left";
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
          "year2018": 3.5,
          "year2019": 4.2
        }, {
          "country": "Febrero",
          "year2018": 1.7,
          "year2019": 3.1
        }, {
          "country": "Marzo",
          "year2018": 2.8,
          "year2019": 2.9
        }, {
          "country": "Abril",
          "year2018": 2.6,
          "year2019": 2.3
        }, {
          "country": "Mayo",
          "year2018": 1.4,
          "year2019": 2.1
        }, {
          "country": "Junio",
          "year2018": 2.6,
          "year2019": 4.9
        }, {
          "country": "Julio",
          "year2018": 6.4,
          "year2019": 7.2
        }, {
          "country": "Agosto",
          "year2018": 8,
          "year2019": 7.1
        }, {
          "country": "Septiembre",
          "year2018": 9.9,
          "year2019": 10.1
        }, {
          "country": "Octubre",
          "year2018": 9.9,
          "year2019": 10.1
        }, {
          "country": "Noviembre",
          "year2018": 9.9,
          "year2019": 10.1
        }, {
          "country": "Diciembre",
          "year2018": 9.9,
          "year2019": 10.1
        }];

        // Create axes
        let categoryAxis2 = chart2.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis2.dataFields.category = "country";
        categoryAxis2.renderer.grid.template.location = 0;
        categoryAxis2.renderer.minGridDistance = 100;

        let valueAxis2 = chart2.yAxes.push(new am4charts.ValueAxis());
        valueAxis2.title.text = "Ganancias EstetiCloud";
        valueAxis2.renderer.labels.template.adapter.add("text", function (text) {
          return "$" + text;
        });

        // Create series
        let series2 = chart2.series.push(new am4charts.ColumnSeries3D());
        series2.dataFields.valueY = "year2018";
        series2.dataFields.categoryX = "country";
        series2.name = "Year 2018";
        series2.clustered = false;
        series2.columns.template.tooltipText = "Ganancias {category} (2018): [bold]{valueY}[/]";
        series2.columns.template.fillOpacity = 0.9;


        let series3 = chart2.series.push(new am4charts.ColumnSeries3D());
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


}
