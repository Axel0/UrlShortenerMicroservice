// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var mongo=require("mongodb").MongoClient
var url=process.env.SECRET
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

var doc={
  "original":null,
  "short":null
}
 
app.get("/new", function(req,res){
  res.end(url);
});
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/new/:link*", function(req, res){

  var param=req.params.link;
  var ObjectID = require('mongodb').ObjectID;
  var id=new ObjectID();
  var link=req.headers.host.split(":")[0]+"/"+id;
  
  mongo.connect(url, function(err, db){
    if (err) throw err;
    var collection=db.collection("urls");
    doc.original=param;
    doc.short=link;
    collection.insert(doc);
    console.log("Document Inserted");
  });
  res.send("Your short url is: " +link);  
});

app.get("/:short*", function(req, res){
  var Returned;
  var link=req.headers.host.split(":")[0]+"/"+req.params.short;
  console.log(link);
  mongo.connect(url, function(err, db){
    if (err) throw err;
    var collection=db.collection("urls");
    collection.findOne({
      "short":link
      
    }, function (err, result){
      if (err) throw err;
      if(result){
        
        res.redirect("http://"+result.original);
      console.log(result);
      }else{
        res.send("The Url Is Not In The Database");
      }
    });

  });
});






// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body


// Simple in-memory store for now


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

