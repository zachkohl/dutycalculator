


function modelForExport(config) {
    app = config.app;
    let cheerio = require('cheerio')
    var fs = require('fs');
    const request = require('request');
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    var obj;
    if (process.env.NODE_ENV !== 'production') {
        require('dotenv').load();
        fs.readFile('hts_2018_revision_14_data.json', 'utf8', function (err, data) {
            if (err) throw err;
            obj = JSON.parse(data)
        })//end read file. 
    } else {
        request('https://usitc.gov/sites/default/files/tata/hts/hts_2018_revision_14_data.json', function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            obj = JSON.parse(body)
        });
    }



    app.get('/', async function (req, res) {

        res.render('dutycalculator')
    });//end '/home'



    app.post('/dutycalculator/api', async function (req, res) {
        countryCode = req.body.countryCode;
        item = req.body.inputItem.toLowerCase();

        //console.log(obj[2])
        function searchDescription(value) {
            return value.description.search(item)
        }
        // result = obj.filter(searchDescription )
        //  console.log(result.length)
        example = [{
            other: '',
            indent: '0',
            description: 'Live horses, asses, mules and hinnies:',
            quotaQuantity: '',
            special: '',
            htsno: '0101',
            addiitionalDuties: '',
            footnotes: [],
            general: '',
            units: ''
        }]

        // for(let i = 0; i < obj.length; i++){
        //     let objectUnderInspection = obj[i];
        //    if(objectUnderInspection.description.toLowerCase().indexOf(item)>-1){
        //        console.log(objectUnderInspection)
        //    }
        // }

        result = obj.filter(function (objectUnderInspection) {
            if (objectUnderInspection.description.toLowerCase().indexOf(item) > -1 || objectUnderInspection.htsno.toLowerCase().indexOf(item) > -1) {
                return true;
            }
            else {
                return false
            }
        })
        res.send(result)
    });//end '/home'





    //  var request = require('request')
    //  , JSONStream = require('JSONStream')
    //  , es = require('event-stream')

    //    request({url: 'https://usitc.gov/sites/default/files/tata/hts/hts_2018_revision_14_data.json'})
    //      .pipe(JSONStream.parse('rows.*'))
    //      .pipe(es.mapSync(function (data) {
    //        console.error(data)
    //        console.log(data)
    //        return data
    //      }))


    // request('https://dutycalculator.herokuapp.com/json').pipe(JSONStream.parse('other')).pipe(es.mapSync(function (data) {
    //     console.error(data)
    //     console.log(data)
    //     return data
    //   }))
    // request('https://dutycalculator.herokuapp.com/json').on('response',function(response){
    //         console.log(response)
    // });







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



