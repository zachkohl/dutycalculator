


 function modelForExport(config) {
    app = config.app;

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



    app.get('/', async function (req, res) {

        res.render('dutycalculator')
     });//end '/home'













}//end ModelForExport





module.exports = modelForExport;



