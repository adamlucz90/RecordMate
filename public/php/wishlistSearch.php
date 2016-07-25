<?php
    //require config to make connection to database
    require 'config.php';

    //get username queried
    $user = $_GET['w1'];
    
    //set query to find the user id
    $idQuery = "SELECT id FROM users WHERE username = '$user'";
    $idResult = mysqli_fetch_array(mysqli_query($conn, $idQuery));
    
    //if user exists then collect wishlist info
    if($idResult != null){
    $id = $idResult[0];

    //set query to select all items from a user's wishlist
    $query = "SELECT artist, album, url FROM wishlist WHERE user_id = '$id'";
    $result = mysqli_query($conn, $query);

    //sort result into an associative array to encode into json
    while($row = $result->fetch_array(MYSQL_ASSOC)) {
            $myArray[] = $row;
        }
        //if the user's wishlist is empty, send back a response of "empty"
        if($myArray === null)
        {
            $emptyArray = array("empty"=>"yes");
            echo json_encode($emptyArray);
        }
        else
        {
        //encodes a json object to pass wishlist items to the javascript file
        echo json_encode($myArray);
        }
    
    }
    else{
        //if the user doesn't exist send back a response of "fail"
        $failArray = array("fail"=>"Yes");
        echo json_encode($failArray);
    }
?>