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
    // טעינת נתוני משתמשים
    this.userService.getAllUserDates().subscribe({
      next: (dates) => {
        this.createUserChart(dates);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading user dates:', err);
        this.loading = false;
        this.error = true;
      }
    });

    // טעינת נתוני שירים בנפרד
    this.userService.getSongCounts().subscribe({
      next: (songCounts) => {
        this.createSongChart(songCounts);
      },
      error: (err) => {
        console.error('Error loading song counts:', err);
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
          fontSize: 16,
          color: '#333333' // שחור
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
          color: '#333333' // שחור
        }
      },
      yAxis: {
        type: 'value',
        name: 'מספר התחברויות',
        nameLocation: 'middle',
        nameGap: 30,
        axisLabel: {
          color: '#333333' // שחור
        }
      },
      series: [
        {
          name: 'מספר התחברויות',
          type: 'bar',
          data: counts,
          itemStyle: {
            color: '#FFA500' // כתום
          },
          emphasis: {
            itemStyle: {
              color: '#FF8C00' // כתום כהה יותר בהדגשה
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
          fontSize: 16,
          color: '#333333' // שחור
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
          color: '#333333' // שחור
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
            borderColor: '#FFFFFF', // לבן
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {c} ({d}%)',
            color: '#333333' // שחור
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
              itemStyle: { color: '#FFA500' } // כתום
            },
            { 
              value: songCounts.PrivateSongs, 
              name: 'שירים פרטיים',
              itemStyle: { color: '#808080' } // אפור
            }
          ]
        }
      ]
    };
  }
}