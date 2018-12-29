


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



    app.get('/dutycalculator/api/searchHTS', async function (req, res) {
        // countryCode = req.query.countryCode;
        item = req.query.searchTerm.toLowerCase();

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
        //  
        // }


        //working code
        // result = obj.filter(function (objectUnderInspection) {
        //     if (objectUnderInspection.description.toLowerCase().indexOf(item) > -1 || objectUnderInspection.htsno.toLowerCase().indexOf(item) > -1) {
        //         return true;
        //     }
        //     else {
        //         return false
        //     }
        // })
//end working code

result=[]
console.log('hi')
for(i=0;i<obj.length;i++){
           // if (obj[i].description.toLowerCase().indexOf(item) > -1 || obj[i].htsno.toLowerCase().indexOf(item) > -1) {
            if (obj[i].description.toLowerCase().indexOf(item) > -1 || obj[i].htsno.toLowerCase() ===item) {
                result.push(obj[i])
                //check for indents
                let j = i;
            let done = false;
            while(!done){
            j++;

            if(typeof obj[j]==='undefined'){
                done = true;
                console.log('flag '+j)
                break;
                if(typeof obj[j].indent==='undefined'){
                    console.log('item '+ j +' does not have indent value')
                    done = true;
                    break;
                    
                }

                
            }
            else{
                if(obj[j].indent>obj[i].indent){
                    result.push(obj[j]);
                   }else{
                       done = true;
                   }
            }
            
            }//end while loop

            }//end if a good answer test
}//end for loop

// function addAll
if(result.length===33978){
    console.log('returned all 33978 items')
    res.send('returned all 33978 items')
    return
}
if(result.length >10000){
console.log('over 10,000 items')
res.send('over 10,000 items')
}else{
    console.log(result)
    res.send(result)
}

    });//end '/home'










    app.get('/json', async function (req, res) {
        JSONRaw = {
            rows: '1',
            name: 'zach',
            sky: 'blue'
        }
        jsonBlob = JSON.stringify(JSONRaw)
        res.send(jsonBlob)
    });//end '/home'

    app.get('/dutycalculator/api/getDuty', async function (req, res) {
searchTerm = req.query.searchTerm;
console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++')
console.log(searchTerm)
result = [];
for(i=0;i<obj.length;i++){
    // if (obj[i].description.toLowerCase().indexOf(item) > -1 || obj[i].htsno.toLowerCase().indexOf(item) > -1) {
     if (obj[i].description.toLowerCase().indexOf(item) > -1 || obj[i].htsno.toLowerCase() ===item) {
        //find above value if not included
        obj[i].added ={};
    if(obj[i].general ===''){
        let j = i;
        do{
j--;
obj[i].added.nextUpGeneral = obj[j].general;
        }while(obj[j].general===''&&j>0)
    }//


         result.push(obj[i])
   

     }//end if a good answer test

}//end for loop
console.log(result)
res.send(result)
    })//end getDuty


















}//end ModelForExport





module.exports = modelForExport;



