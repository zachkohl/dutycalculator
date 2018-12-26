


 function modelForExport(config) {
    app = config.app;

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



    app.get('/', async function (req, res) {

        res.render('dutycalculator')
     });//end '/home'



     app.post('/dutycalculator/api', async function (req, res) {
 countryCode = req.body.countryCode;
 item = req.body.inputItem;





        res.send('success:'+item)
     });//end '/home'











}//end ModelForExport





module.exports = modelForExport;



