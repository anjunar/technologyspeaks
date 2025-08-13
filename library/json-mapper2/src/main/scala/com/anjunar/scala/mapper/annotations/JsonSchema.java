package com.anjunar.scala.mapper.annotations;

import com.anjunar.scala.schema.builder.EntityJSONSchema;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.PARAMETER})
public @interface JsonSchema {

    Class<? extends EntityJSONSchema<?>> value();

}
