const path = require('path');
const express = require('express'); 
//not need for pug
/* const expressHbrs = require('express-handlebars'); */
const bodyParser = require('body-parser');
const app = express();

const sequelize = require('./util/database');
//we don't need this for pug 

/* app.engine('hbs',expressHbrs({layoutsDir:'views/layouts/',
    defaultLayout:'main-layout', 
    extname:'hbs'
}));
 */
app.set('view engine','ejs');
//app.set('view engine','pug');
app.set('views','views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorConttroller = require('./controllers/error');

/* db.execute('SELECT * FROM products')
.then(result =>{console.log(result[0]);
})
.catch(err=>{console.log(err);
});   */

app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname,'public')));

app.use(adminRoutes);
app.use(shopRoutes);

app.use(errorConttroller.notFound);

const port = 3000;
sequelize.sync()
.then(result=>{
    //console.log(result);    
    app.listen(port ,()=> {
        console.log('...Server is running on port $'+port+' !');
    }); 
})
.catch(err=>{console.log(err);});

