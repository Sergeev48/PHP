<?php
$connect = mysqli_connect('localhost', 'root', 'root', 'request'); //подключение к бд
if (!$connect) {
    echo "Ошибка подключения бд";
}
