//create model object
var model = {
    albumInfo: [],
    videoInfo: [],
    covers: [],
    wishInfo: [],
    collectionInfo: []
}

/**
 * makes a request to the last.fm api, asking for 
 * album and artist info using the query artist and album info passed in.
 */
 function albumSearch(artist, album, callback) {
    //Makes sure Search Error Prompt is hidden
    $("#fail").attr("hidden", true);
    
    //make ajax request
    $.ajax({
    url: "https://ws.audioscrobbler.com/2.0/",
    data: {
        method: "album.getinfo",
        api_key: "d17e980eb9b1ea8c7dd060939eac110d",
        artist: artist,
        album: album,
        format: "json"
    },
    success: function(response) {
        if (response.error)
        {
            //Reveals Search Error Prompt
            $("#fail").attr("hidden", false);
        }
        else
        {
            //fill albumInfo object in model with response info
            model.albumInfo = response;
        
            //start the youtubeSearch function, passing in ebaySearch as callback
            callback(ebaySearch);
        }
    }
    });
 }

/**
 * makes a request to the last.fm api, asking for 
 * album and artist info using the query artist and track info passed in
 * and then uses that info to call and start the albumSearch function.
 */
 function songSearch(artist, track, callback) {
    //Makes sure Search Error Prompt is hidden
    $("#fail").attr("hidden", true);
    
    //make ajax request
    $.ajax({
    url: "https://ws.audioscrobbler.com/2.0/",
    data: {
        method: "track.getinfo",
        api_key: "d17e980eb9b1ea8c7dd060939eac110d",
        artist: artist,
        track: track,
        format: "json"
    },
    success: function(response) {
        if (response.error)
        {
            //Reveals Search Error Prompt
            $("#fail").attr("hidden", false);
        }
        else
        {
            //create artist and album variables based on response
            var artist = response.track.album.artist;
            var album = response.track.album.title;
            
            //start the albumSearch function, passing in youtubeSearch as callback
            callback(artist, album, youtubeSearch);
        }
    }
    });
 }

/**
 * makes a request to the youtube api, asking for 
 * video info using the query artist and album info passed in.
 */
function youtubeSearch(callback)
{
    //creates a query variable composed of the artist and album title
    var q = model.albumInfo.album.artist + '+' + model.albumInfo.album.name;
    
    //make ajax request
    $.ajax({
    url: "https://www.googleapis.com/youtube/v3/search",
    data: {
        part: "snippet",
        maxResults: 5,
        q: q,
        key: "AIzaSyDVrxcnUUeCzL0Ek8vsZjWkveDDxIsNuD0"
    },
    success: function(response) {
        //insert video response data into model
        model.videoInfo = response;
        
        //start the ebaySearch function, passing in renderAlbum as callback
        callback(renderAlbum);
    }
    });
}

    
/**
 * makes a request to the ebay api, asking for 
 * ebay listing info using the query artist album, and format info passed in.
 */
function ebaySearch(callback) {

    //checks for radio button format info
    var format = $("input[name=format]:checked").val();
     
    //checks to see if format radio button was checked by user and then fills the keyword accordingly
    if (format === undefined)
        var keyword = model.albumInfo.album.artist + " " + model.albumInfo.album.name;
    else
        var keyword = model.albumInfo.album.artist + " " + model.albumInfo.album.name + " " + format;
     
    //*ajax call to ebay's finding service/
    $.ajax({
    url: encodeURI("https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=AdamLucz-RecordMa-PRD-b2f871c7c-e630c56d&GLOBAL-ID=EBAY-US&RESPONSE-DATA-FORMAT=JSON&callback=_cb_findItemsByKeywords&REST-PAYLOAD&keywords=" + keyword + "&responseencoding=JSON&paginationInput.entriesPerPage=5"),
    crossDomain: true,
    dataType: 'script',
    success: function(response) {
    //calls the renderAlbum function
    callback();
    }
    });
    
}

//**Callback function used by ebay's api to sort response info and fill html table
function _cb_findItemsByKeywords(root) {
      //fills variable items with the response items info
      var items = root.findItemsByKeywordsResponse[0].searchResult[0].item || [];
      //creates empty array
      var html = [];
      //fill the html array with an empty table
      html.push('<h1>eBay Listings</h1> <table width="100%" border="0" cellspacing="0" cellpadding="3"><tbody>');
      
      //itterates through each item in items array, sorts item info into variables, and then fills a new table row in the html array
      for (var i = 0; i < items.length; ++i)   {
        var item     = items[i];
        var title    = item.title;
        var price    = item.sellingStatus.map(function(obj){
                       var curPrice = obj.currentPrice.map(function(obj){
                           var listing = obj["__value__"] + " " + obj["@currencyId"];
                           return listing;});
                        return curPrice;});
        var pic      = item.galleryURL;
        var viewitem = item.viewItemURL;

        if (null != title && null != viewitem) {
          html.push('<tr><td>' + '<img src="' + pic + '" border="0">' + '</td>' +
            '<td><a href="' + viewitem + '" target="_blank">' + title + '</a></td>' + '<td><h4>' + price + '</h4></td></tr>');
        }
      }
      html.push('</tbody></table>');
      document.getElementById("ebay").innerHTML = html.join("");
    }


/**
 * Renders the album profile page based on
 * results from api search responses
 */
function renderAlbum() {
    
    //hide all sections
    $("#search").attr("hidden", true);
    $("#wishlist").attr("hidden", true);
    $("#collection").attr("hidden", true);
    
    //clear everything
    $("#info").empty();
    $("#collectButton").empty();
    $("#addButton").empty();
    $("#cover-img").empty();
    
    /**fill and reveal album profile page**/
    
    //create title headings
    var artist = $("<h1></h1>")
                     .text(model.albumInfo.album.artist);
    
    var title = $("<h1></h1>")
                    .text(model.albumInfo.album.name);
    
    //retrieve and render album cover
    model.covers = model.albumInfo.album.image.map(function(obj) {
        return obj["#text"];
    });
    
    var cover = $("<img/>")
                    .attr("class", "img-responsive")
                    .attr("src", model.covers[3]);
                    
    $("#cover-img").append(cover);
    

    trackList = $("<ul></ul>")
                    .attr("style", "list-style-type:none");
    
    var tracks = model.albumInfo.album.tracks.track.map(function(obj){
        
        trackList.append("<li>" + obj.name + "</li>");
    });

    trackTitle = $("<h3></h3>")
                    .text("Tracklist");
    

                    
    /*create button that when clicked triggers the wishlistAdd function,
    thereby adding the current album to the user's wishlist */
    var wishButton = $("<button></button>")
                        .attr("class", "btn btn-success")
                        .attr("id", "wishButton")
                        .attr("type", "button")
                        .text("Add to Wishlist")
                        .click(function(){
                            wishlistAdd();
                        });
    
    $("#addButton").append(wishButton);

    /*create button that when clicked triggers the collectionAdd function,
    thereby adding the current album to the user's collection */
    var collectionButton = $("<button></button>")
                        .attr("class", "btn btn-success")
                        .attr("id", "addCollectButton")
                        .attr("type", "button")
                        .text("Add to Collection")
                        .click(function(){
                            collectionAdd();
                        });
    
    $("#collectButton").append(collectionButton);

    //checks for available album info and renders accordingly
    if (model.albumInfo.album.wiki)
    {
        var info = $("<p></p>")
                    .append(model.albumInfo.album.wiki.summary);
    }
    else
    {
        var info = $("<p></p>")
                    .text("No info available.");
    }
        
    //retrieve and render genre tags
    var tags = model.albumInfo.album.tags.tag.map(function(obj) {
        return obj.name;
    });
    
    var tag = $("<p></p>")
                    .text(tags);
        
    //add new info to html    
    $("#info").append([artist, title, info, trackTitle, trackList, tag]);
        

    /**Fill youtube result section**/
    videoElement = $("#videos");
    
    //clear any old data out
    videoElement.empty();
    
    //map video results
    var videos = model.videoInfo.items.map(function(obj) {
        var id = obj.id.videoId;
        var url = "https://www.youtube.com/embed/" + id;
        var frame = $("<iframe></iframe>")
                        .attr("width", "260")
                        .attr("height", "185")
                        .attr("src", url);
                        
        return $("<li></li>")
                    .append(frame);
     });
     
     //embed videos into album-profile
     var videoList = $("<ul></ul>")
                        .attr("id", "video-list")
                        .attr("style", "list-style-type:none")
                        .append("<h2>Video Samples</h2>")
                        .append(videos);
                        
    videoElement.append(videoList);
     
        
    //reveal new album listing page
    $("#results").attr("hidden", false);
}

/*Takes album info and then passes it via an ajax request
* into the php controller that adds it to the database wishlist
*/
function wishlistAdd(){
    //diable the add to wishlist button
    $("#wishButton").prop("disabled", true);
    
    //set the variables that are to be added to the wishlist 
    var artist = model.albumInfo.album.artist;
    var album = model.albumInfo.album.name;
    var img = model.covers[2];

    //makes an ajax call to the wishlistAdd php controller, passing along variables to be added to database
    $.ajax({
    url: "https://ide50-adamlucz90.cs50.io/php/wishlistAdd.php",
    data: {
        w1: artist,
        w2: album,
        w3: img
    },
    success: function(response) {

        //parse the JSON information provided from php controller
        var info = JSON.parse(response);
        
        //if the JSON comes back empty that means the album is 
        //already in the users wishlist
        if(info !== null){
            //inform user album is already in the wishlist
            $("#wishButton")
                .prop("diabled", true)
                .text("Already In Wishlist");
        }
    }
    });
}

/*When called makes an ajax request to the database to pull all
* of a user's wishlist items and pass the info into wishlistFill
*/
function wishlist(){
    
    //hide search form
    $("#search").attr("hidden", true);
    
    //makes ajax call to wishlist php controller to access a users wishlist
    $.ajax({
    url: "https://ide50-adamlucz90.cs50.io/php/wishlist.php",
    success: function(response) {
    //parse the JSON object returned from php controller 
    var wish = JSON.parse(response);
    
    //inject the wishlist information into the model to be used in wishlistFill
    model.wishInfo = wish;
    
    //call the wishlistFill function
    wishlistFill();
    }
    });
}

/*Searches the database for a queried user and then
* if the user exists, returns their wishlist items
*/
function wishSearch(user){
    //ajax call to the wishlistSearch php controller
    //passes in artist and album variable to ensure they are deleted from the user's wishlist
    $.ajax({
        url: "https://ide50-adamlucz90.cs50.io/php/wishlistSearch.php",
        data: {
            w1: user
        },
        
        success: function(response) {
        //parse the JSON object returned from php controller 
        var wish = JSON.parse(response);
        
        //if the user searched doesn't exist alert the user
        if(wish.fail){
            //alert user that the queried user doesnt exist
            $("#user-search-form").attr("placeholder", "User Doesn't Exist!");
            
            //clear the search form value to allow the user to see the alert
            $("#user-search-form").val("");
        }
        //else fill in the searched user's wishlist
        else{
            //check to see if the queried user's wishlist is null and fill the model accordingly
            if(wish.empty){
                //inject the wishlist information into the model to be used in wishlistFill
                model.wishInfo = null;
            }
            else{
                //inject theh wishlist information into the model to be used in wishlistFill
                model.wishInfo = wish;
            }
            
            //reload the wishlist
            //pass in the user variable to tell wishlistFill it is rendering a queried user
            wishlistFill(user);            
            }
        }
        });
}

/*Renders the wishlist*/
function wishlistFill(user){
    //empties anything previously in the wishlist
    $("#wishlist ul").empty();
    
    //ensures the empty wishlist message is hidden
    $("#wishEmpty").attr("hidden", true);
    
    //if there is nothing in a users wishlist display empty wishlist message
    //if not then fill the wishlist
    if(model.wishInfo === null){
        //if this is rendering from wishSearch display the correct message
        //else display the correct message
        if(user)
        {
            //ensure searchGreet is visible and displays correct message
            $("#searchGreet")
                .attr("hidden", false)
                .text(user + " has nothing in their wishlist!");
                        
            //ensure wishGreet is invisible
            $("#wishGreet").attr("hidden", true);
        }
        else
        {
            //reveals empty wishlist message
            $("#wishEmpty").attr("hidden", false);
            
            //ensure searchGreet is invisible
            $("#searchGreet").attr("hidden", true);
                    
            //ensure wishGreet is visible
            $("#wishGreet").attr("hidden", false);
        }
    
        //hides the search form section and results section
        $("#search").attr("hidden", true);
        $("#results").attr("hidden", true);
        $("#collection").attr("hidden", true);
        
        //reveals wishlist page
        $("#wishlist")
            .attr("hidden", false);
    }
    else
    {
        //iterate through each item in the user's wishlist
        //and inject info into a bootstrap panel
        model.wishInfo.forEach(function(obj){
        
        //create cover image and make the image a link to it's own info page
        var cover = $("<img></img>")
            .attr("src", obj.url)
            .attr("class", "img-responsive")
            .attr("href", "#")
            .click(function(){
                albumSearch(obj.artist, obj.album, youtubeSearch);
            });
        
        //Get artist name for heading  
        var artist = $("<h4></h4>")
            .text(obj.artist);
       
       //Get album name for heading    
        var album = $("<h4></h4>")
            .text(obj.album);
        
        //create button that allows the user to remove item from their wishlist   
        var button = $("<button></button>")
            .text("REMOVE")
            .attr("class", "btn btn-success")
            .click(function(){
                wishRemove(obj.artist, obj.album);
            });
            
        //create button that allows the user to remove item from their wishlist   
        var collectButton = $("<button></button>")
            .text("Add to Collection")
            .attr("class", "btn btn-success")
            .attr("id", "collectAddButton")
            .click(function(){
                collectionAdd(obj.artist, obj.album, obj.url);
                wishRemove(obj.artist, obj.album);
            });
            
        //panel heading contains the artist and album title
        var panelHeading = $("<div></div>")
          .attr("class", "panel-heading")
          .append([artist, album]);
        
            //if we are rendering from wishSearch
            if(user)
            {
                //display the queried user's username
                $("#searchGreet")
                    .attr("hidden", false)
                    .text(user + "'s Wishlist");
                    
                //hide the usual wishGreet element
                $("#wishGreet").attr("hidden", true);
                
                //render the panel body without the remove button
                var panelBody = $("<div></div>")
                  .attr("class", "panel-body")
                  .append(cover);
                  
                //list item is a panel, contains the panel heading and body
                var item = $("<li></li>")
                  .append( [panelHeading, panelBody] )
                  .attr("class", "panel panel-default");
                
                //append the panel to the wishlist
                $("#wishlist ul").append(item);
                
            }
            else
            {
                
                //panel body contains the cover and button
                var panelBody = $("<div></div>")
                  .attr("class", "panel-body")
                  .append([cover, button, collectButton]);  
                    
                //list item is a panel, contains the panel heading and body
                var item = $("<li></li>")
                  .append( [panelHeading, panelBody] )
                  .attr("class", "panel panel-default");
                
                //append the panel to the wishlist
                $("#wishlist ul").append(item);
                
                //ensure searchGreet is invisible
                $("#searchGreet").attr("hidden", true);
                    
                //ensure wishGreet is visible
                $("#wishGreet").attr("hidden", false);
            }
    });
        //ensure the search-from section and results section are hidden
        $("#search").attr("hidden", true);
        $("#results").attr("hidden", true);
        $("#collection").attr("hidden", true);
        
        //reveal the wishlist section
        $("#wishlist").attr("hidden", false);
    }
}

/*Makes an ajax call to delete the specified album from
* a user's wishlist and then rerenders the wishlist
*/
function wishRemove(artist, album){
    //ajax call to the wishlistDelete php controller
    //passes in artist and album variable to ensure they are deleted from the user's wishlist
    $.ajax({
        url: "https://ide50-adamlucz90.cs50.io/php/wishlistDelete.php",
        data: {
            w1: artist,
            w2: album
        },
        
        success: function(response) {
            //reload the wishlist
            wishlist();
        }
        });
}


/*When called makes an ajax request to the database to pull all
* of a user's collection items and pass the info into collectionFill
*/
function collection(){
    
    //hide search form
    $("#search").attr("hidden", true);
    
    //makes ajax call to collection php controller to access a users collection
    $.ajax({
    url: "https://ide50-adamlucz90.cs50.io/php/collection.php",
    success: function(response) {
    //parse the JSON object returned from php controller 
    var collection = JSON.parse(response);
    
    //inject the collection information into the model to be used in collectionFill
    model.collectionInfo = collection;
    
    //call the wishlistFill function
    collectionFill();
    }
    });
}

/*Takes album info and then passes it via an ajax request
* into the php controller that adds it to the database collection
*/
function collectionAdd(artist, album, img){
    //diable the add to collection button
    $("#addCollectButton").prop("disabled", true);
    
    if(artist){
    //set the variables that are to be added to the collection from input
    var artistName = artist;
    var albumName = album;
    var imgUrl = img;
    }
    else{
    //set the variables that are to be added to the wishlist 
    var artistName = model.albumInfo.album.artist;
    var albumName = model.albumInfo.album.name;
    var imgUrl = model.covers[2];
    }

    //makes an ajax call to the wishlistAdd php controller, passing along variables to be added to database
    $.ajax({
    url: "https://ide50-adamlucz90.cs50.io/php/collectionAdd.php",
    data: {
        w1: artistName,
        w2: albumName,
        w3: imgUrl
    },
    success: function(response) {

        //parse the JSON information provided from php controller
        var info = JSON.parse(response);
        
        //if the JSON comes back empty that means the album is 
        //already in the users wishlist
        if(info !== null){
            //inform user album is already in the wishlist
            $("#addCollectButton")
                .prop("disabled", true)
                .text("Already In Collection!");
        }
    }
    });
}

/*Makes an ajax call to delete the specified album from
* a user's collection and then rerenders the collection
*/
function collectionRemove(artist, album){
    //ajax call to the wishlistDelete php controller
    //passes in artist and album variable to ensure they are deleted from the user's wishlist
    $.ajax({
        url: "https://ide50-adamlucz90.cs50.io/php/collectionDelete.php",
        data: {
            w1: artist,
            w2: album
        },
        
        success: function(response) {
            //reload the wishlist
            collection();
        }
        });
}

/*Renders the collection*/
function collectionFill(){
    //empties anything previously in the collection list
    $("#collection ul").empty();
    
    //ensures the empty collection message is hidden
    $("#collectionEmpty").attr("hidden", true);
    
    //if there is nothing in a users collection display empty collection message
    //if not then fill the wishlist
    if(model.collectionInfo === null){

        //reveals empty collection message
        $("#collectionEmpty").attr("hidden", false);
                    
        //ensure collectionGreet is visible
        $("#collectionGreet").attr("hidden", false);
    
        //hides the search form section, results section, and wishlist section
        $("#search").attr("hidden", true);
        $("#results").attr("hidden", true);
        $("#wishlist").attr("hidden", true);
        
        //reveals collection page
        $("#collection").attr("hidden", false);
    }
    else
    {
        //iterate through each item in the user's collection
        //and inject info into a bootstrap panel
        model.collectionInfo.forEach(function(obj){
        
        //create cover image and make the image a link to it's own info page
        var cover = $("<img></img>")
            .attr("src", obj.url)
            .attr("class", "img-responsive")
            .attr("href", "#")
            .click(function(){
                albumSearch(obj.artist, obj.album, youtubeSearch);
            });
        
        //Get artist name for heading  
        var artist = $("<h4></h4>")
            .text(obj.artist);
       
       //Get album name for heading    
        var album = $("<h4></h4>")
            .text(obj.album);
        
        //create button that allows the user to remove item from their collection   
        var button = $("<button></button>")
            .text("REMOVE")
            .attr("class", "btn btn-success")
            .click(function(){
                collectionRemove(obj.artist, obj.album);
            });
            
        //panel heading contains the artist and album title
        var panelHeading = $("<div></div>")
          .attr("class", "panel-heading")
          .append([artist, album]);
        

        //panel body contains the cover and button
        var panelBody = $("<div></div>")
                .attr("class", "panel-body")
                .append([cover, button]);  
                    
        //list item is a panel, contains the panel heading and body
        var item = $("<li></li>")
                  .append( [panelHeading, panelBody] )
                  .attr("class", "panel panel-default");
                
            //append the panel to the collection
                $("#collection ul").append(item);
                
                    
            //ensure wishGreet is visible
                $("#collectionGreet").attr("hidden", false);
            
    });
        //ensure the search-from section and results section are hidden
        $("#search").attr("hidden", true);
        $("#results").attr("hidden", true);
        $("#wishlist").attr("hidden", true);
        
        $("#collection").attr("hidden", false);
    }
}

/*Passes login info to the login php controller
* if all is good the user is logged in and redirected to homepage
*/
function login(){
    //serialize the form data passed into the login form
    var data = $("#login").serialize();
    
    //ensure the error message is blank
    $("#error").empty();
    
    //makes an ajax call to the login controller passing along user login information
    $.ajax({
        method: "POST",
        url: "https://ide50-adamlucz90.cs50.io/php/login.php",
        data,
        
        success: function(response) {
            var status = JSON.parse(response);
            //check if response is ok
            //if ok reload the page and the user is logged in
            if(status.ok){
                $("#error").empty();
                //redirects user to homepage
                window.location.assign("https://ide50-adamlucz90.cs50.io/");
            }
            else{
                $("#error").text("Your Username and Password do not match.");
            }
        }
        });
}

/*Passes registration information to register php controller
* if all is good the new user is registered, logged in, and redirected to the homepage
*/
function register(){
    //serialize the form data passed into the register form
    var data = $("#register").serialize();
    
    //ensure the error message is blank
    $("#error").empty();
    
    //makes ajax request to the register controller passing along registration information
    $.ajax({
        method: "POST",
        url: "https://ide50-adamlucz90.cs50.io/php/register.php",
        data,
        
        success: function(response) {
            var status = JSON.parse(response);
            //check if response is ok
            //if ok reload the page and the user is logged in
            if(status.ok){
                $("#error").empty();
                //redirects user to homepage
                window.location.assign("https://ide50-adamlucz90.cs50.io/");
            }
            else{
                $("#error").text(status.fail);
            }
        }
        });
}

//event handlers
$(document).ready(function() {
    
    //when user submits the search by album form, pass along the form data and trigger albumSearch
    $("#form-search").submit(function(evt) {
        evt.preventDefault();
        var artist = $("#form-search input[name=artist]").val();
        var album = $("#form-search input[name=album]").val();
        albumSearch(artist, album, youtubeSearch);
        });

    //when user submits the search by song form, pass along the form data and trigger songSearch
    $("#form-search-song").submit(function(evt) {
        evt.preventDefault();
        var artist = $("#form-search-song input[name=artist]").val();
        var track = $("#form-search-song input[name=track]").val();
        songSearch(artist, track, albumSearch);
        });

    //when user submits the user wishlist search form, pass along the form data and trigger wishSearch
    $("#user-search").submit(function(evt) {
        evt.preventDefault();
        var user = $("#user-search input[name=user]").val();
        wishSearch(user);
        });

    //when user clicks the login button on the navbar, reveal the login form section and hide all other sections   
    $("#logclick").on("click", function(evt){
        evt.preventDefault();
        $("#search").attr("hidden", true);
        $("#results").attr("hidden", true);
        $("#log").attr("hidden", false);
        });
    
    //when the user clicks the wishlist button on the navbar, trigger the wishlist function thereby rendering the wishlist    
    $("#wishClick").on("click", function(evt){
        evt.preventDefault();
        wishlist();
        });
    
    //when the user clicks on the search button on the navbar, navigate them back to the search page    
    $("#navSearch").on("click", function(evt){
        evt.preventDefault();
        
        //ensure the search forms are empty
        $("#search .form-control").val("");
        
        //hide all other sections
        $("#results").attr("hidden", true);
        $("#wishlist").attr("hidden", true);
        $("#collection").attr("hidden", true);
        $("#log").attr("hidden", true);
        
        //reveal search section
        $("#search").attr("hidden", false);
    })

    //when the user clicks the Collection button on the navbar, trigger the collection function thereby rendering the collection    
    $("#collectionClick").on("click", function(evt){
        evt.preventDefault();
        collection();
        });
        
        //validates the registration form
        //if valid the register function is fired
        $("#register").validate({
            rules: 
            {
                confirmation: {
                    required: true,
                },
                password:  {
                    required: true,
                    minlength: 6,
                },
                username: {
                    required: true,
                }
            },
          messages:
            {
                confirmation: {
                    required: "please confirm your password"
                },
                password:{
                        required: "please enter your password",
                        minlength: "Your password must be at least 6 characters"
                         },
                username:{ 
                        required: "please enter your Username"
                        },
            },
            submitHandler: function(form){
                register();
                return false;
            }
        });
        
        //validates the login form
        //if valid the login function is fired     
        $("#login").validate({
            rules: 
            {
                password:  {
                    required: true,
                },
                username: {
                    required: true,
                }
            },
           messages:
            {
                password:{
                        required: "please enter your password"
                         },
                username:{ 
                        required: "please enter your Username"
                        },
            },
        submitHandler: function(form){
            login();
            return false;
            }
        });

}); 
