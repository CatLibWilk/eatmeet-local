//////////////////FIREBASE SETUP/INIT//////////////////
var config = {
    apiKey: "AIzaSyAW7bA6l1SKh_5cY1QA6B762FDhcLsGgvE",
    authDomain: "q-test-app.firebaseapp.com",
    databaseURL: "https://q-test-app.firebaseio.com",
    projectId: "q-test-app",
    storageBucket: "q-test-app.appspot.com",
    messagingSenderId: "660859232414"
  };
  firebase.initializeApp(config);


  //////////////////////////////////////////////////////

var database = firebase.database();
var subBtn = $("button[type='submit']");
var input = $("#search-input");
var voteCount = 3;
var chosen = [];
var item;
var compiledArray = [];
var sortedArray = [];
var winner = "";
var transformedWinner = "";
//created so we can check the Id against the one stored in the database to maybe keep track of whos completed voting and etc.
var userIdLocal = "";


////////////////on page load, unique ID is generated for each page user, sent //////////////////////////////////////
function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
      s4() + "-" + s4() + s4() + s4();
  }

    $(document).ready(function() {
        /////adds timestamp for uniqueId creation
        var timeStamp = moment().format();
        var userId = guid();
        /////need to write logic to check in the database if this id is already present, and to take no action if it is present/////
        userIdLocal = userId;
        database.ref('users').push({
            userId: userId,
            timeJoined: timeStamp
        });
    });

////////////////function takes input search term, runs API calls, generates list of suggestions///////////////////////
subBtn.on("click", function(event){
    event.preventDefault();

    ////empties results area with start of each search////

    $("#results-col").empty();
    var keyword = '&query=' + input.val();
    //first call asks API for a list of restuarants within given geoloc
    $.ajax({
        // url:'https://api.foursquare.com/v2/venues/search?limit=2&client_id=FKPJMRN1PCLMFIO32S4QKWS4MV5X0Y1JAKZYOGRP0I4BMVW1&client_secret=BPRZ4NPXWKPRJVCPA3LWZXC5C0A1J5FNNMNKIMNON0CSGTEA&v=20130815&near=Philadelphia' + keyword, //andrewdwilk
        // url:'https://api.foursquare.com/v2/venues/search?limit=5&client_id=4UJJFJRKUVNW1LRBLHWQSZHBUVWQMMH14O3H40RTTNAN5ZAQ&client_secret=AHIYIEJF1EZTPCNWQJ05HOYNZEUJCFNIK0TXE1DZEY4P2KE1&v=20130815&near=Philadelphia' + keyword, //pamrecnetwork
        // url:'https://api.foursquare.com/v2/venues/search?limit=5&client_id=K3TZ4RDWFM4WLDUREOH0VSA0BDCXO5TAYR0BPLEML535HC0M&client_secret=3PT4TSFEMQI0GOLNMP5QOTK1CSH24XQ1AVZUIATQ5QMNVH5B&v=20130815&near=Philadelphia' + keyword, //andrewwilk1990
        // url:'https://api.foursquare.com/v2/venues/search?limit=5&client_id=GRFVBTPCJBJZVW43D2WN1VWP4VLXQO5I1E2S2PUPOHBT42VV&client_secret=VUAZUO4SHDGM1RWC32TWFWVINL4RDRD2GSEX5IUSZEUKYTB2&v=20130815&near=Philadelphia' + keyword, //
        url:'https://api.foursquare.com/v2/venues/search?limit=2&client_id=IPXZ2XOHIZPRQZTIPH3YWTZGDRIPHKGWPPNOVZPT1CSUIPZK&client_secret=CJP2KIZAMSRMVPF3FORJ03B20MGMXNTZCCS4TA0GAM1RQK14&v=20130815&near=Philadelphia' + keyword, //
        
        dataType: 'json',
        
}).then(function(response){
    console.log(response);
    //from list of venues, an array of their ids is made
    var venArray = response.response.venues;
    var venIdArray = [];
    console.log(venArray);

    for(var i=0; i<venArray.length; i++){
        var venId = venArray[i].id;
        venIdArray.push(venId);
    }
    console.log(venIdArray.length);
    //for each id in the venueid array, an ajax call is made for complete venue information, this info used to populate divs for each with venue-choice class connected to a click event
    for(var j = 0; j<venIdArray.length; j++){
        $.ajax({
            // url:'https://api.foursquare.com/v2/venues/' + venIdArray[j] + '?client_id=FKPJMRN1PCLMFIO32S4QKWS4MV5X0Y1JAKZYOGRP0I4BMVW1&client_secret=BPRZ4NPXWKPRJVCPA3LWZXC5C0A1J5FNNMNKIMNON0CSGTEA&v=20130815', //andrewdwilk
            // url:'https://api.foursquare.com/v2/venues/' + venIdArray[j] + '?client_id=4UJJFJRKUVNW1LRBLHWQSZHBUVWQMMH14O3H40RTTNAN5ZAQ&client_secret=AHIYIEJF1EZTPCNWQJ05HOYNZEUJCFNIK0TXE1DZEY4P2KE1&v=20130815', //pamrecnetwork
            // url:'https://api.foursquare.com/v2/venues/' + venIdArray[j] + '?client_id=K3TZ4RDWFM4WLDUREOH0VSA0BDCXO5TAYR0BPLEML535HC0M&client_secret=3PT4TSFEMQI0GOLNMP5QOTK1CSH24XQ1AVZUIATQ5QMNVH5B&v=20130815', //andrewwilk1990
            // url:'https://api.foursquare.com/v2/venues/' + venIdArray[j] + '?client_id=GRFVBTPCJBJZVW43D2WN1VWP4VLXQO5I1E2S2PUPOHBT42VV&client_secret=VUAZUO4SHDGM1RWC32TWFWVINL4RDRD2GSEX5IUSZEUKYTB2&v=20130815', //
             url:'https://api.foursquare.com/v2/venues/' + venIdArray[j] + '?client_id=IPXZ2XOHIZPRQZTIPH3YWTZGDRIPHKGWPPNOVZPT1CSUIPZK&client_secret=CJP2KIZAMSRMVPF3FORJ03B20MGMXNTZCCS4TA0GAM1RQK14&v=20130815', //
           
            dataType: 'json',
            ///this function takes the received restaurant information and creates cards for each suggestion containing that info and a nomination button
    }).then(function(response2){
        venDetails = response2.response.venue;
        console.log(venDetails);
        console.log(venDetails.location.lat);
        var geoLat = venDetails.location.lat
        var geoLong = venDetails.location.lng

        
        var newCard = $("<div class='card w-15 nom-card float-left m-1'>");
            
        var cardBody = $("<div class='card-body bg-light text-center'>");
            var cardTitle = $("<h5 class='card-title'>").text(venDetails.name);
            var priceP = $("<p class='suggP'>").text(venDetails.price.message);
            var locP = $("<p class='suggP'>").text(venDetails.location.address);
        
            var nomBtn = $("<a href='#' class='btn btn-primary nomBtn'>").text("Nominate!");
                nomBtn.attr("id", venDetails.id);
                nomBtn.attr("square-url",venDetails.shortUrl);
                nomBtn.attr("venue-name", venDetails.name);
                nomBtn.attr("venue-price", venDetails.price.message);
                nomBtn.attr("venue-loc", venDetails.location.address);
                nomBtn.attr("geo-lat", geoLat);
                nomBtn.attr("geo-lng", geoLong);
        
        cardBody.append(cardTitle, priceP, locP, nomBtn);
        newCard.append(cardBody);
        
        $("#results-col").append(newCard);


    });
  }; 
  });
});

//////////////function allowing 1 item from suggestion list to be 'chosen', sent to firebase database as a 'nomination'//////////////
$(document).on("click", ".nomBtn", function(event){
    event.preventDefault();

    console.log("click");
    var selected = $(this).attr("id");
    var nameSelected = $(this).attr('venue-name');    
    var priceSelected = $(this).attr('venue-price');
    var locSelected = $(this).attr('venue-loc');
    var squareUrl = $(this).attr('square-url');
    var geoLat = $(this).attr('geo-lat');
    var geoLong = $(this).attr('geo-lng');

    database.ref('nominations').push({
        id: selected,
        name: nameSelected,
        price: priceSelected,
        location: locSelected,
        url: squareUrl,
        lat: geoLat,
        long: geoLong
    });




});
//////////////Takes firebase data, populates ballot, adds pin to map//////////////
database.ref('nominations').on("child_added", function(snapshot) {
    var sv = snapshot.val();
    // console.log(sv);
    
    var newCard = $("<div class='card nomination mb-2'>");
        newCard.attr("id", sv.id);
        newCard.attr("url", sv.url);
        newCard.attr("geo-lat", sv.lat);
        newCard.attr("geo-lng", sv.long)
    var cardHeader= $("<div class='card-header bg-warning text-center'>").text(sv.name);
    var cardBody = $("<div class='card-body p-1 text-center'>");
    var newBlock =$("<div class='blockquote mb-0'>");
        var priceP = $("<p class='nomP text-secondary'>").text("Price: " + sv.price);
        var locP  = $("<p class='nomP text-secondary'>").text(sv.location);
    
    newBlock.append(priceP, locP);
    cardBody.append(newBlock);
    newCard.append(cardHeader, cardBody);

    $("#nom-col").append(newCard);

});

//////////////nominations are clicked, weighted voting occurs//////////////
$(document).on("click", ".nomination", function(){
    console.log("object clicked pre ifelse ", this);
    //create a var called selected ID this.attr(id)
    var id = $(this).attr("id");
    console.log("id preifelse ", id);

    if(voteCount > 0){
        var selectedId = $(this).attr("id");
        console.log("selectedId, after votecount check ", selectedId);

        if(chosen.indexOf(selectedId) !== -1){//it is in the array
            // alert("Please make another selection");
            console.log("this is already in the chosen array so nothing further happens");
        }else{
            //not in chosen array, so is a valid vote
            chosen.push(selectedId);
            console.log("the chosen array has been updated ", chosen);

            //see if its in the database

            database.ref().once("value", function(snapshot) {
                if(!snapshot.child('votes').exists()){
                    console.log("votes determined to not exist, now created and first nomination and vote added");
                    database.ref('votes').push({
                        id: selectedId,
                        score: 3
                    });
                    voteCount = voteCount-1;
                }else{
                    console.log("theres already one vote in the database, so we now check if this one has been nominated");
                    console.log("this snapshot was grabbed after it was determined that 'votes' exists ", snapshot);
                    var returnedArray = [];
                    snapshot.child('votes').forEach(function(childSnap){
                        console.log("getting each ID");
                        console.log("this is the childsnap, the one taken to get all the database item ids ", childSnap);
                        item = childSnap.val();
                        item.key = childSnap.key;

                        returnedArray.push(item);
                        console.log("this is the array that we put ids into ", returnedArray);
                        console.log("this is the length of the array ", returnedArray.length);

                        //here we see if the selected Id is in the database
                        
                    });//for each end
                    var idsArray = [];
                    var scoresArray = [];

                        for(var k = 0; k<returnedArray.length; k++){
                            idsArray.push(returnedArray[k].id);
                        }

                        for(var y = 0; y<returnedArray.length; y++){
                            scoresArray.push(returnedArray[y].score);
                        }

                        if(idsArray.indexOf(selectedId) === -1){
                            console.log("it appears to this code that the ID isnt yet in the database, it will be added");
                            database.ref('votes').push({
                                id: id,
                                score: 3
                            });
                        }else{
                            //if the selected ID matches the id of one of the database entities, I need to take k, which will be the index of the 
                            //database object to be updated, use returned arrays to get the firebase id of that object, and use set to update the changes
                            console.log("we need to update but dont know how");
                            if(idsArray.indexOf(selectedId)!== -1){
                                var targetIndex = idsArray.indexOf(selectedId);
                                    console.log("this is the index we're looking for ", targetIndex);
                                var targetKey = returnedArray[targetIndex].key;
                                    console.log("here's the database key to target ", targetKey);
                                var pathToUpdate = targetKey + "/" + "score";
                                var scoreToUpdate = returnedArray[targetIndex].score + voteCount;
                                    console.log("This is the going to be the new score value", scoreToUpdate);
                                database.ref('votes').child(pathToUpdate).set(scoreToUpdate);
                            }
                        }
                    voteCount = voteCount-1;
                    console.log("the updated voteCount for this user is ", voteCount);
                }//end of else that comes after it was determined that 'votes' exists
            });
            
        }//else end of chosen indexof check
        
    }else{
        console.log("user is out of votes");
    }//voteCount super end
});//vote counting logic end



//////////////When voting done, tallies up the vote//////////////
    /////////For now, runs on tally button click/////////
$("#tally-btn").on("click", function(){
    
    /////////Get the values of the votes section and push them into an array to be sorted
    database.ref().once("value", function(snapshot){
        snapshot.child('votes').forEach(function(childSnap){
            var sub = childSnap.val();
            compiledArray.push(sub);
        });

        console.log("these are the objects in the votes section", compiledArray);
        console.log("the above array is actually an array?", Array.isArray(compiledArray));
      
        sortedArray = compiledArray.sort(function sorting(a, b){return a.score - b.score});
        console.log("now sorted", sortedArray);
        winner = sortedArray[sortedArray.length-1];
        console.log("and the winner is...", winner.id);

        ///////////now we find the winner's id in the nominations section///////////////

        database.ref('nominations').orderByChild("id").equalTo(winner.id).once("value", function(snapshot) {
            winningObject = snapshot.val();
            transformedWinner = winningObject[Object.keys(winningObject)[0]];
            console.log("name of the winner is ", transformedWinner.name);

            var winningName = transformedWinner.name;
            var winningLoc = transformedWinner.location;
            var winningUrl = transformedWinner.url;

            var jumboDiv = $("<div class='jumbotron jumbotron-fluid'>");
            var jumboContain = $("<div class='container'>");
            var jumboHeader = $("<h1 class='display-4'>").text("You have chosen: ");
            var jumboName = $("<h2>").text(winningName);
            var jumboLoc = $("<h3>").text(winningLoc);
            var jumboUrl = $("<h4>").text(winningUrl);

            jumboContain.append(jumboHeader, jumboName, jumboLoc, jumboUrl);
            jumboDiv.append(jumboContain);

            $("#winning-display-col").append(jumboDiv);
            
        });

    });

    
});










        
//////////////use connections to record when voting is complete

// var connectionsRef = database.ref("/connections");
//     // '.info/connected' is a boolean value, true if the client is connected and false if they are not.
// var connectedRef = database.ref(".info/connected");

//     // When the client's connection state changes...
//     connectedRef.on("value", function(snap){
//         if(snap.val()){
//             var con = connectionsRef.push(true);
//             // Remove user from the connection list when they disconnect.
//             con.onDisconnect().remove();
//         }

//     });
//     connectionsRef.on("value", function(snap){

//         // The number of online users is the number of children in the connections list.
//         var usersCurrent = snap.numChildren();
//         console.log(usersCurrent);
//     });