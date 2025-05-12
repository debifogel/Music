import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideEchartsCore } from 'ngx-echarts'; // Import provideEchartsCore from the correct module
import * as echarts from 'echarts'; // Import echarts library
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(),provideHttpClient(), provideEchartsCore({ echarts })]
};
