package com.anjunar.olama

import java.lang
import scala.beans.BeanProperty
import scala.compiletime.uninitialized

case class RequestOptions(num_ctx : lang.Integer = null,
                          repeat_last_n : lang.Integer = null,
                          repeat_penalty : lang.Float = null,
                          temperature : lang.Float = 0f,
                          seed : lang.Integer = null,
                          stop : String = null,
                          num_predict : lang.Integer = null,
                          top_k : lang.Integer = null,
                          top_p : lang.Float = null,
                          min_p : lang.Float = null)