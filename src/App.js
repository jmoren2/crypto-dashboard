import React, { useState, useEffect, useRef } from "react";
import Dashboard from "./Components/Dashboard";
import { formatData } from "./utils";
import "./App.css";
import axios from "axios"
import GasPrice from "./Components/GasPrice"


export default function App() {
  const [currencies, setcurrencies] = useState([]);
  const [pair, setpair] = useState("");
  const [price, setprice] = useState("0.00");
  const [pastData, setpastData] = useState({});
  const ws = useRef(null);

  let firstLoad = useRef(false);
  const url = "https://api.pro.coinbase.com";
  const historicalDataURL = `${url}/products/${pair}/candles?granularity=86400`;

  useEffect(() => {
    ws.current = new WebSocket("wss://ws-feed.pro.coinbase.com");

    let pairs = [];

    const getCurrencyPairs = async () => {
      var unfilteredPairs = await axios.get(url + "/products");
      pairs = unfilteredPairs.data
      
      let filtered = pairs.filter( pair => {
        if (pair.quote_currency === "USD") {
          return pair;
        }
      }).sort((a,b) => {
        if(a.base_currency === b.base_currency) return 0;
        if(a.base_currency === "ETH") return -1;
        if(b.base_currency ==="ETH") return 1;

        if (a.base_currency < b.base_currency) {
          return -1;
        }
        if (a.base_currency > b.base_currency ) {
          return 1;
        }
        return 0;
      });
      console.log(filtered)
      filtered.unshift({})
      setcurrencies(filtered);
      firstLoad.current = true;
    };

    getCurrencyPairs();
  }, []);

  useEffect(() => {
    if (!firstLoad.current) {
      return;
    }
    
    let msg = {
      type: "subscribe",
      product_ids: [pair],
      channels: ["ticker"]
    };
    let jsonMsg = JSON.stringify(msg);
    ws.current.send(jsonMsg);

    const getHistoricalData = async () => {
      let dataArr = await axios.get(historicalDataURL);
      
      let formattedData = formatData(dataArr.data);
      setpastData(formattedData);
    };

    getHistoricalData();

    ws.current.onmessage = (e) => {
      let data = JSON.parse(e.data);
      if (data.type !== "ticker") {
        return;
      }

      if (data.product_id === pair) {
        setprice(data.price);
      }
    };
  }, [pair]);

  const handleSelect = (e) => {
    let unsubMsg = {
      type: "unsubscribe",
      product_ids: [pair],
      channels: ["ticker"]
    };
    let unsub = JSON.stringify(unsubMsg);

    ws.current.send(unsub);

    setpair(e.target.value);
  };
  return (
    <div className="container">
      {
        <select name="currency" value={pair} onChange={handleSelect}>
          {currencies.map((cur, idx) => {
            return (
              <option key={idx} value={cur.id}>
                {cur.base_currency}
              </option>
            );
          })}
        </select>
      }
       <Dashboard price={price} data={pastData} /> 
      {
        pair === "ETH-USD" ? <GasPrice /> : null
      }
    </div>
  );
}