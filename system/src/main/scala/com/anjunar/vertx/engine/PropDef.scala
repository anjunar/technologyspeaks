package com.anjunar.vertx.engine

import com.anjunar.scala.introspector.DescriptorsModel
import com.anjunar.scala.schema.builder.Schemas
import com.anjunar.scala.schema.model.Link
import com.anjunar.scala.universe.introspector.BeanModel
import org.hibernate.reactive.stage.Stage

import java.lang.reflect.Type
import java.util.concurrent.CompletionStage
import scala.reflect.Typeable

case class PropDef[E, T](name: String,
                         entity : DescriptorsModel,
                         var typeHandler: Option[RequestContext => Schemas] = None,
                         var instanceHandler: Option[(T, RequestContext, Stage.Session) => Seq[CompletionStage[Schemas]]] = None,
                         var visibility: VisibilityRule[E] = DefaultRule[E](),
                         var views: Set[String] = Set("Full"),
                         var dynamicLinks: Seq[(entity : E, ctx : RequestContext, factory : Stage.Session) => CompletionStage[Link]] = Seq[(entity : E, ctx : RequestContext, factory : Stage.Session) => CompletionStage[Link]](),
                         var staticLinks: Seq[() => Link] = Seq[() => Link]()) {
  
  val propType = entity.findProperty(name)

  def forType(schema: RequestContext => Schemas): PropDef[E, T] = {
    typeHandler = Some(schema)
    this
  }

  def forInstance(schema: (T, RequestContext, Stage.Session) => Seq[CompletionStage[Schemas]]): PropDef[E, T] = {
    instanceHandler = Some(schema)
    this
  }

  def visibleWhen(rule: VisibilityRule[E]): PropDef[E, T] = {
    visibility = rule
    this
  }

  def inViews(vs: String*): PropDef[E, T] = {
    views = vs.toSet
    this
  }

  def withDynamicLinks(ls: ((entity : E, ctx : RequestContext, factory : Stage.Session) => CompletionStage[Link])*): PropDef[E, T] = {
    dynamicLinks = ls
    this
  }

  def withStaticLinks(ls: (() => Link)*): PropDef[E, T] = {
    staticLinks = ls
    this
  }

}
