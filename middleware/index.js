const Document = require("../models/document"),
Course         = require("../models/course");

var middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next)=>{
	if(req.isAuthenticated())
		return next();

	res.redirect("/login");

}

middlewareObj.checkDocumentOwnership = (req, res, next)=>{
	Document.findById(req.params.id, (err, document)=>{
		if(err){
			res.redirect("back");
		}
		else{
			if(req.user && document.owner === req.user.username)
				next();
			else{
				res.redirect("back");
			}
		}
	});
	
}

middlewareObj.nameGenerator = (document)=>{
	 if(document.name.length>20){ 
		 var doc_name = document.name.substring(0,20) + "...  ";
	} 
	else{
		var doc_name = document.name 
		for(var i=0; i<25-document.name.length;i++)
			doc_name += " ";
	}
	return doc_name;
}
		

module.exports = middlewareObj;
