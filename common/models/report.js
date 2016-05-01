module.exports = function(Report) {

	Report.getReport = function(cb) {
		console.log("njemak")
		
	Report.find({limit:100 
          }, function (err, instance) {

          	var returnvalue = {}

          	returnvalue.type = "FeatureCollection"
          	var returnvaluearray = []
          	for (var i = 0;i<instance.length;i++){
          		var newobject = {}
          		newobject.type = "Feature"
          		newobject.properties = {
          			"title":instance[i].title,
		            "comment":instance[i].comment,
		            "picture":instance[i].picture,
		            "category":instance[i].category
          		}
          		newobject.geometry = instance[i].location
          		returnvaluearray.push(newobject)
          	}

          	returnvalue.features = returnvaluearray

							cb(null, returnvalue);
						});
	};
	
	Report.remoteMethod('getReport', {
		http : {
			path : '/getReport',
			verb : 'get',
			source : 'query'
		},

		returns :  {
			arg : 'result',
			type : 'object'
		}, 
	});

};
