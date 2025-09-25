package com.anjunar.technologyspeaks.shared.property

import com.anjunar.jaxrs.types.OwnerProvider
import com.anjunar.scala.mapper.IdProvider
import com.anjunar.scala.universe.TypeResolver
import com.anjunar.technologyspeaks.control.User
import com.anjunar.vertx.engine.{RequestContext, VisibilityRule}
import org.hibernate.reactive.stage.Stage

import java.util.{Objects, UUID}
import java.util.concurrent.{CompletableFuture, CompletionStage}

case class ManagedRule[E <: OwnerProvider](entityClass : Class[?]) extends VisibilityRule[E] {

  override def isVisible(entity: E, property: String, ctx: RequestContext, session : Stage.Session): CompletionStage[Boolean] = {
    if (! ctx.currentUser.principal().containsKey("id")) {
      CompletableFuture.completedFuture(false)
    } else {
      if (entity.owner.id == ctx.currentUser.get("id") || ctx.roles.contains("Administrator")) {
        CompletableFuture.completedFuture(true)
      } else {
        session.find(classOf[User], ctx.currentUser.get("id"))
          .thenCompose(currentUser =>
            val viewContext = TypeResolver.companionInstance(entityClass).asInstanceOf[ViewContext]
            viewContext.findByUser(currentUser)(using session)
              .thenCompose(view => {
                val opt = view.properties.stream()
                  .filter(p => p.value == property)
                  .findFirst()

                if opt.isPresent then {
                  val managedProperty = opt.get
                  CompletableFuture.completedFuture(checkVisibility(managedProperty, ctx))
                } else {
                  val managedProperty = new ManagedProperty
                  managedProperty.view = view
                  managedProperty.value = property

                  session.persist(managedProperty).thenApply(_ => {
                    checkVisibility(managedProperty, ctx)
                  })
                }
              })
          )
      }
    }
  }

  private def checkVisibility(managedProperty: ManagedProperty, ctx: RequestContext): Boolean = {
    val userId = ctx.currentUser.get("id")
    val visibleForAll = managedProperty.visibleForAll
    val isInUsers = managedProperty.users.stream().anyMatch(user => user.id.toString == userId)
    val isInGroup = managedProperty.groups.stream().anyMatch(group =>
      group.users.stream().anyMatch(user => user.id.toString == userId)
    )

    visibleForAll || isInUsers || isInGroup
  }

  override def isWriteable(entity: E, property: String, ctx: RequestContext, factory : Stage.Session): CompletionStage[Boolean] = {
    CompletableFuture.completedFuture(ctx.currentUser.get("id") == entity.owner.id.toString || ctx.roles.contains("Administrator"))
  }
}

