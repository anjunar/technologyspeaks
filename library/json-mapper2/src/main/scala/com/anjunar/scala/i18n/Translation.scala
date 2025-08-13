package com.anjunar.scala.i18n

import java.util.Locale
import scala.beans.BeanProperty

case class Translation(@BeanProperty text : String,@BeanProperty language : Locale)
