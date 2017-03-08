# 本文介绍: 应用语言环境的判断

>使用 `app.getLocale()` 接收返回语言环境值

Electron 通过 Chromium的 `l10n_util` 库获取应用的语言环境。
以下是语言列表:

|语言代码|语言名称|
|---------------|---------------|
| af |南非荷兰人|
| an |阿拉贡|
| ar-AE |阿拉伯语（U.A.E.）|
| ar-IQ |阿拉伯语（伊拉克）|
| ar |阿拉伯语（标准）|
| ar-BH |阿拉伯语（巴林）|
| ar-DZ |阿拉伯语（阿尔及利亚）|
| ar-EG |阿拉伯语（埃及）|
| ar-JO |阿拉伯语（约旦）
| ar-KW |阿拉伯语（科威特）|
| ar-LB |阿拉伯语（黎巴嫩）|
| ar-LY |阿拉伯语（利比亚）|
| ar-MA |阿拉伯语（摩洛哥）|
| ar-OM |阿拉伯语（阿曼）|
| ar-QA |阿拉伯语（卡塔尔）|
| ar-SA |阿拉伯语（沙特阿拉伯）|
| ar-SY |阿拉伯语（叙利亚）|
| ar-TN |阿拉伯语（突尼斯）|
| ar-YE |阿拉伯语（也门）|
| as | Assamese |
| ast |阿斯图里亚斯|
| az |阿塞拜疆|
| be |白俄罗斯|
| bg |保加利亚语|
| bg |保加利亚语|
| bn |孟加拉语
| br |布雷顿|
| bs |波斯尼亚|
| ca |加泰罗尼亚语|
| ce |车臣|
| ch | Chamorro |
| co |科西嘉|
| cr | Cree |
| cs |捷克|
| cv | Chuvash |
| da |丹麦语|
| de |德语（标准）|
| de-AT |德语（奥地利）|
| de-CH |德语（瑞士）|
| de-DE |德语（德国）|
| de-LI |德语（列支敦士登）|
| de-LU |德语（卢森堡）|
| el |希腊语|
| en-AU |英语（澳大利亚）|
| en-BZ |英语（伯利兹）|
| en |英语|
| en-CA |英语（加拿大）|
| en-GB |英语（英国）|
| en-IE |英语（爱尔兰）|
| en-JM |英语（牙买加）|
| en-NZ |英语（新西兰）|
| en-PH |英语（菲律宾）|
| en-TT |英语（特立尼达和多巴哥）|
| en-US |英语（美国）|
| en-ZA |英语（南非）|
| en-ZW |英语（津巴布韦）|
| eo |世界语|
et | 爱沙尼亚语|
| eu |巴斯克语|
| fa |波斯|
| fa | Farsi |
| fa-IR |波斯语/伊朗|
| fi |芬兰语|
| fj |斐济|
| fo | Faeroese |
| fr-CH |法语（瑞士）|
| fr-FR |法语（法国）|
| fr-LU |法语（卢森堡）|
| fr-MC |法语（摩纳哥）|
| fr |法语（标准）|
| fr-BE |法语（比利时）|
| fr-CA |法语（加拿大）|
| fur | Friulian |
| fy | Frisian |
| ga |爱尔兰|
| gd-IE |盖尔语（爱尔兰）|
| gd |盖尔语（苏格兰）|
| gl | Galacian |
| gu | Gujurati |
| he |希伯来语
| hi |印地语|
| hr |克罗地亚语|
| ht |海地|
| hu |匈牙利语|
| hy |亚美尼亚|
| id |印度尼西亚|
| is |冰岛|
| it-CH |意大利语（瑞士）|
| it |意大利语（标准）|
| iu | 伊努伊特语 |
| ja |日语|
| ka |格鲁吉亚|
| kk |哈萨克斯坦
| km |高棉|
| kn | 埃纳德语 |
| ko |韩语|
| ko-KP |韩国（朝鲜）|
| ko-KR |韩国（韩国）|
| ks |克什米尔|
| ky | Kirghiz |
| la |拉丁语
| lb |卢森堡|
| lt |立陶宛语|
| lv |拉脱维亚语|
| mi |毛利|
| mk |马其顿|
| ml |马拉雅拉姆|
| mo |摩尔多瓦|
| mr |马拉泰|
| ms |马来西亚|
| mt |马耳他语
| my |缅甸|
| nb |挪威语（Bokmal）|
| ne |尼泊尔语
| ng | Ndonga |
| nl |荷兰语（标准）|
| nl-BE |荷兰语（比利时）|
| nn |挪威语（Nynorsk）|
| no |挪威语|
| nv | Navajo |
| oc | Occitan |
| om | Oromo |
| or | Oriya |
| sq |阿尔巴尼亚语|
| tlh | Klingon |
| zh-TW |中国（台湾）|
| zh |中文|
| zh-CN |中国（PRC）|
| zh-HK |中国（香港）|
| zh-SG |中文（新加坡）|












