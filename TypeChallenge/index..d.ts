export type DeepReadonly<T> =  keyof T extends never? T:{readonly [P in keyof T]:DeepReadonly<T[P]>}
type X = { 
    x: { 
      a: 1
      b: 'hi'
      c:number
    }
    y: 'hey'
  }
  
  type Expected = { 
    readonly x: { 
      readonly a: 1
      readonly b: 'hi'
      readonly c:number
    }
    readonly y: 'hey' 
  }
  type Todo = DeepReadonly<X> // should be same as `Expected`