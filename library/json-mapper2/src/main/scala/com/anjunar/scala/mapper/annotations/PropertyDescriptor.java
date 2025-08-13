package com.anjunar.scala.mapper.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.FIELD, ElementType.PARAMETER})
public @interface PropertyDescriptor {

    String title();

    String description() default "";

    String widget() default "";

    String step() default "";

    boolean id() default false;

    boolean naming() default false;

    boolean writeable() default false;

    boolean hidden() default false;

}
