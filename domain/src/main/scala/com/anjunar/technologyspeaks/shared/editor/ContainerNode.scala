package com.anjunar.technologyspeaks.shared.editor

import jakarta.persistence.{CascadeType, Entity, OneToMany}

import java.util
import scala.beans.BeanProperty
import scala.jdk.CollectionConverters.*

trait ContainerNode extends Node {

  def position : Position 
  def children : util.List[Node]
  
}
