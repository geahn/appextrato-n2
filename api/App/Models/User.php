<?php

    namespace App\Models;

    class User {

        private static $table = 'users';

        public static function select($username) {

            $con_string = 'host='.DBHOST.' port=5432 dbname='.DBNAME.' user='.DBUSER.' password='.DBPASS;
            $bdcon = pg_connect($con_string);

            $result = pg_query($bdcon, "SELECT * FROM daniel_geahn.".self::$table." WHERE username = '".$username."'");
            $numrows = pg_numrows($result);

            if (!$numrows) {
            throw new \Exception("Nenhum usuário encontrado");
            exit;
            } else {
                return $arr = pg_fetch_array($result, NULL, PGSQL_ASSOC);
            }
        }

        public static function selectAll() {

            $con_string = 'host='.DBHOST.' port=5432 dbname='.DBNAME.' user='.DBUSER.' password='.DBPASS;
            $bdcon = pg_connect($con_string);

            $result = pg_query($bdcon, 'SELECT * FROM daniel_geahn.'.self::$table);
            $numrows = pg_numrows($result);

            if (!$numrows) {
            throw new \Exception("Nenhum usuário encontrado");
            exit;
            } else {
                return $arr = pg_fetch_all($result, PGSQL_ASSOC);
            }
        }

        public static function insert($data) {

            $username = $data['username'];
            $password = $data['password'];

            $con_string = 'host='.DBHOST.' port=5432 dbname='.DBNAME.' user='.DBUSER.' password='.DBPASS;
            $bdcon = pg_connect($con_string);

            //$result = pg_query($bdcon, "INSERT INTO daniel_geahn.".self::$table." (username, password, status) VALUES ('".$data['username']."', '".$data['password']."', '1')");
            $result = pg_query($bdcon, "INSERT INTO daniel_geahn.".self::$table." (username, password, status) VALUES ('".$username."', '".$password."', '1')");

            if (!$result) {
            throw new \Exception("Falha ao inserir!");
            exit;
            } else {
                return "Inserido com sucesso! Usuário: ".$username;
            }
        }

        public static function update($id) {

        }
    }