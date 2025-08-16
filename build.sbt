import scala.collection.Seq

ThisBuild / version := "0.1.0-SNAPSHOT"

ThisBuild / scalaVersion := "3.7.2"

ThisBuild / javacOptions ++= Seq("--release", "24")
ThisBuild / scalacOptions ++= Seq("-release", "24")

lazy val scalaUniverse2 = (project in file("library/scala-universe2"))
  .settings(
    libraryDependencies ++= Seq(
      "com.google.guava" % "guava" % "33.4.8-jre",
      "jakarta.enterprise" % "jakarta.enterprise.cdi-api" % "4.1.0",
      "ch.qos.logback" % "logback-classic" % "1.5.18",
      "org.slf4j" % "slf4j-api" % "2.0.17",
      "org.slf4j" % "jul-to-slf4j" % "2.0.17",
      "com.typesafe.scala-logging" % "scala-logging_3" % "3.9.5"
    )
  )

lazy val jsonMapper2 = (project in file("library/json-mapper2"))
  .dependsOn(scalaUniverse2)
  .settings(
    libraryDependencies ++= Seq(
      "jakarta.validation" % "jakarta.validation-api" % "3.1.1",
      "jakarta.enterprise" % "jakarta.enterprise.cdi-api" % "4.1.0",
      "jakarta.persistence" % "jakarta.persistence-api" % "3.2.0",
      "jakarta.ws.rs" % "jakarta.ws.rs-api" % "4.0.0",
      "com.fasterxml.jackson.core" % "jackson-annotations" % "2.19.2",
      "org.apache.commons" % "commons-lang3" % "3.18.0",
      "org.apache.commons" % "commons-text" % "1.14.0",
      "commons-fileupload" % "commons-fileupload" % "1.6.0",
      "org.hibernate.orm" % "hibernate-core" % "7.1.0.Final"
    )
  )

lazy val system = (project in file("system"))
  .dependsOn(jsonMapper2)
  .settings(
    libraryDependencies ++= Seq(
      "com.github.gumtreediff" % "core" % "3.0.0",
      "com.googlecode.java-diff-utils" % "diffutils" % "1.3.0",
      "com.fasterxml.jackson.core" % "jackson-databind" % "2.19.2",
      "com.fasterxml.jackson.module" %% "jackson-module-scala" % "2.19.2",
      "com.fasterxml.jackson.datatype" % "jackson-datatype-jdk8" % "2.19.2",
      "com.fasterxml.jackson.datatype" % "jackson-datatype-jsr310" % "2.19.2",
      "com.fasterxml.jackson.jaxrs" % "jackson-jaxrs-json-provider" % "2.19.2",
      "com.google.guava" % "guava" % "33.4.8-jre",
      "com.pgvector" % "pgvector" % "0.1.6",
      "commons-io" % "commons-io" % "2.20.0",
      "org.hibernate.reactive" % "hibernate-reactive-core" % "4.1.0.Final",
      "com.webauthn4j" % "webauthn4j-core-async" % "0.29.5.RELEASE",
      "io.vertx" % "vertx-web" % "5.0.3",
      "io.vertx" % "vertx-pg-client" % "5.0.3",
      "jakarta.json.bind" % "jakarta.json.bind-api" % "3.0.1",
      "org.glassfish" % "jakarta.el" % "4.0.2",
      "javax.ws.rs" % "javax.ws.rs-api" % "2.1.1",
      "net.bytebuddy" % "byte-buddy" % "1.17.6",
      "org.apache.commons" % "commons-lang3" % "3.18.0",
      "org.apache.commons" % "commons-text" % "1.14.0",
      "org.jboss.weld.se" % "weld-se-core" % "6.0.3.Final",
      "org.jboss.resteasy" % "resteasy-client" % "7.0.0.Beta1"
    )
  )


lazy val domain = (project in file("domain"))
  .dependsOn(system)
  .settings(
    libraryDependencies ++= Seq(
      "org.hibernate" % "hibernate-validator" % "9.0.0.Beta3",
      "org.hibernate.orm" % "hibernate-core" % "7.1.0.Final",
      "org.hibernate.orm" % "hibernate-envers" % "7.1.0.Final",
      "org.hibernate.orm" % "hibernate-vector" % "7.1.0.Final"
    )
  )

lazy val rest = (project in file("rest"))
  .dependsOn(domain)
  .settings(
    libraryDependencies ++= Seq(
      "io.vertx" % "vertx-web" % "5.0.3"
    )
  )



lazy val application = (project in file("application"))
  .dependsOn(rest)
  .settings(
    libraryDependencies ++= Seq(
      "io.vertx" % "vertx-web-client" % "5.0.3"
      )
  )