<?php
//include the database config file
include_once 'config.php';
//$dbhost, $dbuser,$dbpass,$dbname are defined in config.php
//establish a connection with the database
$db = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
if ($db->connect_errno > 0) {
    die('Unable to establish database connection :' . $db->connect_error);
}

//defining variables for requested picture and retreived comment
$requested = 0;
$retreivedComment = "";

// The request is using the POST method
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (isset($_POST['id'])) {// if 'id' is set
        $requested = $_POST['id'];//get the id
    }
    //query for the number of pictures in the table
    $query = "select * from assignment_pictures";
    $res = $db->query($query);
    $count = $res->num_rows;

//using arithmetic mod to start from the beginning once end is reached
    // for reg: if there are 4 items, and the request is 5, it should display 1, which is 5 mod 4
    $toView = $requested % $count;
    //handling mod for negative values
    if ($toView < 0) {
        $toView += abs($count);
    }
    //since we are handling arrays, we increase it by 1,
    // to get the right index
    $toView += 1;

//if comment is set, insert the comment into the database
    if (isset($_POST['comment'])) {
        $retreivedComment = $_POST['comment'];
        $query = 'insert into assignment_comments (id, comments) values(' . $toView . ',' . '"' . $retreivedComment . '")';
        if ($db->query($query) === FALSE) {
            echo "Error: " . $query . "<br>" . $db->error;
        }
    }

}
//prepare queries  to fetch the url and comments
$fetchURLQuery = "select url from assignment_pictures where id=" . $toView;
$fetchCommentsQuery = "select comments from assignment_comments where id=" . $toView;
//execute the queries
$requestedURLResults = $db->query($fetchURLQuery);
$requestedCommentsResults = $db->query($fetchCommentsQuery);
//get the data from the results
$urlRes = $requestedURLResults->fetch_assoc();
$urlData = $urlRes['url'];
$i = 0;
//get all the comments in an array
$allComments;
while ($row = $requestedCommentsResults->fetch_assoc()) {
    $allComments[$i] = $row['comments'];
    $i += 1;
}
//prepare the array with the url of the picture and comments
$arrayToSend = array("url" => $urlData,
    "comments" => $allComments
);
//encode the array to json object
$encodedJson = json_encode($arrayToSend);
//echo the json so it can be retreived by the ajax
echo $encodedJson;

?>

