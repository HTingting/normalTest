
document.write("<script charset='UTF-8' type='text/javascript' src='./js/core.js'></script>");
document.write("<script charset='UTF-8' type='text/javascript' src='./js/md5.js'></script>");


function jiami(params) {
    var timestamp = Math.round(new Date().getTime() / 1000).toString();
    //通过request.data获取body的内容，这个是postman内置变量
    // var param = request.data;
    // request.data["sn"] = timestamp;
    // params = Object.assign({}, params, { sn: timestamp, appid: "61cf2aee74f285263a881b2a05eb25c5"})
    params['sn'] = timestamp;
    params['app_id'] = "20015";
    var appSecret = "khE7tFY6543dd54UTSwws160O8I7utcbrRtteffdffdf";
    // var sign = md5Sign(params, appSecret);
    var signStr = sign(params, appSecret);
    params["_sign"] = signStr;
    // var result = params = Object.assign({}, params, { _sign: signStr })
    var result = params;
    // console.log("results" + JSON.stringify(result));
    var formData = new FormData();
    for (let key in result) {
        // console.log(key)
        // console.log(result[key])
        formData.append(key, result[key])
    }
    return result;
}

function sign(data, appSecret) {
    var SORT_STRING;
    var signData = ksort(data, "");
    if (typeof data.sign != "undefined" && data.sign !== null) {
        delete signData.sign;
    }

    var signStr = createLinkstring(signData);
    var m5 = CryptoJS.MD5(signStr).toString();
    var signs = CryptoJS.MD5(m5.toUpperCase() + appSecret)
        .toString()
        .toUpperCase();

    return signs;
}

function createLinkstring(params) {
    var signStr = "";
    for (var k in params) {
        if (params[k] === null) return false;
        if (typeof params[k] == "boolean") params[k] = params[k] ? 1 : 0;
        signStr +=
            k +
            (Array.isArray(params[k]) ? createLinkstring(params[k]) : params[k]);
    }
    return signStr;
}
//排序
function ksort(inputArr, sort_flags) {
    var tmp_arr = {},
        keys = [],
        sorter,
        i,
        k,
        that = this,
        strictForIn = false,
        populateArr = {};

    switch (sort_flags) {
        case "SORT_STRING":
            // compare items as strings
            sorter = function (a, b) {
                return that.strnatcmp(a, b);
            };
            break;
        case "SORT_LOCALE_STRING":
            // compare items as strings, original by the current locale (set with  i18n_loc_set_default() as of PHP6)
            var loc = this.i18n_loc_get_default();
            sorter = this.php_js.i18nLocales[loc].sorting;
            break;
        case "SORT_NUMERIC":
            // compare items numerically
            sorter = function (a, b) {
                return a + 0 - (b + 0);
            };
            break;
        // case 'SORT_REGULAR': // compare items normally (don't change types)
        default:
            sorter = function (a, b) {
                var aFloat = parseFloat(a),
                    bFloat = parseFloat(b),
                    aNumeric = aFloat + "" === a,
                    bNumeric = bFloat + "" === b;
                if (aNumeric && bNumeric) {
                    return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
                } else if (aNumeric && !bNumeric) {
                    return 1;
                } else if (!aNumeric && bNumeric) {
                    return -1;
                }
                return a > b ? 1 : a < b ? -1 : 0;
            };
            break;
    }

    // Make a list of key names
    for (k in inputArr) {
        if (inputArr.hasOwnProperty(k)) {
            keys.push(k);
        }
    }
    keys.sort(sorter);

    // BEGIN REDUNDANT
    var php_js = php_js || {};
    var php_js = { ini: {} }
    // END REDUNDANT
    strictForIn =
        php_js.ini["phpjs.strictForIn"] &&
        php_js.ini["phpjs.strictForIn"].local_value &&
        php_js.ini["phpjs.strictForIn"].local_value !== "off";
    populateArr = strictForIn ? inputArr : populateArr;

    // Rebuild array with sorted key names
    for (i = 0; i < keys.length; i++) {
        k = keys[i];
        tmp_arr[k] = inputArr[k];
        if (strictForIn) {
            delete inputArr[k];
        }
    }
    for (i in tmp_arr) {
        if (tmp_arr.hasOwnProperty(i)) {
            populateArr[i] = tmp_arr[i];
        }
    }

    return strictForIn || populateArr;
}
