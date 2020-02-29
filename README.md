# wx-performance
微信小程序测速耗时管理SDK

> 使用此组件需要依赖小程序基础库 2.2.1 以上版本，同时依赖开发者工具的 npm 构建。具体详情可查阅[官方 npm 文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)。

## 说明
### 简化耗时管理和上报逻辑

小程序·测速系统开始内测。测速系统旨在帮助开发者简单方便的测速网络性能、渲染/加载性能等。 测速结果数据支持地域、运营商、系统、网络类型等关键维度交叉分析，支持分钟级数据实时查看。

微信只提供了`wx.reportPerformance(id, cost)`接口，具体的耗时计算需要业务方自己计算。一般情况下我们计算任务耗时都是通过打点的方式，比如：
```javascript
let t1 = new Date().getTime();
let pfmId = 1001;

// some sync task 
...

let cost = new Date().getTime() - t1;
if (wx.reportPerformance) {
	wx.reportPerformance(pfmId, cost);
}


// ============

let t2 = new Date().getTime();
let pfmId1 = 1002;

// some async task
setTimeout(() => {
	let cost = new Date().getTime() - t2;
	if (wx.reportPerformance) {
		wx.reportPerformance(pfmId1, cost);
	}
}, 100)

```
我们可以看到常规打点的方式代码比较繁琐：

1. 需要自己进行耗时计算
2. 变量多，增加维护成本
3. 接口兼容性处理

本SDK旨在提供一种更简单的方式进行耗时管理和上报，使用SDK后的代码：

```javascript
var Performance = require('wx-performance')
let pfmId = 1001;
let pfmId1 = 1002;

let record = Performance.startRecord(pfmId);
// some sync task 
...
record.finish();

// ============

let record1 = Performance.startRecord(pfmId1);

// some async task
setTimeout(() => {
	record1.finish();
}, 100)
```

```Performance.startRecord```接口返回一个有finish接口的对象，只需要在结束的地方执行就会进行耗时自动计算与上报。

### 防重复调用处理

有时我们会出现重复调用finish接口的场景，导致上报数据不准确，比如：我们需要计算页面第一次onShow的耗时，我们的代码可能如下：

```javascript
let pfmId = 1001;

Page({
	t1: null,
	
	onLoad() {
		this.t1 = new Date().getTime();
	},
	
	onShow() {
		let cost = new Date().getTime() - this.t1;
		wx.reportPerformance(pfmId, cost);
	}
})
```

而我们都知道onShow会被多次调用，比如从下一级页面返回当前页，就会导致上报异常数据。为了避免这种情况，finish接口做了防重复调用的处理。

```javascript
var Performance = require('wx-performance')
let pfmId = 1001;

Page({
	record: null,
	
	onLoad() {
		this.record = Performance.startRecord(pfmId);
	},
	
	onShow() {
    // finish接口只会上传第一次掉用的数据
		this.record.finish()
	}
})
```



## 安装

```bash
npm install --save wx-performance
```

## 使用

```javascript
var Performance = require('wx-performance')
let pfmId = 1001;

let record = Performance.startRecord(pfmId)
// some sync task 
...
record.finish()
```

