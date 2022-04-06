<?php

    include('lock/const.php');
    include('lock/connect.php');

    $BREAKER = 0;

    $ALL_MESSAGES = file_get_contents("https://api.telegram.org/bot1615739249:AAGzlBdj19qjjxp3qWq3W8QOD-VkwignVv0/getUpdates","r");

    $ALL_MESSAGES_decode = json_decode($ALL_MESSAGES, true, 512);

    $MESSAGES_KOL = count($ALL_MESSAGES_decode['result']);


    for($i=1; $i<$MESSAGES_KOL+1;$i++) {


        $TEXT = $ALL_MESSAGES_decode['result'][$MESSAGES_KOL-$i]['message']['text'];

        if(strripos($TEXT, '/')) {

            $TEXT_L = strlen($TEXT);

            $pos = strripos($TEXT, '/');

            if ($pos < 6) $MONEY_L = $pos;
                else $MONEY_L = 6;

            $MISHA  = substr($TEXT, $pos-$MONEY_L, $MONEY_L);
            $KOSTYA = substr($TEXT, $pos+1, $MONEY_L);

            if(strripos($MISHA, "\n"))
                $MISHA = substr($MISHA,strripos($MISHA, "\n"));

            if(strripos($MISHA, " "))
                $MISHA = substr($MISHA,strripos($MISHA, " "));

            if(strripos($KOSTYA, ' '))
                $KOSTYA = substr($KOSTYA,0,strripos($KOSTYA, ' '));

            $BREAKER = 1;


            $QR_CHECK_MONEY = "SELECT * FROM `MONEY` WHERE `NUM` = '1'";

            $result = mysqli_query($connect_to_db,$QR_CHECK_MONEY);

            $data_m = mysqli_fetch_assoc($result);

            if (($data_m['M'] < $MISHA*1) || ($data_m['K'] < $KOSTYA*1)) {

                $QR_INSERT = "UPDATE `MONEY` SET `M` = '".$MISHA."', `K` = '".$KOSTYA."' WHERE `NUM` = '1'";

                $result = mysqli_query($connect_to_db,$QR_INSERT);
            }

            echo 'Текст  - [ ',$TEXT,' ]<br>';
            echo 'Миша   - [ ',$MISHA,' ]<br>';
            echo 'Костя  - [ ',$KOSTYA,' ]<br>';

        }

        if($BREAKER) break;
    }

    mysqli_close($connect_to_db);

?>