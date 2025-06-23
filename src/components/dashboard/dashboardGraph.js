import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
export const LineGraph=()=>{
    return (<CChartLine
        className="mt-3 mx-3"
        style={{ height: '70px' }}
        data={{
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
            {
              label: 'My First dataset',
              backgroundColor: 'transparent',
              borderColor: 'rgba(255,255,255,.55)',
              pointBackgroundColor: getStyle('--cui-info'),
              data: [1, 18, 9, 17, 34, 22, 11],
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              display: false,
            },
          },
          maintainAspectRatio: false,
          scales: {
            x: {
              border: {
                display: false,
              },
              grid: {
                display: false,
                drawBorder: false,
              },
              ticks: {
                display: false,
              },
            },
            y: {
              min: -9,
              max: 39,
              display: false,
              grid: {
                display: false,
              },
              ticks: {
                display: false,
              },
            },
          },
          elements: {
            line: {
              borderWidth: 1,
            },
            point: {
              radius: 4,
              hitRadius: 10,
              hoverRadius: 4,
            },
          },
        }}
      />)
}

export const BarGraph=()=>{
    return (
            <CChartBar
                 className="mt-3 mx-3"
                 style={{ height: '70px' }}
                 data={{
                   labels: [
                     'January',
                     'February',
                     'March',
                     'April',
                     'May',
                     'June',
                     'July',
                     'August',
                     'September',
                     'October',
                     'November',
                     'December',
                     'January',
                     'February',
                     'March',
                     'April',
                   ],
                   datasets: [
                     {
                       label: 'My First dataset',
                       backgroundColor: 'rgba(255,255,255,.2)',
                       borderColor: 'rgba(255,255,255,.55)',
                       data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                       barPercentage: 0.6,
                     },
                   ],
                 }}
                 options={{
                   maintainAspectRatio: false,
                   plugins: {
                     legend: {
                       display: false,
                     },
                   },
                   scales: {
                     x: {
                       grid: {
                         display: false,
                         drawTicks: false,
                       },
                       ticks: {
                         display: false,
                       },
                     },
                     y: {
                       border: {
                         display: false,
                       },
                       grid: {
                         display: false,
                         drawBorder: false,
                         drawTicks: false,
                       },
                       ticks: {
                         display: false,
                       },
                     },
                   },
                 }}
               />
    )
}

