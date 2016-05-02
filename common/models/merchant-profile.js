module.exports = function(MerchantProfile) {

	MerchantProfile.getLocation = function(cb) {
		
	MerchantProfile.find({limit:100 
          }, function (err, instance) {

          	var returnvalue = {}

          	returnvalue.type = "FeatureCollection"
          	var returnvaluearray = []
          	for (var i = 0;i<instance.length;i++){
          		var newobject = {}
          		newobject.type = "Feature"
          		newobject.properties = {
          			"title":instance[i].merchant_name,
		            "comment":instance[i].address.full_address,
		            "picture":instance[i].picture_profile,
		            "category":"Kebun"
          		}
          		newobject.geometry = instance[i].address.latlng
          		returnvaluearray.push(newobject)
          	}

          	returnvalue.features = returnvaluearray

							cb(null, returnvalue);
						});
	};
	
	MerchantProfile.remoteMethod('getLocation', {
		http : {
			path : '/getLocation',
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
