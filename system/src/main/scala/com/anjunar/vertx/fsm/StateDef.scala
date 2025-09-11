package com.anjunar.vertx.fsm

import com.anjunar.scala.universe.members.ResolvedMethod
import com.anjunar.scala.universe.{ResolvedClass, TypeResolver}
import com.anjunar.vertx.engine.SchemaView
import com.anjunar.vertx.engine.SchemaView.Full
import jakarta.annotation.security.RolesAllowed
import jakarta.ws.rs.{Consumes, HttpMethod, Path, Produces}

import java.lang.reflect.Type

case class StateDef(rel : String,
                    name : String,
                    view: String = "full",
                    ref: Class[?] = classOf[Void],
                    resource: Class[?]) {
  
  def isRef : Boolean = ref != classOf[Void]

  val clazz: ResolvedClass = TypeResolver
    .resolve(resource)

  val method: ResolvedMethod = clazz
    .declaredMethods
    .find(method => method.annotations.exists(annotation => annotation.annotationType().isAnnotationPresent(classOf[HttpMethod])))
    .get
  
  val httpMethod = method.annotations.find(annotation => annotation.annotationType().isAnnotationPresent(classOf[HttpMethod]))
    .get
    .annotationType()
    .getSimpleName
  
  val returnType : Type = method.returnType.typeArguments(0).underlying
  
  val path : String = {
    val classPathAnnotation = clazz.findAnnotation(classOf[Path])
    val methodPathAnnotation = method.findAnnotation(classOf[Path])
    
    val classPath = if (classPathAnnotation == null) {
      throw new IllegalStateException("No Path Annotation on " + resource.getName)
    } else {
      if (classPathAnnotation.value().startsWith("/")) {
        classPathAnnotation.value()
      } else {
        "/" + classPathAnnotation.value()
      }
    }
    
    val methodPath = if (methodPathAnnotation == null) {
      ""
    } else {
      if (methodPathAnnotation.value().startsWith("/")) {
        methodPathAnnotation.value()
      } else {
        "/" + methodPathAnnotation.value()
      }
    }
    
    val fullPath = classPath + methodPath
    
    if (fullPath == "/") {
      ""
    } else {
      fullPath
    }
  } 
  
  val consumes : Array[String] = {
    val classConsumes = clazz.findAnnotation(classOf[Consumes])
    val methodConsumes = method.findAnnotation(classOf[Consumes])
    
    if (classConsumes == null) {
      if (methodConsumes == null) {
        Array[String]()
      } else {
        methodConsumes.value()
      }    
    } else {
      if (methodConsumes == null) {
        classConsumes.value()
      } else {
        classConsumes.value() ++ methodConsumes.value()
      }
    }
  }

  val produces : Array[String] = {
    val classProduces = clazz.findAnnotation(classOf[Produces])
    val methodProduces = method.findAnnotation(classOf[Produces])

    if (classProduces == null) {
      if (methodProduces == null) {
        Array[String]()
      } else {
        methodProduces.value()
      }
    } else {
      if (methodProduces == null) {
        classProduces.value()
      } else {
        classProduces.value() ++ methodProduces.value()
      }
    }
  }
  
  val rolesAllowed : Array[String] = {
    val allowed = method.findAnnotation(classOf[RolesAllowed])
    if (allowed == null) {
      Array("Administrator")
    } else {
      allowed.value()  
    }
  }

}
