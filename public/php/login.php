<?php
    //require config to make connection to database
    require 'config.php';

    //set query variables based on POST data 
    $password = $_POST["password"];
    $user = $_POST["username"];
    
    //query database for the user
    $query = "SELECT id, password FROM users WHERE username = '$user'";
    $row = mysqli_fetch_array(mysqli_query($conn, $query));

    //ensure that the password sent matches with the password saved in database
    //if so log them in, if not send backa message of "fail"
    if(password_verify($password, $row[1]))
    {
        //set the cookie username to user and log setting the cookie for 30 days
        setcookie("username", $user, strtotime( '+30 days' ), "/", "", "", TRUE);
            
        //set the cookie id to user id and log them in setting the cookie for 30 days
        setcookie("id", $row[0], strtotime( '+30 days' ), "/", "", "", TRUE);
        
        //when the user is logged in send back message of "ok"            
        $ok = array("ok"=>"ok");
        echo json_encode($ok);
    }
    else
    {
        //send back message of "fail"
        $fail = array("fail"=>"fail");
        echo json_encode($fail);
    }
?>