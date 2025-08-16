package com.anjunar.technologyspeaks

import com.anjunar.technologyspeaks.control.User
import com.anjunar.vertx.fsm.services.DefaultFSMService
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class ApplicationService extends DefaultFSMService[Application] {
  
  def run(callback : Application => Unit): Unit = {
    
    val application = new Application
    
    val user = new User
    user.nickName = "Guest"
    
    application.user = user
    
    callback(application)
    
  }

}
