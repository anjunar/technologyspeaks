package com.anjunar.scala.mapper.helper

import java.util.concurrent.{CompletableFuture, CompletionStage}

object Futures {

  def combineAll[T](futures: List[CompletionStage[T]]): CompletionStage[List[T]] = {
    combineAllSerial(futures.map(f => () => f))
  }

  def combineAllSerial[T](futures: List[() => CompletionStage[T]]): CompletionStage[List[T]] = {
    futures match {
      case Nil => CompletableFuture.completedFuture(Nil)
      case head :: tail =>
        head().thenCompose { h =>
          combineAllSerial(tail).thenApply(t => h :: t)
        }
    }
  }
}
