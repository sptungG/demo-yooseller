export const getTotalPage = (total: number, limit: number) => {
  let totalPage =
    total % limit === 0 ? (total - (total % limit)) / limit : (total - (total % limit)) / limit + 1;
  totalPage = Number.isNaN(Number(totalPage)) ? 0 : Number(totalPage);
  return totalPage === 0 ? 1 : totalPage;
};

export const bindParamsFilter = (filter: { [x: string]: any }) => {
  const params = Object.keys(filter)
    .filter((key) => filter[key] === false || filter[key] === 0 || !!filter[key])
    .map((key) => `${key}=${filter[key]}`);
  return params.join("&");
};

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat().format(Math.floor(value));
};

export const getTotalByDatakey = (arr: any[], datakey: any) => {
  return arr.reduce((currentValue, nextValue) => {
    return currentValue + nextValue[datakey];
  }, 0);
};

export const getRandomInt = (min = 100000, max = 999999) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const formatArrayStringify = (value: any) => JSON.stringify(value)?.replace(/\[|\]/g, "");

export const checkValidColor = (value: string) =>
  value ? /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(value.replace(/\s/g, "")) : false;

export const sorterByWords =
  <T extends Record<string, any>>(sorterKey: keyof T) =>
  (a: T, b: T) =>
    vietnameseSlug(a[sorterKey]) > vietnameseSlug(b[sorterKey])
      ? 1
      : vietnameseSlug(b[sorterKey]) > vietnameseSlug(a[sorterKey])
      ? -1
      : 0;

export const allCombinedCases = (arr: number[][], item: number[] = [], final: number[][] = []) => {
  const verifiedArr = arr.filter((e) => (e?.length || 0) > 0);
  if (verifiedArr.length === 0) return [];
  if (verifiedArr.length > 1) {
    verifiedArr[0]?.forEach((v) => allCombinedCases(verifiedArr.slice(1), [...item, v], final));
  } else {
    verifiedArr[0]?.forEach((v) => final.push([...item, v]));
  }
  return final;
};

export const toBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
export const returnFileSize = (number: number) => {
  if (number < 1000) {
    return `${number} bytes`;
  } else if (number >= 1000 && number < 1000000) {
    return `${(number / 1000).toFixed(1)} KB`;
  } else if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)} MB`;
  }
};

export const mappedAddressDetail = (address: any) => {
  return `${!!address?.toWardName ? address.toWardName + ", " : ""}${
    !!address?.toDistrictName ? address.toDistrictName + ", " : ""
  }${!!address?.toProvinceName ? address.toProvinceName : ""}`;
};

/**
 * Số điện thoại cá nhân
 */
export const regexVNMobilePhone = /^(84|0[3|5|7|8|9])+([0-9]+$)\b/;

/**
 * Số máy bàn, số điện thoại cá nhân
 */
export const regexVNPhone =
  /^(84|0)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])+([0-9]+$)\b/;

/**
 * Số máy bàn, số điện thoại cá nhân, số hotline
 */
export const regexVNPhoneAll =
  /^(84|0)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])+([0-9]+$)\b|^(1800|1900)+([0-9]+$)\b/;

export const vietnameseSlug = (str: string, separator = "-") => {
  if (str) {
    str = str.trim();
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, "");
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|\\=|\\<|\\>|\?|\/|,|\.|\\:|\\;|\\'|\\"|\\&|\\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      "",
    );
    str = str.replace(/ +/g, "-");

    if (separator) {
      return str.replace(/-/g, separator);
    }
    return str;
  } else return "";
};

export const noop = () => {};

export function on<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T["addEventListener"]> | [string, Function | null, ...any]
): void {
  if (obj && obj.addEventListener) {
    obj.addEventListener(...(args as Parameters<HTMLElement["addEventListener"]>));
  }
}

export function off<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T["removeEventListener"]> | [string, Function | null, ...any]
): void {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(...(args as Parameters<HTMLElement["removeEventListener"]>));
  }
}

export const isBrowser = typeof window !== "undefined";

export const isNavigator = typeof navigator !== "undefined";
