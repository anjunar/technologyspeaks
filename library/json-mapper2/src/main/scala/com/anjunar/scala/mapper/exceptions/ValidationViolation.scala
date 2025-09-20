package com.anjunar.scala.mapper.exceptions

import java.util

class ValidationViolation(val path : util.List[Any], val message : String,val  root : String)
