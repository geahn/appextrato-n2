<?php

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
        header('Access-Control-Allow-Headers: token, Content-Type');
        header('Access-Control-Max-Age: 1728000');
        header('Content-Length: 0');
        header('Content-Type: text/plain');
        die();
    }

    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    $ret = [
        'result' => 'OK',
    ];

    require_once '../vendor/autoload.php';
    
    if ($_GET['url']) {
        $url = explode("/", $_GET['url']);

        if ($url[0] === 'api') {
            array_shift($url);
            $service = 'App\Services\\'.ucfirst($url[0]).'Service';
            array_shift($url);

            $method = strtolower($_SERVER['REQUEST_METHOD']);
            
            try {
                $response = call_user_func_array(array(new $service, $method), $url);
                http_response_code(200);
                echo json_encode(array('status' => 'sucess', 'data' => $response));
                exit;            
            } catch (\Exception $e) {
                http_response_code(404);
                echo json_encode(array('status' => 'error', 'data' => $e->getMessage()), JSON_UNESCAPED_UNICODE);
                exit;            
            }
        }
    }