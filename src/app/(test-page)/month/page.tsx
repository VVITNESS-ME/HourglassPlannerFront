'use client'
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Make sure to import Chart from 'chart.js'

export default function Home() {
    // Specify the type of the ref as HTMLDivElement
    const chartContainer = useRef<HTMLDivElement>(null);
    var myChart: any = null;

    useEffect(() => {
        if (chartContainer && chartContainer.current) {
            const canvas = document.createElement('canvas');
            chartContainer.current.appendChild(canvas);

            if(myChart){
                myChart.destroy();
            }

            myChart = new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
                    datasets: [{
                        label: '집중도',
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 9, 4, -4, -8, -6, 8, 8, 7, 4, -8, -6, 0, 0, 0],
                        backgroundColor: function(context) {
                            var index = context.dataIndex;
                            var value = context.dataset.data[index];
                            return value < 0 ? 'red' : 'green'; // 음수면 빨간색, 양수면 초록색
                        },
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }, []);

    return (
        <div ref={chartContainer} style={{padding: '10vh'}}/>
    );
}