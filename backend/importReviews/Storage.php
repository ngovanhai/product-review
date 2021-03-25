<?php

/**
 * Created by PhpStorm.
 * User: tiennv
 * Date: 8/18/18
 * Time: 18:04
 */

namespace Reviews;


class Storage
{
    public static function path($path)
    {
        $root = dirname(__DIR__);
        $storage_dir = $root . '/storage/';
        return $storage_dir . $path;
    }
}
