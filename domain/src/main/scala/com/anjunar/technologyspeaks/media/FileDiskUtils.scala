package com.anjunar.technologyspeaks.media

import java.io.File
import java.nio.file.{Files, Paths}
import java.util.{Base64, UUID}
import scala.util.matching.Regex

object FileDiskUtils {

  def workingFile(id: UUID): File = {
    val home = System.getProperty("user.home")
    val meld = new File(home + File.separator + ".hairstyle")
    if (!meld.exists()) meld.mkdirs()
    val file = new File(meld.getCanonicalPath + File.separator + id.toString)
    if (file.isFile) file
    else {
      file.createNewFile()
      file
    }
  }

  case class Base64Resource(`type`: String, subType: String, data: Array[Byte])

  def extractBase64(value: String): Base64Resource = {
    val pattern: Regex = "data:(\\w+)/([\\w+]+);base64,.*".r
    val result = value.replaceFirst("data:(\\w+)/([\\w+]+);base64,", "")
    val decoder = Base64.getMimeDecoder
    val decode = decoder.decode(result)
    value match {
      case pattern(aType, subType) => Base64Resource(aType, subType, decode)
    }
  }

  def buildBase64(`type`: String, subType: String, data: Array[Byte]): String = {
    val encoder = Base64.getMimeEncoder
    val encode = encoder.encode(data)
    s"data:${`type`}/${subType};base64,${new String(encode)}"
  }
}


