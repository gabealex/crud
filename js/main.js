// // Initialize Parse app
 Parse.initialize("uWL7Tlm0W3THpPMd4nMIOliWsWglQAq208mJUan7", "fECjsj8FAdpAue8cXPDisbEevKfioIwPuWAAul0o");

// // Create a new sub-class of the Parse.Object, with name "Review"
 var Review = Parse.Object.extend('Review');
 var totalreviews;
 var totalRatings;
 $('#star').raty();

// Click event when form is submitted
$('form').submit(function() {
	// Create a new instance of your Review class
	var newReview = new Review();

	var title = $('#title').val();
	var review = $('#review').val();
	var rating = $('#star').raty('score');

	// For each input element, set a property of your new instance equal to the input's value
	newReview.set('title', title);
	newReview.set('review', review);
	newReview.set('rating', parseInt(rating));

	// After setting each property, save your new instance back to your database
	newReview.save();
	
	//clear data after save
	$('#title').val('');
	$('#review').val('');
	$('#star').raty('score', 0);
	getData();
	return false
});

// Function to get data from parse.com
var getData = function() {
	var query = new Parse.Query(Review);
	totalRatings = 0;
	/* Executes query. When successful, sends results to next function
	*/
	query.find({
		success:function(results) {
			buildList(results);
		}
	})
}

// A function to build the list of reviews
var buildList = function(data) {
	$('#list').html('');
	totalreviews = data.length;
	// Loops through data, and passes each element to the addItem function
	data.forEach(function(d) {
		addItem(d);
	})
}

// This function takes in an item, adds it to the list of reviews
var addItem = function(item) {
	var title = item.get('title');
	var review = item.get('review');
	var score = item.get('rating');
	totalRatings = totalRatings + score;
	
	var div = $(document.createElement('div')).addClass('reviewDiv').appendTo('#list');
	
	var rating = $(document.createElement('span')).raty({
		score: (item.get('rating'))
	}).appendTo(div);
	
	var top = $(document.createElement('h4')).addClass('title').text(title).appendTo(div);
	
	var body = $(document.createElement('p')).text(review).appendTo(div);

	var downvote = $('<button class="btn-info btn-xs" id="nothelpful">Not Helpful! </button>');
	downvote.click(function() {
		item.increment('downvotes');
		item.save().then(getData());
		});
	downvote.appendTo(top);

	var badvotes = $(document.createElement('i'))
	.addClass('counts')
	.text(item.get('downvotes'))
	.appendTo('#nothelpful');

	var upvote = $('<button class="btn-success btn-xs" id="helpful">Helpful! </button>');
	upvote.click(function() {
		item.increment('upvotes');
		item.save().then(getData());
		});
	upvote.appendTo(top);

	var goodvotes = $(document.createElement('i'))
	.addClass('counts')
	.text(item.get('upvotes'))
	.appendTo('#helpful');

	var button = $('<button class="btn-danger btn-xs">Remove</button>');
	button.click(function() {
		item.destroy({
			sucess: getData()
		});
		getData();
	});
	button.appendTo(top);

	$('#avg-rating').raty({
		readOnly: true,
		score: totalRatings/totalreviews
	});
}
getData();