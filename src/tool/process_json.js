//百度地图坐标转换为高德地图坐标
function bd_convert_gd(coordinate) {
    var bd_lng = coordinate[0];
    var bd_lat = coordinate[1];
    var pi = 3.14159265358979324 * 3000.0 / 180.0;
    var x = bd_lng - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * pi);
    var gd_lng = z * Math.cos(theta);
    var gd_lat = z * Math.sin(theta);
    return [gd_lng,gd_lat];
}
//JSONdata 为数组，将转换后的坐标放在JSON中每个对象position属性中
function processJSONData(JSONdata,lngName,latName){
    let coordinate = [];
    JSONdata.forEach(element => {
        coordinate = [element[lngName],element[latName]];
        element["position"] = bd_convert_gd(coordinate);
    });
    return JSONdata
}

export {
    processJSONData
}
