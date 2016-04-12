# vue-rolling
vue infinite scroll which can work.


借鉴于ElemeFE/vue-infinite-scroll．
重新设计了核心算法．
将持续更新和添加与滚动有关的效果


＠TODO 增加环境与测试用例．

# 使用方法//Usage

Use v-infinite-scroll to enable the infinite scroll, and use infinite-scroll-* attributes to define its options.

使用v-infinite-scroll进行无限滚动翻页,使用 infinite-scroll- * 属性来定义它的选项。

```HTML
<div v-infinite-scroll="loadMore()" infinite-scroll-foot="500">

</div>
```

```JavaScript
  var app = document.querySelector('.app')
  new Vue({
    el: 'body',
    data: function () {
      return {busy: false, a: [], b: []}
    },
    methods: {
      loadMore: function () {
         //当滚动条距离底部高度等于你在infinite-scroll-foot设置的高度时将运行一次此函数
         //if scrollTop = infinite-scroll-foot , function run.
        this.busy = true

        for (var i = this.a.length; i < this.b.length; i++) {
          this.a.push(this.b[i])
          if (i % 6 === 5) {
            break
          }
        }
        this.busy = false
      }
    },
    ready: function () {
      //无限滚动翻页实例（请按照自己的需要去修改）
      //infinite-scroll the instance.
      $.ajax({
          url: '#',
          type: 'get',
          success: function (res) {
            if (res.status === 200) {
              // 初始化数据 先获取所有数据并初始化前６条
              //Initialize the data,get 0-6 data of the array.
              this.$set('b', res.data)
              for (var i = 0; i < 6; i++) {
                this.a.push(this.b[i])
              }
            }
          }
        })
    }
  })
```

# 选项//Options

| infinite-scroll/Option | Description |
| ----- | ----- |
| infinite-scroll-foot | 设定滚动条距离底部的高度．// Set the height of the scroll bar at the bottom of the distance. |

# License

MIT