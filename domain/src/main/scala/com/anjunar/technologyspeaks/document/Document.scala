package com.anjunar.technologyspeaks.document

import com.anjunar.jaxrs.types.OwnerProvider
import com.anjunar.jpa.RepositoryContext
import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.anjunar.scala.mapper.file.{File, FileContext}
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
import java.util.Locale
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
  
  def findTop5(vector : Array[Float]) : util.List[Document] = {
    val builder = entityManager.getCriteriaBuilder
    val query = builder.createQuery(classOf[Document])
    val root = query.from(classOf[Document])

    val subquery = query.subquery(classOf[lang.Double])
    val chunkRoot = subquery.correlate(root).join("chunks")

    val distanceExpr = builder.avg(builder.function(
      "cosine_distance",
      classOf[lang.Double],
      chunkRoot.get("embedding"),
      builder.parameter(classOf[Array[lang.Float]], "embedding")
    ))

    subquery.select(distanceExpr)
      .where(Array(builder.equal(chunkRoot.get("document"), root)) *)

    val maxDistance = 0.35d
    val predicate = builder.lessThanOrEqualTo(subquery, maxDistance)

    query.select(root)
      .where(Array(predicate)*)
    
    entityManager.createQuery(query)
      .setParameter("embedding", vector)
      .setMaxResults(5)
      .getResultList
  }

  def revisions(document: Document, index: Int, limit: Int): (Int, util.List[Revision]) = {
    val auditReader = AuditReaderFactory.get(entityManager)
    val revisions = auditReader.getRevisions(classOf[Document], document.id)

    def paginateRevisions(revs: util.List[Number], page: Int, size: Int): util.List[Number] = {
      val from = page * size
      if (from >= revs.size) new util.ArrayList()
      else revs.asScala.slice(from, Math.min(from + size, revs.size())).asJava
    }

    val pageRevisions = paginateRevisions(revisions, index, limit)
    (revisions.size(), pageRevisions.stream.map(rev => {
      val revDocument = auditReader.find(classOf[Document], document.id, rev)
      val revision = new Revision
      revision.id = revDocument.id
      revision.revision = rev.intValue()
      revision.title = revDocument.title

      val oldContext = ASTDiffUtil.buildTreeContext(revDocument.editor.json)
      val newContext = ASTDiffUtil.buildTreeContext(document.editor.json)

      val matcher = Matchers.getInstance().getMatcher.`match`(oldContext.getRoot, newContext.getRoot)

      val editScript = new ChawatheScriptGenerator().computeActions(matcher)

      val actions = editScript.asList()

      val changes = Change.extractChanges(actions)
      
      revision.editor = document.editor
      revision.editor.changes.addAll(changes)
      
      revision
    }).toList)
  }

}
