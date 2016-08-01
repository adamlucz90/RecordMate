<?php
//require config to make connection to database
require 'config.php';

//set id variable to users id
$id = $_COOKIE['id'];

//grab and set query variables from GET method
$artist = $_GET['w1'];
$album = $_GET['w2'];
$img = $_GET['w3'];

//Check to see if the album is already in the user's collection
$falseQuery = "SELECT * FROM collection WHERE user_id = '$id' AND album = '$album' AND artist = '$artist'";

//Return a query result
$result1 = mysqli_query($conn, $falseQuery);

//returns false if album is not in the collection and true if it is
$check = mysqli_data_seek($result1, 0);

//if album is not in user's collection then add it
if($check !== false){
    
    //sort result into an associative array to encode into json
    while($row = $result1->fetch_array(MYSQL_ASSOC)) {
            $hold[] = $row;
    }
    //encode a json object to tell javascript that the album is already in the collection
    echo json_encode($hold);

}
else{

    //set query to insert new album into the user's collection
    $query = "INSERT IGNORE INTO collection (artist, album, url, user_id) VALUES('$artist', '$album', '$img', '$id')";
    $result = mysqli_query($conn, $query);
}
?>