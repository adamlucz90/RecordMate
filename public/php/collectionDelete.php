<?php
//require config to make connection to database
require 'config.php';

//get user id
$id = $_COOKIE['id'];

//fill artist and album variables based on GET data
$artist = $_GET['w1'];
$album = $_GET['w2'];

//query the database deleting the album for the user based on the artist and album variables
$query = "DELETE FROM collection WHERE user_id = '$id' AND artist = '$artist' AND album = '$album'";
$result = mysqli_query($conn, $query);

?>