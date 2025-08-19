package com.anjunar.futures

import java.util.concurrent.{CompletableFuture, CompletionStage}

object Futures {

  def combineAll(futures: List[() => CompletionStage[?]]): CompletionStage[List[?]] = {
    futures match {
      case Nil => CompletableFuture.completedFuture(Nil)
      case head :: tail =>
        head().thenCompose { h =>
          combineAll(tail).thenApply(t => h :: t)
        }
    }
  }
}
