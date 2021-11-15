 (function(angular) {
  'use strict';
/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('socket', [])

.factory('$socket',
($rootScope)=>{
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    },
		request:function(strScript,fn){
		  var eventName = "request"
			this.emit(eventName,strScript,fn)
      if(fn)
        this.on(eventName,fn)
		},
		// define requet and respon 
    onEmit : (eventName,$get) => {
      var self = this
      this.on(eventName,(data)=>{
        var r = $get(data)
        //answer
        self.emit(eventName,r)
      })
    },
    emitOn:(eventName,$send,$get)=>{
      var self = this
      self.on(eventName,(d)=>{
        $get && $get(d)
      })
      self.emit(eventName,$send)
    }
  };
})

  
})(window.angular);
