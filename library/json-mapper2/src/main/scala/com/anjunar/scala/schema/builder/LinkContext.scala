package com.anjunar.scala.schema.builder

import com.anjunar.scala.schema.model.Link

trait LinkContext {
  
  def addLink(name : String, link : Link) : Unit 
  
}
