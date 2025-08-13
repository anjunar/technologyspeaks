package com.anjunar.olama

import com.fasterxml.jackson.annotation.JsonProperty

import scala.beans.BeanProperty
import scala.compiletime.uninitialized

class EmbeddingResponse extends AbstractResponse {

  var embeddings : Array[Array[Float]] = uninitialized

}
