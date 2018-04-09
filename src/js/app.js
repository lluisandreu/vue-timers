window.addEventListener('DOMContentLoaded', function () {
    var Vue = require('vue');

    new Vue({
	  el: "#app",
	  data: {
	  	timers: [],
	  },
	  created: function() {
	  	for (var i = 0; i < 4; i++) {
	  		this.timers.push({
		  		times: [],
			    animateFrame: 0,
			    nowTime: 0,
			    diffTime: 0,
			    startTime: 0,
			    isRunning: false,
			    limit: 0,
			    ended: false,
	  		});
	  	};
	  },
	  watch: {
	  	timers:  {
	  		handler: function(timer) {
	  			for (var i = 0; i < timer.length; i++) {
	  				if(timer[i].isRunning) {
	  					if((timer[i].nowTime - timer[i].startTime) > timer[i].limit) {
	  						timer[i].ended = true;
	  						this.stopTimer(i);
	  						timer[i].diffTime = timer[i].limit;
	  					}
	  				}
	  			};
	  		}, 
	  		deep: true
	  	},
	  },
	  methods: {
	    start: function(timer,min) {
	    	this.timers[timer].ended = false;
	    	if(this.timers[timer].isRunning) {
	    		this.stopTimer(timer);
	    	}
	    	if(min != 0) {
	    		this.timers[timer].limit = min * 60 * 1000;
	    	} else {
	    		this.timers[timer].limit = 1800000;
	    	}
	    	this.timers[timer].startTime = 0;
	    	this.startTimer(timer);
	    },
	    startAll: function(min) {
	    	for (var i = 0; i < this.timers.length; i++) {
	    		this.start(i,min);
	    	};
	    },
	    setSubtractStartTime: function (timer, time) {
	      var time = typeof time !== 'undefined' ? time : 0;
	      this.timers[timer].startTime = Math.floor(performance.now() - time);
	    },
	    // タイマーをスタートさせる
	    startTimer: function (timer) {
	      // loop()内で this の値が変更されるので退避
	      var vm = this.timers[timer];
	      this.setSubtractStartTime(timer, vm.diffTime);
	      // ループ処理
	      (function loop(){
	        vm.nowTime = Math.floor(performance.now());
	        vm.diffTime = vm.nowTime - vm.startTime;
	        vm.animateFrame = requestAnimationFrame(loop);
	      }());
	      vm.isRunning = true;
	    },
	    stopTimer: function (timer) {
	      this.timers[timer].isRunning = false;
	      cancelAnimationFrame(this.timers[timer].animateFrame);
	    },
	    stopAll: function() {
	    	for (var i = 0; i < this.timers.length; i++) {
	    		this.stopTimer(i);
	    	};
	    },
	    pushTime: function (timer) {
	    	var t = this.timers[timer];
	      	t.times.push({
		        hours: this.hours(timer),
		        minutes: this.minutes(timer),
		        seconds: this.seconds(timer),
		        milliSeconds: this.milliSeconds(timer)
	      	});
	    },
	    clear: function (timer) {
	   		var t = this.timers[timer];
	   		t.ended = false;
	      	t.startTime = 0;
	      	t.nowTime = 0;
	      	t.diffTime = 0;
	      	t.times = [];
	     	this.stopTimer(timer);
	      	t.animateFrame = 0;
	    },
	    clearAll: function() {
	    	for (var i = 0; i < this.timers.length; i++) {
	    		this.clear(i);
	    	};
	    },
	    hours: function (timer) {
	      return Math.floor(this.timers[timer].diffTime / 1000 / 60 / 60);
	    },
	    minutes: function (timer) {
	      return Math.floor(this.timers[timer].diffTime / 1000 / 60) % 60;
	    },
	    seconds: function (timer) {
	      return Math.floor(this.timers[timer].diffTime / 1000) % 60;
	    },
	    milliSeconds: function (timer) {
	      return Math.floor(this.timers[timer].diffTime % 1000);
	    }
	  },
	  filters: {
	    // ゼロ埋めフィルタ 引数に桁数を入力する
	    // ※ String.prototype.padStart() は IEじゃ使えない
	    zeroPad: function(value, num){
	      var num = typeof num !== 'undefined' ? num : 2;
	      return value.toString().padStart(num,"0");
	    }
	  }
	});
});