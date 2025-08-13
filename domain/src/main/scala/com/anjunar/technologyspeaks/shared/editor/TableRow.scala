package com.anjunar.technologyspeaks.shared.editor

import jakarta.persistence.Entity

import java.util

case class TableRow(position : Position, children : util.List[Node]) extends ContainerNode
