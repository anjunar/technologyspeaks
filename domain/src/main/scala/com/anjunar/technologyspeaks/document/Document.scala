package com.anjunar.technologyspeaks.document

import com.anjunar.jaxrs.types.OwnerProvider
import com.anjunar.jpa.RepositoryContext
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.scala.mapper.file.{File, FileContext}
import com.anjunar.scala.schema.engine.EntitySchemaDef
import com.anjunar.security.SecurityUser
import com.anjunar.technologyspeaks.control.User
import com.anjunar.technologyspeaks.shared.AbstractEntity
import com.anjunar.technologyspeaks.shared.editor.{ASTDiffUtil, Change, Editor, EditorFile}
import com.anjunar.technologyspeaks.shared.hashtag.HashTag
import com.github.gumtreediff.actions.{ChawatheScriptGenerator, EditScriptGenerator, InsertDeleteChawatheScriptGenerator}
import com.github.gumtreediff.matchers.Matchers
import jakarta.persistence.*
import jakarta.validation.constraints.Size
import jakarta.ws.rs.FormParam
import org.hibernate.annotations.CollectionType
import org.hibernate.envers.{AuditReaderFactory, Audited, NotAudited}

import java.util
import java.util.{Locale, UUID}
import scala.beans.BeanProperty
import scala.collection.mutable
import scala.compiletime.uninitialized
import scala.jdk.CollectionConverters.*
import java.lang

@Entity
@Audited
class Document extends AbstractEntity with OwnerProvider {

  @Size(min = 3, max = 80)
  @PropertyDescriptor(title = "Title")
  @FormParam("title")
  @Basic
  var title: String = uninitialized

  @Lob
  @Column(columnDefinition = "text")
  @PropertyDescriptor(title = "Description")
  @NotAudited
  @Basic
  var description: String = uninitialized

  @PropertyDescriptor(title = "User")
  @ManyToOne(optional = false, targetEntity = classOf[User])
  @NotAudited
  var user: User = uninitialized

  @PropertyDescriptor(title = "Editor", widget = "editor")
  @OneToOne(optional = false, cascade = Array(CascadeType.ALL), orphanRemoval = true, targetEntity = classOf[Editor])
  var editor: Editor = uninitialized

  @OneToMany(cascade = Array(CascadeType.ALL), orphanRemoval = true, mappedBy = "document", targetEntity = classOf[Chunk])
  @NotAudited
  @BeanProperty  
  val chunks: util.List[Chunk] = new util.ArrayList[Chunk]()

  @PropertyDescriptor(title = "HashTags", widget = "form-array")
  @ManyToMany(targetEntity = classOf[HashTag])
  @NotAudited
  val hashTags : util.Set[HashTag] = new util.HashSet[HashTag]()
  
  @PropertyDescriptor(title = "Language")
  @Basic
  var language : Locale = uninitialized
  
  override def owner: SecurityUser = user
  
  override def toString = s"Document($title, $description, $language)"
}

object Document extends RepositoryContext[Document](classOf[Document]) {

  val schema = new EntitySchemaDef[Document]("Document") {
    val id = column[UUID]("id")
    val title = column[String]("title")
  }
  
}
