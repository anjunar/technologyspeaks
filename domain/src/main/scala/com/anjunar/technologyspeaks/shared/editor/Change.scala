package com.anjunar.technologyspeaks.shared.editor

import com.anjunar.scala.mapper.annotations.PropertyDescriptor
import com.github.gumtreediff.actions.model.{Action, Delete, Insert, Move, Update}
import com.github.gumtreediff.tree.Tree
import difflib.Delta.TYPE
import difflib.DiffUtils
import org.apache.commons.text.diff.{CommandVisitor, StringsComparator}

import scala.beans.BeanProperty
import scala.compiletime.uninitialized
import java.util
import scala.jdk.CollectionConverters.*
import scala.collection.immutable.List
import scala.collection.mutable.ListBuffer

class Change {
  
  @PropertyDescriptor(title = "Action")
  var action: String = uninitialized

  @PropertyDescriptor(title = "Type")
  var nodeType: String = uninitialized

  @PropertyDescriptor(title = "Old Value")
  var oldValue: String = uninitialized

  @PropertyDescriptor(title = "New Value")
  var newValue: String = uninitialized

  @PropertyDescriptor(title = "Value")
  var value: String = uninitialized

  @PropertyDescriptor(title = "Offset")
  var offset: Int = uninitialized

}

object Change {
  
  def apply(action: String , nodeType: String, oldValue: String = null, newValue: String = null, value: String = null,  offset: Int) : Change = {
    val change = new Change
    change.action = action
    change.nodeType = action
    change.oldValue = oldValue
    change.newValue = newValue
    change.value = value
    change.offset = offset
    change
  }

  def createChanges(position : Int, oldText: String, newText: String): List[Change] = {
    val oldList = oldText.toCharArray.map(_.toString).toList.asJava
    val newList = newText.toCharArray.map(_.toString).toList.asJava

    val patch = DiffUtils.diff(oldList, newList)
    patch.getDeltas.asScala.map { delta =>
      val offset = delta.getOriginal.getPosition
      delta.getType match {
        case TYPE.INSERT =>
          Change("insert", "text", value = delta.getRevised.getLines.asScala.mkString(""), offset = position + offset)
        case TYPE.DELETE =>
          Change("delete", "text", value = delta.getOriginal.getLines.asScala.mkString(""), offset = position + offset)
        case TYPE.CHANGE =>
          Change("update", "text",
            oldValue = delta.getOriginal.getLines.asScala.mkString(""),
            newValue = delta.getRevised.getLines.asScala.mkString(""),
            offset = position + offset)
      }
    }.toList
  }

  def extractChanges(editScript: util.List[Action]): util.List[Change] = {
    editScript.asScala.toList.flatMap {
      case ins: Insert =>
        List(Change("insert", ins.getNode.getType.name, value = ins.getNode.getLabel, offset = ins.getNode.getParent.getPos))
      case del: Delete =>
        List(Change("delete", del.getNode.getType.name, value = del.getNode.getLabel, offset = del.getNode.getParent.getPos))
      case upd: Update =>
        createChanges(upd.getNode.getParent.getPos, upd.getNode.getLabel, upd.getValue)
      case mov: Move =>
        List(Change("move", mov.getNode.getType.name, value = mov.getNode.getLabel, offset = mov.getNode.getParent.getPos))
    }.asJava
  }

}
