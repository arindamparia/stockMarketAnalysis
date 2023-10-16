
const stocks = ['AAPL' ,'MSFT' ,'GOOGL' ,'AMZN' ,'PYPL', 'TSLA' ,'JPM' ,'NVDA', 'NFLX', 'DIS'];
async function render() {
    document.getElementById('chart').style.display='none'
    let stockChartsData,stockStatsData,stockSummary;
    try{
        stockChartsData = await (await fetch('https://stocks3.onrender.com/api/stocks/getstocksdata')).json()
        stockStatsData = await (await fetch('https://stocks3.onrender.com/api/stocks/getstockstatsdata')).json()
        stockSummary=await (await fetch('https://stocks3.onrender.com/api/stocks/getstocksprofiledata')).json()
    }
    finally {
        document.getElementById('chart').style.display='block'
        document.getElementById('waiting').style.display='none'
    }
    const stockNamesEle = document.getElementById('stockNames')
    let options = {
        series: [{
            name: 'AAPL',
            data: createChart(stockChartsData,stockStatsData,stockSummary,'AAPL',"5y")
        }],
        chart: {
            id: 'area-datetime',
            type: 'area',
            height: 350,
            zoom: {
                autoScaleYaxis: true
            }
        },
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 2,
            style: 'hollow',
        },
        xaxis: {
            type: 'datetime',
            min: createChart(stockChartsData,stockStatsData,stockSummary,'AAPL',"5y")[0][0],
            tickAmount: 10,
        },
        tooltip: {
            x: {
                format: 'dd MMM yyyy'
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 100]
            }
        },
    };
    let chart = new ApexCharts(document.querySelector("#chart-timeline"), options);
    chart.render();
    let resetCssClasses = function(activeEl) {
        let els = document.querySelectorAll('button')
        Array.prototype.forEach.call(els, function(el) {
            el.classList.remove('active')
        })

        activeEl.target.classList.add('active')
    }
    stocks.forEach(val => {
        const stockDetailsDivEle=document.createElement('div')
        stockDetailsDivEle.classList.add('stockDetailsDiv')
        const stockBtnEle = document.createElement('button')
        const stockPriceEle=document.createElement('span'),stockProfitEle=document.createElement('span')
        // stockPriceEle.classList.add('stockPrice')
        // stockProfitEle.classList.add('stockProfit')
        stockBtnEle.textContent = val;
        stockPriceEle.textContent=`$${(stockStatsData.stocksStatsData[0][`${val}`].bookValue).toFixed(2)}`
        stockProfitEle.textContent=`${(stockStatsData.stocksStatsData[0][`${val}`].profit).toFixed(2)}%`
        if(stockStatsData.stocksStatsData[0][`${val}`].profit>0)stockProfitEle.style.color='green'
        else stockProfitEle.style.color='red'
        stockDetailsDivEle.append(stockBtnEle,stockPriceEle,stockProfitEle)
        stockBtnEle.onclick = () => {
            const arr=createChart(stockChartsData, stockStatsData, stockSummary, val, '5y')
            chart.updateOptions({
                series: [{
                    data: arr,
                    name: val
                }],
                xaxis: {
                    min:arr[0][0]
                }
            })
            // chart.updateSeries([{data: arr, name: val}])
        }
        stockNamesEle.append(stockDetailsDivEle)
    })
    document.querySelector('#one_month').onclick = () => {

        const arr=createChart(stockChartsData,stockStatsData,stockSummary,document.getElementById('stockName').textContent, '1mo')
        chart.updateOptions({
            series: [{
                data: arr,
                name: document.getElementById('stockName').textContent
            }],
            xaxis: {
                min:arr[0][0]
            }
        })
    }
    document.querySelector('#three_months').onclick = () => {
        const arr=createChart(stockChartsData,stockStatsData,stockSummary,document.getElementById('stockName').textContent, '3mo')
        chart.updateOptions({
            series: [{
                data: arr,
                name: document.getElementById('stockName').textContent
            }],
            xaxis: {
                min:arr[0][0]
            }
        })
    }
    document.querySelector('#one_year').onclick = () => {
        const arr=createChart(stockChartsData,stockStatsData,stockSummary,document.getElementById('stockName').textContent, '1y')
        chart.updateOptions({
            series: [{
                data: arr,
                name: document.getElementById('stockName').textContent
            }],
            xaxis: {
                min:arr[0][0]
            }
        })
    }
    document.querySelector('#five_years').onclick = () => {
        const arr=createChart(stockChartsData,stockStatsData,stockSummary,document.getElementById('stockName').textContent, '5y')
        chart.updateOptions({
            series: [{
                data: arr,
                name: document.getElementById('stockName').textContent
            }],
            xaxis: {
                min:arr[0][0]
            }
        })
    }

}
function createChart(stockChartsData,stockStatsData,stockSummary,brand,time) {
    //currentStock=brand
    const timeArr=stockChartsData.stocksData[0][`${brand}`][`${time}`].timeStamp
    const valArr=stockChartsData.stocksData[0][`${brand}`][`${time}`].value
    const dataArr=[];
    let minVal=valArr[0].toFixed(2),maxVal=minVal;
    for(let i=0;i<timeArr.length;i++){
        const newArr=[timeArr[i]*1000,valArr[i].toFixed(2)]
        minVal=Math.min(minVal,newArr[1])
        maxVal=Math.max(maxVal,newArr[1])
        dataArr.push(newArr);
    }
    document.getElementById('stockName').textContent=brand
    document.getElementById('book_Value').textContent=`$${stockStatsData.stocksStatsData[0][`${brand}`].bookValue}`
    document.getElementById('profit').textContent=`${stockStatsData.stocksStatsData[0][`${brand}`].profit}%`
    if(stockStatsData.stocksStatsData[0][`${brand}`].profit>0)document.getElementById('profit').style.color='green'
    else document.getElementById('profit').style.color='red'
    document.getElementById('stockSummary').textContent=stockSummary.stocksProfileData[0][`${brand}`].summary
    document.getElementById('stockMin').textContent=`Minimum Price in the selected duration= $${minVal}`
    document.getElementById('stockMax').textContent=`Maximum Price in the selected duration= $${maxVal}`
    return dataArr
}
render()
