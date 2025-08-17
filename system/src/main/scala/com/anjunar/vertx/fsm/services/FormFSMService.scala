package com.anjunar.vertx.fsm.services

import java.util.concurrent.CompletionStage

trait FormFSMService[E] extends FSMService {

  def load() : CompletionStage[E]
  
  def save(entity : E) : CompletionStage[Void]
  
  def update(entity : E) : CompletionStage[E]
  
  def delete(entity : E) : CompletionStage[Void]
  
}
