const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const blog = require('./routes/blog.route');
const uuid = require('uuid/v4')
const amenities = require('./routes/amenities.route');
const property_type = require('./routes/property_type.route');
const search_tags = require('./routes/search_tags.route');
const enquiries = require('./routes/enquiries.route');
const terms = require('./routes/terms.route');
const sites = require('./routes/sitesettings.route');
const social = require('./routes/social.route');
const jsontours = require('./routes/jsontour.route');
const proplist = require('./routes/property_list.route');
const vrupload = require('./routes/vrtour.route');
const passport = require('passport');
var mail = require('./routes/mail.route')
var authRoutes = require('./routes/auth.route');
const flash = require("express-flash-messages");
const expressSession = require("express-session");
const FileStore = require('session-file-store')(expressSession);
const mongoose = require('mongoose');
require('./utils/passport')(passport);
var path = require("path");
var cors = require('cors');
const userroute = require('./routes/user.route');
app.use(
    expressSession({
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 3600000 },
        secret: "property360"
    })
);

// app.use(expressSession({
//     genid: (req) => {
//         console.log('Inside the session middleware')
//         console.log(req.sessionID)
//         return uuid() // use UUIDs for session IDs
//     },
//     store: new FileStore(),
//     secret: 'keyboard cat',
//     ,
//     resave: false,
//     saveUninitialized: true
// }))


let dev_db_url = 'mongodb://127.0.0.1:27017/property';
//let dev_db_url = 'mongodb://101.53.152.152:27017/property';
var db = mongoose.connect(dev_db_url, { useNewUrlParser: true });

mongoose.connection.on('connected', function() { console.log("Database Connected") });
mongoose.connection.on('error', function() { console.log("Erorr connecting database") });
mongoose.connection.on('disconnected', function() { console.log("Database disconnected") });

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


var corsOptions = {
    origin: 'http://propertydarshan.com:8080',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
//app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/blog', blog);
app.use('/amenities', amenities);
app.use('/propertytypes', property_type);
app.use('/searchtags', search_tags);
app.use('/enquiries', enquiries);
app.use('/terms', terms);
app.use('/settings', sites);
app.use('/social', social);
app.use('/users', userroute);
app.use('/admin', authRoutes);
app.use('/jsontours', jsontours);
app.use('/propertylist', proplist);
app.use('/mail', mail);
app.use('/vrupload', vrupload);
app.set("view options", { layout: false });

app.use("/public/images", express.static(__dirname + '/public/images'))
app.use("/useradmin", express.static(__dirname + '/public/admin'))
app.use("/user", express.static(__dirname + '/public/user'));

app.set('view engine', 'pug')
app.get('/', function(req, res) {
    res.render('home');
});
app.get('/home', function(req, res) {
    res.render('home');
});
app.get('/contact', function(req, res) {
    res.render('contactus');
});

app.get('/terms', function(req, res) {
    res.render('termsconditions');
});

const port = 3000;
app.listen(port, '172.16.108.31', () => {
    console.log('Server is up and running on port numner ' + port);
});

// app.listen(port, () => {
//     console.log('Server is up and running on port numner ' + port);
// });