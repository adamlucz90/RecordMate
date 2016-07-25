<?php
    //require config to make connection to database
    require 'config.php';
    
    //Query the database to see if the username already exists
    $user = $_POST["username"];
    $userQuery = "SELECT username FROM users WHERE username = '$user'";
    $userResult = mysqli_fetch_array(mysqli_query($conn, $userQuery));
    
    //if the username exists send back a fail message
    if($userResult != null)
    {
        $exists = array("fail"=>"Username already exists");
        echo json_encode($exists);
    }
    else
    {
        //Ensure password and confirmation match
        if ($_POST["password"] != $_POST["confirmation"])
        {
            $fail = array("fail"=>"Your passwords do not match");
            echo json_encode($fail);
        }
        else
        {
            //Insert new user into the database
            $password = password_hash($_POST["password"], PASSWORD_DEFAULT);
            $query = "INSERT IGNORE INTO users (username, password) VALUES('$user', '$password')";
            $result = mysqli_query($conn, $query);
            
            //Get ID number of new user
            $rows = "SELECT LAST_INSERT_ID() AS id";
            $row = mysqli_fetch_array(mysqli_query($conn, $rows));
            $id = $row[0];
    
            //set the cookie username to the username setting the cookie for 30 days
            setcookie("username", $user, strtotime( '+30 days' ), "/", "", "", TRUE);
            
            //set the cookie id to user id and log them in setting the cookie for 30 days
            setcookie("id", $row[0], strtotime( '+30 days' ), "/", "", "", TRUE);
            
            //when the user is registered and logged in send back message of "ok"
            $ok = array("ok"=>"ok");
            echo json_encode($ok);
          }
    }
?>