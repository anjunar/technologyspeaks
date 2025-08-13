package com.anjunar.vertx.annotations;

import jakarta.ws.rs.HttpMethod;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Documented
@Retention(RUNTIME)
@Target(TYPE)
public @interface Route {

    String path();
    
    String method() default HttpMethod.GET;
    
    int order() default 0;
    
}
