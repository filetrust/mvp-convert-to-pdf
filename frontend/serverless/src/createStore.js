import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk'
import reducer from './reducers'

let enhancers = []

if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.devToolsExtension
    if (typeof devToolsExtension === 'function') {
        enhancers.push(devToolsExtension())
    }
}

let composeEnhancers = compose(
    applyMiddleware(thunkMiddleware),
    ...enhancers
)

const store = createStore(reducer, composeEnhancers);

export {
    store
}
