package com.anjunar.technologyspeaks.shared.editor

import com.anjunar.scala.mapper.annotations.{Converter, PropertyDescriptor}
import com.anjunar.scala.mapper.file.{File, FileContext}
import com.anjunar.technologyspeaks.shared.AbstractEntity
import jakarta.persistence.*
import jakarta.ws.rs.FormParam
import org.hibernate.annotations.Type
import org.hibernate.envers.Audited

import java.util
import java.util.stream.Collectors
import scala.beans.BeanProperty
import scala.compiletime.uninitialized

@Entity
@Audited
class Editor extends AbstractEntity {

  @PropertyDescriptor(title = "Files")
  @OneToMany(cascade = Array(CascadeType.ALL), orphanRemoval = true, targetEntity = classOf[EditorFile])
  @FormParam("files")  
  val files: util.List[File] = new util.ArrayList[File]()

  @PropertyDescriptor(title = "AST", writeable = true)
  @Column(columnDefinition = "jsonb")
  @Type(classOf[RootType])
  @Converter(classOf[RootConverter])
  var json: Root = uninitialized

  @Lob
  @Column(columnDefinition = "text")
  @PropertyDescriptor(title = "Markdown")
  @FormParam("editor")
  @Basic
  var markdown: String = uninitialized

  @Transient
  @PropertyDescriptor(title = "Changes")
  val changes: util.List[Change] = new util.ArrayList[Change]()

  def toText() : String = toText(json)
  
  private def toText(root: Node): String = root match {
    case node: Table => ""
    case node: ContainerNode => node.children.stream().map(node => toText(node)).collect(Collectors.joining("\n"))
    case node: TextNode => node.value
    case _ => ""
  }


  override def toString = s"Editor($json)"
}
