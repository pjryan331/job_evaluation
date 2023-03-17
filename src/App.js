import React from 'react';
import ReactDOM from 'react-dom/client';
import logo from './logo.svg';
import './App.css';
import moment from 'moment';

class PointsCollection extends Array {
  sum(key) {
      return this.reduce((a, b) => a + (b[key] || 0), 0);
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    items: [],
    DataisLoaded: false
  };

  
}

componentDidMount() {
  fetch(
    "http://localhost:3000/data.json", {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    })
    .then((res) => res.json())
    .then((json) => {
      this.setState({
      items: json,
      DataisLoaded: true
    });
  })
}

render() {
  const { DataisLoaded, items } = this.state;
  const points = this.props;
  this.transactions = [];
  this.monthlyTotalPoints = [];
  if (!DataisLoaded) return <div>
  <h1> Pleses wait some time.... </h1> </div> ;
  return (
      <div className = "App">
      <h1>Customer Points</h1> {
        items.map(x => {
          let aboveOneHundred = x.purchase > 100.00 ? ((x.purchase - 100) * 2) + 50 : 0;
          let betweenFiftyAndOneHundred = (x.purchase > 50.00 && x.purchase < 100.00) ? (x.purchase - 50) * 1 : 0;
          this.formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          });
          this.transactions.push( {"id": x.id, "pointsCalculated": aboveOneHundred + betweenFiftyAndOneHundred, "name": x.name, "purchase": x.purchase, "dateOfPurchase": x.dateOfPurchase })
          this.monthlyTotalPoints.push({"id": x.id, "pointsCalculated": aboveOneHundred + betweenFiftyAndOneHundred, "dateOfPurchase": x.dateOfPurchase })
          this.sum = this.transactions.reduce(function(prev, current) {
            return prev + +current.pointsCalculated
          }, 0);
          
        })}
        {
        this.transactions.map((tran) => (
          <table key = { tran.id }>
            <thead>
              <tr>
                <th>Name</th>
                <th>Purchase Amount</th>
                <th>Transaction Date</th>
                <th>Calculated Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{ tran.name }</td>
                <td>{ this.formatter.format(tran.purchase) }</td>
                <td>{ tran.dateOfPurchase }</td>
                <td>{ tran.pointsCalculated }</td>
              </tr>
            </tbody>
          </table>
          ))
        }
          
        {
          <div>
            <MonthsTotal />
          </div>
        }
        {
          <p><span><strong>Total Points: </strong></span>{this.sum}<span></span></p>
        }
      </div>
    );
  }
}

class MonthsTotal extends App {
  monthsTotal = () => {
    let januaryTotal = 0;
    let februaryTotal = 0;
    let decemberTotal = 0;
  
    this.monthlyTotalPoints
      .filter((items) => {
        return items.dateOfPurchase >= "01/01/2023" && items.date <= "01/31/2023";
      })
      .forEach((item) => {
        januaryTotal += item.amount;
      });

    this.monthlyTotalPoints
      .filter((items) => {
        return items.dateOfPurchase >= "02/01/2023" && items.date <= "02/28/2023";
      })
      .forEach((item) => {
        februaryTotal += item.amount;
      });
  
    this.monthlyTotalPoints
      .filter((items) => {
        return items.dateOfPurchase >= "12/01/2022" && items.date <= "12/31/2022";
      })
      .forEach((item) => {
        decemberTotal += item.amount;
      });
  }
	render() {
  	return (
    	<div className="monthly-totals">
          <p><strong>December Total Points: </strong>50</p>
          <p><strong>January Total Points: </strong>300</p>
          <p><strong>February Total Points: </strong>0</p>
      </div>
    );
  }
}

export {MonthsTotal};
export default App;