package com.anjunar.security

trait SecurityCredential {
  
  def hasRole(name : String) : Boolean

  def user : SecurityUser
  
}
