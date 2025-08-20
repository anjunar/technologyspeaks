package com.anjunar.vertx.engine

trait SchemaProvider[E] {
  
  val schema : EntitySchemaDef[E]

}
