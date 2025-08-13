package com.anjunar.olama

import jakarta.ws.rs.{Consumes, POST, Path, Produces}

@Path("api")
trait OLlamaResource {

  @Path("generate")
  @POST
  @Produces(Array("application/json"))
  @Consumes(Array("application/json"))
  def generate(request : GenerateRequest) : GenerateResponse

  @Path("chat")
  @POST
  @Produces(Array("application/json"))
  @Consumes(Array("application/json"))
  def chat(request : ChatRequest) : ChatResponse

  @Path("embed")
  @POST
  @Produces(Array("application/json"))
  @Consumes(Array("application/json"))
  def generateEmbeddings(request : EmbeddingRequest): EmbeddingResponse

}
