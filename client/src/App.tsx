import { useState, useEffect } from 'react'
import './App.css'
import { ChakraProvider, extendTheme, Text, Input } from '@chakra-ui/react'
import { Container } from '@chakra-ui/react'
import DefaultLayout from './components/layouts/Default'
import LineChart from './components/LineChart'
import theme from './theme'

const defaultTheme = extendTheme(theme)

const endpoint = "http://localhost:8000/interest-data/"

type ChartData = {
    xAxis: string[],
    yAxis: string[]
}

type InputData = {
    initial: number,
    monthly: number,
    interest: number,
    frequency: number
}


function App() {

    const [chartData, setChartData] = useState<ChartData>({xAxis: [], yAxis: []})
    const [inputData, setInputData] = useState<InputData>({initial: 0, monthly: 0, interest: 0, frequency: 365})

    useEffect(() => {
        fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(inputData)
        }).then((response) => {
            if (!response.ok) {
                return
            } else {
                return response.json()
            }
        }).then((data) => {
            console.log(data)
            if (data !== undefined) {
                setChartData(data)
            }
        })
    }, [inputData])

    return (
        <ChakraProvider theme={defaultTheme}>
            <DefaultLayout>
                <Container pt={6}>
                    <LineChart
                        title="Savings Over time"
                        xAxisData={chartData.xAxis}
                        yAxisData={chartData.yAxis}
                        xLabel="Years"
                        yLabel="Amount"
                    />

                    <Text>At the end of 50 years, you will have saved {
                        new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
                        Number.parseFloat(chartData.yAxis[chartData.yAxis.length - 1]),
                    )} </Text>
                    <br/>
                    <hr/>
                    <br/>
                    <Text>Initial Amount</Text>
                    <Input onChange={(e) => setInputData({...inputData, initial: Number.parseFloat(e.target.value)})}/>

                    <Text>Monthly Deposit</Text>
                    <Input onChange={(e) => setInputData({...inputData, monthly: Number.parseFloat(e.target.value)})}/>

                    <Text>Annual Interest Rate</Text>
                    <Input onChange={(e) => setInputData({...inputData, interest: Number.parseFloat(e.target.value)})}/>
                </Container>
            </DefaultLayout>
        </ChakraProvider>
    )
}

export default App
