const transformArray = (array: string[]) => array.map((ele: string) => {
  const num = Number(ele);
  
  return isNaN(num) ? ele : num;
})

console.log(transformArray(["super", "20.5", "test", "23"]));
