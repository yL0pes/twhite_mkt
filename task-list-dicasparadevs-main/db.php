<?php
// filepath: c:\Users\Patrick\OneDrive\Documents\twhite_mkt\task-list-dicasparadevs-main\db.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tw_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM tasks";
        $result = $conn->query($sql);
        $tasks = array();

        while ($row = $result->fetch_assoc()) {
            $tasks[] = $row;
        }

        echo json_encode($tasks);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $category_id = $data['category_id'];
        $task_description = $data['task_description'];

        $sql = "INSERT INTO tasks (category_id, task_description) VALUES ('$category_id', '$task_description')";

        if ($conn->query($sql) === TRUE) {
            $response = array("insertId" => $conn->insert_id);
            echo json_encode($response);
        } else {
            echo json_encode(array("error" => $conn->error));
        }
        break;

    case 'DELETE':
        $id = $_GET['id'];
        $sql = "DELETE FROM tasks WHERE id = $id";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(array("message" => "Task deleted"));
        } else {
            echo json_encode(array("error" => $conn->error));
        }
        break;
}

$conn->close();
?>