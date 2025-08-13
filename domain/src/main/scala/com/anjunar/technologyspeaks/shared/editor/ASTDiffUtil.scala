package com.anjunar.technologyspeaks.shared.editor

import com.github.gumtreediff.tree.{Tree, TreeContext, TypeSet}

object ASTDiffUtil {

  def decapitalize(s: String): String =
    if s.nonEmpty then s.head.toLower + s.tail else s

  def buildTreeContext(node: Node): TreeContext = {
    val context = new TreeContext()
    val root = buildSubTree(context, node)
    context.setRoot(root)
    context
  }

  private def buildSubTree(context: TreeContext, node: Node): Tree = {
    val treeNode = context.createTree(TypeSet.`type`(decapitalize(node.getClass.getSimpleName)))
    treeNode.setMetadata("node", node)
    treeNode.setPos(node.position.start.offset)

    node match {
      case image : Image =>
        val valueNode = context.createTree(TypeSet.`type`(decapitalize(image.getClass.getSimpleName)), s"![${image.alt}](${image.url})")
        treeNode.addChild(valueNode)
        treeNode.setMetadata("node", image)
        treeNode.setPos(image.position.start.offset)
      case text: TextNode =>
        if (text.value != null) {
          val valueNode = context.createTree(TypeSet.`type`(decapitalize(text.getClass.getSimpleName)), text.value)
          treeNode.addChild(valueNode)
          treeNode.setMetadata("node", text)
          treeNode.setPos(text.position.start.offset)
        }
      case container: ContainerNode =>
        container.children.forEach { child =>
          treeNode.addChild(buildSubTree(context, child))
        }
    }

    treeNode
  }

}
