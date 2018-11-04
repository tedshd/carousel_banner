# carousel_banner

滑動式 Banner 套件

## Feature

* 不依賴任何 JavaScript 函式庫

* 支持 SSR & API 的資料來源

* 支持桌面裝置與行動裝置

* 支援多個 Banner 顯示(不用擔心太多時的記憶體問題, DOM UI 有回收)

* 有漸變、隨機、滑動的呈現方式

* 可以設定任意寬高或滿版

* 滿版的寬度支持行動裝置轉動自適應寬度

* 可以自定義 data attribute 處理 event callback

* 向下相容? 2018 年了誰管這個東西拉

## Usage

引入 `carousel_banner.css` 和 `carousel_banner.js`

Basic usage

```HTML
<div class="carousel_banner">
    <a href="" class="carousel_banner_content b_2" data-ga="mktPromote" data-label="a2" data-action="click" data-category="b"><img src="https://tedshd.io/image/banner_2@1x.jpg" srcset="https://tedshd.io/image/banner_2@2x.jpg 2x" alt=""></a>
    <a href="" class="carousel_banner_content b_3" data-ga="mktPromote" data-label="a3" data-action="click" data-category="b"><img src="https://tedshd.io/image/banner_3@1x.jpg" srcset="https://tedshd.io/image/banner_3@2x.jpg 2x" alt=""></a>
</div>
```

```JavaScript
var option = {
    select: document.querySelector('.carousel_banner'),
    time: 2000,
    width: '300px',
    height: '100px',
    type: 'fade',
    dot: false,
    domEvent: function (data) {
        var dom = data.dom;
        dom.addEventListener('click', function (e) {
            e.preventDefault();
            console.log(data);
        });
    }
};
var banner = new carouselBanner(option);
banner.init();
```


## Arguments

|key|type|required|description|example|
|---|---|---|---|---|
| select         | DOM      | required | banner container                        | document.querySelector('#banner') |
| dataFeed       | Array    | option   | API data feed                           | see data format                   |
| time           | Number   | option   | fade or slide action time(milliseconds) | 2000                              |
| width          | String   | option   | banner width                            | '300px'                           |
| height         | String   | option   | banner height                           | '100px'                           |
| type           | String   | required | transition type                         | 'fade', 'random', 'slide'         |
| dot            | Boolean  | option   | dot show current banner                 | true, false                       |
| domEvent       | Function | option   | handle dom callback                     | see example                       |
| bannerCallback | Function | option   | handle current banner show callback     | see example                       |

* dataFeed format

```JavaScript
[
    {
        'node': 'a',
        'attributes': {
            'href': '',
            'className': '',
            'dataset': {},
            'target': '',
        },
        'children': {
            'node': 'img',
            'attributes': {
                'src': '',
                'srcset': '',
                'className': ''
            },
        }
    }
]
```

* Example

```JavaScript
var optionB = {
    select: document.querySelector('.carousel_banner_fd'),
    dataFeed: dataArray,
    time: 2000,
    width: '300px',
    height: '100px',
    type: 'slide',
    dot: true,
    bannerCallback: function (data) {
        console.log(data);
    },
    domEvent: function (data) {
        var dom = data.dom;
        dom.addEventListener('click', function (e) {
            e.preventDefault();
            console.log(data);
            // ga(data.ga + '.send', 'event', data.category, data.action, data.label, {nonInteraction:true});
        });
    }
};
var bannerB = new carouselBanner(optionB);
bannerB.init();
```

## method

* init()

產生 banner

* resize([width], [height])

可以重新設定寬高, 一定得用在呼叫 init() 之後

|key|type|required|description|example|
|---|---|---|---|---|
| width  | String | option | resize banner width  | '600px' |
| height | String | option | resize banner height | '200px' |

