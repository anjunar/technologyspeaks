package com.anjunar.configuration

import org.hibernate
import org.hibernate.`type`.StandardBasicTypes
import org.hibernate.boot.model.FunctionContributions
import org.hibernate.dialect.PostgreSQLDialect

class Postgres16Dialect extends PostgreSQLDialect {
  override def initializeFunctionRegistry(functionContributions: FunctionContributions): Unit = {
    super.initializeFunctionRegistry(functionContributions)
    val typeConfiguration = functionContributions.getTypeConfiguration
    val functionRegistry = functionContributions.getFunctionRegistry
    functionRegistry.registerPattern("levensthein", "levenshtein(?1, ?2)", typeConfiguration.getBasicTypeRegistry.resolve(StandardBasicTypes.DOUBLE))
    functionRegistry.registerPattern("similarity", "similarity(?1, ?2)", typeConfiguration.getBasicTypeRegistry.resolve(StandardBasicTypes.DOUBLE))
    functionRegistry.registerPattern("jsonPathAsJson", "?1::json -> ?2", typeConfiguration.getBasicTypeRegistry.resolve(StandardBasicTypes.STRING))
    functionRegistry.registerPattern("jsonPathAsText", "?1::json ->> ?2", typeConfiguration.getBasicTypeRegistry.resolve(StandardBasicTypes.STRING))
    functionRegistry.registerPattern("distance", "?1 @@ to_tsquery(?2, ?3)", typeConfiguration.getBasicTypeRegistry.resolve(StandardBasicTypes.BOOLEAN))
    functionRegistry.registerPattern("array_agg", "array_agg(?1)::char", typeConfiguration.getBasicTypeRegistry.resolve(StandardBasicTypes.BOOLEAN))
  }
}
