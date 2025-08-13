package com.anjunar.technologyspeaks

import com.anjunar.nodejs.NodeJSEnvironment
import com.anjunar.vertx.CDIApiVerticle
import com.typesafe.scalalogging.Logger
import io.vertx.core.{Vertx, VertxOptions}
import jakarta.annotation.PreDestroy
import jakarta.enterprise.context.{ApplicationScoped, Dependent}
import jakarta.enterprise.event.Observes
import jakarta.enterprise.inject.Produces
import jakarta.enterprise.inject.spi.CDI
import jakarta.persistence.Persistence
import org.hibernate.SessionFactory
import org.jboss.weld.environment.se.Weld
import org.jboss.weld.environment.se.events.ContainerInitialized

@ApplicationScoped
class Main {

  val logger = Logger[Main]

  @Produces
  @ApplicationScoped
  lazy val sessionFactory: SessionFactory = Persistence
    .createEntityManagerFactory("default")
    .unwrap(classOf[SessionFactory])

  @Produces
  @ApplicationScoped
  lazy val vertx: Vertx = {
    val options = new VertxOptions().setEventLoopPoolSize(8)
    Vertx.vertx(options)
  }

  @PreDestroy
  def destroy(): Unit = {
    logger.info("Executing @PreDestroy hook...")
    try {
      if (!sessionFactory.isClosed) {
        logger.info("Closing SessionFactory...")
        sessionFactory.close()
      }
    } catch {
      case e: Exception => logger.error("Failed to close SessionFactory", e)
    }
    try {
      logger.info("Closing Vertx...")
      vertx.close().toCompletionStage.toCompletableFuture.get() // Ensure synchronous close
    } catch {
      case e: Exception => logger.error("Failed to close Vertx", e)
    }
    logger.info("@PreDestroy hook completed.")
  }

  def onStartup(@Observes event: ContainerInitialized, vertx: Vertx, nodeJSEnvironment: NodeJSEnvironment): Unit = {
    nodeJSEnvironment.startContainer()
    vertx.deployVerticle(new CDIApiVerticle(CDI.current()))
  }

}

object Main {
  def main(args: Array[String]): Unit = {
    val weld = new Weld()
    val container = weld.initialize()
    try {
      println("Weld container is running. Press Ctrl+C to shutdown.")
      Thread.currentThread().join()
    } catch {
      case e: InterruptedException =>
        println(s"Main thread interrupted: ${e.getMessage}")
    } finally {
      container.close()
    }
  }
}
