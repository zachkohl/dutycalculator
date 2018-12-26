


 function modelForExport(config) {
    app = config.app;
    let cheerio = require('cheerio')
  
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



    app.get('/', async function (req, res) {

        res.render('dutycalculator')
     });//end '/home'



     app.post('/dutycalculator/api', async function (req, res) {
 countryCode = req.body.countryCode;
 item = req.body.inputItem;

 let $ = cheerio.load('https://usitc.gov/sites/default/files/tata/hts/hts_2018_revision_14_data.json')

$.each(function(){
 
})

        res.send('success:'+item)
     });//end '/home'




    
     var request = require('request')
     , JSONStream = require('JSONStream')
     , es = require('event-stream')
    
//    request({url: 'https://usitc.gov/sites/default/files/tata/hts/hts_2018_revision_14_data.json'})
//      .pipe(JSONStream.parse('rows.*'))
//      .pipe(es.mapSync(function (data) {
//        console.error(data)
//        console.log(data)
//        return data
//      }))


request('https://usitc.gov/sites/default/files/tata/hts/hts_2018_revision_14_data.json').pipe(JSONStream.parse('other')).pipe(es.mapSync(function (data) {
    console.error(data)
    console.log(data)
    return data
  }))








  app.get('/json', async function (req, res) {
      JSONRaw = {
          rows: '1',
          name: 'zach',
          sky: 'blue'
      }
jsonBlob = JSON.stringify(JSONRaw)
    res.send(jsonBlob)
 });//end '/home'



}//end ModelForExport





module.exports = modelForExport;



