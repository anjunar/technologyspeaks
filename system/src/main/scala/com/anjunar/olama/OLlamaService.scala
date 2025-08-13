package com.anjunar.olama

import com.anjunar.configuration.ObjectMapperContextResolver
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider
import jakarta.enterprise.context.ApplicationScoped
import jakarta.ws.rs.client.{Client, ClientBuilder, Entity, WebTarget}
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget

import java.io.InputStream
import java.util.concurrent.atomic.AtomicBoolean
import scala.io.BufferedSource
import scala.util.control.Breaks
import scala.util.control.Breaks.break

@ApplicationScoped
class OLlamaService extends Serializable {

  def generate(request: GenerateRequest): String = {
    val (client, webTarget) = createSyncClient()
    try {
      webTarget.proxy(classOf[OLlamaResource]).generate(request).response
    } finally {
      client.close()
    }
  }

  def chat(request: ChatRequest): String = {
    val (client, webTarget) = createSyncClient()
    try {
      webTarget.proxy(classOf[OLlamaResource]).chat(request).message.content
    } finally {
      client.close()
    }
  }

  def generateEmbeddings(request: EmbeddingRequest): Array[Float] = {
    val (client, webTarget) = createSyncClient()
    try {
      webTarget.proxy(classOf[OLlamaResource]).generateEmbeddings(request).embeddings.head
    } finally {
      client.close()
    }
  }

  def chat(request: ChatRequest, onData: String => Unit, canceled: AtomicBoolean): Unit = {
    val client = ClientBuilder.newClient
    try {
      val target = client.target("http://localhost:11434/api/chat")

      val (mapper: ObjectMapper, source: BufferedSource) = createAsyncClient(request, target)

      try {
        Breaks.breakable {
          for (line <- source.getLines()) {
            val chatResponse = mapper.readValue(line, classOf[ChatResponse])
            onData(chatResponse.message.content)
            if (chatResponse.done) break
            if (canceled.get()) break
          }
        }
      } finally {
        source.close()
      }
    } finally {
      client.close()
    }
  }

  def generate(request: GenerateRequest, onData: String => Unit, canceled: AtomicBoolean): Unit = {
    val client = ClientBuilder.newClient
    try {
      val target = client.target("http://localhost:11434/api/generate")

      val (mapper: ObjectMapper, source: BufferedSource) = createAsyncClient(request, target)

      try {
        Breaks.breakable {
          for (line <- source.getLines()) {
            val generateResponse = mapper.readValue(line, classOf[GenerateResponse])
            onData(generateResponse.response)
            if (generateResponse.done) break
            if (canceled.get()) break
          }
        }
      } finally {
        source.close()
      }
    } finally {
      client.close()
    }
  }

  private def createAsyncClient(request: AnyRef, target: WebTarget) = {
    val webTarget = target.asInstanceOf[ResteasyWebTarget]
    val resteasyJacksonProvider = new JacksonJsonProvider()
    val mapper = ObjectMapperContextResolver.objectMapper

    resteasyJacksonProvider.setMapper(mapper)
    webTarget.register(resteasyJacksonProvider)

    val response = target.request().post(Entity.json(request))
    val inputStream = response.readEntity(classOf[InputStream])
    val source = scala.io.Source.fromInputStream(inputStream)
    (mapper, source)
  }

  private def createSyncClient(): (Client, ResteasyWebTarget) = {
    val mapper = ObjectMapperContextResolver.objectMapper
    val resteasyJacksonProvider = new JacksonJsonProvider()
    resteasyJacksonProvider.setMapper(mapper)

    val client = ClientBuilder.newClient
    client.register(resteasyJacksonProvider)

    val target = client.target("http://localhost:11434")
      .asInstanceOf[ResteasyWebTarget]

    (client, target)
  }

}
