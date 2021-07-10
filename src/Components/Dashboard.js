import React, { useRef } from "react";
import { Line } from "react-chartjs-2";

function Dashboard(props) {
  const opts = {
    tooltips: {
      intersect: false,
      mode: "index"
    },
    responsive: true,
    maintainAspectRatio: false
  };
  if (props.price === "0.00") {
    return <h2>please select a currency pair</h2>;
  }
  return (
    <div className="dashboard">
      <h2>{`$${props.price}`}</h2>

      <div className="chart-container">
        <Line data={props.data} options={opts} />
      </div>
    </div>
  );
}

export default Dashboard;