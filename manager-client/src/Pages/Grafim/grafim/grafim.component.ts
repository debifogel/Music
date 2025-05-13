import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/Users/users.service';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  selector: 'app-grafim',
  standalone: true,
  imports: [NgxEchartsModule],
  templateUrl: './grafim.component.html',
  styleUrls: ['./grafim.component.css']
})
export class GrafimComponent implements OnInit {
  chartOption: any;
  loading = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUserDates().subscribe(dates => {
      const dateCounts: { [key: string]: number } = {};

      dates.forEach(dateStr => {
        const date = new Date(dateStr).toISOString().split('T')[0];
        dateCounts[date] = (dateCounts[date] || 0) + 1;
      });

      const sortedDates = Object.keys(dateCounts).sort();
      const counts = sortedDates.map(date => dateCounts[date]);

      this.chartOption = {
        title: {
          text: 'התחברויות לפי תאריך'
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: sortedDates
        },
        yAxis: {
          type: 'value'
        },
        
        series: [
          {
            name: 'מספר התחברויות',
            type: 'bar',
            data: counts,
            itemStyle: {
              color: '#FFA500'
            }
          }
        ]
      };

      this.loading = false;
    });
  }
}
