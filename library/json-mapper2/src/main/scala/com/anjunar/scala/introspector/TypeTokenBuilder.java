package com.anjunar.scala.introspector;

import com.google.common.reflect.TypeParameter;
import com.google.common.reflect.TypeToken;

import java.util.List;
import java.util.Set;

public class TypeTokenBuilder {

    public static <T> TypeToken<?> parameterizedType(Class<?> rawOuter, TypeToken<?> innerType) {
        if (rawOuter == List.class) {
            return new TypeToken<List<T>>() {}
                    .where(new TypeParameter<T>() {}, (TypeToken<T>) innerType);
        } else if (rawOuter == Set.class) {
            return new TypeToken<Set<T>>() {}
                    .where(new TypeParameter<T>() {}, (TypeToken<T>) innerType);
        } else {
            throw new IllegalArgumentException("Nicht unterstützter Typ: " + rawOuter);
        }
    }
}
