package com.anjunar.scala.i18n

import java.util
import java.util.Locale

case class I18n(text : String, translations : util.Map[Locale, String])
