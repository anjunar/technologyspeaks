package com.anjunar.nodejs

import com.typesafe.scalalogging.Logger
import jakarta.annotation.PreDestroy
import jakarta.enterprise.context.ApplicationScoped

import java.io.{BufferedReader, File, InputStreamReader}
import java.nio.file.Files
import scala.compiletime.uninitialized

@ApplicationScoped
class NodeJSEnvironment {

  val logger = Logger[NodeJSEnvironment]

  var ssrProcess: Process = uninitialized

  var webpackProcess : Process = uninitialized

  def startContainer(): Unit = {
    ssrProcess = new ProcessBuilder("npm.cmd", "run", "serve:ssr:production")
      .directory(new File("./src/main/javascript/workspace"))
      .redirectError(ProcessBuilder.Redirect.INHERIT)
      .start()

    new Thread(() => {
      val reader = new BufferedReader(new InputStreamReader(ssrProcess.getInputStream))
      try {
        var line: String = null
        while ( {
          line = reader.readLine(); line != null
        }) {
          println(s"[Node.js] $line")
        }
      } finally {
        reader.close()
      }
    }).start()

/*
    webpackProcess = new ProcessBuilder("npm.cmd", "run", "watch")
      .directory(new File("./src/main/typescript/packages/technology-speaks"))
      .redirectError(ProcessBuilder.Redirect.INHERIT)
      .start()

    new Thread(() => {
      val reader = new BufferedReader(new InputStreamReader(webpackProcess.getInputStream))
      try {
        var line: String = null
        while ( {
          line = reader.readLine();
          line != null
        }) {
          println(s"[Node.js] $line")
        }
      } finally {
        reader.close()
      }
    }).start()
*/

  }

  private def killProcessTree(process: Process): Unit = {
    try {
      val pid = process.pid()
      val os = System.getProperty("os.name").toLowerCase
      if (os.contains("win")) {
        new ProcessBuilder("taskkill", "/PID", pid.toString, "/T", "/F")
          .inheritIO()
          .start()
          .waitFor()
      } else {
        new ProcessBuilder("kill", "-9", s"-$pid")
          .inheritIO()
          .start()
          .waitFor()
      }
    } catch {
      case e: Exception => logger.error("Failed to kill process tree", e)
    }
  }

  @PreDestroy
  def destroy(): Unit = {
    try {
      if (ssrProcess.isAlive) {
        logger.info("Destroying NodeJS SSR process tree...")
        killProcessTree(ssrProcess)
      }
    } catch {
      case e: Exception => logger.error("Failed to destroy NodeJS SSR process", e)
    }
    try {
      if (webpackProcess != null && webpackProcess.isAlive) {
        logger.info("Destroying NodeJS Webpack process tree...")
        killProcessTree(webpackProcess)
      }
    } catch {
      case e: Exception => logger.error("Failed to destroy NodeJS Webpack process", e)
    }
  }

}
