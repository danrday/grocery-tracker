var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
                  app.use(bodyParser.json({limit: '50mb'}));
                  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport	  = require('passport');
var config      = require('./config/database'); // get db config file
var User        = require('./app/models/user'); // get the mongoose model
var port        = process.env.PORT || 8080;
var jwt         = require('jwt-simple');

var db          = require('./db');
var pg          = require('pg');

// receipt parsing
var tesseract   = require('node-tesseract');
var multer      = require('multer');
var fs          = require('fs');

var receiptParser = require('./app/models/receipt-parser').receiptParser

//DB
const knexconfig = require("./knexfile.js").development;
const knex = require('knex')(knexconfig);

//pg
// pg.defaults.ssl = process.env.NODE_ENV === 'production';
// const databaseURL = process.env.DATABASE_URL || 'postgres://localhost:5432/grocery-tracker';
// const client = new pg.Client(databaseURL);
// client.connect((err) => console.error(err));



//

var convert = function(req, res) {
    var path = req.files.file.path;
    // Recognize text of any language in any format
    tesseract.process(path,function(err, text) {
        if(err) {
            console.error('tesseract convert err', err);
        } else {
            fs.unlink(path, function (err) {
                if (err){
                    res.json(500, "Error while scanning image");
                }
                console.log('successfully deleted %s', path);
            });
            res.json(200, text);
        }
    });
};



// //multer temp directory
app.use(multer({dest:'./uploads/'}).none());

// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// fix cors issue
app.use(function (req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
if (req.method === 'OPTIONS') {
res.end();
} else {
next();
}
});

// log to console
app.use(morgan('dev'));

// Use the passport package in our application
app.use(passport.initialize());

// demo Route (GET http://localhost:8080)
app.get('/', function(req, res) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// connect to database
mongoose.connect(config.database);

// pass passport for configuration
require('./config/passport')(passport);

// bundle our routes
var apiRoutes = express.Router();

apiRoutes.post("/ocr", convert)

/////TESTING

// finishedObject = {
//   dateOfPurchase: date object,
//   location: string,
//   purchases: [{
//     category: string,
//     memberSavings: number,
//     numberOfItems: number,
//     price: number,
//     pricePerPound: number,
//     product: string,
//     upcCode: number
//   }],
//   storeName: string,
//   tax: number,
//   total: number
// }


apiRoutes.post("/testing2", (req, res) => {

  console.log('req.body testing2', req.body)

});


apiRoutes.post("/testing1", (req, res) => {

  console.log('req.body testing1', req.body)

  let userName = "Joe"

//   let r = req.body
//
//   userName = "Joe"

knex("user")
		.insert({user_name: userName})
    .returning('user_id')
    .then((id) => console.log('id', id
    ))
//
//   let user_id;
//
//   console.log('req.body', req.body)
//
// 	knex("user")
// 		.insert({user_name: userName})
//     .returning('user_id')
// 		.then((id) => {
//       user_id = id;
//       knex('stores')
//         .insert({
//           company_name: r.storeName,
//           store_address: r.location
//         })
//         .returning('location_id')
//         .then((id) => {
//           console.log("location id", id)
//           res.status(200).json(id[0])
// 		})
// });

})

//
// apiRoutes.post("/testing", (req, res) => {
//
// 	knex("user")
// 		.insert({user_name: userName})
//     .returning('user_id')
// 		.then((user_id) => {
//       knex('receipt')
//         .select()
//         .where('location_id', data[0])
//         .then( data => {
//           res.status(200).json(data[0])
//         } )
// 		})
// });


app.get("/api/getStores", (req, res) => {
	knex.select('location_id', 'company_name', 'store_address').from('stores')
		.then((data) => {
  			console.log(data)
		})
});

/////end TESTING

// create a new user account (POST http://localhost:8080/api/signup)
apiRoutes.post('/signup', function(req, res) {
  if (!req.body.name || !req.body.password) {
    res.json({success: false, msg: 'Please pass name and password.'});
  } else {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});


// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

apiRoutes.post('/base64upload', function(req, res, next) {
    // console.log('setup: data', req.body.data);
    // console.log('setup: check', req.body.check);
    // console.log('setup avatar: ', req.body.avatar);
// res.send({test: 'test'});
    let encodeOptions = { encoding: 'base64' };
    let wstream = fs.createWriteStream('test.jpg', encodeOptions)

    wstream.write(req.body.avatar);
    wstream.end();

    tesseract.process(__dirname + '/test.jpg',function(err, text) {
    if(err) {
        console.error(err);
    } else {

      let parsedReceipt = receiptParser(text)

      console.log("parsed receipt:", parsedReceipt)

      // res.json({
      // parsed: parsedReceipt
      // });

      res.send({parsed: parsedReceipt});

        console.log("TEXT", typeof(text));
    }
});

});

//testupload
apiRoutes.post('/testupload', function(req, res, err) {

console.log('WHOLE REQ', req)
// console.log(req)

req.pipe(fs.createWriteStream('test.jpeg'))

req.on('end', () => {

res.send('OK')

console.log('REQ BODY:', req.body)

}
)


});

let userName;


// route to a restricted info (GET http://localhost:8080/api/memberinfo)
apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          userName = user.name
          res.json({success: true, msg: user.name});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

// connect the api routes under /api/*
app.use('/api', apiRoutes);


// Start the server
app.listen(port);
console.log('Listening on port ' + port);
