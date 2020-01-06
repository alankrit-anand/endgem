const express        = require("express"),
app                 = express(),
bodyParser          = require("body-parser"),
mongoose            = require("mongoose"),
methodOverride      = require("method-override"),
passport            = require("passport"),
LocalStrategy       = require("passport-local"),
middlewareObj       = require("./middleware"),
User                = require("./models/user"),
Course              = require("./models/course"),
Document            = require("./models/document"),
multer              = require("multer"),
open                = require("open");

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';



//================================================================================ 
//"mongodb://localhost:27017/endgem"

mongoose.connect(process.env.DATABASEURL, {
	useNewUrlParser: true, 
	useUnifiedTopology: true
});


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

 
var upload = multer();

//================================================================================

app.use(require("express-session")({
	secret: "This is a secret",
	resave: false,
	saveUninitialized: false
})); 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
	res.locals.currentUser = req.user; 
	next();
});


//================================================================================

app.get("/", (req, res)=>{
	res.render("landing");
}); 

app.get("/index/:i", (req, res)=>{

	Course.find({}).populate("documents").exec((err, courses)=>{

		

		courses.forEach((course)=>{
			course.documents.sort((a, b)=>{
				return b.downloads - a.downloads;
			});
		});

		

		if(err)
			console.log(err);
		else{
			Document.find({}, (err, documents)=>{
				
				documents.sort((a, b)=>{
					return b.downloads - a.downloads;
				});
				


				if(err)
					console.log(err);
				else
					res.render("index", {documents: documents, courses:courses, i:parseInt(req.params.i)});
			});
		}
		
	}); 
});


app.get("/new/:i", (req, res)=>{

	
	Document.find({}, (err, documents)=>{

		documents.sort((a, b)=>{
			return b.downloads - a.downloads;
		});



		if(err)
			console.log(err);
		else{
			Course.find({}, (err, courses)=>{
				if(err)
					console.log(err);
				else
					res.render("new", {documents: documents, courses:courses, i:req.params.i});
			});
		}
	});
});





app.get("/login", (req, res)=>{

	Document.find({}, (err, documents)=>{
		documents.sort((a, b)=>{
			return b.downloads - a.downloads;
		});
		if(err)
			console.log(err);
		else
			res.render("login",{documents: documents});
	});
});


app.get("/signup", (req, res)=>{

	Document.find({}, (err, documents)=>{
		documents.sort((a, b)=>{
			return b.downloads - a.downloads;
		});
		if(err)
			console.log(err);
		else
			res.render("signup",{documents: documents});
	});

});

app.get("/courses/new", (req, res)=>{

	Document.find({}, (err, documents)=>{
		documents.sort((a, b)=>{
			return b.downloads - a.downloads;
		});
		if(err)
			console.log(err);
		else
			res.render("new-course",{documents: documents});
	});

});


app.get("/documents/:id", (req, res)=>{

	Document.find({}, (err, documents)=>{
		documents.sort((a, b)=>{
			return b.downloads - a.downloads;
		});
		if(err)
			console.log(err);
		else{
			Document.findById(req.params.id, (err, document)=>{
				if(err)
					console.log(err);
				else{

					


					Course.find({}, (err, courses)=>{
						var i = 0;
						courses.forEach((c, index)=>{
							if(c.name === document.course)
								i = index;
						});
						res.render("show", {document:document, documents: documents, i:i});
					});

					
				}
			});
		}

	});
});

app.get("/documents/:id/edit", middlewareObj.checkDocumentOwnership, (req, res)=>{

	Course.find({}, (err, courses)=>{
		Document.find({}, (err, documents)=>{
			documents.sort((a, b)=>{
			return b.downloads - a.downloads;
			});
			if(err)
				console.log(err);
			else{
				Document.findById(req.params.id, (err, document)=>{
					if(err)
						console.log(err);
					else
						res.render("edit", {document:document, documents: documents, courses:courses, i:0});
				});
			}
			
		});
	});

	
});

//==============================================================================

app.post("/documents",middlewareObj.isLoggedIn, upload.single('file'), (req, res, next)=>{

	console.log(req.body);
	console.log(req.file);

	

	let stream = require('stream');
    let fileObject = req.file;
    let bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);

	fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  authorize(JSON.parse(content), uploadFiles);
});


	 function uploadFiles(auth){
  const drive = google.drive({version: 'v3', auth});
  var fileMetadata = {
    'name': req.file.originalname
  };
  var media = {
    mimeType: req.file.mimetype,
    body: bufferStream
  };
  drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  }, function (err, file) {
    if (err) {
    console.error(err);
  } else {
    console.log(file);
    
    document = req.body.document;
	document.drive_id = file.data.id;
	document.type = req.file.mimetype;
	document.downloads = 0;
	document.uploadDate = currentdate();
	document.owner = req.user.username;
	document.course = req.body.coursename;
	console.log(document);
	Document.create(document, (err, document)=>{
		if(err)
			console.log(err);
		else{
			Course.findOne({"name":req.body.coursename}, (err, course)=>{
				course.documents.push(document);
				course.save();
				User.findOne({"username": req.user.username}, (err, user)=>{
					if(err)
						console.log(err);
					else{
						Course.find({}, (err, courses)=>{
							var i = 0;
							courses.forEach((c, index)=>{
								if(c.name === course.name)
									i = index;
							});
							user.documents.push(document);
							user.save();
							res.redirect("/index/"+i);
						});
						
					}
				});
			});
			
		}
	}); 



  }
});
}

});

//===================================================================================

app.post("/courses", middlewareObj.isLoggedIn, (req, res)=>{
	course = req.body.course;
	course.documents = []
	Course.create(course, (err, course)=>{
		if(err)
			console.log(err);
		else
			res.redirect("/index/0");
	});
});

app.post("/download/:id", (req, res)=>{

	Document.findById(req.params.id, (err, document)=>{
		document.downloads += 1;
		document.save();
		Document.findByIdAndUpdate(req.params.id, document, (err, document)=>{
			if(err)
				console.log(err);
			else{

				/*(async () => {

				    await open("https://drive.google.com/uc?id="+document.drive_id+"&export=download");
				 
				})();*/

				res.redirect("https://drive.google.com/uc?id="+document.drive_id+"&export=download");
				
				
			}
		});

	});
	
});

//===============================================================================

app.post("/register", (req, res)=>{
	User.register(new User({username: req.body.username}), req.body.password, (err, user)=>{
		if(err){
			return res.render("register");
		}
		passport.authenticate("local")(req, res, ()=>{
			res.redirect("/index/0");
		});
	});
});

app.post("/login", passport.authenticate("local", 
{
	successRedirect: "/index/0",
	failureRedirect: "/login"
}), (req, res)=>{

});

app.get("/logout", (req, res)=>{
	req.logout();
	res.redirect("/index/0");
});

//===============================================================================

app.put("/documents/:id", middlewareObj.checkDocumentOwnership, (req, res)=>{
	Document.findById(req.params.id, (err, document)=>{
		document.name = req.body.document.name;
		document.save();
		res.redirect("/documents/"+req.params.id);
	});
});

//==============================================================================

app.delete("/documents/:id", middlewareObj.checkDocumentOwnership, (req, res)=>{

	Document.findById(req.params.id, (err, document)=>{
		if(err)
			console.log(err);
		else{
			Course.findOne({"name": document.course}, (err, course)=>{
				var index = course.documents.indexOf(req.params.id);
				course.documents.splice(index, 1);
				course.save();

				User.findOne({"username": document.owner}, (err, user)=>{
					index = user.documents.indexOf(req.params.id);
					user.documents.splice(index, 1);
					user.save();

					Document.findByIdAndDelete(req.params.id, (err)=>{
						if(err)
							console.log(err);
						else
							res.redirect("/index/0");
					});

				});
			});
		}
	});
});

//===============================================================================

function currentdate(){
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); 
	var yyyy = today.getFullYear();
	today = dd + '/' + mm + '/' + yyyy;
	return today;
}
//===============================================================================

function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}


 function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}




//===============================================================================

app.listen(process.env.PORT, process.env.IP, ()=>{
	console.log("Server started...");
}) 

