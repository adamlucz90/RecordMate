<?php
session_start();

//turns session into an empty array destroying any session variables
$_SESSION = array();

//Checks for a cookie and then destroys it
if(isset($_COOKIE['id']))
{
    setcookie("id", '', strtotime( '-5 days' ), '/');
    setcookie("username", '', strtotime( '-5 days' ), '/');
}

//destroys the session
session_destroy();

//redirects back to the homepage
header("Location: https://ide50-adamlucz90.cs50.io/")

?>