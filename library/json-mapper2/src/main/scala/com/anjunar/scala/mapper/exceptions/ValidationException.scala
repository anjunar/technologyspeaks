package com.anjunar.scala.mapper.exceptions

class ValidationException(val violations : java.util.List[ValidationViolation]) extends RuntimeException
