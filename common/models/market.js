module.exports = function(Market) {

	Market.search = function(query, cb) {
		var request = require('request');

		 request('https://7e373138-a206-41c8-b94e-1481814f7513-bluemix:86ab9e2a891748b520c6f190fa22e93d1751d4f22c1e2592e26cd4fdaad8e952@7e373138-a206-41c8-b94e-1481814f7513-bluemix.cloudant.com/stonecity_cloudant/_design/searchMarket/_search/searchMarket?q=name:' + query + '%20OR%20location:' + query + '%20OR%20price:' + query + '%20OR%20harvest_time:' + query + '%20OR%20area_hectar:' + query + '%20OR%20owner:' + query + '&limit=20', function (error, response, body) {
	      if (!error && response.statusCode == 200) {
	        var message = JSON.parse(body);
	        cb(null,message.rows)
	      }
    	}) 

	};
	
	Market.remoteMethod('search', {
		http : {
			path : '/search',
			verb : 'get',
			source : 'query'
		},
		description : "Search category",
		accepts : {
			arg : 'query',
			type : 'string',
			"required" : true,
			"description" : "questy"
		},

		returns :  {
			arg : 'result',
			type : 'object'
		}, 
	});

	Market.checkout = function(data, cb) {
		var _und = require('underscore');
		var cart = data.carts_list
		var arraycart = []
		var market_id_list = []
		for (var i = 0;i<cart.length;i++){
			// console.log(cart[i])
			var checkouthistory = {
		    'market_id':cart[i].market.id,
			'date' : new Date(),
			'customer_profile' : data.customer_profile,
			'quantitiy' : cart[i].quantity
			}

			market_id_list.push(cart[i].market.id)

			arraycart.push(checkouthistory)
			// var market_id = cart[i].market.id

		}

		//console.log(arraycart)
		var post_history = _und.groupBy(arraycart, 'market_id')
		for (var key in post_history) {
		  if (post_history.hasOwnProperty(key)) {
		  	var checkouthistorygroup = post_history[key]
		  	console.log(checkouthistorygroup)

		  	Market.findById(key,{fields: ['history']}, function(err, instance){
		  		for (var i = 0;i<checkouthistorygroup.length;i++){
		  			instance.history.push(checkouthistorygroup[i])
		  		}
				
				console.log("market")
				console.log(instance.history)

			  	  Market.updateAll({id:key},{history:instance.history}, function (err, instance2) {
			  	  	console.log("market updated")
			  	  	console.log(instance2)
		        });
			  });
		  }
		}

		var CustomerProfile = Market.app.models.CustomerProfile

		var customer_id = data.customer_profile.id
		CustomerProfile.findById(customer_id,{fields: ['history']}, function(err, instance){
				var cartnow = {
					'carts_list' : data.carts_list
				}
			  	  instance.history.push(cartnow)
			  	  console.log("customer")
			  	  console.log(instance.history)
			  	  CustomerProfile.updateAll({id:customer_id},{history:instance.history}, function (err, instance2) {
			  	  	console.log("customer updated")
			  	  	console.log(instance2)
		        });
			  });

		cb(null,"Success")

	};
	
	Market.remoteMethod('checkout', {
		http : {
			path : '/checkout',
			verb : 'post'
		},
		description : "Search category",
		accepts : [ {
		arg : 'data',
		type : 'object',
		http:{source:'body'}
	 }],
		returns :  {
			arg : 'result',
			type : 'string',
			root:true
		}, 
	});


	// Market.populateDummy = function(cb) {

	// 	function randomDate(start, end) {
	// 	    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
	// 	}

	// 	var kelurahan = ['Ngaglik', 'Oro - Oro Ombo RO', 'Pesanggrahan', 'Sidomulyo', 'Sisir', 'Songgokerto', 'Sumberejo', 'Temas', 'Bulukerto', 
	// 	'Bumiaji','Giripurno', 'Gunungsari', 'Pandanrejo', 'Punten', 'Sumberbrantas', 'Sumbergondo', 'Tulungrejo', 'Beji', 'Dadaprejo', 'Junrejo',
	// 	'Mojorejo', 'Pendem', 'Tlekung', 'Torongrejo']

	// 	var harga = [10000,11000,12000,13000,14000,15000,16000,17000,18000,19000,20000,21000,22000,23000,24000,25000,26000,27000,28000,29000,30000,
	// 	31000,32000,33000,34000,35000,3600]

	// 	var nama = ['Tri', 'Nur', 'Muhammad', 'Agus', 'Nugroho', 'Wahyu', 'Eko', 'Kurniawan','Budi', 'Adi','Agung','Putra','Ahmad','Ari','Prasetyo',
	// 	'Arif', 'Wibowo', 'Fajar', 'Bayu', 'Hidayat', 'Saputra', 'Setiawan', 'Indra', 'Abdul', 'Bagus', 'Aji', 'Santoso', 'Hadi', 'Puji', 'Abdi',
	// 	'Achmad', 'Adam', 'Aditia', 'Adnan', 'Alam', 'Andhika', 'Andrian', 'Andry', 'Anton', 'Anugrah', 'Anwar', 'Bambang', 'Budianto', 'Candra','Choirul', 'Cahyadi',
	// 	'Denny', 'Donny', 'Dony', 'Dedi', 'Edi', 'Endro', 'Fadilah', 'Fadli', 'Fahrudin', 'Galih', 'Gilang', 'Guruh', 'Hajar', 'Hakim', 'Handoko', 'Hendrawan', 'Hendra', 'Hermanto',
	// 	'Ibrahim', 'Ikhsan', 'Iskandar', 'Ivan', 'Januar', 'Junaedi', 'Kurnianto', 'Kusuma', 'Kusumah', 'Lailatul', 'Lesmana', 'Lutfi', 'Mahardika', 'Martin', 'Maryanto', 'Miftahul', 'Mulya', 'Nanang',
	// 	'Nanang', 'Okta', 'Pamungkas', 'Pratama', 'Pratomo', 'Pramana', 'Rachmad', 'Rahmad', 'Rama', 'Ramdhani', 'Rangga', 'Riyadi', 'Rizqi', 'Roni', 'Rosadi', 'Riki', 'Rian', 'Saeful', 'Satria', 'Setiaji', 'Setiyo',
	// 	'Sidiq', 'Tanjung', 'Taufiq', 'Untung', 'Utomo', 'Widodo', 'Yahya', 'Yayan', 'Zainal']

	// 	var buah = ['Apel', 'Anggur', 'Salak', 'Nangka', 'Rambutan', 'Kelengkeng', 'Mangga', 'Nanas', 'Semangka', 'Pisang Madu', 'Pisang', 
	// 	'Alpukat', 'Belimbing', 'Blueberry', 'Ceri', 'Cempedak', 'Duku', 'Jambu Air', 'Jambu Batu', 'Jeruk', 'Kiwi', 'Lemon', 'Leci', 'Markisa', 'Melon', 'Naga',
	// 	'Sirsak', 'Stroberi', 'Tomat']
	// 	var postdata = []

	// 	for (var i = 0;i<1000;i++){
	// 		var datanow = {
	// 		  "name": buah[Math.floor((Math.random() * buah.length) + 0)],
	// 		  "price": harga[Math.floor((Math.random() * harga.length) + 0)],
	// 		  "location": kelurahan[Math.floor((Math.random() * kelurahan.length) + 0)],
	// 		  "owner": nama[Math.floor((Math.random() * nama.length) + 0)] + " " + nama[Math.floor((Math.random() * nama.length) + 0)],
	// 		  "area_hectar": Math.round((Math.random() * (0.1 - 10) + 10) * 100) / 100,
	// 		  "harvest_time": randomDate(new Date(1462035600000),new Date(1483117200000)),
	// 		  "user_id": "IDnyaOwner",

	// 		}
	// 		postdata.push(datanow)
	// 	}

	// 	 Market.create(postdata, function(err,instance){

	// 	  cb(null,instance)
	//   	});

		

	// };
	
	// Market.remoteMethod('populateDummy', {
	// 	http : {
	// 		path : '/populateDummy',
	// 		verb : 'POST',
	// 		source : 'query'
	// 	},
	// 	description : "Populate Dummy",
	// 	returns :  {
	// 		arg : 'result',
	// 		type : 'object'
	// 	}, 
	// });

	Market.testNLP = function(query, cb) {

		var Tokenizer = require('nalapa').tokenizer;
		var word = require('nalapa').word;
		var Cleaner = require('nalapa').cleaner;
		var BIOLabel = require('nalapa').BIOLabel;
		var feature = require('nalapa').feature;
		var fs = require('fs');

		var _und = require('underscore');

		//Setup Stop Words
 		var stopwords = fs.readFileSync('stopwords_id.txt', 'utf8').split('\r\n');
 		var stopwords = fs.readFileSync('stopwords_id.txt', 'utf8').split('\r\n');

		var res = query.split(" ");
		for (var i = 0;i<res.length;i++){
			res[i] = Cleaner.removeNonAlphaNumeric(res[i])
			res[i] = word.stem(res[i])
			if (_und.contains(stopwords,res[i])){
				res.splice(i, 1);
			}
		}

		cb(null,res)


	};
	
	Market.remoteMethod('testNLP', {
		http : {
			path : '/testNLP',
			verb : 'GET',
			source : 'query'
		},
		accepts : {
			arg : 'query',
			type : 'string',
			"required" : true,
			"description" : "questy"
		},
		description : "Test NLP for Query",
		returns :  {
			arg : 'result',
			type : 'string'
		}, 
	});

};
