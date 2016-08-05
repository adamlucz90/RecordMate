<!DOCTYPE html>
<html>
    <head>
        <!-- get j-query-->
        <script src="https://code.jquery.com/jquery-2.2.3.js"></script> 
        <!-- get jquery validation plugin -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.15.0/jquery.validate.min.js"></script>
        
        <!-- get bootstrap-->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
        
        <!-- link stylesheet-->
        <link rel="stylesheet" href="css/styles.css"/>
        
        <!--link javascript controller-->
        <script src="js/index.js" type="text/javascript"></script>

        <title>RecordMate- Find The Music You Love</title>
    </head>
    
    <header class="jumbotron col-xs-12">
        <h1><a href="https://ide50-adamlucz90.cs50.io/">RecordMate</a></h1>
        <h3 class="text-muted">Find the music you love!</h3>

    <!--NavBar-->
    <nav class="navbar  col-xs-12" id="nav">
      <a class="navbar-brand" href="https://ide50-adamlucz90.cs50.io/">RecordMate</a>
      <ul class="nav navbar-nav">
        <li class="nav-item active">
          <a class="nav-link" href="#" id="navSearch">Search<span class="sr-only">(current)</span></a>
        </li>
        <?php
        //check if user is logged in
        //if not then display login button
        if(!$_COOKIE['id']):
        ?>
        <li class="nav-item">
          <a class="nav-link" id="logclick" href="#">Login/Register</a>
        </li>
        <?php
        //if user is logged in then display wishlist and logout buttons
        else:
        ?>
        <li class="nav-item">
          <a class="nav-link" href="#" id="wishClick">Wishlist</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="#" id="collectionClick">My Collection</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/php/logout.php" id="logout">Logout</a>
        </li>
        <?php
        endif;
        // Closing the IF-ELSE construct
        ?>
      </ul>
      <form class="form-inline pull-xs-right" id="user-search">
        <input class="form-control" type="text" name ="user" id="user-search-form" placeholder="Search User's Wishlist" required>
        <button class="btn btn-success-outline" type="submit">Search</button>
      </form>
    </nav>
    </header>
     
    <body>

    <!-- default search section-->
    <section id="search" class="col-xs-12">
        <h2>Search by Album</h2>
        <!--search by album form-->
        <form id="form-search" class="form-inline">
            <div class="form-group">
                <input type="text" name="artist" placeholder="Artist" class="form-control"/>
            </div>
            <div class="form-group">
                <input type="text" name="album" placeholder="Album Title" class="form-control"/>
            </div>
            <button type="submit" class="btn btn-success">Search!</button>
            <div>
                <label class="radio-inline">
                     <input type="radio" name="format" value="cd">CD
                </label>
                <label class="radio-inline">
                  <input type="radio" name="format" value="vinyl">Vinyl
                </label>
                <label class="radio-inline">
                  <input type="radio" name="format" value="cassette">Cassette
                </label>
            </div>
        <!--Search Fail prompt-->
        <h2 id="fail" hidden="true">Could not find. Please search again!</h2>
        </form>
        <!--Search by Song form-->
        <h2>Search by Song</h2>
        <form id="form-search-song" class="form-inline">
            <div class="form-group">
                <input type="text" name="artist" placeholder="Artist" class="form-control"/>
            </div>
            <div class="form-group">
                <input type="text" name="track" placeholder="Song Title" class="form-control"/>
            </div>
            <button type="submit" class="btn btn-success">Search!</button>
            <div>
                <label class="radio-inline">
                     <input type="radio" name="format" value="cd">CD
                </label>
                <label class="radio-inline">
                  <input type="radio" name="format" value="vinyl">Vinyl
                </label>
                <label class="radio-inline">
                  <input type="radio" name="format" value="cassette">Cassette
                </label>
            </div>
    </section>

    <!--Album info results Section-->
    <section id="results" hidden="true">
        <!--Album profile section-->
        <section id="album-profile">
            <div id="info" class="col-xs-7">
            </div>
            <div id="cover" class="col-xs-5">
                <?php
                //if user is logged in then display "add to wishlist" button
                if($_COOKIE['id']):
                ?>
                    <div id="addButton" class="col-xs-8"></div>
                    <div id="collectButton" class="col-xs-8"></div>
                <?php
                else:
                ?>
                <h3>Login or Register to add to wishlist!</h3>
                <?php
                //end IFELSE construst
                endif;
                ?>
                <div id="cover-img"></div>
            </div>
        </section>
        
        <!--video and ebay listings-->
        <section id="video-profile">
            <div id="videos" class="col-xs-6">
            </div>
            <div id="ebay" class="col-xs-6">
                <h2>eBay Listings</h2>
            </div>
        </section>
    </section> 

    <!--forms for login and register-->
    <section id="log" hidden="true">
        <div class="col-xs-5"></div>
        <div class="col-xs-2">
            <form></form>
                <h2>Log In</h2>
                <form id="login">
                    <fieldset>
                        <div class="form-group">
                            <input autocomplete="off" autofocus class="form-control" name="username" placeholder="Username" type="text"/>
                        </div>
                        <div class="form-group">
                            <input class="form-control" name="password" placeholder="Password" type="password"/>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-success"><span aria-hidden="true" class="glyphicon glyphicon-log-in"></span>Log in!</button>
                        </div>
                    </fieldset>
                </form>
                <h4 id="error"></h4>
                <h2>Register</h2>
                <form id="register">
                    <fieldset>
                        <div class="form-group">
                            <input autocomplete="off" autofocus class="form-control" name="username" placeholder="Username" type="text"/>
                        </div>
                        <div class="form-group">
                            <input class="form-control" name="password" placeholder="Password (min 6 chars)" type="password"/>
                        </div>
                        <div class="form-group">
                            <input class="form-control" name="confirmation" placeholder="Confirm Password" type="password"/>
                        </div>
                        <div class="form-group">
                            <button class="btn btn-success" type="submit" id="reg-sub"><span aria-hidden="true" class="glyphicon glyphicon-log-in"></span>Register</button>
                        </div>
                    </fieldset>
                </form>
                
        </div>
        <div class="col-xs-5"></div>
    </section>
    
    <!--Wishlist Section-->
    <section id="wishlist" hidden="true" class="col-xs-12">
        <div id="friendList" hidden="true"><ul></ul></div>
        <h1 id="searchGreet" hidden="true"></h1>
        <h1 id="wishGreet" hidden="false"><?= htmlspecialchars($_COOKIE["username"])?>'s Wishlist</h1>
        <h1 hidden="true" id="wishEmpty">You have nothing in your wishlist!</h1>
            <ul id="wishItems" class="list-inline"></ul>
    </section>

    <!--Collection Section-->
    <section id="collection" hidden="true" class="col-xs-12">
        <h1 id="collectionGreet" hidden="false"><?= htmlspecialchars($_COOKIE["username"])?>'s Collection</h1>
        <h1 hidden="true" id="collectionEmpty">You have nothing in your collection!</h1>
            <ul id="collectionItems" class="list-inline"></ul>
    </section>
    
    </body>
    <footer class="col-xs-12">
        <p>&copy 2016 Adam Lucz</p>
    </footer>
</html>