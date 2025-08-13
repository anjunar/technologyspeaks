package com.anjunar.technologyspeaks.media

import scala.beans.BeanProperty

case class Base64Resource(@BeanProperty `type`: String, @BeanProperty subType: String, @BeanProperty data: Array[Byte])


