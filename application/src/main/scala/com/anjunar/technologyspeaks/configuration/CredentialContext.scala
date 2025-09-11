package com.anjunar.technologyspeaks.configuration

import com.anjunar.scala.universe.ResolvedClass
import com.anjunar.technologyspeaks.control.{Credential, CredentialWebAuthn}
import com.anjunar.vertx.jaxrs.providers.ContextProvider
import io.vertx.ext.web.RoutingContext

import java.lang.annotation.Annotation

class CredentialContext extends ContextProvider {

  override def canRead(javaType: ResolvedClass, annotations: Array[Annotation]): Boolean = classOf[Credential].isAssignableFrom(javaType.raw)

  override def read(javaType: ResolvedClass, annotations: Array[Annotation], ctx: RoutingContext): Any = ctx.session().get("credential") 
    
}
