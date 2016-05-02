module.exports = function(Report) {

	Report.getReport = function(cb) {
		
	Report.find({limit:100 
          }, function (err, instance) {

          	var returnvalue = {}

          	returnvalue.type = "FeatureCollection"
          	var returnvaluearray = []
          	for (var i = 0;i<instance.length;i++){
          		var newobject = {}
          		var picturenow;

          		if (instance[i].category == "Sampah"){
          			picturenow = "sampah.jpg"
          		}else if (instance[i].category == "Kriminal"){
          			picturenow = "kriminal.jpg"
          		}else if (instance[i].category == "Kebakaran"){
          			picturenow = "kebakaran.jpg"
          		}else if (instance[i].category == "Macet"){
          			picturenow = "macet.jpg"
          		}else{
          			picturenow = "kecelakaan.jpg"
          		}
          		newobject.type = "Feature"
          		newobject.properties = {
          			"title":instance[i].title,
		            "comment":instance[i].comment,
		            "picture":picturenow,
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
			type : 'object',
			root:true
		}, 
	});

};
