let isMount = true;
let workInProgressHook = null;


const fiber = {
    stateNode: App,
    memorizedState: null
}

function schedule() {
    workInProgressHook = fiber.memorizedState;
    const app = fiber.stateNode();
    isMount = false;
    return app;
}

function useState(initialState) {
    let hook;
    if (isMount) {
        hook = {
            memorizedState: initialState,
            queue: {
                pending: null
            },
            next: null
        }
        if (!fiber.memorizedState) {
            fiber.memorizedState = hook;
        } else {
            workInProgressHook.next = hook;
        }
        workInProgressHook = hook;
    } else {
        hook = workInProgressHook;
        workInProgressHook = workInProgressHook.next;
    }
    let state = hook.memorizedState;
    if (hook.queue.pending) {
        let firstUpdate = hook.queue.pending.next
        do {
            const action = firstUpdate.action;
            state = action(state);
            firstUpdate.next = firstUpdate.next
        } while (firstUpdate !== hook.queue.pending.next)
        hook.queue.pending = null;
    }
    hook.memorizedState = state;
    return [state, dispatchAction.bind(null, hook.queue)]
}

function dispatchAction(queue, action) {
    const update = {
        action,
        next: null
    }
    if (queue.pending === null) {
        update.next = update;
    } else {
        update.next = queue.pending.next;
        queue.pending.next = update;
    }
    queue.pending = update;
    schedule();
}

function App() {
    const [num, setNum] = useState(0);
    const [age, setAge] = useState(10);
    console.log(isMount ? '初次渲染' : '更新');
    console.log('num:', num);
    console.log('age:', age);
    const clickNum = () => {
        setNum(num => num + 1);
          setNum(num =>  num + 1);  // 是可能调用多次的
    }
    const clickAge = () => {
        setAge(age => age + 3);
        setNum(num =>  num + 1);  // 是可能调用多次的
    }
    return {
        clickNum,
        clickAge
    }
}

window.App = schedule();