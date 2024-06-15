const hello = 'Hello World!'

function add(a, b) {
  const result = a + b;

  return result;
}

function parent(a, b){
  const parentResult = add(a, b);

  return parentResult;
}

debugger;

parent(2, 4);


console.log('--- END ---')