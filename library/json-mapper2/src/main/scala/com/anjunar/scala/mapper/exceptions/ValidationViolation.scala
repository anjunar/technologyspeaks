package com.anjunar.scala.mapper.exceptions

import java.util

class ValidationViolation(val path : util.List[AnyRef], val message : String,val  root : Class[?])
