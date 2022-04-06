
    <?php

    include('lock/const.php');
    include('lock/connect.php');

    $data = $_POST;

    $name    = $data['name'];
    $console = $data['console'];
    $deposit = $data['deposit'];
    $date    = $data['date'];
    $credit = '0';

    $now = time() + $date*24*60*60;
    $date = date("d.m.Y H:i", $now);

    $QR_CHECK_MONEY = "SELECT * FROM `MONEY` WHERE `NUM` = '1'";

    $result = mysqli_query($connect_to_db,$QR_CHECK_MONEY);

    $data_m = mysqli_fetch_assoc($result);

    $money_m = $data_m['M'];
    $money_k = $data_m['K'];

    $data['money'] *= 1;

    if($data['who'] === 'D') {
        
        $credit = $data['money'];
        
        $arr = array(
            ''              => $name,
            '%0AПрист:%20'  => $console,
            ' Залог:%20'    => $deposit,
            '       До:%20' => $date,
            '%0AДолг:%20'   => $credit
        );
    }
    else {
        if($data['who'] === 'M')
            $money_m += $data['money'];
        else
            $money_k += $data['money'];
    
        $money = $money_m.'/'.$money_k;
        
        $arr = array(
            ''              => $name,
            '%0AПрист:%20'  => $console,
            ' Залог:%20'    => $deposit,
            '       До:%20' => $date,
            '%0AБаланс:%20' => $money
        );
    }


    foreach($arr as $key => $value) {
        $message .= "<b>".$key."</b>".$value."%0A";
    }

    $sendToTelegram = fopen("https://api.telegram.org/bot{$TOKEN}/sendMessage?chat_id={$CHAT_ID}&parse_mode=html&text={$message}","r");

    $QR_UPDATE_MONEY = "UPDATE `MONEY` SET `M` = '".$money_m."', `K` = '".$money_k."' WHERE `NUM` = '1'";
    $result = mysqli_query($connect_to_db,$QR_UPDATE_MONEY);

    $QR_UPDATE_main = "
    UPDATE `main` SET 
        `FREE` = '0', 
        `CLIENT` = '".$name."', 
        `DEPOSIT` = '".$deposit."', 
        `CREDIT` = '".$credit."', 
        `DATE` = '".date("Y-m-d H:i:s", $now)."' 
    WHERE `CONSOLE` = '".$console."'";

    $result = mysqli_query($connect_to_db,$QR_UPDATE_main);

    mysqli_close($connect_to_db);

    echo json_encode($message);

?>