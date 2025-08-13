package com.anjunar.jaxrs.types

import com.anjunar.security.SecurityUser

trait OwnerProvider {
  def owner: SecurityUser
}
