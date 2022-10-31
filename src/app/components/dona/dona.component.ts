import { Component, Input } from '@angular/core';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent {

  @Input() title: string = 'sin titulo';
  @Input() data = [350, 450, 100];
  @Input('labels') doughnutChartLabels: string[] = [ 'Label1', 'Label2', 'Label3' ];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [{ data: this.data }],
  };

  ngOnChanges(){
    this.doughnutChartData = {
      labels: this.doughnutChartLabels,
      datasets: [{ data: this.data }],
    };
  } 

}
