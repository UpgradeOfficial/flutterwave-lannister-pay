const express = require("express");
const bodyParser = require("body-parser");
const { response } = require("express");

const app = express();

app.use(express.json())

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.post("/split-payments/compute", (req, res) => {
  
  var request = req.body;      // your JSON
  
  var ans = request.SplitInfo;
  var amount = request.Amount;
  var percentage_array = [];
  var ratio_array = [];
  ratio_total = 0;
  var ratio_amount;
  var SplitBreakdown = [];

  ans.forEach(function (item, index) {
    if (item.SplitType === "PERCENTAGE") {
      percentage_array.push(item);
    } else if (item.SplitType === "RATIO") {
      ratio_total += item.SplitValue;
      ratio_array.push(item);
    } else {
      amount -= item.SplitValue;
      SplitBreakdown.push({
        SplitEntityId: item.SplitEntityId,
        Amount: amount,
      });
    }
  });

  percentage_array.forEach(function (item, index) {
    amount -= (item.SplitValue / 100) * amount;
    SplitBreakdown.push({
      SplitEntityId: item.SplitEntityId,
      Amount: amount,
    });
  });

  var ratio_temporary_amount = amount;

  ratio_array.forEach(function (item, index) {
    ratio_amount = (item.SplitValue / ratio_total) * ratio_temporary_amount;
    amount -= ratio_amount;
    SplitBreakdown.push({
      SplitEntityId: item.SplitEntityId,
      Amount: ratio_amount,
    });
  });

  var response = {
    ID: request.ID,
    balance: amount,
    SplitBreakdown: SplitBreakdown,
  };
  res.send(response)
  // Ending the response
  res.end()
});


app.get("/", (req, res)=>{
  res.send("flutter lannister pay");
  // Ending the response
  res.end();
})