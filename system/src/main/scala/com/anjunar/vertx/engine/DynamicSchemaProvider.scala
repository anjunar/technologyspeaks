package com.anjunar.vertx.engine

import com.anjunar.jaxrs.types.Table
import org.hibernate.reactive.stage.Stage

trait DynamicSchemaProvider {

  def schema[E](clazz: Class[E], view: SchemaView) : EntitySchemaDef[Table[E]]

}
