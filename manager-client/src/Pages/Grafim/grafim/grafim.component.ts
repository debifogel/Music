import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/Users/users.service';
import { NgxEchartsModule } from 'ngx-echarts';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-grafim',
  standalone: true,
  imports: [NgxEchartsModule, CommonModule],
  templateUrl: './grafim.component.html',
  styleUrls: ['./grafim.component.css']
})
export class GrafimComponent implements OnInit {
  userChartOption: any;
  songChartOption: any;
  loading = true;
  error = false;

  constructor(
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    // Load both data sources in parallel
    forkJoin({
      userDates: this.userService.getAllUserDates(),
      songCounts: this.userService.getSongCounts()
    }).subscribe({
      next: (results) => {
        this.createUserChart(results.userDates);
        this.createSongChart(results.songCounts);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading chart data:', err);
        this.loading = false;
        this.error = true;
      }
    });
  }

  private createUserChart(dates: string[]): void {
    const dateCounts: { [key: string]: number } = {};

    dates.forEach(dateStr => {
      const date = new Date(dateStr).toISOString().split('T')[0];
      dateCounts[date] = (dateCounts[date] || 0) + 1;
    });

    const sortedDates = Object.keys(dateCounts).sort();
    const counts = sortedDates.map(date => dateCounts[date]);

    this.userChartOption = {
      title: {
        text: 'התחברויות לפי תאריך',
        textStyle: {
          fontWeight: 'bold',
          fontSize: 16
        },
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c} התחברויות'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: sortedDates,
        axisLabel: {
          rotate: 45,
          interval: 0
        }
      },
      yAxis: {
        type: 'value',
        name: 'מספר התחברויות',
        nameLocation: 'middle',
        nameGap: 30
      },
      series: [
        {
          name: 'מספר התחברויות',
          type: 'bar',
          data: counts,
          itemStyle: {
            color: '#4e73df'
          },
          emphasis: {
            itemStyle: {
              color: '#2e59d9'
            }
          },
          barWidth: '60%'
        }
      ]
    };
  }

  private createSongChart(songCounts: { PublicSongs: number; PrivateSongs: number }): void {
    this.songChartOption = {
      title: {
        text: 'התפלגות שירים',
        subtext: 'שירים ציבוריים ופרטיים',
        textStyle: {
          fontWeight: 'bold',
          fontSize: 16
        },
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: 'bottom',
        data: ['שירים ציבוריים', 'שירים פרטיים']
      },
      series: [
        {
          name: 'סוגי שירים',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {c} ({d}%)'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '16',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: [
            { 
              value: songCounts.PublicSongs, 
              name: 'שירים ציבוריים',
              itemStyle: { color: '#36b9cc' } 
            },
            { 
              value: songCounts.PrivateSongs, 
              name: 'שירים פרטיים',
              itemStyle: { color: '#1cc88a' } 
            }
          ]
        }
      ]
    };
  }
}