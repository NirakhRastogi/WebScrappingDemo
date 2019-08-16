var express = require('express');
var router = express.Router();
var axios = require('axios').default;
let parser = require('../public/javascripts/Parser');

/* GET home page. */
router.get('/', function (_, res, __) {
  res.render('index', { scrapUrl: 'Please enter your URL and press Submit.' });
});

router.post('/scrap', function (req, res, _) {
  let url = req.body.scrapUrl;

  axios.get(url).then((sRes) => {

    var startTime = new Date().getTime();
    let metaInformation = parser.startScrapping(sRes.data);
    let parseInformation = parser.parseScrappedData(metaInformation);
    var endTime = new Date().getTime();
    // res.setHeader('Content-Type', 'application/json');
    // res.send({ "Full Info": metaInformation, "Parse Data": parseInformation, "ScriptExecutionTime": (endTime - startTime) + "ms" });
    console.log(`Total time take ${endTime - startTime} ms`);
    res.render('index', { 'scrapUrl': { "FullInfo": metaInformation, "ParseData": parseInformation, "ScriptExecutionTime": (endTime - startTime) + "ms" } });
  }).catch((sErr) => {
    console.log(sErr);
  })
});

module.exports = router;
