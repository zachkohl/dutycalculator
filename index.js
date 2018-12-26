config = require('./config');

config.app.get('/',config.checkSession, function (req, res) {
   switch(req.session.role){
case 'student':
res.redirect('quiz');
break;
case 'admin':
res.render('landing')
break;
case 'Debbie':
res.redirect('answers');
break;
case 'Raja':
res.redirect('answers');
break;
default:
res.redirect('login')
}



});//end '/'