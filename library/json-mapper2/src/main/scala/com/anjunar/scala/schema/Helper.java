package com.anjunar.scala.schema;

import com.google.common.reflect.TypeParameter;
import com.google.common.reflect.TypeToken;

import java.util.Collection;

public class Helper {

    static <E> TypeToken<Collection<E>> mapOf(Class<E> keyType) {
        return new TypeToken<Collection<E>>() {}
                .where(new TypeParameter<E>() {}, keyType);
    }

}
