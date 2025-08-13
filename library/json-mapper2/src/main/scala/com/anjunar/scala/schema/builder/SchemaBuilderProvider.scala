package com.anjunar.scala.schema.builder

import jakarta.enterprise.context.RequestScoped

@RequestScoped
class SchemaBuilderProvider {

  val builder : SchemaBuilder = new SchemaBuilder()

}
