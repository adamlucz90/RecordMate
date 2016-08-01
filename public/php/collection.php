<?php
    //require config to make connection to database
    require 'config.php';

    //set id to users id from cookie
    $id = $_COOKIE['id'];

    //set query to select all items from a user's collection
    $query = "SELECT artist, album, url FROM collection WHERE user_id = '$id'";
    $result = mysqli_query($conn, $query);
    
    //sort result into an associative array to encode into json
    while($row = $result->fetch_array(MYSQL_ASSOC)) {
            $collectArray[] = $row;
    }
    
    //encodes a json object to pass collection items to the javascript file
    echo json_encode($collectArray);

?>