package com.anjunar.scala.mapper.file

import com.anjunar.scala.mapper.IdProvider
import com.anjunar.scala.mapper.annotations.PropertyDescriptor

trait File extends IdProvider {

  @PropertyDescriptor(title = "Content Type")
  def contentType: String
  def contentType_=(value: String): Unit

  @PropertyDescriptor(title = "Filename")
  def name: String
  def name_=(value: String): Unit

  @PropertyDescriptor(title = "Data")
  def data: Array[Byte]
  def data_=(value: Array[Byte]): Unit

}
