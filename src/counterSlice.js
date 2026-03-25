import { createSlice } from "@reduxjs/toolkit"

const checkOutLocal = localStorage.getItem("user_cart")
let checkOutLc = JSON.parse(checkOutLocal) || {}
let totalCheckout = 0
Object.keys(checkOutLc).map(prd => totalCheckout += checkOutLc[prd])

const counterSlice = createSlice({
    name: "counter",
    initialState: { value: totalCheckout },
    reducers: {
        totalCheckoutCount(state) {
            const checkOutLocal = localStorage.getItem("user_cart")
            let checkOutLc = JSON.parse(checkOutLocal) || {}
            let totalCheckout = 0
            Object.keys(checkOutLc).map(prd => totalCheckout += checkOutLc[prd])
            state.value = totalCheckout
        }
    }
})

export const { totalCheckoutCount } = counterSlice.actions
export default counterSlice.reducer