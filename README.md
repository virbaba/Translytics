Backend:
    A. controllers folder contain Transaction related controller like:
      1. Initialize transaction. -> (/initialize)
      2. Get all transaction by month or seach filter. -> (/)
      3. Get bar-chart data. -> (/bar-chart)
      4. Get pie-chart data. -> (/pie-chart)
      5. Get all data by combined query -> (/combined)
    
   B. router folder contain all routing url 
       Backend base url is: http://localhost:1001/api/transaction/*

   C. model folder contain Transaction.js file contain schema for data base

   D. utils folder contain db.js file that provide database connection


Frontend:
     base url is http://localhost:5173

A. components folder have component
  1. Navbar

B. pages folder contain all pages 
  1. Transaction Dashboard
  2. Transaction Statistics
  3. Transaction Bar-Chart
  4. Transaction Pie-Chart

for Bar chart and pie chart used react-chartjs-2 package

    
