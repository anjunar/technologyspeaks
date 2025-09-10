package com.anjunar.vertx.engine

import com.anjunar.scala.introspector.DescriptorsModel
import com.anjunar.scala.schema.builder.{EntitySchemaBuilder, SchemaBuilder}
import com.anjunar.scala.universe.introspector.BeanModel
import org.hibernate.reactive.stage.Stage

import java.lang.reflect.Type
import java.util.concurrent.CompletionStage
import scala.reflect.Typeable

case class PropDef[E, T](name: String,
                         entity : DescriptorsModel,
                         var typeHandler: Option[RequestContext => SchemaBuilder] = None,
                         var instanceHandler: Option[(T, RequestContext, Stage.SessionFactory) => Seq[CompletionStage[SchemaBuilder]]] = None,
                         var visibility: VisibilityRule[E] = DefaultRule[E](),
                         var views: Set[SchemaView] = Set(SchemaView.Full),
                         var links: Seq[Link[E]] = Seq[Link[E]]()) {
  
  val propType = entity.findProperty(name)

  def forType(schema: RequestContext => SchemaBuilder): PropDef[E, T] = {
    typeHandler = Some(schema)
    this
  }

  def forInstance(schema: (T, RequestContext, Stage.SessionFactory) => Seq[CompletionStage[SchemaBuilder]]): PropDef[E, T] = {
    instanceHandler = Some(schema)
    this
  }

  def visibleWhen(rule: VisibilityRule[E]): PropDef[E, T] = {
    visibility = rule
    this
  }

  def inViews(vs: SchemaView*): PropDef[E, T] = {
    views = vs.toSet
    this
  }

  def withLinks(ls: Link[E]*): PropDef[E, T] = {
    links = ls
    this
  }
}
