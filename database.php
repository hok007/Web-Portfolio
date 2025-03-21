<?php
    $uri = "mysql://avnadmin:AVNS_aVE01t5pXH6N3wsEipF@mysql-36f2c12-kubota-ec6d.f.aivencloud.com:16372/portfolio_db?ssl-mode=REQUIRED";

    $fields = parse_url($uri);

    $conn = "mysql:";
    $conn .= "host=" . $fields["host"];
    $conn .= ";port=" . $fields["port"];;
    $conn .= ";dbname=portfolio_db";
    $conn .= ";sslmode=verify-ca;sslrootcert=ca.pem";

    try {
        $db = new PDO($conn, $fields["user"], $fields["pass"]);

        // $sql = "select * from personal_info";
        $sql = "UPDATE personal_info SET phone = '+855 98 496 050' WHERE id = 1";
        $result = $db->exec($sql);

        $sql = "SELECT * FROM personal_info WHERE id = 1";
        $result = $db->query($sql);

        $personalInfo = $result->fetch(PDO::FETCH_ASSOC);
        echo json_encode($personalInfo);
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
?>
