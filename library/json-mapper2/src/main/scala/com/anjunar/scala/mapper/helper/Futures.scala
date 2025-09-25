package com.anjunar.scala.mapper.helper

import java.util.concurrent.{CompletableFuture, CompletionStage}

object Futures {

  def combineAll[T](futures: List[CompletionStage[T]]): CompletionStage[List[T]] = {
    if (futures.isEmpty) CompletableFuture.completedFuture(List.empty[T])
    else {
      val initial: CompletionStage[List[T]] = CompletableFuture.completedFuture(List.empty[T])
      futures.foldLeft(initial) { (acc, next) =>
        acc.thenCombine(next, (list: List[T], elem: T) => list :+ elem)
      }
    }
  }
}
