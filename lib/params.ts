export const buildParams = (obj: any) => {
  const paramsArray = Object.entries(obj).map(
    // @ts-ignore
    ([key, value]) => ({[key]: value.join(",")})
  );
  const queryParams = paramsArray.map((obj: any) => {
    const key = Object.keys(obj)[0];
    let value = obj[key];
    // value = encodeURIComponent(value).replace(/%2C/g, ",");
    return `${key}=${value}`;
  });

  return `?${queryParams.join("&")}`;
};

export const parseParams = (inputObj: any) => {
  const result: any = {};
  for (const key in inputObj) {
    if (inputObj.hasOwnProperty(key)) {
      result[key] = inputObj[key].includes(",") ? inputObj[key].split(",") : [inputObj[key]];
    }
  }
  return result;
};
