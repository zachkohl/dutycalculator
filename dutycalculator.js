


function modelForExport(config) {
    app = config.app;
    let cheerio = require('cheerio')
    var fs = require('fs');
    const request = require('request');
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // var htsData;
    // if (process.env.NODE_ENV !== 'production') {
    //     require('dotenv').load();
    //     fs.readFile('hts_2018_revision_14_data.json', 'utf8', function (err, data) {
    //         if (err) throw err;
    //         htsData = JSON.parse(data)
    //     })//end read file. 
    // } else {
    //     request('https://usitc.gov/sites/default/files/tata/hts/hts_2018_revision_14_data.json', function (error, response, body) {
    //         console.log('error:', error); // Print the error if one occurred
    //         console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //         htsData = JSON.parse(body)
    //     });
    // }
    // var countryInfo
    // fs.readFile('dataCleaning/countryInfo.json', 'utf8', function (err, data) {
    //     if (err) throw err;
    //     countryInfo = JSON.parse(data)
    // })//end read file. 

    var htsData=   JSON.parse(fs.readFileSync('hts_2018_revision_14_data.json','utf8')); 

    var countryInfo =   JSON.parse(fs.readFileSync('dataCleaning/countryInfo.json','utf8')); 


    app.get('/', async function (req, res) {
        countries = [];
        for (i = 0; i < countryInfo.length; i++) {
            countries.push(countryInfo[i].name)
        }


        res.render('dutycalculator', { countries: countries })
    });//end '/home'



    app.get('/dutycalculator/api/searchHTS', async function (req, res) {


        // countryCode = req.query.countryCode;
        item = req.query.searchTerm.toLowerCase();
        console.log(item)
        //console.log(htsData[2])
        function searchDescription(value) {
            return value.description.search(item)
        }




        result = []

        for (i = 0; i < htsData.length; i++) {
            // if (htsData[i].description.toLowerCase().indexOf(item) > -1 || htsData[i].htsno.toLowerCase().indexOf(item) > -1) {
            if (htsData[i].description.toLowerCase().indexOf(item) > -1 || htsData[i].htsno.toLowerCase() === item) {
                result.push(htsData[i])
                //check for indents
                let j = i;
                let done = false;
                while (!done) {
                    j++;

                    if (typeof htsData[j] === 'undefined') {
                        done = true;
                        console.log('flag ' + j)
                        break;
                        if (typeof htsData[j].indent === 'undefined') {
                            console.log('item ' + j + ' does not have indent value')
                            done = true;
                            break;

                        }


                    }
                    else {
                        if (htsData[j].indent > htsData[i].indent) {
                            result.push(htsData[j]);
                        } else {
                            done = true;
                        }
                    }

                }//end while loop

            }//end if a good answer test
        }//end for loop

        // function addAll
        if (result.length === 33978) {
            console.log('returned all 33978 items')
            res.send('returned all 33978 items')
            return
        }
        if (result.length > 10000) {
            console.log('over 10,000 items')
            res.send('over 10,000 items')
        } else {
            // console.log(result)
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
        //This function takes in the the tariff code and the country of origin. It is for use after the correct tariff has been identified in the drill down process.
        //Then it checks to find the correct row of the primary table to start to figure out the duty.
        //Check if column two is the correct Tariff (Cuba, North Korea)
        //Then check the middle column to see if the country of origin matches a country group listed
        //If neither of those are true, the tariff is what is in the far left column
        //process the tariff
        //send result to client for DOM update
        let searchTerm = req.query.searchTerm;
        let origin = req.query.origin;


        //Get full country data
        for (i = 0; i < countryInfo.length; i++) {
            if (countryInfo[i].name === origin) {
                var originJSON = countryInfo[i];
                break;
            }//end if
        }//end for





        //STEP 1: find out if the duty has a row in the main table that has our information, or if we need to move up to get it. 

        for (z = 0; z < htsData.length; z++) { //go through all the htsData

            if (htsData[z].htsno === searchTerm) { //check each row of htsData for a match of the search term 
                //  console.log(htsData[i].htsno)
                //do the below code if when you find your match
                let ourRow
                //Check if this is the row we want
                if (htsData[z].general === '') {

                    let j = z;
                    do {
                        j--;
                        ourRow = htsData[j];
                    } while (htsData[j].general === '' && j > 0)
                } else {
                    ourRow = htsData[z];
                }

                findCorrectColumn(ourRow)
                //result.push(ourRow)


            }//end if a good answer test
        }//end for loop

        //STEP 2: check if North Korea or Cuba
        function findCorrectColumn(ourRow) {


            if (origin === "Cuba" || origin === "North Korea (Democratic People;s Republic of Korea)") {
                calculateTariff(ourRow.other)
            } else {
                //Check if no special column
                if (ourRow.special === '') {
                    calculateTariff(ourRow.general)
                }
                else if (typeof originJSON.tradeDeals === "undefined") { //check if we even have a special trade deal with that country
                    calculateTariff(ourRow.general);


                }
                else {//if there is a special column, check it
                    //break the special column into an array

                    list = ourRow.special.split(')')
                    if (list[list.length - 1] === '') {
                        list.pop(); //remove last element in array
                    }
                    foundMatch = false;
                    for (i = 0; i < list.length; i++) {
                        breakDown = list[i].split('(');
                        RawTariff = breakDown[0];
                        codes = breakDown[1].split(',');
                        for (k = 0; k < codes.length; k++) {//check each code against each trade deal


                            for (j = 0; j < originJSON.tradeDeals.length; j++) {

                                if (codes[k] === originJSON.tradeDeals[j].code) {
                                    calculateTariff(RawTariff);
                                    foundMatch = true;
                                }//end if
                            }// end j

                        }// end k
                    }// end i
                    if (foundMatch === false) { //Country of origin was not in the list
                        calculateTariff(ourRow.general)
                    }
                    //console.log(list)



                }//end else, checking the special column

            }//end else 

        }//end findCorrectColumn

        function calculateTariff(RawTariff) {
            console.log('calculateTariff fired')
            res.send(RawTariff)
        }





    })//end getDuty


 app.get('/dutycalculator/api/getHistory',async function(req,res){
    
 // countryCode = req.query.countryCode;
 item = req.query.searchTerm
 console.log(item)

 



 result = []

 for (i = 0; i < htsData.length; i++) {
     if (htsData[i].htsno === item) {
//found our item in the big table, now we can workbackwards adding descriptions as we go. 
var ThisHtsData = htsData[i]; //for use by 232 tarrif calculator ThisHtsData.tsno
startIndent = htsData[i].indent;
var indentArray = [];
indentArray.push({description:htsData[i].description,htsno:htsData[i].htsno})
let m = 1;
findNextIndent(i,startIndent)
function findNextIndent(z,startIndent){
    console.log('got inside FindNextIndent '+m+" times")
    m++;
j = z;
let thisIndent = htsData[j].indent
while(thisIndent>0 && j>0 ){
    j--;
 thisIndent = htsData[j].indent
if( thisIndent  < startIndent){
    console.log(htsData[j].htsno)
    indentArray.push({description:htsData[j].description,htsno:htsData[j].htsno});
    findNextIndent(j,thisIndent);
    return;
}//end if

}//end while loop

}//end function findNextIndent
break; //leave the big for loop
     }//end if a good answer test
 }//end for loop

//build html

let html = '<p>Description Tree</p><div id="descriptionTree"><ul>';
n= indentArray.length
while(n>0){
    n--;
    //calculate indent:
    let spacing = ''
    for (k = 0; k < n; k++) {
        spacing = spacing + '     '
    }//end spacing    
    html = html + `<li>${spacing}${indentArray[n].description}</li>`;
    }//end for loop
html = html + '</ul></div>'

//CHECK FOR 232 tariffs 
first3Digits = ThisHtsData.htsno.substring(0,2)
console.log(first3Digits)
switch(first3Digits){
    case '72':
        html = addWarning(html)
        break;
        
        case '73':
            html = addWarning(html)
            break;
        
        case '76':
            html = addWarning(html)
            break;
        
        default:
            html=html;
            break;
}

function addWarning(html){
    return `<p style='color:red'>Warning: if this article is of iron, steel, or aluminum, then section 232 tariffs likely apply. Contact a trade professional for assistance as these rates can be as high as 50% in addition to regular duty. Exceptions apply.</p>`+html
}


     res.send(html)
 })//getHistory















}//end ModelForExport





module.exports = modelForExport;



