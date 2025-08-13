package com.anjunar.olama

case class EmbeddingRequest(model: String = "nomic-embed-text",
                            input: String,
                            options: RequestOptions = RequestOptions())