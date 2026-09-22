<?php
class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct() {
        // Try to load from .env file, fallback to production defaults
        $envFile = __DIR__ . '/../.env';
        if (file_exists($envFile)) {
            $env = parse_ini_file($envFile);
            $this->host = $env['DB_HOST'] ?? 'sql308.infinityfree.com';
            $this->db_name = $env['DB_NAME'] ?? 'if0_42963205_efashionbd';
            $this->username = $env['DB_USER'] ?? 'if0_42963205';
            $this->password = $env['DB_PASS'] ?? 'hrYV7cuoACRx';
        } else {
            // Production defaults for InfinityFree
            $this->host = 'sql308.infinityfree.com';
            $this->db_name = 'if0_42963205_efashionbd';
            $this->username = 'if0_42963205';
            $this->password = 'hrYV7cuoACRx';
        }
    }

    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        
        return $this->conn;
    }
}
?>
