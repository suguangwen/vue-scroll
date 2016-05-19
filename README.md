# vue-scroll
vue scroll which can work.


借鉴于ElemeFE/vue-infinite-scroll．
重新设计了核心算法．
将持续更新和添加与滚动有关的效果


＠TODO 增加环境与测试用例．

# 安装//Install

```npm
npm install vue_scroll --save
```

###ES6

```JavaScript
import vue_scroll from 'vue_scroll'
Vue.use(vue_scroll)
```

###CommonJS

```JavaScript
var vue_scroll =  require('vue_scroll');
Vue.use(vue_scroll)
```

###直接引用//Direct include

```JavaScript
<script src="../node_modules/vue_scroll/vue_scroll.js"></script>
```

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
         //当滚动条距离底部高度小于或等于你在scroll-foot设置的高度时将运行一次此函数
         //if scrollFoot height <= scroll-foot , function run.
        for (var i = this.a.length; i < this.b.length; i++) {
          this.a.push(this.b[i])
          if (i % 6 === 5) {
            break
          }
        }
      },
      up: function () {
        //当滚动条距离顶部高度小于或等于你在scroll-top设置的高度时将运行一次此函数
        //if scrollTop height <= scroll-top , function run.
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
| scroll-foot | 数字(默认为０)：设定滚动条距离底部的高度．// Number(default = 0)：Set the height of the scroll bar at the bottom of the distance. |
| scroll-top | 数字(默认为０)：设定滚动条距离顶部的距离．// Number(default = 0)：Set the height of the scroll bar at the top of the distance. |
| scroll-up | 设定滚动条往上回滚时触发的函数．// When setting a scroll bar to rollback trigger function. |
| scroll-initialize | 布尔(默认为false)：设定为true时将在页面加载完成后触发一次v-scroll设定的函数．// Boolean(default = false)：After completion of the page load when set to true will trigger a v-scroll set function. |

# License

MIT