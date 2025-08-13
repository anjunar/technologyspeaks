package com.anjunar.technologyspeaks.chat

import com.anjunar.olama.{ChatMessage, ChatRequest, ChatRole, EmbeddingRequest, GenerateRequest, OLlamaService, RequestOptions}
import com.anjunar.technologyspeaks.document.Document
import com.typesafe.scalalogging.Logger
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional

import java.util.concurrent.BlockingQueue
import java.util.concurrent.atomic.AtomicBoolean
import scala.compiletime.uninitialized
import scala.jdk.CollectionConverters.*

@ApplicationScoped
class ChatService {

  val log: Logger = Logger[ChatService]

  @Inject
  var syncService: OLlamaService = uninitialized

  @Transactional
  def chat(text: String, queue: BlockingQueue[String], canceled : AtomicBoolean): Unit = {

    val inputVector = syncService.generateEmbeddings(EmbeddingRequest(input = text))

    val memoryShortTerm = MemoryEntry.findLatest10()
    val memoryLongTerm = MemoryEntry.findSimilar(inputVector)

    val memory = (memoryShortTerm.asScala.toSet ++ memoryLongTerm.asScala.toSet).toList.sortBy(entry => entry.created)

    val session = memory.flatMap(item => Seq(ChatMessage(content = item.question), ChatMessage(content = item.answer, role = ChatRole.ASSISTANT)))

    val documents = Document.findTop5(inputVector)
      .asScala
      .map(document => ChatMessage(content = document.editor.toText(), role = ChatRole.ASSISTANT))
      .toSeq
    /*
        val bias = Source.fromResource("bias.txt")
          .getLines()
          .filter(line => line.trim.nonEmpty)
          .map(line => ChatMessage(content = "Memory: " + line, role = ChatRole.SYSTEM))
          .toSeq
    */

    val messages = documents ++ session ++ Seq(ChatMessage(content = text))

    val tokenSize = messages.map((entry: ChatMessage) => entry.tokenSize).sum

    if (tokenSize > 8192) {
      throw new RuntimeException("Token size is too large")
    } else {
      log.info(s"Token size: $tokenSize")
    }

    val request = ChatRequest(messages = messages, options = RequestOptions(num_ctx = 8192, temperature = 0.3f))

    var buffer = ""

    syncService.chat(request, text => {
      buffer += text
      queue.offer(text)
    }, canceled)

    if (! canceled.get()) {
      val systemPrompt =
        """You are responsible for creating memory memoryShortTerm. For every user interaction, summarize the user input and the
          |assistant's response into a single memory entry.
          |Preserve the original language of both the user input and the response.
          |Focus on core meaning and long-term relevance.
          |Respond only with the summary, no extra text or emojis.
          |
          |Format:
          |Summary capturing the essence of the user input and the assistant's response in their original language.""".stripMargin


      val promptText =
        s"""
           |User input: $text
           |Assistant response: $buffer
           |
           |Summary:""".stripMargin

      val response = syncService.generate(GenerateRequest(prompt = promptText, system = systemPrompt))

      val embeddingResponse = syncService.generateEmbeddings(EmbeddingRequest(input = response))

      MemoryEntry(response, text, buffer, embeddingResponse)
        .saveOrUpdate()
    }

    queue.offer("!Done!")

  }

}
