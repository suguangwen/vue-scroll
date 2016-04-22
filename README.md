# vue-scroll
vue scroll which can work.


借鉴于ElemeFE/vue-infinite-scroll．
重新设计了核心算法．
将持续更新和添加与滚动有关的效果


＠TODO 增加环境与测试用例．

# 使用方法//Usage

Use v-scroll to enable the infinite scroll, and use scroll-* attributes to define its options.

使用v-scroll进行滚动翻页,使用 scroll- * 属性来定义它的选项。

```HTML
<div v-scroll="down()" scroll-foot="500" scroll-top="200" scroll-up="up()">

</div>
```

```JavaScript
  new Vue({
    el: 'body',
    data: function () {
      return {a: [], b: []}
    },
    methods: {
      down: function () {
         //当滚动条距离底部高度等于你在scroll-foot设置的高度时将运行一次此函数
         //if scrollTop = scroll-foot , function run.
        for (var i = this.a.length; i < this.b.length; i++) {
          this.a.push(this.b[i])
          if (i % 6 === 5) {
            break
          }
        }
      },
      up: function () {
        //当滚动条距离底部高度等于你在scroll-top设置的高度时将运行一次此函数
        //if scrollTop = scroll-top , function run.
      }
    },
    ready: function () {
      //滚动翻页实例（请按照自己的需要去修改）
      //scroll the instance.
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

| scroll/Option | Description |
| ----- | ----- |
| scroll-foot | 设定滚动条距离底部的高度．// Set the height of the scroll bar at the bottom of the distance. |
| scroll-top | 设定滚动条距离顶部的距离．// Set the height of the scroll bar at the top of the distance. |
| scroll-up | 设定滚动条往上回滚时触发的函数．// When setting a scroll bar to rollback trigger function. |
| scroll-initialize | 设定为true时将在页面加载完成后触发一次v-scroll设定的函数．// After completion of the page load when set to true will trigger a v-scroll set function. |

# License

MIT