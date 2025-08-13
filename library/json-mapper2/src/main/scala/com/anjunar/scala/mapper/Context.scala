package com.anjunar.scala.mapper

import jakarta.validation.ConstraintViolation

import java.util
import scala.collection.mutable

trait Context {

  val children: mutable.Map[String, Context] = new mutable.HashMap[String, Context]()
  val violations: util.Set[ConstraintViolation[?]] = new util.HashSet[ConstraintViolation[?]]()
}
