<?php
namespace App\Helpers;

class Validator {
  public static function intBetween($v, int $min, int $max): bool {
    return filter_var($v, FILTER_VALIDATE_INT) !== false && $v >= $min && $v <= $max;
  }
  public static function enum($v, array $allowed): bool {
    return in_array($v, $allowed, true);
  }
}
