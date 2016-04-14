(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : (factory((global.infiniteScroll = global.infiniteScroll || {})))
}(this, function (exports) {
  'use strict'
  var throttle = function throttle (fn, delay) {
    var now, lastExec, timer, context, args //eslint-disable-line

    var execute = function execute () {
      fn.apply(context, args)
      lastExec = now
    }

    return function () {
      context = this
      args = arguments

      now = Date.now()

      if (timer) {
        clearTimeout(timer)
        timer = null
      }

      if (lastExec) {
        var diff = delay - (now - lastExec)
        if (diff < 0) {
          execute()
        } else {
          timer = setTimeout(function () {
            execute()
          }, diff)
        }
      } else {
        execute()
      }
    }
  }

  var getScrollTop = function getScrollTop () {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    return scrollTop
  }

  var getComputedStyle = document.defaultView.getComputedStyle

  var getScrollEventTarget = function getScrollEventTarget (element) {
    var currentNode = element
    while (currentNode && currentNode.tagName !== 'HTML' && currentNode.nodeType === 1) {
      var overflowY = getComputedStyle(currentNode).overflowY
      if (overflowY === 'scroll' || overflowY === 'auto') {
        return currentNode
      }
      currentNode = currentNode.parentNode
    }
    return window
  }

  var getVisibleHeight = function getVisibleHeight () {
    return document.documentElement.clientHeight
  }

  var getScrollHeight = function getScrollHeight () {
    return document.documentElement.scrollHeight
  }

  var isAttached = function isAttached (element) {
    var currentNode = element.parentNode
    while (currentNode) {
      if (currentNode.tagName === 'HTML') {
        return true
      }
      if (currentNode.nodeType === 11) {
        return false
      }
      currentNode = currentNode.parentNode
    }
    return false
  }



  var infiniteScroll = {
    doBind: function doBind () {
      if (this.binded) return // eslint-disable-line
      this.binded = true

      var directive = this
      var element = directive.el

      directive.scrollEventTarget = getScrollEventTarget(element)
      directive.scrollListener = throttle(directive.doCheck.bind(directive), 200)
      directive.scrollEventTarget.addEventListener('scroll', directive.scrollListener)

      var viewportFootExpr = element.getAttribute('infinite-scroll-foot')
      var viewportFoot = 0
      if (viewportFootExpr) {
        viewportFoot = Number(directive.vm.$get(viewportFootExpr))
        if (isNaN(viewportFoot)) {
          viewportFoot = 0
        }
      }
      directive.viewportFoot = viewportFoot

      var viewportWaterfallExpr = element.getAttribute('infinite-waterfall')
      var Waterfall = false
      if (viewportWaterfallExpr) {
        Waterfall = Boolean(directive.vm.$get(viewportWaterfallExpr))
      }
      directive.Waterfall = Waterfall

      var immediateCheckExpr = element.getAttribute('infinite-scroll-immediate-check')
      var immediateCheck = true
      if (immediateCheckExpr) {
        immediateCheck = Boolean(directive.vm.$get(immediateCheckExpr))
      }
      directive.immediateCheck = immediateCheck

      if (immediateCheck) {
        directive.doCheck()
      }

    },

    doCheck: function doCheck (force) {
      var scrollEventTarget = this.scrollEventTarget
      var element = this.el
      var viewportFoot = .viewportFoot
      var viewportWaterfall = this.Waterfall
      if (force !== true && this.disabled) return //eslint-disable-line
      var shouldTrigger = false
      if (scrollEventTarget === element) {
        shouldTrigger = getVisibleHeight() + getScrollTop() + viewportFoot <= getScrollHeight()
      } else {
        shouldTrigger = getVisibleHeight() + getScrollTop() + viewportFoot >= getScrollHeight()
      }

      if (shouldTrigger && this.expression) {
        this.vm.$get(this.expression)
      }

      if(viewportWaterfall) {
      }
    },

    bind: function bind () {
      var directive = this
      var element = this.el

      directive.vm.$on('hook:ready', function () {
        if (isAttached(element)) {
          directive.doBind()
        }
      })

      this.bindTryCount = 0

      var tryBind = function tryBind () {
        if (directive.bindTryCount > 10) return //eslint-disable-line
        directive.bindTryCount++
        if (isAttached(element)) {
          directive.doBind()
        } else {
          setTimeout(tryBind, 50)
        }
      }

      tryBind()
    },

    unbind: function unbind () {
      this.scrollEventTarget.removeEventListener('scroll', this.scrollListener)
    }
  }

  if (window.Vue) {
    window.infiniteScroll = infiniteScroll
    Vue.use(install)
  }

  function install (Vue) {
    Vue.directive('infiniteScroll', infiniteScroll)
  }

  exports.install = install
  exports.infiniteScroll = infiniteScroll

}))
