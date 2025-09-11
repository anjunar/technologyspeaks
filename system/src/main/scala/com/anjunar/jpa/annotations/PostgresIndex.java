package com.anjunar.jpa.annotations;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Repeatable(PostgresIndices.class)
public @interface PostgresIndex {

    String name();
    String columnList();
    String using();
    String where() default "";

}
