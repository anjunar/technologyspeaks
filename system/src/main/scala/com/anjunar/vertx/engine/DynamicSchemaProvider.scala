package com.anjunar.vertx.engine

import com.anjunar.jaxrs.types.Table

trait DynamicSchemaProvider {

  def schema[E](clazz: Class[E], view: String) : EntitySchemaDef[Table[E]]

}
