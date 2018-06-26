//数据格式
//日期一定是4-2-2的结构
const lost = {
    provider_id: 1,
    name: "陈文彬",
    gender: 1,
    birthday: "1998-01-14",
    person_location: "C10",
    contact: 13416349304,
    contact_name: "陈文彬",
    last_location: "华工C12",
    since: "2018-05-26",
    description: "此男拿外卖不慎走丢",
}
//上传,查询,修改一致,不过查询和修改要增加一条lost_id的属性
//查询是lost_id不是必需的,修改时是必需的,如果想要删除某一条信息把对应上传的lost_id乘上-1

const clue = {
    provider_id: 1,
    location: "京东",
    gender: 1,
    description: "此男原来去拿快递了",
    data: "2018-05-26",
    contact: 13416349304,
    contact_name: "陈先生"
}
//和上述一致，将lost_id改成clue_id

//在上传成功后，客户端会收到一个数字,这个数字是对应失踪(线索)的id,使用该id进行后续图片的上传

const image = {
    image: "这里是图片",
    which: "clue", //这里是上传lost的图就填"lost"
    info_id: 1, //这里填对应的信息的id
    image_id: 1 //上传新图片时不用填这个属性
}
//如果要获得或删除图片,不用设置image属性或者设置为undefined
//如果删除一个信息里面的所有图片就只填写info_id,如果删除具体某张图片就只填写image_id

//返回的图片是base64编码的
//所有的返回信息都是在一个数组里面,就算知道只有一条也要加[0]