package com.anjunar.security

trait IdentityContext {
  def getPrincipal: SecurityCredential
}
