package com.anjunar.technologyspeaks

import com.anjunar.jpa.PostgresIndexIntegrator
import com.anjunar.nodejs.NodeJSEnvironment
import com.anjunar.scala.universe.{ClassPathResolver, ResolvedClass}
import com.anjunar.vertx.CDIVerticle
import com.anjunar.vertx.fsm.FSMEngine
import com.typesafe.scalalogging.Logger
import io.vertx.core.{Vertx, VertxOptions}
import jakarta.annotation.PreDestroy
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.event.Observes
import jakarta.enterprise.inject.spi.BeanManager
import jakarta.enterprise.inject.{Instance, Produces}
import jakarta.inject.Inject
import jakarta.persistence.{Entity, EntityManagerFactory, Persistence}
import jakarta.validation.{Validation, Validator}
import org.hibernate.boot.registry.{BootstrapServiceRegistryBuilder, StandardServiceRegistryBuilder}
import org.hibernate.reactive.mutiny.Mutiny
import org.hibernate.reactive.provider.ReactiveServiceRegistryBuilder
import org.hibernate.reactive.stage.Stage
import org.hibernate.reactive.vertx.VertxInstance
import org.jboss.weld.environment.se.Weld
import org.jboss.weld.environment.se.events.ContainerInitialized

import scala.compiletime.uninitialized

@ApplicationScoped
class Main {

  @Inject
  var beanManager : BeanManager = uninitialized

  @Produces
  @ApplicationScoped
  lazy val validator: Validator = Validation
    .buildDefaultValidatorFactory()
    .getValidator

  @Produces
  @ApplicationScoped
  lazy val sessionFactory: Stage.SessionFactory = {
    val bootstrapServiceRegistry = new BootstrapServiceRegistryBuilder()
      .applyIntegrator(new PostgresIndexIntegrator())
      .build()

    val standardServiceRegistryBuilder = new StandardServiceRegistryBuilder(bootstrapServiceRegistry)

    val properties = new java.util.Properties()
    properties.setProperty("jakarta.persistence.jdbc.url", "postgresql://localhost:5432/technology_speaks")
    properties.setProperty("jakarta.persistence.jdbc.user", "postgres")
    properties.setProperty("jakarta.persistence.jdbc.password", "postgres")
    properties.setProperty("hibernate.hbm2ddl.auto", "create")
    properties.put("jakarta.persistence.bean.manager", beanManager)
    //    properties.setProperty("hibernate.show_sql", "true")
    //    properties.setProperty("hibernate.format_sql", "true")


    standardServiceRegistryBuilder.applySettings(properties)

    val configuration = new org.hibernate.cfg.Configuration()
    configuration.addProperties(properties)

    val serviceRegistry = new ReactiveServiceRegistryBuilder(bootstrapServiceRegistry)
      .applySettings(configuration.getProperties)
      .addService(classOf[VertxInstance], new VertxInstance {
        override def getVertx: Vertx = vertx
      })
      .applySetting("jakarta.persistence.bean.manager", beanManager)
      .build()

    val classes = ClassPathResolver.findAnnotation(classOf[Entity])
    classes.foreach(annotation => configuration.addAnnotatedClass(annotation.target.asInstanceOf[ResolvedClass].raw))

    configuration.buildSessionFactory(serviceRegistry).unwrap(classOf[Stage.SessionFactory])
  }

  @Produces
  @ApplicationScoped
  lazy val vertx: Vertx = {
    val options = new VertxOptions().setEventLoopPoolSize(8)
    Vertx.vertx(options)
  }
  val logger = Logger[Main]

  @PreDestroy
  def destroy(): Unit = {
    logger.info("Executing @PreDestroy hook...")
    try {
      if (sessionFactory.isOpen) {
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

  def onStartup(@Observes event: ContainerInitialized,
                vertx: Vertx,
                nodeJSEnvironment: NodeJSEnvironment,
                engine: FSMEngine,
                beanManager: BeanManager,
                instance: Instance[AnyRef]): Unit = {
    nodeJSEnvironment.startContainer()
    vertx.deployVerticle(new CDIVerticle(beanManager, instance, engine))
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
