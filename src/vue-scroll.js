(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : (factory((global.Scroll = global.Scroll || {})))
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

  var getScrollTop = document.documentElement.scrollTop || document.body.scrollTop
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

  var Scroll = {
    doBind: function doBind () {
      if (this.binded) return // eslint-disable-line
      this.binded = true

      var directive = this
      var element = directive.el

      directive.scrollEventTarget = getScrollEventTarget(element)
      directive.scrollListener = throttle(directive.doCheck.bind(directive), 200)
      directive.scrollEventTarget.addEventListener('scroll', directive.scrollListener)

      var viewportTopExpr = element.getAttribute('scroll-top')
      var viewportTop = 0
      if (viewportTopExpr) {
        viewportTop = Number(directive.vm.$get(viewportTopExpr))
        if (isNaN(viewportTop)) {
          viewportTop = 0
        }
      }
      directive.viewportTop = viewportTop

      var viewportFootExpr = element.getAttribute('scroll-foot')
      var viewportFoot = 0
      if (viewportFootExpr) {
        viewportFoot = Number(directive.vm.$get(viewportFootExpr))
        if (isNaN(viewportFoot)) {
          viewportFoot = 0
        }
      }
      directive.viewportFoot = viewportFoot

      var viewportUpExpr = element.getAttribute('scroll-up')
      directive.viewportUpExpr = viewportUpExpr
      var initializeExpr = element.getAttribute('scroll-initialize')
      var initialize = false
      if (initializeExpr) {
        initialize = Boolean(directive.vm.$get(initializeExpr))
      }
      directive.initialize = initialize

      if (initialize) {
        directive.doCheck()
      }

    },

    doCheck: function doCheck (force) {
      var scrollEventTarget = this.scrollEventTarget
      var element = this.el
      var viewportFoot = this.viewportFoot
      var viewportTop = this.viewportTop
      if (force !== true && this.disabled) return //eslint-disable-line
      var downTrigger = false
      var Rolling = window.onscroll = function (direction) {
        var scroll = document.documentElement.scrollTop || document.body.scrollTop
        direction = false
        if (scroll > getScrollTop) {
          direction = false
          getScrollTop = scroll
          return direction
        } else {
          direction = true
          getScrollTop = scroll
          return direction
        }
      }
      if (Rolling() && viewportTop > getScrollTop) {
        this.vm.$get(this.viewportUpExpr)
      } else {
        if (scrollEventTarget === element) {
          downTrigger = getVisibleHeight() + getScrollTop + viewportFoot <= getScrollHeight()
        } else {
          downTrigger = getVisibleHeight() + getScrollTop + viewportFoot >= getScrollHeight()
        }
      }
      if (downTrigger && this.expression) {
        this.vm.$get(this.expression)
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
    window.Scroll = Scroll
    Vue.use(install)
  }

  function install (Vue) {
    Vue.directive('Scroll', Scroll)
  }

  exports.install = install
  exports.Scroll = Scroll

}))
