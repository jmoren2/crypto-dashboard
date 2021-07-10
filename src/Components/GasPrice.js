import React, { useRef, useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "../App.css";

function GasPrice(props) {
    const url = 'wss://www.gasnow.org/ws';
    const [gasPrices, setGasPrices] = useState({})
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket(url);
        //let gas = {}
        ws.current.onmessage = (e) => {
            const datastr = e.data;
            const data = JSON.parse(datastr)
            //console.log(data.data)
            let gas = data.data.gasPrices
            setGasPrices(gas)
        }
        //setGasPrices(gas)
    }, [])
  return (
    <div className="gasprice">
        <h1>Gas Prices</h1>
        <br />
        <div class="card">
                <div class="container">
                    Rapid:
                    {gasPrices.rapid}
                </div>
            </div>
        <div class="card">
                <div class="container">
                    {gasPrices.fast}
                </div>
            </div>
        <div class="card">
                <div class="container">
                    {gasPrices.standard}
                </div>
            </div>
        <div class="card">
                <div class="container">
                    {gasPrices.slow}
                </div>
            </div>
        </div>
  );
}

export default GasPrice;