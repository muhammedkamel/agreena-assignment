const hasDigit = (str: string): boolean => {
  const n = str.length

  for(let i = 0; i < n; i++) {
    const charCode = str.charCodeAt(i)
    
    if(charCode >= 48 && charCode <= 57) return true
  }

  return false
}

console.log(hasDigit("test-string"))
console.log(hasDigit("test-string23"))
