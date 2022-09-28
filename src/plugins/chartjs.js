import { Chart, Tooltip, PieController, ArcElement, Legend, Title } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(Tooltip, PieController, Legend, Title, ArcElement, ChartDataLabels);
