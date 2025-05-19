import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/Users/users.service';
import { NgxEchartsModule } from 'ngx-echarts';
import { CommonModule } from '@angular/common';

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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Load user data
    this.userService.getAllUserDates().subscribe({
      next: (dates) => {
        this.createUserChart(dates);
      },
      error: (err) => {
        console.error('Error loading user dates:', err);
        this.error = true; // Set error state
      },
      complete: () => this.loading = false // Set loading to false after completion
    });

    // Load song counts separately
    this.userService.getSongCounts().subscribe({
      next: (songCounts) => {
        this.createSongChart(songCounts);
      },
      error: (err) => {
        console.error('Error loading song counts:', err);
        this.error = true; // Set error state
      },
      complete: () => this.loading = false // Set loading to false after completion
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

    // Set user chart options
    this.userChartOption = {
      title: {
        text: 'התחברויות לפי תאריך',
        textStyle: {
          fontWeight: 'bold',
          fontSize: 16,
          color: '#333333' // Black
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
          interval: 0,
          color: '#333333' // Black
        }
      },
      yAxis: {
        type: 'value',
        name: 'מספר התחברויות',
        nameLocation: 'middle',
        nameGap: 30,
        axisLabel: {
          color: '#333333' // Black
        }
      },
      series: [
        {
          name: 'מספר התחברויות',
          type: 'bar',
          data: counts,
          itemStyle: {
            color: '#FFA500' // Orange
          },
          emphasis: {
            itemStyle: {
              color: '#FF8C00' // Darker orange on emphasis
            }
          },
          barWidth: '60%'
        }
      ]
    };
  }

  private createSongChart(songCounts: { PublicSongs: number; PrivateSongs: number }): void {
    console.log('Song Counts:', songCounts);
    // Set song chart options
    this.songChartOption = {
      title: {
        text: 'התפלגות שירים',
        subtext: 'שירים ציבוריים ופרטיים',
        textStyle: {
          fontWeight: 'bold',
          fontSize: 16,
          color: '#333333' // Black
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
        data: ['שירים ציבוריים', 'שירים פרטיים'],
        textStyle: {
          color: '#333333' // Black
        }
      },
      series: [
        {
          name: 'סוגי שירים',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#FFFFFF', // White
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {c} ({d}%)',
            color: '#333333' // Black
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
              itemStyle: { color: '#FFA500' } // Orange
            },
            { 
              value: songCounts.PrivateSongs, 
              name: 'שירים פרטיים',
              itemStyle: { color: '#808080' } // Gray
            }
          ]
        }
      ]
    };
  }
}